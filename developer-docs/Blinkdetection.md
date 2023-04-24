# Blink Detection Test Cases

## Without dependencies

- Interval: 500ms
- Time Frame: 5000ms
- Rising Edges: 3

```jsonc
[
  {
    "sourceValueArray": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "expectedResult": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "testname": "No rising edges, always OFF"
  },
  {
    "sourceValueArray": [
      0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],
    "expectedResult": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1
    ],
    "testname": "Switch from OFF to ON"
  },
  {
    "sourceValueArray": [
      0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "expectedResult": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0
    ],
    "testname": "ON delayed by one time frame"
  },
  {
    "sourceValueArray": [
      0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1
    ],
    "expectedResult": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2],
    "testname": "Switch from OFF TO BLINK"
  },
  {
    // After the 2nd rising edge there are not enough rising edges anymore to fullfil the condition >= 3 in 5 seconds. This would lead to an ON/OFF switches like \"2,2,2,0,1,0,1. To prevent this, after the switch from BLINK to OFF, rising edges are ignored for 5 seconds."
    "sourceValueArray": [
      0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "expectedResult": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0],
    "testname": "Switch from BLINK to OFF"
  },
  {
    "sourceValueArray": [
      0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0
    ],
    "expectedResult": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0
    ],
    "testname": "Not enough rising edges, ONs are delayed"
  },
  {
    // "Because of the suppressed rising edges after switching to OFF, there is one 2 missing"
    "sourceValueArray": [
      0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0
    ],
    "expectedResult": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2
    ],
    "testname": "Blinking detected and then sometimes not enough rising edges"
  },
  {
    "sourceValueArray": [
      0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0
    ],
    "expectedResult": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2
    ],
    "testname": "Long blinking, with sometimes not enough rising edges"
  },
  {
    "sourceValueArray": [
      0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0
    ],
    "expectedResult": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    "testname": "Ignoring rising edge after blink stopped"
  }
]
```

# With dependency

Interval: 500ms

VDP 1

- Id: 'vdp1'
- Time Frame: 5000
- Rising Edges: 3
- Linked Blink Detections: []

VDP 2

- Id: 'vdp2'
- Time Frame: 5000
- Rising Edges: 3
- Linked Blink Detections: ['vdp1']

```json
[
  {
    "sourceValueArray1": [
      0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "sourceValueArray2": [
      0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "expectedResult1": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "expectedResult2": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "testname": "No blinking detected as linked signal resets the main one"
  },
  {
    "sourceValueArray1": [
      1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0
    ],
    "sourceValueArray2": [
      0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0
    ],
    // For expectedResult1: Start value is always 0, so if the first element is 1 in sourceValueArray1 it is treated like rising edge TBD
    "expectedResult1": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2
    ],
    "expectedResult2": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2
    ],
    "testname": "Use case for Haas machine"
  }
]
```
