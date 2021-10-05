import { DataItem, Event } from '../DataItem';

describe('Test DataItem', () => {
  test('Get string output', () => {
    const item = new DataItem('test');

    expect(item.isUnavailable).toBeTruthy;

    item.value = 1;

    expect(item.value).toBe(1);

    const data = item.toString().split('|');
    expect(data.length).toBe(2);
    expect(data[0]).toBe('test');
    expect(data[1]).toBe('1');

    item.unavailable();
    expect(item.isUnavailable).toBeTruthy;
  });

  test('Get item list', () => {
    const item = new DataItem('test');
    item.value = 1;

    expect(item.itemList().some((_item) => _item === item)).toBeTruthy;

    item.cleanup();
    expect(item.itemList(true).some((_item) => _item === item)).toBeTruthy;
    expect(item.itemList().some((_item) => _item === item)).toBeFalsy;

    item.forceChanged();
    expect(item.changed).toBeTruthy();
    expect(item.itemList().some((_item) => _item === item)).toBeTruthy;
  });
});

describe('Test Event', () => {
  it('Create event', () => {
    const event = new Event('test');

    expect(event instanceof DataItem).toBeTruthy();
  });
});
