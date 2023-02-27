---
title: 'データソース: SIEMENS SINUMERIK 840D pl/sl'
---

## はじめに

このデータソースを使用して、SIEMENS SINUMERIK 840D pl および SIEMENS SINUMERIK 840D sl 制御装置と SIEMENS S7 PLC を接続することができます。正しく動作するように、モデルに応じて設定する必要があります。840D の NCK と PLC 部分からデータポイントを読み取ることができます。

ページの上部には、データソースの主な設定があります: `有効`、`IPアドレス`、`制御装置のタイプ`

## Siemens データソースのタイプを変更する

ページ上部の種類ドロップダウンメニューを使用して、使用する入力ボードのタイプを変更することができます。

![シーメンスタイプオプション](/img/datasource/siemens_types.png)

## 新しいデータポイントの追加

- 新しい NCK データポイントを追加するには、テーブルの左上にある青い `データポイント追加` ボタンをクリックします ![データソース追加ボタン](/img/datasource/addbutton.png).
- 新しいデータポイントがリストの末尾に追加されます。
- 新しいデータポイントに対して、名前を付け、変数は「NCK」と「PLC」を選択します。
- タイプとして PLC を選択した場合はデータポイントのアドレスを、タイプとして NCK を選択した場合は変数を設定します。
- 完了後、行の最後にある緑色の保存ボタンをクリックします。
- 変更したすべての変数を適用するには、ページの右上にある`変更を適用`ボタンをクリックします。

### NCK のデータポイント

![NCK新規データポイント列](/img/datasource/nck.png)

NCK の場合、上の画像にあるように、`選択`ボタンでアドレス列の下にある BTSS 文字列のような変数アドレスの一覧から選択できます。![NCK選択ボタン](/img/datasource/nckselectbutton.png)変数を追加・変更し、変更を適用すると、その値はすぐに利用可能になります。

追加された NCK データポイントの例:
![NCKデータポイントの例](/img/datasource/nck_example.png)

以下に、変数を選択する際のガイドとなる例をいくつか示します。

| アドレス                                         | タイプ |
| ------------------------------------------------ | ------ |
| `/Channel/ProgramPointer/progName`               | 文字列 |
| `/Nck/MachineAxis/feedRateOvr`                   | 数値   |
| `/Channel/State/actProgNetTime`                  | 数値   |
| `/Bag/State/OpMode`                              | 数値   |
| `/Channel/ProgramModification/singleBlockActive` | 数値   |
| `/Channel/Programinfo/selectedWorkPProg`         | 文字列 |
| `/Channel/State/feedRateIpoOvr`                  | 数値   |
| `/Channel/Configuration/numSpindles`             | 数値   |
| `/Channel/Spindle/SpindleType`                   | 数値   |
| `/Channel/Spindle/speedOvr`                      | 数値   |
| `/Channel/State/rapFeedRateOvr`                  | 数値   |
| `/Channel/State/totalParts`                      | 数値   |
| `/Channel/State/reqParts`                        | 数値   |
| `/Channel/State/actParts`                        | 数値   |
| `/Channel/State/actTNumber`                      | 数値   |
| `/Nck/State/numAlarms`                           | 数値   |
| `/Nck/Configuration/maxnumAlarms`                | 数値   |
| `/Nck/AlarmEvent/alarmNo`                        | 数値   |
| `/Nck/LastAlarm/alarmNo`                         | 数値   |
| `/Nck/TopPrioAlarm/alarmNo`                      | 数値   |
| `/Channel/ChannelDiagnose/cuttingTime`           | 数値   |
| `/Channel/State/progStatus`                      | 数値   |
| `/Channel/ProgramInfo/msg`                       |        |
| `/Channel/ProgramInfo/workPNameLong`             | 文字列 |
| `/Channel/ProgramInfo/workPandProgName`          | 文字列 |
| `/Channel/State/specParts`                       | 数値   |
| `/Channel/Spindle/turnState`                     | 数値   |
| `/Nck/Configuration/anLanguageOnHmi`             | 数値   |
| `/Nck/Configuration/basicLengthUnit`             | 数値   |
| `/Nck/Configuration/nckType`                     | 数値   |
| `/Nck/Configuration/nckVersion`                  | 数値   |
| `/Channel/State/chanStatus`                      | 数値   |
| `/Channel/ProgramModification/optStopActive`     | 数値   |
| `/Channel/ProgramModification/progTestActive`    | 数値   |
| `/Channel/ProgramModification/trialRunActive`    | 数値   |

### PLC データポイント

![PLC新データポイント列](/img/datasource/plc.png)

データポイントアドレスは、SIEMENS Step 7 または SIEMENS TIA Portal で使用される変数アドレスとは若干異なります。主な違いは、IoTconnector flex が raw バイトを適切にデコードできるように、データポイント・アドレスにはデータ型が含まれることです。データポイント行のアドレス列のテキストフィールドにデータポイントアドレス文字列を入力することができます。

追加された PLC データポイントの例。
![PLCデータポイントの例](/img/datasource/plc_example.png)

変数のアドレスを入力する際のガイドとなる例をいくつか紹介します。

| アドレス                          | Step 7 もしくは相当    | JS データタイプ | 説明                                                   |
| --------------------------------- | ---------------------- | --------------- | ------------------------------------------------------ |
| `DB5,X0.1`                        | `DB5.DBX0.1`           | ブール値        | Bit 1 of byte 0 of DB 5                                |
| `DB23,B1` もしくは `DB23,BYTE1`   | `DB23.DBB1`            | 数値            | Byte 1 (0-255) of DB 23                                |
| `DB100,C2` もしくは `DB100,CHAR2` | `DB100.DBB2`           | 文字列          | Byte 2 of DB 100 as a Char                             |
| `DB42,I3` もしくは `DB42,INT3`    | `DB42.DBW3`            | 数値            | Signed 16-bit number at byte 3 of DB 42                |
| `DB57,WORD4`                      | `DB57.DBW4`            | 数値            | Unsigned 16-bit number at byte 4 of DB 57              |
| `DB13,DI5` もしくは `DB13,DINT5`  | `DB13.DBD5`            | 数値            | Signed 32-bit number at byte 5 of DB 13                |
| `DB19,DW6` もしくは `DB19,DWORD6` | `DB19.DBD6`            | 数値            | Unsigned 32-bit number at byte 6 of DB 19              |
| `DB21,R7` もしくは `DB21,REAL7`   | `DB21.DBD7`            | 数値            | Floating point 32-bit number at byte 7 of DB 21        |
| `DB2,S7.10`\*                     | -                      | 文字列          | String of length 10 starting at byte 7 of DB 2         |
| `I1.0` もしくは `E1.0`            | `I1.0` もしくは `E1.0` | ブール値        | Bit 0 of byte 1 of input area                          |
| `Q2.1` もしくは `A2.1`            | `Q2.1` もしくは `A2.1` | ブール値        | Bit 1 of byte 2 of output area                         |
| `M3.2`                            | `QM3.2`                | ブール値        | Bit 2 of byte 3 of memory area                         |
| `IB4` もしくは `EB4`              | `IB4` もしくは `EB4`   | 数値            | Byte 4 (0 -255) of input area                          |
| `QB5` もしくは `AB5`              | `QB5` もしくは `AB5`   | 数値            | Byte 5 (0 -255) of output area                         |
| `MB6`                             | `MB6`                  | 数値            | Byte 6 (0 -255) of memory area                         |
| `IC7` もしくは `EC7`              | `IB7` もしくは `EB7`   | 文字列          | Byte 7 of input area as a Char                         |
| `QC8` もしくは `AC8`              | `QB8` もしくは `AB8`   | 文字列          | Byte 8 of output area as a Char                        |
| `MC9`                             | `MB9`                  | 文字列          | Byte 9 of memory area as a Char                        |
| `II10` もしくは `EI10`            | `IW10` もしくは `EW10` | 数値            | Signed 16-bit number at byte 10 of input area          |
| `QI12` もしくは `AI12`            | `QW12` もしくは `AW12` | 数値            | Signed 16-bit number at byte 12 of output area         |
| `MI14`                            | `MW14`                 | 数値            | Signed 16-bit number at byte 14 of memory area         |
| `IW16` もしくは `EW16`            | `IW16` もしくは `EW16` | 数値            | Unsigned 16-bit number at byte 16 of input area        |
| `QW18` もしくは `AW18`            | `QW18` もしくは `AW18` | 数値            | Unsigned 16-bit number at byte 18 of output area       |
| `MW20`                            | `MW20`                 | 数値            | Unsigned 16-bit number at byte 20 of memory area       |
| `IDI22` もしくは `EDI22`          | `ID22` もしくは `ED22` | 数値            | Signed 32-bit number at byte 22 of input area          |
| `QDI24` もしくは `ADI24`          | `QD24` もしくは `AD24` | 数値            | Signed 32-bit number at byte 24 of output area         |
| `MDI26`                           | `MD26`                 | 数値            | Signed 32-bit number at byte 26 of memory area         |
| `ID28` もしくは `ED28`            | `ID28` もしくは `ED28` | 数値            | Unsigned 32-bit number at byte 28 of input area        |
| `QD30` もしくは `AD30`            | `QD30` もしくは `AD30` | 数値            | Unsigned 32-bit number at byte 30 of output area       |
| `MD32`                            | `MD32`                 | 数値            | Unsigned 32-bit number at byte 32 of memory area       |
| `IR34` もしくは `ER34`            | `IR34` もしくは `ER34` | 数値            | Floating point 32-bit number at byte 34 of input area  |
| `QR36` もしくは `AR36`            | `QR36` もしくは `AR36` | 数値            | Floating point 32-bit number at byte 36 of output area |
| `MR38`                            | `MR38`                 | 数値            | Floating point 32-bit number at byte 38 of memory area |
| `DB1,DT0`                         | -                      | 日付\*\*        | A timestamp in the DATE_AND_TIME format                |
| `DB1,DTZ10`                       | -                      | 日付\*\*        | A timestamp in the DATE_AND_TIME format, in UTC        |
| `DB2,DTL2`                        | -                      | 日付\*\*        | A timestamp in the DTL format                          |
| `DB2,DTLZ12`                      | -                      | 日付\*\*        | A timestamp in the DTL format, in UTC                  |

- \*) SIEMENS S7 PLC の文字列は、文字列のサイズと長さのために、最初に 2 バイトを使用することに注意してください。
- \*\*) IoTconnector flex では、日付データ型は常に UTC で表現されることに注意してください。
