import winston from 'winston';
import { evaluate, isNaN, number } from 'mathjs';

import { ConfigManager } from '../ConfigManager';
import {
  isValidVdp,
  IVirtualDataPointConfig
} from '../ConfigManager/interfaces';
import { CounterManager } from '../CounterManager';
import { DataPointCache } from '../DatapointCache';
import {
  IDataSourceMeasurementEvent,
  IMeasurement
} from '../Southbound/DataSources/interfaces';
import { SynchronousIntervalScheduler } from '../SyncScheduler';

interface IVirtualDataPointManagerParams {
  configManager: ConfigManager;
  cache: DataPointCache;
}

type LogEntry = {
  count: number;
  log: string;
};

type LogSummary = {
  error: LogEntry[];
  warn: LogEntry[];
  info: LogEntry[];
  debug: LogEntry[];
};

type VdpValidityStatus = {
  isValid: boolean;
  error?: 'wrongVdpsOrder' | 'wrongFormat' | 'unexpectedError';
  vdpIdWithError?: string;
  notYetDefinedSourceVdpId?: string;
};

type BlinkingStatus = {
  [key: string]: {
    sourceValue: boolean;
    detectionStatus: 'detectBlinkingStart' | 'detectBlinkingEnd' | 'inactive';
    risingEdgeTimestamps: number[];
    resetTimerId?: NodeJS.Timeout;
    processedValue?: 0 | 1 | 2; // 0=OFF, 1=ON, 2=BLINKING
  };
};

/**
 * Calculates virtual datapoints
 */
export class VirtualDataPointManager {
  private configManager: ConfigManager;
  private config: IVirtualDataPointConfig[] = null;
  private cache: DataPointCache;
  private counters: CounterManager;
  private blinkingStatus: BlinkingStatus = {};
  private scheduler: SynchronousIntervalScheduler;
  private logSchedulerListenerId: number;
  private DEFAULT_BLINK_DETECTION_TIMEFRAME = 10000;
  private DEFAULT_BLINK_DETECTION_RISING_EDGES = 3;
  private logSummary: LogSummary = {
    error: [],
    warn: [],
    info: [],
    debug: []
  };
  private energyMachineStatusChangeCallback: Function;

  private static className: string = VirtualDataPointManager.name;

  constructor(params: IVirtualDataPointManagerParams) {
    params.configManager.once('configsLoaded', () => this.init());
    params.configManager.on('configChange', () => this.updateConfig());

    this.configManager = params.configManager;
    this.cache = params.cache;
    this.counters = new CounterManager(this.configManager, this.cache);
    this.scheduler = SynchronousIntervalScheduler.getInstance();
  }

  private init() {
    this.updateConfig();
    this.setupLogCycle();
  }

  private updateConfig() {
    const logPrefix = `${VirtualDataPointManager.className}::updateConfig`;
    winston.debug(`${logPrefix} refreshing config`);

    this.config = this.configManager.config.virtualDataPoints;
    // Update blinking status object if any blink-detection VDP is deleted
    for (let vdpId of Object.keys(this.blinkingStatus)) {
      if (!this.config.find((vdp) => vdp.id === vdpId)) {
        //If VDP is deleted, then remove the blinking status information as well
        delete this.blinkingStatus[vdpId];
      }
    }
  }

  /**
   * Setup log cycle for summary logging
   */
  protected setupLogCycle(defaultFrequency: number = 15 * 60 * 1000): void {
    if (this.logSchedulerListenerId) return;

    const logPrefix = `${VirtualDataPointManager.className}::setupLogCycle`;
    winston.debug(`${logPrefix} setup log cycle`);

    this.logSchedulerListenerId = this.scheduler.addListener(
      [defaultFrequency],
      this.printSummaryLogs.bind(this)
    );
  }

  /**
   * Logs summary of logs to not spam logs every data point ready cycle
   */
  protected printSummaryLogs(): void {
    const logPrefix = `${VirtualDataPointManager.className}::logSummary`;

    Object.keys(this.logSummary).forEach((level: keyof LogSummary) => {
      if (this.logSummary[level].length > 0) {
        for (const entry of this.logSummary[level]) {
          winston[level](
            `${logPrefix} Count: ${entry.count} Log: ${entry.log}`
          );
        }
        this.logSummary[level] = [];
      }
    });
  }

  /**
   * Adding log to summary. If Same log already exits, counting up
   */
  protected addSummaryLog(level: keyof LogSummary, log: string): void {
    const entry = this.logSummary[level].find((entry) => entry.log === log);

    if (entry) {
      entry.count = entry.count + 1;
    } else {
      this.logSummary[level].push({ log, count: 1 });
    }
  }

  /**
   * Convert all data point value types to boolean to handle bool operations
   * @param  {boolean|number|string} value
   * @returns boolean
   */
  private toBoolean(value: boolean | number | string): boolean {
    if (typeof value === 'number') {
      return value > 0;
    }
    if (typeof value === 'string') {
      return value.length > 0;
    }
    return value;
  }

  /**
   * Calculates the given math expression.
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private calculation(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): number | null {
    const logPrefix = `VirtualDataPointManager::calculation`;
    if (config.operationType !== 'calculation') {
      this.addSummaryLog(
        'error',
        `${logPrefix} called with invalid operation type.`
      );
      return null;
    }
    if (sourceEvents.length < 1) {
      this.addSummaryLog(
        'warn',
        `${logPrefix} Virtual data point Calculation (${config.id}) requires at least 1 source!`
      );
      return null;
    }
    if (typeof config.formula !== 'string' || config.formula.length === 0) {
      this.addSummaryLog(
        'warn',
        `${logPrefix} Virtual data point Calculation called without formula string`
      );
      return null;
    }
    try {
      let variableReplacedFormula = config.formula;
      sourceEvents.forEach((sourceEvent) => {
        variableReplacedFormula = variableReplacedFormula.replace(
          new RegExp(sourceEvent.measurement.id, 'g'),
          sourceEvent.measurement.value.toString()
        );
      });
      // Replace true with 1 and false with 0
      variableReplacedFormula = variableReplacedFormula
        .replace(new RegExp('true', 'g'), '1')
        .replace(new RegExp('false', 'g'), '0');

      let result = evaluate(variableReplacedFormula);
      if (
        /[*/+-]+([*/+-])/.test(variableReplacedFormula) || //check if any operators are repeating
        variableReplacedFormula.includes('Infinity') ||
        result === Infinity ||
        result === -Infinity ||
        result === null ||
        isNaN(result)
      ) {
        this.addSummaryLog(
          'warn',
          `${logPrefix} Unexpected value while calculating formula: ${config.formula}. With replaced values: ${variableReplacedFormula}`
        );

        return null;
      } else {
        return number(result.toFixed(4));
      }
    } catch (err) {
      this.addSummaryLog('error', `${logPrefix} ${err.message}`);
      return null;
    }
  }

  /**
   * Calculates virtual data points from type and
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private and(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    if (sourceEvents.length < 2) {
      this.addSummaryLog(
        'warn',
        `Virtual data point (${config.id}) requires at least 2 sources!`
      );
      return null;
    }

    let retValue = this.toBoolean(sourceEvents[0].measurement.value);
    for (let i = 1; i < sourceEvents.length; i++) {
      retValue = retValue && this.toBoolean(sourceEvents[i].measurement.value);
    }

    return retValue;
  }

  /**
   * Check if value of sourceEvents first entry is greater the compare value config.comparativeValue.
   *
   * @param sourceEvents  Array of measurements
   * @param config operation config
   * @param equal optional parameter to check for >= instead of >
   * @returns true if it is greater, false if not and null if something went wrong.
   */
  private greater(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig,
    equal: boolean = false
  ): boolean | null {
    const logPrefix = `${this.constructor.name}::greater${
      equal ? '(Equal)' : ''
    }`;
    if (sourceEvents.length > 1 || sourceEvents.length === 0) {
      this.addSummaryLog(
        'warn',
        `${logPrefix} is only available for one source but receive ${sourceEvents.length}`
      );
      return null;
    }

    // @ts-ignore
    const compare = parseFloat(config.comparativeValue);
    if (Number.isNaN(compare)) {
      this.addSummaryLog(
        'warn',
        `${logPrefix} got ${compare} for comparison but it's not a number`
      );
      return null;
    }

    const value = sourceEvents[0].measurement.value;

    let result: boolean;
    switch (typeof value) {
      case 'number': {
        if (equal && Math.abs(compare - value) < 1e-9) {
          return true;
        }
        return value > compare;
      }
      case 'string': {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
          this.addSummaryLog('error', `${logPrefix} no valid number.`);
          return null;
        }
        if (equal && Math.abs(compare - parsed) < 1e-9) {
          return true;
        }
        return parsed > compare;
      }
      case 'boolean': {
        this.addSummaryLog(
          'warn',
          `${logPrefix} boolean is not a valid compare value.`
        );
        return null;
      }
      default: {
        this.addSummaryLog(
          'warn',
          `${logPrefix} invalid value type: ${typeof value}`
        );
        return null;
      }
    }
  }

  /**
   * Check if value of sourceEvents first entry is smaller the compare value config.comparativeValue.
   *
   * @param sourceEvents  Array of measurements
   * @param config operation config
   * @param equal optional parameter to check for <= instead of <
   * @returns true if it is smaller, false if not and null if something went wrong.
   */
  private smaller(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig,
    equal: boolean = false
  ): boolean | null {
    const logPrefix = `${this.constructor.name}::smaller ${
      equal ? '(Equal)' : ''
    }`;
    if (sourceEvents.length > 1 || sourceEvents.length === 0) {
      this.addSummaryLog(
        'warn',
        `${logPrefix} is only available for one source but receive ${sourceEvents.length}`
      );
      return null;
    }

    // @ts-ignore
    const compare = parseFloat(config.comparativeValue);
    if (Number.isNaN(compare)) {
      this.addSummaryLog(
        'warn',
        `${logPrefix} got ${compare} for comparison but it's not a number`
      );
      return null;
    }

    const value = sourceEvents[0].measurement.value;
    let result: boolean;
    switch (typeof value) {
      case 'number': {
        // Correct method to compare
        // floating-point numbers
        if (equal && Math.abs(compare - value) < 1e-9) {
          return true;
        }
        return value < compare;
      }
      case 'string': {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
          this.addSummaryLog('error', `${logPrefix} no valid number.`);
          return null;
        }
        if (equal && Math.abs(compare - parsed) < 1e-9) {
          return true;
        }
        return parsed < compare;
      }
      case 'boolean': {
        this.addSummaryLog(
          'warn',
          `${logPrefix} boolean is not a valid compare value.`
        );
        return null;
      }
      default: {
        this.addSummaryLog(
          'warn',
          `${logPrefix} invalid value type: ${typeof value}`
        );
        return null;
      }
    }
  }

  /**
   * Check if value of sourceEvents first entry is equal the compare value config.comparativeValue.
   *
   * @param sourceEvents  Array of measurements
   * @param config operation config
   * @returns true if it is equal, false if not and null if something went wrong.
   */
  private equal(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    const logPrefix = `${this.constructor.name}::equal`;
    if (sourceEvents.length > 1 || sourceEvents.length === 0) {
      this.addSummaryLog(
        'warn',
        `${logPrefix} is only available for one source but receive ${sourceEvents.length}`
      );
      return null;
    }
    const value = sourceEvents[0].measurement.value;
    const compare = config.comparativeValue;

    if (!compare) {
      return null;
    }

    switch (typeof value) {
      case 'number': {
        // Correct method to compare
        // floating-point numbers

        if (
          // @ts-ignore
          !Number.isNaN(parseFloat(compare)) &&
          // @ts-ignore
          Math.abs(parseFloat(compare) - value) < 1e-9
        ) {
          return true;
        } else {
          return false;
        }
      }
      case 'string': {
        if (typeof compare !== 'string') {
          this.addSummaryLog(
            'warn',
            `${logPrefix} try to compare string with non string value: ${compare}`
          );
          return null;
        }
        return value.trim() === compare.trim();
      }
      case 'boolean': {
        this.addSummaryLog(
          'warn',
          `${logPrefix} boolean is not a valid compare value.`
        );
        return null;
      }
      default: {
        this.addSummaryLog(
          'warn',
          `${logPrefix} invalid value type: ${typeof value}`
        );
        return null;
      }
    }
  }

  /**
   * Check if value of sourceEvents first entry is unequal the compare value config.comparativeValue.
   *
   * @param sourceEvents  Array of measurements
   * @param config operation config
   * @returns true if it is unequal, false if not and null if something went wrong.
   */
  private unequal(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    const compare = config?.comparativeValue;

    if (!compare) {
      return null;
    }
    return !this.equal(sourceEvents, config);
  }

  /**
   * Calculates virtual data points from type or
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private or(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    if (sourceEvents.length < 2) {
      this.addSummaryLog(
        'warn',
        `Virtual data point (${config.id}) requires at least 2 sources!`
      );
      return null;
    }

    let retValue = this.toBoolean(sourceEvents[0].measurement.value);
    for (let i = 1; i < sourceEvents.length; i++) {
      retValue = retValue || this.toBoolean(sourceEvents[i].measurement.value);
    }

    return retValue;
  }

  /**
   * Calculates virtual data points from type not
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private not(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    if (sourceEvents.length !== 1) {
      this.addSummaryLog(
        'warn',
        `Virtual data point (${config.id}) requires exactly 1 source!`
      );
      return null;
    }

    return !this.toBoolean(sourceEvents[0].measurement.value);
  }

  /**
   * Calculates virtual data points from type not
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private count(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): number | null {
    if (sourceEvents.length !== 1) {
      this.addSummaryLog(
        'warn',
        `Virtual data point (${config.id}) requires exactly 1 source!`
      );
      return null;
    }

    const measurement = sourceEvents[0].measurement;
    if (
      this.toBoolean(measurement.value) &&
      this.cache.hasChanged(measurement.id)
    ) {
      // NOTE: The counter is incremented after each restart as against the cache the value has changed.
      return this.counters.increment(config.id);
    }

    return this.counters.getValue(config.id);
  }

  /**
   * Check 'enumerated' grouped virtual data point and return the 'returnValueIfTrue' of the highest true value.
   *
   * @param sourceEvents
   * @param config
   * @returns string
   */
  private enumeration(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): string | null {
    const logPrefix = `${this.constructor.name}::enumeration`;
    if (
      config.operationType !== 'enumeration' &&
      config.operationType !== 'setTariff'
    ) {
      this.addSummaryLog(
        'error',
        `${logPrefix} receive invalid operation type: ${config.operationType}`
      );
      return null;
    }
    if (typeof config.enumeration === undefined) {
      this.addSummaryLog(
        'error',
        `${logPrefix} no enumeration configuration found`
      );
      return null;
    }

    // Iterate over sorted by high prio array
    for (const entry of config.enumeration.items.sort((a, b) => {
      return a.priority - b.priority;
    })) {
      const hit = !!sourceEvents.find((event) => {
        // winston.debug(
        //   `${logPrefix} searching for entry ${entry.source} found ${event.measurement.id}`
        // );
        // winston.debug(
        //   `${logPrefix} measurement is: ${!!event.measurement.value}`
        // );
        return (
          event?.measurement?.id === entry.source && !!event?.measurement?.value
        );
      });
      if (hit) {
        return entry.returnValueIfTrue;
      }
    }
    // No true value in list
    return config.enumeration?.defaultValue || null;
  }

  /**
   * Special version of enumeration for setting EEM tariff
   * @see enumeration
   *
   * @param sourceEvents
   * @param config
   * @returns string
   */
  private setTariff(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): string | null {
    const value = this.enumeration(sourceEvents, config);

    const cacheValue = this.cache.getLastestValue(config.id)?.value;

    if (!!value && value !== cacheValue) {
      this.energyMachineStatusChangeCallback(value);
    }

    return value;
  }

  /**
   * Calculates virtual data points from type thresholds
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private thresholds(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): number | string | null {
    if (sourceEvents.length !== 1) {
      this.addSummaryLog(
        'warn',
        `Virtual data point (${config.id}) requires exactly 1 source!`
      );
      return null;
    }

    if (!config.thresholds) return null;

    const thresholds = (Object.keys(config.thresholds) || [])
      .map((key) => config.thresholds?.[key])
      .sort((a, b) => a - b)
      .reverse();

    const activeThreshold = thresholds.find(
      (x) => sourceEvents[0].measurement.value > x
    );

    const value = (Object.keys(config.thresholds) || []).find(
      (key) => config.thresholds[key] === activeThreshold
    );
    if (typeof value === 'undefined') {
      return null;
    }
    const parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      return value;
    } else {
      return parsedValue;
    }
  }

  /**
   * Calculates rising edges and blink detection
   */
  private detectBlinking(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): 0 | 1 | 2 {
    if (!this.blinkingStatus[config.id]) {
      // initialize currentStatus if it is first time this VDP is checked
      this.blinkingStatus[config.id] = {
        sourceValue: false, //TBD potentially use cache value?
        detectionStatus: 'inactive',
        processedValue: 0, //TBD
        risingEdgeTimestamps: []
      };
    }
    const currentTimestamp = Date.now();
    const currentStatus = this.blinkingStatus[config.id];
    const requiredRisingEdges = Number(
      config.blinkSettings?.risingEdges ??
        this.DEFAULT_BLINK_DETECTION_RISING_EDGES
    );
    const isLinkedToAnotherBlinkDetectionVDP = this.config.some(
      (vdp) =>
        vdp.id !== config.id &&
        vdp.blinkSettings?.linkedBlinkDetections?.includes(config.id)
    );
    const timeframe = Number(
      config.blinkSettings?.timeframe ?? this.DEFAULT_BLINK_DETECTION_TIMEFRAME
    );
    const newSourceValue = Boolean(sourceEvents[0].measurement.value);
    const hasSourceValueChanged = newSourceValue !== currentStatus.sourceValue;
    const isRisingEdge =
      newSourceValue === true && currentStatus.sourceValue === false;

    if (hasSourceValueChanged) {
      if (isRisingEdge) {
        // Save the rising edge
        currentStatus.risingEdgeTimestamps.push(currentTimestamp);

        if (currentStatus.detectionStatus === 'inactive') {
          // Rising edge in inactive status starts detecting start of blinking
          currentStatus.detectionStatus = 'detectBlinkingStart';

          // user timer to check for ending detectBlinkingStart or detecting blinking
          this.restartTimerForBlinkStatusReset(
            currentStatus,
            timeframe,
            requiredRisingEdges
          );

          //If it is linked to another blink-detection VDP, then it resets the parent's timer
          if (isLinkedToAnotherBlinkDetectionVDP) {
            let parentBlinkDetectionVDP = this.config.find((vdp) =>
              vdp.blinkSettings?.linkedBlinkDetections.includes(config.id)
            );

            if (
              parentBlinkDetectionVDP &&
              this.blinkingStatus[parentBlinkDetectionVDP.id]
            ) {
              this.blinkingStatus[
                parentBlinkDetectionVDP.id
              ].risingEdgeTimestamps = [];
              this.restartTimerForBlinkStatusReset(
                this.blinkingStatus[parentBlinkDetectionVDP.id],
                timeframe,
                requiredRisingEdges
              );
            }
          }
        } else if (currentStatus.detectionStatus === 'detectBlinkingStart') {
          // If it is in blinking start detection mode, each rising edge could be fulfilling criteria to decide for blinking
          currentStatus.risingEdgeTimestamps =
            currentStatus.risingEdgeTimestamps.filter(
              (t) => t >= currentTimestamp - timeframe
            );
          if (
            currentStatus.risingEdgeTimestamps.length === requiredRisingEdges
          ) {
            // If the total rising edge requirement is reached, then start blinking and set detectBlinkingEnd status
            currentStatus.processedValue = 2;
            currentStatus.detectionStatus = 'detectBlinkingEnd';

            // user timer to check for ending detectBlinkingEnd or keep verifying blinking
            this.restartTimerForBlinkStatusReset(
              currentStatus,
              timeframe,
              requiredRisingEdges
            );
          }
        }
      } else {
        // If new value is not rising edge but falling edge
        if (currentStatus.detectionStatus === 'inactive') {
          // check if the new value lasted as long as the timeframe
          this.restartTimerForBlinkStatusReset(
            currentStatus,
            timeframe,
            requiredRisingEdges
          );
        }
      }
      currentStatus.sourceValue = newSourceValue;
    }

    return currentStatus.processedValue;
  }

  /**
   * This function removes existing timer and restarts the timeout for reset
   */
  private restartTimerForBlinkStatusReset(
    currentStatus: BlinkingStatus[keyof BlinkingStatus],
    timeframe: number,
    requiredRisingEdges: number
  ) {
    // Clear existing timer to set the new timer
    clearTimeout(currentStatus.resetTimerId);

    currentStatus.resetTimerId = setTimeout(
      () =>
        this.resetBlinkingDetectionStatus(
          currentStatus,
          timeframe,
          requiredRisingEdges
        ),
      timeframe
    );
  }

  /**
   * This function resets the existing status to inactive
   * It is called after desired timeframe is up without enough rising edges
   */
  private resetBlinkingDetectionStatus(
    currentStatus: BlinkingStatus[keyof BlinkingStatus],
    timeframe: number,
    requiredRisingEdges: number
  ) {
    const currentTimestamp = Date.now();

    // Filter out too old rising edges
    currentStatus.risingEdgeTimestamps =
      currentStatus.risingEdgeTimestamps.filter(
        (t) => t >= currentTimestamp - timeframe
      );

    if (currentStatus.risingEdgeTimestamps.length >= requiredRisingEdges) {
      // Enough rising edges available -> blinking active
      currentStatus.processedValue = 2;
      // Check continuation of blinking with timer
      this.restartTimerForBlinkStatusReset(
        currentStatus,
        timeframe,
        requiredRisingEdges
      );
    } else {
      // Not enough rising edges to keep blinking.

      // New processed value is therefore equal the current status of the source
      currentStatus.processedValue = currentStatus.sourceValue ? 1 : 0;
      // Status is now set to inactive, will wait for new rising edges
      currentStatus.detectionStatus = 'inactive';
    }
  }
  /**
   * Calculates an virtual data point
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private calculateValue(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): IMeasurement['value'] {
    switch (config.operationType) {
      case 'and':
        return this.and(sourceEvents, config);
      case 'or':
        return this.or(sourceEvents, config);
      case 'not':
        return this.not(sourceEvents, config);
      case 'counter':
        return this.count(sourceEvents, config);
      case 'thresholds':
        return this.thresholds(sourceEvents, config);
      case 'enumeration':
        return this.enumeration(sourceEvents, config);
      case 'greater':
        return this.greater(sourceEvents, config);
      case 'greaterEqual':
        return this.greater(sourceEvents, config, true);
      case 'smaller':
        return this.smaller(sourceEvents, config);
      case 'smallerEqual':
        return this.smaller(sourceEvents, config, true);
      case 'equal':
        return this.equal(sourceEvents, config);
      case 'unequal':
        return this.unequal(sourceEvents, config);
      case 'calculation':
        return this.calculation(sourceEvents, config);
      case 'setTariff':
        return this.setTariff(sourceEvents, config);
      case 'blink-detection':
        return this.detectBlinking(sourceEvents, config);
      default:
        // TODO Only print this once at startup or config change, if invalid
        // this.addSummaryLog("warn",
        //   `Invalid type (${config.operationType}) provided for virtual data point ${config.id}!`
        // );
        return null;
    }
  }

  /**
   * Calculates all virtual data points, that are related to the input events
   * (Only if one or more events of sources are provided)
   * @param  {IDataSourceMeasurementEvent[]} events
   * @returns IDataSourceMeasurementEvent
   */
  // TODO Rename "getVirtualMeasurements"
  public getVirtualEvents(
    events: IDataSourceMeasurementEvent[]
  ): IDataSourceMeasurementEvent[] {
    const logPrefix = `${VirtualDataPointManager.className}::getVirtualEvents`;
    if (this.config === null) {
      this.addSummaryLog(
        'warn',
        `${logPrefix} Config not yet loaded. Skipping virtual event calculation`
      );
      return [];
    }

    // Contains all events, "source events" first and "virtual events" after
    const _events = [...events];
    const virtualEvents: IDataSourceMeasurementEvent[] = [];

    //Check blink detection VDPs that have other VDPs linked as last, so that their values are ready first
    const sortedVirtualDatapoints = this.config.sort((vdp1, vdp2) => {
      const isVdp1BlinkDetectionWithDependency =
        vdp1.operationType === 'blink-detection' &&
        vdp1.blinkSettings?.linkedBlinkDetections?.length > 0;
      const isVdp2BlinkDetectionWithDependency =
        vdp2.operationType === 'blink-detection' &&
        vdp2.blinkSettings?.linkedBlinkDetections?.length > 0;

      if (
        isVdp1BlinkDetectionWithDependency ||
        isVdp2BlinkDetectionWithDependency
      ) {
        if (
          isVdp1BlinkDetectionWithDependency &&
          isVdp2BlinkDetectionWithDependency
        ) {
          if (vdp1.blinkSettings?.linkedBlinkDetections.includes(vdp2.id)) {
            // if vdp1 depends on vdp2, then first calculate vdp2
            return 1; // puts vdp1 to last
          } else if (
            vdp2.blinkSettings?.linkedBlinkDetections.includes(vdp1.id)
          ) {
            // if vdp2 depends on vdp1, then first calculate vdp1
            return -1; // puts vdp2 to last
          }
        } else if (isVdp1BlinkDetectionWithDependency) {
          return 1; // puts blink detection VDP with dependency as last, puts vdp1 to last
        } else if (isVdp2BlinkDetectionWithDependency) {
          return -1; // puts blink detection VDP with dependency as last, puts vdp2 to last
        }
      }
      return 0;
    });

    for (const vdpConfig of sortedVirtualDatapoints) {
      const calculateVirtualDatapoint =
        vdpConfig.operationType === 'enumeration' ||
        vdpConfig.sources.some((sourceId) =>
          _events.some((e) => e?.measurement?.id === sourceId)
        );

      // If virtual datapoint has no event in the current cycle, do not calculate it
      if (!calculateVirtualDatapoint) {
        continue;
      }

      let sourceEvents = vdpConfig.sources.map((sourceId) => {
        let event = _events.find((e) => e?.measurement?.id === sourceId);
        if (!event) {
          event = this.cache.getCurrentEvent(sourceId);
        }
        if (!event) {
          this.addSummaryLog(
            'warn',
            `Virtual data point ${vdpConfig.id} could not be calculated, because missing event from data source ${sourceId}`
          );
        }

        return event;
      });

      // Skip virtual data point if one or more source events are missing if it is not enumeration
      if (
        (vdpConfig.operationType === 'enumeration' &&
          sourceEvents.every((event) => typeof event === 'undefined') &&
          !vdpConfig.enumeration?.defaultValue) ||
        (vdpConfig.operationType !== 'enumeration' &&
          sourceEvents.some((event) => typeof event === 'undefined'))
      )
        continue;

      const value = this.calculateValue(sourceEvents, vdpConfig);

      if (value === null) {
        continue;
      }

      const newEvent: IDataSourceMeasurementEvent = {
        dataSource: {
          protocol: 'virtual'
        },
        measurement: {
          id: vdpConfig.id,
          name: '',
          value
        }
      };

      _events.push(newEvent);
      virtualEvents.push(newEvent);
    }

    this.cache.update(virtualEvents);

    return virtualEvents;
  }

  /**
   * Set counter to 0
   * @param id identifier of the virtual datapoint
   */
  public resetCounter(id: string): void {
    winston.info(`${this.constructor.name}::resetCounter `);
    this.counters.reset(id);
  }

  /**
   * Sets the callback function for Energy use case, where machine status change triggers EEM tariff change
   */
  public setEnergyCallback(cb: Function): void {
    this.energyMachineStatusChangeCallback = cb;
  }

  /**
   * Checks order of VDPs to determine if their order is valid according to the dependencies.
   *
   * @see client/src/app/pages/settings/virtual-data-point/virtual-data-point.component.ts for usage of same logic in frontend!
   * Update there as well if any logic changes here
   */
  public getVdpValidityStatus(
    vdpsListToCheck: IVirtualDataPointConfig[]
  ): VdpValidityStatus {
    try {
      if (
        !Array.isArray(vdpsListToCheck) ||
        !vdpsListToCheck.every(isValidVdp)
      ) {
        return {
          isValid: false,
          error: 'wrongFormat'
        };
      }
      let result: VdpValidityStatus = {
        isValid: true
      };
      for (let [index, vdp] of vdpsListToCheck.entries()) {
        //Check sources that are VDP, as non-VDP sources will not cause problem
        const otherVdpSources = vdp.sources.filter((sourceVdpId) =>
          vdpsListToCheck.find((v) => v.id === sourceVdpId)
        );
        if (otherVdpSources.length > 0) {
          for (let sourceVdpId of otherVdpSources) {
            const indexOfSourceVdp = vdpsListToCheck.findIndex(
              (x) => x.id === sourceVdpId
            );

            /**
             * If VDP source is defined later, then it is not valid
             */
            if (indexOfSourceVdp >= index) {
              result.isValid = false;
              result.error = 'wrongVdpsOrder';
              result.vdpIdWithError = vdp.id;
              result.notYetDefinedSourceVdpId = sourceVdpId;
              break;
            }
          }
        }
        if (!result.isValid) {
          break;
        }
      }

      return result;
    } catch (err) {
      return {
        isValid: false,
        error: 'unexpectedError'
      };
    }
  }
}
