import { ObjectMap } from "app/shared/utils";

export interface PreDefinedDataPoint {
    name: string;
    address: string;
    type: string;
    initialValue: string;
    map: ObjectMap<string>;
}

function generatePreDefinedDataPoint(i) {
    return <PreDefinedDataPoint>{
        "name": `Emergency Stop ${i}`,
        "address": `addr${i}`,
        "type": ['event', 'condition'][i % 2],
        "initialValue": "TRIGGERED",
        "map": {
            1: "abc",
            2: "123"
        },
    };
}

export function PRE_DEFINED_DATA_POINTS() {
    const r = new Array<PreDefinedDataPoint>();
    for (let i = 0; i < 40; i++) {
        r.push(generatePreDefinedDataPoint(i));
    }
    return r;
}