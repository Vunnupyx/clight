/* tslint:disable */
export interface Sourcedatapoint {
  address: string;
  description?: string;
  name: string;
  readFrequency: number;
  type: 's7' | 'nck' | 'nck-pl' | 'pmc' | 'cnc' | 'cncParameter';
  fanucDataType?: 'bit' | 'byte' | 'word' | 'double_word' | 'real';
  fanucAddressType?: string;
  fanucSNumber?: string;
  fanucENumber?: string;
  fanucLength?: string;
}
