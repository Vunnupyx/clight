export default (tariff: string) => [
  { name: 'IN', type: 'measurement', address: 'Effective value current IN' },
  {
    name: 'P',
    type: 'measurement',
    address:
      'Sum of active power according to DIN EN 61557-12 with sign. >0: Demand <0:'
  },
  {
    name: 'Q',
    type: 'measurement',
    address:
      'Vectorial total reactive power according to DIN EN 61557-12 with sign as sum of the individual reactive powers. >0: Demand <0: Delivery'
  },
  {
    name: 'S',
    type: 'measurement',
    address: 'Vectorial total apparent power according to DIN EN 61557-12'
  },
  {
    name: 'PF',
    type: 'measurement',
    address:
      'Vectorial total power factor with sign according to IEEE. >0: Inductive <0: Capacitive'
  },
  { name: 'Ea+', type: 'meter', address: 'Total active energy demand' },
  { name: 'Ea-', type: 'meter', address: 'Total active energy delivery' },
  { name: 'Er+', type: 'meter', address: 'Total reactive energy demand' },
  { name: 'Er-', type: 'meter', address: 'Total reactive energy delivery' },
  {
    name: 'Tx Ea+',
    type: 'meter',
    address: `Active energy demand since last reset in tariff ${tariff}`
  },
  {
    name: 'Tx Ea-',
    type: 'meter',
    address: `Active energy delivery since last reset in tariff ${tariff}`
  },
  {
    name: 'Tx Er+',
    type: 'meter',
    address: `Reactive energy demand since last reset in tariff ${tariff}`
  },
  {
    name: 'Tx Er-',
    type: 'meter',
    address: `Reactive energy delivery since last reset in tariff ${tariff}`
  },
  {
    name: 'Tx Es',
    type: 'meter',
    address: `Apparent energy since last reset in tariff ${tariff}`
  },
  {
    name: 'Tx Er',
    type: 'meter',
    address: `Unsigned reactive energy since last reset in tariff ${tariff}`
  },
  {
    name: 'Tx Runtime',
    type: 'meter',
    address: `Runtime since last reset in tariff ${tariff}`
  }
];
