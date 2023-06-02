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
import { MeasurementEventBus } from '../EventBus';

interface IVirtualDataPointManagerParams {
  configManager: ConfigManager;
  cache: DataPointCache;
  measurementsBus: MeasurementEventBus;
}

type LogEntry = {
  count: number;
  log: string;
};

type LogSummaryKeys = 'error' | 'warn' | 'info' | 'debug';
type LogSummary = {
  [key in LogSummaryKeys]: LogEntry[];
};

type VdpValidityStatus = {
  isValid: boolean;
  error?: 'wrongVdpsOrder' | 'wrongFormat' | 'unexpectedError';
  vdpIdWithError?: string;
  notYetDefinedSourceVdpId?: string;
};

type BlinkingStatus = {
  [id: string]: {
    isBlinking: boolean;
    blinkStartTimestamp: number | null;
    blinkEndTimestamp: number | null;
    lastResetTimestamp: number | null;
    lastValueBeforeReset: null | boolean;
    valueAfterBlinkEnd: null | boolean;
    sourceValues: {
      value: boolean;
      changed: boolean;
      timestamp: number;
    }[];
  };
};

/**
 * Calculates virtual datapoints
 */
export class VirtualDataPointManager {
  private configManager: ConfigManager;
  private measurementBus: MeasurementEventBus;
  private config: IVirtualDataPointConfig[] | null = null;
  private cache: DataPointCache;
  private counters: CounterManager;
  private blinkingStatus: BlinkingStatus = {};
  private scheduler: SynchronousIntervalScheduler;
  private logSchedulerListenerId: number | null = null;
  private DEFAULT_BLINK_DETECTION_TIMEFRAME = 10000;
  private DEFAULT_BLINK_DETECTION_RISING_EDGES = 3;
  private logSummary: LogSummary = {
    error: [],
    warn: [],
    info: [],
    debug: []
  };
  private energyMachineStatusChangeCallback: Function = () => {};

  private static className: string = VirtualDataPointManager.name;

  constructor(params: IVirtualDataPointManagerParams) {
    params.configManager.once('configsLoaded', () => this.init());
    params.configManager.on('configChange', () => this.updateConfig());

    this.configManager = params.configManager;
    this.measurementBus = params.measurementsBus;
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

    (Object.keys(this.logSummary) as LogSummaryKeys[]).forEach(
      (level: LogSummaryKeys) => {
        if (this.logSummary[level].length > 0) {
          for (const entry of this.logSummary[level]) {
            winston[level](
              `${logPrefix} Count: ${entry.count} Log: ${entry.log}`
            );
          }
          this.logSummary[level] = [];
        }
      }
    );
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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
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
        if (sourceEvent) {
          variableReplacedFormula = variableReplacedFormula.replace(
            new RegExp(sourceEvent.measurement.id, 'g'),
            sourceEvent.measurement.value.toString()
          );
        }
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
      this.addSummaryLog('error', `${logPrefix} ${(err as Error).message}`);
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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    if (sourceEvents.length < 2) {
      this.addSummaryLog(
        'warn',
        `Virtual data point (${config.id}) requires at least 2 sources!`
      );
      return null;
    }

    let retValue = this.toBoolean(sourceEvents[0]?.measurement?.value ?? 0);
    for (let i = 1; i < sourceEvents.length; i++) {
      retValue =
        retValue && this.toBoolean(sourceEvents[i]?.measurement?.value ?? 0);
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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
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

    const value = sourceEvents[0]?.measurement?.value;

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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
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

    const value = sourceEvents[0]?.measurement?.value;

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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
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
    const value = sourceEvents[0]?.measurement?.value;
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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    if (sourceEvents.length < 2) {
      this.addSummaryLog(
        'warn',
        `Virtual data point (${config.id}) requires at least 2 sources!`
      );
      return null;
    }

    let retValue = this.toBoolean(sourceEvents[0]?.measurement?.value ?? 0);
    for (let i = 1; i < sourceEvents.length; i++) {
      retValue =
        retValue || this.toBoolean(sourceEvents[i]?.measurement?.value ?? 0);
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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    if (sourceEvents.length !== 1) {
      this.addSummaryLog(
        'warn',
        `Virtual data point (${config.id}) requires exactly 1 source!`
      );
      return null;
    }

    return !this.toBoolean(sourceEvents[0]?.measurement?.value ?? 0);
  }

  /**
   * Calculates virtual data points from type not
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private count(
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
    config: IVirtualDataPointConfig
  ): number | null {
    if (sourceEvents.length !== 1) {
      this.addSummaryLog(
        'warn',
        `Virtual data point (${config.id}) requires exactly 1 source!`
      );
      return null;
    }

    const measurement = sourceEvents[0]?.measurement;
    if (
      measurement &&
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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
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
    for (const entry of config.enumeration!.items?.sort((a, b) => {
      return a.priority - b.priority;
    }) ?? []) {
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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
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
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
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
      .sort((a, b) => a! - b!)
      .reverse();

    const activeThreshold = thresholds.find(
      (x) =>
        typeof x !== 'undefined' &&
        Number(sourceEvents[0]?.measurement?.value) > x
    );

    const value = (Object.keys(config.thresholds) || []).find(
      (key) => config.thresholds![key] === activeThreshold
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
   * Calculates blink detection and calls timeout function to determine final value
   * General notes:
   *  - Signals are delayed at the output with timeframe length. If blinking detected then the result is given as 2 (blinking)
   *  - When enough rising edges are available, the blinking is activated at the end of the timeframe and 1 timeframe time away from the first rising edge
   *  - After blinking ends, the first value is kept for a timeframe long
   *  - After linked signal's first rising edge per timeframe, main signal is reset (cannot have blinking) for a timeframe long. The last value before reset is kept for timeframe long.
   */
  private detectBlinking(
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
    config: IVirtualDataPointConfig
  ): null {
    const logPrefix = `${this.constructor.name}::detectBlinking`;

    // Only one source is allowed
    if (sourceEvents.length !== 1) {
      this.addSummaryLog(
        'warn',
        `${logPrefix} is only available for one source but received ${sourceEvents.length}`
      );
      return null;
    }

    const currentTimestamp = Date.now();
    const currentValue = this.toBoolean(
      sourceEvents[0]?.measurement?.value ?? 0
    );
    const timeframe = Number(
      config.blinkSettings?.timeframe ?? this.DEFAULT_BLINK_DETECTION_TIMEFRAME
    );

    // initialize blinkingStatus if it is first time this VDP is checked
    if (!this.blinkingStatus[config.id]) {
      this.blinkingStatus[config.id] = {
        isBlinking: false,
        blinkStartTimestamp: null,
        blinkEndTimestamp: null,
        lastResetTimestamp: null,
        lastValueBeforeReset: null,
        valueAfterBlinkEnd: null,
        sourceValues: [
          {
            value: currentValue,
            timestamp: currentTimestamp,
            changed: true
          }
        ]
      };
    } else {
      // All blinking status information for this VDP
      const status = this.blinkingStatus[config.id];

      // Whether the value has changed since the previous value
      let changed = true;

      // If there is already a previous value, calculate if the value has changed,
      // otherwise very first reading is always changed=true
      if (status.sourceValues.length > 0) {
        changed =
          status.sourceValues[status.sourceValues.length - 1].value !==
          currentValue;
      }

      // Save all source values to the array
      status.sourceValues.push({
        value: currentValue,
        timestamp: currentTimestamp,
        changed
      });

      // If there was a last reset timestamp and timeframe amount of time has passed, reset the saved timestamp and saved value
      if (
        status.lastResetTimestamp &&
        currentTimestamp - status.lastResetTimestamp > timeframe
      ) {
        status.lastResetTimestamp = null;
        status.lastValueBeforeReset = null;
      }

      // If value after blinking end has been saved and more than timeframe amount of time has passed, reset it
      if (
        typeof status.valueAfterBlinkEnd === 'boolean' &&
        status.blinkEndTimestamp &&
        currentTimestamp - status.blinkEndTimestamp >= timeframe
      ) {
        status.valueAfterBlinkEnd = null;
      }

      // Check and handle if this VDP would reset any other blink detection VDP.
      this.handleOtherAffectedBlinkingVdps(
        config,
        status,
        currentTimestamp,
        changed,
        currentValue,
        timeframe
      );
    }

    // Start the timeout for callback function to check if there are enough rising edges etc. within the timeframe
    setTimeout(() => {
      try {
        this.processBlinkDetection(config.id, currentValue);
      } catch (error) {
        winston.error(
          `${logPrefix} error while processing blink detection: ${error}`
        );
      }
    }, timeframe);

    return null;
  }

  /**
   * Checks and handles other blink detection VDPs if their dependent signal should cause their status to be reset.
   */
  private handleOtherAffectedBlinkingVdps(
    config: IVirtualDataPointConfig,
    status: BlinkingStatus[keyof BlinkingStatus],
    currentTimestamp: number,
    changed: boolean,
    currentValue: boolean,
    timeframe: number
  ): void {
    if (!this.config) return;

    // Find all VDPs that are linked to this one (which means this one could reset them)
    const affectedOtherBlinkDetectionVDPs = this.config.filter(
      (vdp) =>
        vdp.id !== config.id &&
        vdp.operationType === 'blink-detection' &&
        vdp.blinkSettings?.linkedBlinkDetections?.includes(config.id)
    );

    // If no other VDP is depending on this one, return
    if (affectedOtherBlinkDetectionVDPs.length === 0) {
      return;
    }

    // If this change is rising edge and first rising edge in the saved sourceValues then reset the other ones
    if (
      changed &&
      currentValue === true &&
      status.sourceValues.filter((x) => x.changed && x.value)?.length === 1 //it must have 1 rising edge so far so it does not try to reset after each rising edge.
    ) {
      // Check each other VDP whether they should be rest
      affectedOtherBlinkDetectionVDPs.forEach((affectedVdp) => {
        let statusOfAffectedVdp = this.blinkingStatus[affectedVdp.id];

        // Reset that VDP, if it was not recently reset already OR it has been reset long ago (should not happen as that timestamp is reset after timeframe amount of time)
        if (
          !statusOfAffectedVdp.lastResetTimestamp ||
          currentTimestamp - statusOfAffectedVdp.lastResetTimestamp >= timeframe
        ) {
          // Find where that VDP has its first rising edge. It is used to determine its value before resetting now
          const firstRisingEdgeIndex =
            statusOfAffectedVdp.sourceValues.findIndex(
              (x) => x.value && x.changed
            );

          // If its first rising edge is at the beginning of time scale or never happened, then previous value was false.
          // Otherwise last value before reset is the value that VDP had before its first rising edge (any rising edge older than the timeframe is already removed)
          const lastValueBeforeReset =
            firstRisingEdgeIndex < 1
              ? false
              : statusOfAffectedVdp.sourceValues[firstRisingEdgeIndex - 1]
                  ?.value;

          // Update other VDP's status
          this.blinkingStatus[affectedVdp.id] = {
            ...(statusOfAffectedVdp ?? {}),
            isBlinking: false,
            blinkStartTimestamp: null,
            blinkEndTimestamp: null,
            lastValueBeforeReset,
            valueAfterBlinkEnd: statusOfAffectedVdp.valueAfterBlinkEnd,
            lastResetTimestamp: currentTimestamp,
            sourceValues: statusOfAffectedVdp.sourceValues ?? []
          };
        }
      });
    }
  }

  /**
   * Callback function for processing blink detection. It is called after timeframe amount of time
   * It determines if there was enough rising edges for blinking and what the final output value should be.
   */
  private processBlinkDetection(id: string, sourceValueAtCall: boolean) {
    // Get the current status of the VDP
    const status = this.blinkingStatus[id];
    if (!status) return;

    if (!this.config) return;

    // Read VDP config from main config, in case it changed before this function is called
    const config = this.config.find((vdp) => vdp.id === id);
    if (!config) return;

    const currentTimestamp = Date.now();
    const timeframe = Number(
      config.blinkSettings?.timeframe ?? this.DEFAULT_BLINK_DETECTION_TIMEFRAME
    );

    // Delete values outside timeframe if it did not start blinking yet,
    // values need to be kept during blinking
    if (!status.blinkStartTimestamp) {
      status.sourceValues = status.sourceValues.filter(
        (x) => x.timestamp > currentTimestamp - timeframe
      );
    }

    // If there has been blink end timestamp and timeframe amount of time passes, then reset it
    if (
      status.blinkEndTimestamp &&
      currentTimestamp - status.blinkEndTimestamp >= timeframe
    ) {
      status.blinkEndTimestamp = null;
    }

    // Number of required rising edges needed, as given by user or the default value
    const requiredRisingEdges = Number(
      config.blinkSettings?.risingEdges ??
        this.DEFAULT_BLINK_DETECTION_RISING_EDGES
    );

    // The array of all rising edges that happened within the timeframe
    const risingEdgesArray = status.sourceValues.filter(
      (x) =>
        x.changed &&
        x.value === true &&
        x.timestamp >= currentTimestamp - timeframe &&
        x.timestamp >= (status.lastResetTimestamp ?? 0)
    );

    const hasEnoughRisingEdges = risingEdgesArray.length >= requiredRisingEdges;

    // The flag if it has been reset by a linked VDP within this timeframe
    const wasResetInThisTimeframe =
      status.lastResetTimestamp &&
      currentTimestamp - status.lastResetTimestamp < timeframe;

    // Here start of a blinking is detected. If enough rising edges are found and
    // no blink start timestamp is set yet, then it is set here. Required number of
    // rising edges can be reached in the middle of the timeframe, but blinking
    // should be shown after timeframe ends, therefore the timestamp when it should be
    // shown is saved to blinkStartTimestamp. It is timeframe amount of time
    // after the first rising edge.
    if (hasEnoughRisingEdges && !status.blinkStartTimestamp) {
      const firstRisingEdgeTimestamp = risingEdgesArray[0].timestamp;
      status.blinkStartTimestamp = firstRisingEdgeTimestamp + timeframe;
    }

    // Blink is detected if it is not in blink-end mode and
    // has enough rising edges and
    // has not been reset in this timeframe and
    // blink start is already detected above and
    // current time is ahead of the start of blinkStartTimestamp
    let blinkDetected: boolean =
      !status.blinkEndTimestamp &&
      hasEnoughRisingEdges &&
      !wasResetInThisTimeframe &&
      !!status.blinkStartTimestamp &&
      currentTimestamp >= status.blinkStartTimestamp;

    // Detects if it has been blinking and now the conditions are not fulfilled so blinking is stopped
    if (!blinkDetected && status.isBlinking) {
      status.blinkEndTimestamp = currentTimestamp;
      status.blinkStartTimestamp = null;
    }

    // Update the current blinking status
    status.isBlinking = blinkDetected;

    // final output value. 0=OFF, 1=ON, 2=BLINKING
    // By default it is the value of the source when this function was called (timeframe amount of time ago)
    let out: 0 | 1 | 2 = sourceValueAtCall ? 1 : 0;

    // Out value is updated in certain cases:
    if (blinkDetected) {
      // If it is blinking, output is 2 (BLINKING)
      out = 2;
    } else if (status.blinkStartTimestamp) {
      // If not blinking now but blink start has been detected for future and just waiting the timeframe to finish
      // Then continue with latest cache value of this VDP. So last value is shown till timeframe ends
      out = this.cache.getLastestValue(config.id)?.value ? 1 : 0;
    } else if (status.blinkEndTimestamp) {
      // If blinking ended
      if (status.blinkEndTimestamp === currentTimestamp) {
        // If blinking ended NOW, then find latest source value
        const currentValue =
          status.sourceValues[status.sourceValues.length - 1]?.value;

        // Output is this value.
        out = currentValue ? 1 : 0;
        // Save this value as value after blinking, because it will be persisted for timeframe amount of time.
        status.valueAfterBlinkEnd = !!out;
      } else if (typeof status.valueAfterBlinkEnd === 'boolean') {
        //If blinking ended a while ago then keep showing the value after blink end until this timeframe is over.
        out = status.valueAfterBlinkEnd ? 1 : 0;
      }
    } else if (
      wasResetInThisTimeframe &&
      risingEdgesArray.length > 0 &&
      typeof status.lastValueBeforeReset === 'boolean'
    ) {
      // If none of above conditions are present but it has been reset in this timeframe, then its value before reset is shown for timeframe amount of time
      out = status.lastValueBeforeReset ? 1 : 0;
    }

    // Output value is finalized, it will be emitted as an event

    // Create event for final output value
    const newEvent: IDataSourceMeasurementEvent = {
      dataSource: {
        protocol: 'virtual'
      },
      measurement: {
        id,
        name: '',
        value: out
      }
    };
    // Update cache and recalculate virtual events, so that other VDPs could use this value and push it to measurement bus
    this.cache.update([newEvent]);
    this.getVirtualEvents([newEvent]);
    this.measurementBus.push([newEvent]);
  }

  /**
   * Calculates an virtual data point
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private calculateValue(
    sourceEvents: (IDataSourceMeasurementEvent | undefined)[],
    config: IVirtualDataPointConfig
  ): IMeasurement['value'] | null {
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

    for (const vdpConfig of this.config) {
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
