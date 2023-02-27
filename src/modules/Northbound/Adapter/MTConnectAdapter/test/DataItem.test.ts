import { DataItem, Event, Sample, Condition } from '../DataItem';

describe('Test DataItem', () => {
  test('Get string output', () => {
    const name = 'testname';
    const item = new DataItem(name);

    expect(item.name).toBe(name);
    expect(item.isUnavailable).toBeTruthy();

    item.value = 1;

    expect(item.value).toBe(1);
    expect(item.changed).toBeTruthy();

    const data = item.toString().split('|');
    expect(data.length).toBe(2);
    expect(data[0]).toBe(name);
    expect(data[1]).toBe('1');

    item.unavailable();
    expect(item.isUnavailable).toBeTruthy();
  });

  test('Get item list', () => {
    const item = new DataItem('test');
    item.value = 1;

    expect(item.changed).toBeTruthy();
    expect(item.itemList().some((_item) => _item === item)).toBeTruthy();

    item.cleanup();
    expect(item.itemList(true).some((_item) => _item === item)).toBeTruthy();
    expect(item.itemList().some((_item) => _item === item)).toBeFalsy();

    item.forceChanged();
    expect(item.changed).toBeTruthy();
    expect(item.itemList().some((_item) => _item === item)).toBeTruthy();
  });
});

describe('Test Event', () => {
  it('Create event', () => {
    const event = new Event('test');

    expect(event instanceof DataItem).toBeTruthy();
    expect(event.name).toBe('test');
  });
});

describe('Test Sample', () => {
  it('Create event', () => {
    const sample = new Sample('test');

    expect(sample instanceof DataItem).toBeTruthy();
    expect(sample.name).toBe('test');
  });
});

describe('Test Condition', () => {
  it('Create condition', () => {
    const condition = new Condition('test');

    expect(condition instanceof DataItem).toBeTruthy();
  });

  it('creates string output', () => {
    const name = 'testname';
    const condition = new Condition(name);
    condition.value = 'AVAILABLE';

    expect(condition.isActive).toBeTruthy();
    expect(condition.toString()).toBe(`${name}|FAULT|EX0000|100||AVAILABLE`);
  });
});
