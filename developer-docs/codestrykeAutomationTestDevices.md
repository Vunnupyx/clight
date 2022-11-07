# Devices

## S7-1511T - 192.168.0.100

DB3001

```
    Name            Type    Offset
	typeTest_Bool	Bool	0.0	        false	TRUE	False	True	True	True	False		E2E Test Type Bool
	typeTest_Byte	Byte	1.0	        16#0	16#0B	False	True	True	True	False		E2E Test Type Byte
	typeTest_Word	Word	2.0	        16#0	16#B10B	False	True	True	True	False		E2E Test Type Word
	typeTest_DWord	DWord	4.0	        16#0	16#0020_B10B	False	True	True	True	False		E2E Test Type DWord
	typeTest_USInt	USInt	8.0	0	    11	False	True	True	True	False		E2E Test Type USInt
	typeTest_SInt	SInt	9.0	0	    11	False	True	True	True	False		E2E Test Type SInt
	typeTest_UInt	UInt	10.0	    0	45323	False	True	True	True	False		E2E Test Type UInt
	typeTest_Int	Int	    12.0	    0	-20213	False	True	True	True	False		E2E Test Type Int
	typeTest_UDInt	UDInt	14.0	    0	2142475	False	True	True	True	False		E2E Test Type UDInt
	typeTest_DInt	DInt	18.0	    0	2142475	False	True	True	True	False		E2E Test Type DInt
	typeTest_Real	Real	22.0	    0.0	21424.75	False	True	True	True	False
	typeTest_LReal	LReal	26.0	    0.0	21424.75	False	True	True	True	False
	typeTest_Time	Time	34.0	    T#0ms	T#0MS	False	True	True	True	False		E2E Test Type Time
	typeTest_S5Time	S5Time	38.0	    S5T#0ms	S5T#0MS	False	True	True	True	False		E2E Test Type S5Time
```

# SIEMENS SINUMERIK 840D sl - 192.168.214.1

PLC - DB12

```
    Name                Type    Offset
	partCountC1	        Int	    0.0	        500	True	True	False
	progNameC1	        String	2.0	        'codestryke_Test_Program'	True	True	False
	partCountC1Req	    Int	    258.0	    200	True	True	False
	partCountC1Overall	Int	    260.0	    100	True	True	False
	toolNumberC1	    String	262.0	    'FRAESER'	True	True	False
	greenLightState	    Bool	518.0	    false	True	True	False
	yellowLightState	Bool	518.1	    false	True	True	False
	redLightState	    Bool	518.2	    false	True	True	False
	blueLightState	    Bool	518.3	    false	True	True	False
	serialNumber	    String	520.0	    'NTX11140602'	True	True	False
```

# Network configuration

To connect to PLCs

```
sudo nmcli con mod enx00e04c6bf53f-default ipv4.addresses 192.168.0.220/24 ipv4.gateway 0.0.0.0 ipv4.dns 0.0.0.0 ipv4.method manual
sudo nmcli con up enx00e04c6bf53f-default
```

To connect to SIEMENS SINUMERIK:

```
sudo nmcli con mod enx00e04c6bf53f-default ipv4.addresses 192.168.214.240/24 ipv4.gateway 0.0.0.0 ipv4.dns 0.0.0.0 ipv4.method manual
sudo nmcli con up enx00e04c6bf53f-default
```
