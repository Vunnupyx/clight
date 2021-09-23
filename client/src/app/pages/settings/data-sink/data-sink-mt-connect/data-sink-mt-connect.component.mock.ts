function generateMtConnectDataItem(i) {
  return {
    id: `addr${i}`,
    name: `addr ${i}`
  };
}

export function MT_CONNECT_DATA_ITEMS_MOCK() {
  const r = [] as any;
  for (let i = 0; i < 100; i++) {
    r.push(generateMtConnectDataItem(i));
  }
  return r;
}
