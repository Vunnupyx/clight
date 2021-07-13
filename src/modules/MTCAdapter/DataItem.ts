const UNAVAILABLE = "UNAVAILABLE";

export class DataItem {
  protected _name: string;
  protected _value: string | number = UNAVAILABLE;
  protected _changed = true;
  protected _newLine = false;
  protected _devicePrefix = null;

  constructor(name: string) {
    this._name = name;
  }

  public get value(): string | number {
    return this._value;
  }

  public set value(v: string | number) {
    if (v !== this._value) {
      this._changed = true;
      this._value = v;
    }
  }

  public unavailable(): void {
    this._value = UNAVAILABLE;
  }

  public get isUnavailable(): boolean {
    return this._value === UNAVAILABLE;
  }

  public get changed(): boolean {
    return this._changed;
  }

  public get newLine(): boolean {
    return this._newLine;
  }

  public forceChanged(): void {
    this._changed = true;
  }

  public toString(): string {
    if (this._devicePrefix === null) return this._name + "|" + this._value;
    else return this._devicePrefix + ":" + this._name + "|" + this._value;
  }

  public begin(): void {}
  public prepare(): void {}

  public cleanup(): void {
    this._changed = false;
  }

  public itemList(all = false): DataItem[] {
    const list: DataItem[] = [];
    if (all || this._changed) {
      list.push(this);
    }

    return list;
  }
}

export class Event extends DataItem {}
