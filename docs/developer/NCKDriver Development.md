# NCK Driver

## S7 Communication Layers

- TCP
- ISO/RFC Connection - https://datatracker.ietf.org/doc/html/rfc1006

## Development tips

- It is recommended to use Wireshark for debugging and further development, the current release of Wireshark includes a full S7 communication decoder, including the NC flavor of S7 communication.

## NC Variables

### Introduction

When accessing NC Variables from the PLC program, S7 Communication is also used (but via the "virtual" backplane bus, instead of Ethernet/Profibus). Here the PLC programmer specifies the relevant address information for a specific NC Variable on the S7-Com function block ("GET") and receives the current value of the NC-Variable.
The address information is only available in the "Sinumerik Toolbox" Program "NCVar-Selector", where all NC Variables can be searched, and their address information can be exported as a STEP7 / TIA Portal data block (DB). The address information exported from the NCVar-Selector is also used by the NCK driver to access variables over the network, via S7-Communication. If a new variable should be accessed by the NCK driver, the address information can only be retrieved via the NCVar-Selector.

### NCVar-Selector

Example output can be found in the file `NCVarSelectorTestOutput.awl`

### Currently supported variables

/Nck/MachineAxis/feedRateOvr[2]
/Channel/Spindle/speedOvr[u1,1]
/Channel/State/rapFeedRateOvr[u1]
/Channel/State/actParts[u1,1]
/Channel/State/reqParts[u1,1]
/Channel/Configuration/numMachAxes[u<Area index>, <Row index>]
/Channel/ProgramPointer/progName[u<Area index>, <Row index>]

/Nck/Configuration/toolChangeMFunc <-DINT -> Change using MD 22560: TOOL_CHANGE_M_CODE
/Nck/State/sysTimeUdword <- DWORD
/Bag/State/opMode[u1] <- WORD - Value Range: 0 = JOG / 1 = MDI / 2 = AUTO

### NC-Var Reverse Engineering

Documentation HTMLs can be used to support all/more variables in the NCKDriver: `C:\Program Files (x86)\Siemens\NCVar Selector`
Decompile htmls: `Hh.exe -decompile ausgabeverzeichnis chmdatei.chm`

## Glossary

- TSAP - Transport Service Access Point
