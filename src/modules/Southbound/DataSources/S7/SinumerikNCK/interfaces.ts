export interface NCVarSelectorAddress {
  syntaxId: number;
  areaUnit: number;
  column: number;
  line: number;
  blockType: number;
  numOfLine: number;
  dataType: number;
  byteLength: number;
}

export interface NCItem {
  byteBuffer: Buffer;
  value: any;
  ncVar: NCVarSelectorAddress;
}
