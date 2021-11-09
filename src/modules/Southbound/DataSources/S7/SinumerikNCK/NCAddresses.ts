import { NCVarSelectorAddress } from './interfaces';

export const NC_ADDRESSES: { [key: string]: NCVarSelectorAddress } = {
  '/Channel/ProgramPointer/progName': {
    // /Channel/ProgramPointer/progName[1,1]
    // String Test
    syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
    areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
    column: 0x5, // Column : WORD := W#16#5;
    line: 0x1, // Line : WORD := W#16#1;
    blockType: 0x7a, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
    numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
    dataType: 0x13, // DataType : BYTE := B#16#13;
    byteLength: 0x20 // Length : BYTE := B#16#20;
  },
  '/Nck/MachineAxis/feedRateOvr': {
    // /Nck/MachineAxis/feedRateOvr[1]
    // REAL / DOUBLE Test
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x1,
    line: 0x1,
    blockType: 0x71,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/actProgNetTime': {
    // /Channel/State/actProgNetTime[u1]
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x129,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Bag/State/OpMode': {
    syntaxId: 0x82,
    areaUnit: 0x21,
    column: 0x3,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Channel/ProgramModification/singleBlockActive': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0xc,
    line: 0x1,
    blockType: 0x7e,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Channel/Programinfo/selectedWorkPProg': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x23,
    line: 0x1,
    blockType: 0x7d,
    numOfLine: 0x1,
    dataType: 0x13,
    byteLength: 0xa0
  },
  '/Channel/State/feedRateIpoOvr': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x3,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0xa8
  },
  '/Channel/Configuration/numSpindles': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x4,
    line: 0x1,
    blockType: 0x10,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0xa2
  },
  '/Channel/Spindle/SpindleType': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0xd,
    line: 0x1,
    blockType: 0x72,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Channel/Spindle/speedOvr': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x4,
    line: 0x1,
    blockType: 0x72,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/rapFeedRateOvr': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x4,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/totalParts': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x78,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0xf,
    byteLength: 0x8
  },
  '/Channel/State/reqParts': {
    syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
    areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
    column: 0x77, // Column : WORD := W#16#5;
    line: 0x1, // Line : WORD := W#16#1;
    blockType: 0x7f, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
    numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
    dataType: 0xf, // DataType : BYTE := B#16#13;
    byteLength: 0x8 // Length : BYTE := B#16#20;
  },
  '/Channel/State/actParts': {
    syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
    areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
    column: 0x79, // Column : WORD := W#16#5;
    line: 0x1, // Line : WORD := W#16#1;
    blockType: 0x7f, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
    numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
    dataType: 0xf, // DataType : BYTE := B#16#13;
    byteLength: 0x8 // Length : BYTE := B#16#20;
  },
  '/Channel/State/actTNumber': {
    syntaxId: 0x82,
    areaUnit: 0x41,
    column: 0x17,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Nck/State/numAlarms': {
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x7,
    line: 0x1,
    blockType: 0x7f,
    numOfLine: 0x1,
    dataType: 0x13,
    byteLength: 0x2
  },
  '/Nck/Configuration/maxnumAlarms': {
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x13,
    line: 0x1,
    blockType: 0x10,
    numOfLine: 0x1,
    dataType: 0x4,
    byteLength: 0x2
  },
  '/Nck/SequencedAlarms/alarmNo': {
    // N_SALA_alarmNo1_2
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x2,
    line: 0x1,
    blockType: 0x77,
    numOfLine: 0x1,
    dataType: 0x7,
    byteLength: 0x4
  },
  '/Nck/AlarmEvent/alarmNo': {
    // N_SALAC_alarmNo1_2
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x2,
    line: 0x1,
    blockType: 0x54,
    numOfLine: 0x1,
    dataType: 0x7,
    byteLength: 0x4
  },
  '/Nck/LastAlarm/alarmNo': {
    // N_SALAL_alarmNo1_2
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x2,
    line: 0x1,
    blockType: 0x75,
    numOfLine: 0x1,
    dataType: 0x7,
    byteLength: 0x4
  },
  '/Nck/TopPrioAlarm/alarmNo': {
    // N_SALAP_alarmNo1_2
    syntaxId: 0x82,
    areaUnit: 0x1,
    column: 0x2,
    line: 0x1,
    blockType: 0x76,
    numOfLine: 0x1,
    dataType: 0x7,
    byteLength: 0x4
  }
  // SSP_SPEED_OVR: {
  //   qualityBuffer: null,
  //   byteLength: 50, // Dummy
  //   valid: false,
  //   errCode: null,
  //   readTransportCode: 0x04, // For PLC this always 0x04 except when reading "hardware" Counters or Timers,
  //   byteBuffer: Buffer.alloc(1000),
  //   dtypelen: -1, // With strings, add 2 to the length due to S7 header
  //   arrayLength: 1,

  //   datatype: "LREAL",
  //   value: "" as any,
  //   quality: "",
  //   bitOffset: 0,
  //   ncVar: {
  //     syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
  //     areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
  //     column: 0x4, // Column : WORD := W#16#5;
  //     line: 0x1, // Line : WORD := W#16#1;
  //     blockType: 0x72, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
  //     numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
  //     dataType: 0xf, // DataType : BYTE := B#16#13;
  //     byteLength: 0x8, // Length : BYTE := B#16#20;
  //   },
  // },
  // RAP_FEED_RATE_OVR: {
  //   qualityBuffer: null,
  //   byteLength: 50, // Dummy
  //   valid: false,
  //   errCode: null,
  //   readTransportCode: 0x04, // For PLC this always 0x04 except when reading "hardware" Counters or Timers,
  //   byteBuffer: Buffer.alloc(1000),
  //   dtypelen: -1, // With strings, add 2 to the length due to S7 header
  //   arrayLength: 1,

  //   datatype: "LREAL",
  //   value: "" as any,
  //   quality: "",
  //   bitOffset: 0,
  //   ncVar: {
  //     syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
  //     areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
  //     column: 0x4, // Column : WORD := W#16#5;
  //     line: 0x1, // Line : WORD := W#16#1;
  //     blockType: 0x7f, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
  //     numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
  //     dataType: 0xf, // DataType : BYTE := B#16#13;
  //     byteLength: 0x8, // Length : BYTE := B#16#20;
  //   },
  // },
  // ACT_PARTS: {
  //   qualityBuffer: null,
  //   byteLength: 50, // Dummy
  //   valid: false,
  //   errCode: null,
  //   readTransportCode: 0x04, // For PLC this always 0x04 except when reading "hardware" Counters or Timers,
  //   byteBuffer: Buffer.alloc(1000),
  //   dtypelen: -1, // With strings, add 2 to the length due to S7 header
  //   arrayLength: 1,

  //   datatype: "LREAL",
  //   value: "" as any,

  //   bitOffset: 0,
  //   ncVar: {
  //     syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
  //     areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
  //     column: 0x79, // Column : WORD := W#16#5;
  //     line: 0x1, // Line : WORD := W#16#1;
  //     blockType: 0x7f, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
  //     numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
  //     dataType: 0xf, // DataType : BYTE := B#16#13;
  //     byteLength: 0x8, // Length : BYTE := B#16#20;
  //   },
  // },
  // REQ_PARTS: {
  //   qualityBuffer: null,
  //   byteLength: 50, // Dummy
  //   valid: false,
  //   errCode: null,
  //   readTransportCode: 0x04, // For PLC this always 0x04 except when reading "hardware" Counters or Timers,
  //   byteBuffer: Buffer.alloc(1000),
  //   dtypelen: -1, // With strings, add 2 to the length due to S7 header
  //   datatype: "LREAL",
  //   value: "" as any,
  //   bitOffset: 0,
  //   ncVar: {
  //     syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
  //     areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
  //     column: 0x77, // Column : WORD := W#16#5;
  //     line: 0x1, // Line : WORD := W#16#1;
  //     blockType: 0x7f, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
  //     numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
  //     dataType: 0xf, // DataType : BYTE := B#16#13;
  //     byteLength: 0x8, // Length : BYTE := B#16#20;
  //   },
  // },
  // ACT_TOOL_IDENT: {
  //   qualityBuffer: null,
  //   byteLength: 50, // Dummy
  //   valid: false,
  //   errCode: null,
  //   readTransportCode: 0x04, // For PLC this always 0x04 except when reading "hardware" Counters or Timers,
  //   byteBuffer: Buffer.alloc(1000),
  //   dtypelen: 0x20, // With strings, add 2 to the length due to S7 header
  //   arrayLength: 1,

  //   datatype: "STRING",
  //   value: "" as any,
  //   quality: "",
  //   bitOffset: 0,
  //   ncVar: {
  //     syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
  //     areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
  //     column: 0x21, // Column : WORD := W#16#5;
  //     line: 0x1, // Line : WORD := W#16#1;
  //     blockType: 0x7f, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
  //     numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
  //     dataType: 0x13, // DataType : BYTE := B#16#13;
  //     byteLength: 0x20, // Length : BYTE := B#16#20;
  //   },
  // },
  // TOOL_RADIUS: {
  //   qualityBuffer: null,
  //   byteLength: 50, // Dummy
  //   valid: false,
  //   errCode: null,
  //   readTransportCode: 0x04, // For PLC this always 0x04 except when reading "hardware" Counters or Timers,
  //   byteBuffer: Buffer.alloc(1000),
  //   dtypelen: -1, // With strings, add 2 to the length due to S7 header
  //   arrayLength: 1,

  //   datatype: "LREAL",
  //   value: "" as any,
  //   quality: "",
  //   bitOffset: 0,
  //   ncVar: {
  //     syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
  //     areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
  //     column: 0x1b, // Column : WORD := W#16#5;
  //     line: 0x1, // Line : WORD := W#16#1;
  //     blockType: 0x7f, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
  //     numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
  //     dataType: 0xf, // DataType : BYTE := B#16#13;
  //     byteLength: 0x8, // Length : BYTE := B#16#20;
  //   },
  // },
  // TOOL_LEN1: {
  //   qualityBuffer: null,
  //   byteLength: 50, // Dummy
  //   valid: false,
  //   errCode: null,
  //   readTransportCode: 0x04, // For PLC this always 0x04 except when reading "hardware" Counters or Timers,
  //   byteBuffer: Buffer.alloc(1000),
  //   dtypelen: -1, // With strings, add 2 to the length due to S7 header
  //   arrayLength: 1,

  //   datatype: "LREAL",
  //   value: "" as any,
  //   quality: "",
  //   bitOffset: 0,
  //   ncVar: {
  //     syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
  //     areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
  //     column: 0x1c, // Column : WORD := W#16#5;
  //     line: 0x1, // Line : WORD := W#16#1;
  //     blockType: 0x7f, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
  //     numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
  //     dataType: 0xf, // DataType : BYTE := B#16#13;
  //     byteLength: 0x8, // Length : BYTE := B#16#20;
  //   },
  // },
  // NUM_MACH_AXES: {
  //   // Word Test
  //   qualityBuffer: null,
  //   byteLength: 50, // Dummy
  //   valid: false,
  //   errCode: null,
  //   readTransportCode: 0x04, // For PLC this always 0x04 except when reading "hardware" Counters or Timers,
  //   byteBuffer: Buffer.alloc(1000),
  //   dtypelen: -1, // With strings, add 2 to the length due to S7 header
  //   arrayLength: 1,

  //   datatype: "WORD",
  //   value: "" as any,
  //   quality: "",
  //   bitOffset: 0,
  //   ncVar: {
  //     syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
  //     areaUnit: 0x41, // Area_Unit : BYTE := B#16#41;
  //     column: 0x3, // Column : WORD := W#16#5;
  //     line: 0x1, // Line : WORD := W#16#1;
  //     blockType: 0x10, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
  //     numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
  //     dataType: 0x4, // DataType : BYTE := B#16#13;
  //     byteLength: 0x2, // Length : BYTE := B#16#20;
  //   },
  // },
  // TOOL_CHANGE_MFUNC: {
  //   // Word Test
  //   qualityBuffer: null,
  //   byteLength: 50, // Dummy
  //   valid: false,
  //   errCode: null,
  //   readTransportCode: 0x04, // For PLC this always 0x04 except when reading "hardware" Counters or Timers,
  //   byteBuffer: Buffer.alloc(1000),
  //   dtypelen: -1, // With strings, add 2 to the length due to S7 header
  //   arrayLength: 1,

  //   datatype: "DINT",
  //   value: "" as any,
  //   quality: "",
  //   bitOffset: 0,
  //   ncVar: {
  //     syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
  //     areaUnit: 0x1, // Area_Unit : BYTE := B#16#41;
  //     column: 0x1, // Column : WORD := W#16#5;
  //     line: 0x1, // Line : WORD := W#16#1;
  //     blockType: 0x10, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
  //     numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
  //     dataType: 0x7, // DataType : BYTE := B#16#13;
  //     byteLength: 0x4, // Length : BYTE := B#16#20;
  //   },
  // },
  // SYS_TIME_UDWORD: {
  //   // Word Test
  //   qualityBuffer: null,
  //   byteLength: 50, // Dummy
  //   valid: false,
  //   errCode: null,
  //   readTransportCode: 0x04, // For PLC this always 0x04 except when reading "hardware" Counters or Timers,
  //   byteBuffer: Buffer.alloc(1000),
  //   dtypelen: -1, // With strings, add 2 to the length due to S7 header
  //   arrayLength: 1,

  //   datatype: "DWORD",
  //   value: "" as any,
  //   quality: "",
  //   bitOffset: 0,
  //   ncVar: {
  //     syntaxId: 0x82, // SYNTAX_ID : BYTE := B#16#82;
  //     areaUnit: 0x1, // Area_Unit : BYTE := B#16#41;
  //     column: 0x121, // Column : WORD := W#16#5;
  //     line: 0x1, // Line : WORD := W#16#1;
  //     blockType: 0x7f, // BlockType : BYTE := B#16#7A; // "Module" in S7Toolbox
  //     numOfLine: 0x1, // NumOfLine : BYTE := B#16#1;
  //     dataType: 0x6, // DataType : BYTE := B#16#13;
  //     byteLength: 0x4, // Length : BYTE := B#16#20;
  //   },
  // },
};

// Dev tool for Frontend model -> should be replaced by common source
// for (const k of Object.keys(NC_ADDRESSES)) {
//   const p = k.split('/');
//   console.log(`{ name: '${p[p.length - 1]}', address: '${k}' },`);
// }
