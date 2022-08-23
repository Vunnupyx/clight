import winston from 'winston';

const UNAVAILABLE = 'UNAVAILABLE';

/**
 * MTConnect Data Items
 */
export class DataItem {
  protected _name: string;
  protected _value: string | number = UNAVAILABLE;
  protected _changed = true;
  protected _newLine = false;
  protected _devicePrefix = null;

  constructor(name: string) {
    this._name = name;
  }

  /**
   * Returns the data item's value
   * @returns string | number
   */
  public get value(): string | number {
    return this._value;
  }

  /**
   * Sets value for the data item
   * @param  {string|number} v
   */
  public set value(v: string | number) {
    if (v !== this._value) {
      this._changed = true;
      this._value = v;
    }
  }

  /**
   * Sets data item to unavailable
   * @returns void
   */
  public unavailable(): void {
    this._value = UNAVAILABLE;
  }

  /**
   * Whether the data item is unavailable or not
   * @returns boolean
   */
  public get isUnavailable(): boolean {
    return this._value === UNAVAILABLE;
  }

  /**
   * Whether the data item has changed or not
   * @returns boolean
   */
  public get changed(): boolean {
    return this._changed;
  }

  /**
   * Determines if data item should be sent together with other items or separately
   * @returns void
   */
  public get newLine(): boolean {
    return this._newLine;
  }

  /**
   * Forces changed
   * @returns void
   */
  public forceChanged(): void {
    this._changed = true;
  }

  /**
   * Returns message sting for data item
   * @returns string
   */
  public toString(): string {
    if (this._devicePrefix === null) return this._name + '|' + this._value;
    else return this._devicePrefix + ':' + this._name + '|' + this._value;
  }

  /**
   * Not implemented
   * @returns void
   */
  public begin(): void {}

  /**
   * Not implemented
   * @returns void
   */
  public prepare(): void {}

  /**
   * Clean up data item
   * @returns void
   */
  public cleanup(): void {
    this._changed = false;
  }

  /**
   * Returns a list of all data items
   * @param  {boolean} all=false
   * @returns DataItem
   */
  public itemList(all = false): DataItem[] {
    const list: DataItem[] = [];
    if (all || this._changed) {
      list.push(this);
    }

    return list;
  }

  /**
   * Returns the name of the data item
   * @returns name
   */
  public get name(): string {
    return this._name;
  }
}

export class Event extends DataItem {}

export class Sample extends DataItem {}

/**
 * Representation of a MDConnect Condition data item
 */
export class Condition extends DataItem {
  protected _newLine = true;
  protected _defaultAlarmString = 'UNNAMED_ALARM';

  /**
   * Print condition dataitem as string with pattern:
   *  DATA_ITEM_NAME|STATUS|ERRORCODE|SEVERITY|ALARM_TEXT
   *
   * Status can be one of:
   * - NORMAL
   * - FAULT
   * @returns concatenated string
   */
  public toString(): string {
    const alarmMsg =
      typeof this.value === 'string' && !!this.value
        ? this.value
        : this._defaultAlarmString;
    return `${this.name}|${
      this.isActive ? 'FAULT' : 'NORMAL'
    }|EX0000|100||${alarmMsg}`;
  }

  /**
   * Return false if value is:
   *  - false
   *  - empty string
   *  - 0
   * and true if
   */
  public get isActive(): boolean {
    return !!this.value;
  }
}
