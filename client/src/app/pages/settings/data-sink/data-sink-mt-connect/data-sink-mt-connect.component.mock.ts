function generateMtConnectItem(i) {
    return {
        id: `mt-connect-item-${i}`,
        name: `mt connect item ${i}`,
    };
}

export function MT_CONNECT_ITEMS_MOCK() {
    const r = [] as any;
    for (let i = 0; i < 100; i++) {
        r.push(generateMtConnectItem(i));
    }
    return r;
}