---
title: 'Datenquelle: SIEMENS SINUMERIK 840D pl/sl'
---

## Einführung

Mit dieser Datenquelle können Sie SIEMENS SINUMERIK 840D pl und SIEMENS SINUMERIK 840D sl Steuerungen und SIEMENS S7 SPSen verbinden. Sie müssen die Benutzeroberfläche entsprechend dem Modell konfigurieren, damit sie korrekt funktioniert. Sie können Datenpunkte von der NCK und dem SPS-Teil der 840D lesen.

Oben auf der Seite finden Sie die wichtigsten Einstellungen für die Datenquelle: Aktivieren, Eingabe der IP-Adresse und Auswahl des Steuerungstyps.

## Ändern des Typs der Siemens-Datenquelle

Sie können das Dropdown-Menü Typ oben auf der Seite verwenden, um den Typ der verwendeten Eingabekarte auszuwählen.

![Siemens Typ Optionen](/img/datasource/siemens_types.png)

## Hinzufügen neuer Datenpunkte

- Um einen neuen NCK-Datenpunkt hinzuzufügen, klicken Sie auf die blaue Schaltfläche `Datenpunkt hinzufügen` (/img/datasource/addbutton.png) oben links in der Tabelle.
- Der neue Datenpunkt wird am Ende der Liste hinzugefügt.
- Geben Sie dem neuen Datenpunkt einen Namen und wählen Sie zwischen den Variablen `NCK` und `PLC`.
- Sie müssen die Adresse des Datenpunktes angeben, wenn Sie `PLC` als Typ wählen oder eine Variable auswählen, wenn Sie `NCK` als Typ wählen.
- Wenn Sie fertig sind, klicken Sie auf die grüne Schaltfläche Speichern am Ende der Zeile.
- Um alle von Ihnen vorgenommenen Variablenänderungen zu übernehmen, klicken Sie bitte auf die Schaltfläche `Änderungen übernehmen` oben rechts auf der Seite.

### NCK Datenpunkte

![NCK neue Datenpunktreihe](/img/datasource/nck.png)

Für NCK können Sie aus einer Liste von BTSS-String-ähnlichen Variablenadressen unter der Spalte `Adresse` auswählen, indem Sie auf die Schaltfläche `Auswählen` klicken ![NCK select button](/img/datasource/nckselectbutton.png), wie im Bild oben zu sehen. Nachdem Sie eine Variable hinzugefügt oder geändert und die Änderungen übernommen haben, ist ihr Wert in der Laufzeit verfügbar.

Beispiel für einen hinzugefügten NCK-Datenpunkt:
![Beispiel NCK Datenpunkt](/img/datasource/nck_example.png)

Im Folgenden finden Sie einige Beispiele, die Ihnen bei der Auswahl Ihrer Variablen helfen sollen:

| Adresse                                          | Typ  |
| ------------------------------------------------ | ---- |
| `/Channel/ProgramPointer/progName`               | Text |
| `/Nck/MachineAxis/feedRateOvr`                   | Zahl |
| `/Channel/State/actProgNetTime`                  | Zahl |
| `/Bag/State/OpMode`                              | Zahl |
| `/Channel/ProgramModification/singleBlockActive` | Zahl |
| `/Channel/Programinfo/selectedWorkPProg`         | Text |
| `/Channel/State/feedRateIpoOvr`                  | Zahl |
| `/Channel/Configuration/numSpindles`             | Zahl |
| `/Channel/Spindle/SpindleType`                   | Zahl |
| `/Channel/Spindle/speedOvr`                      | Zahl |
| `/Channel/State/rapFeedRateOvr`                  | Zahl |
| `/Channel/State/totalParts`                      | Zahl |
| `/Channel/State/reqParts`                        | Zahl |
| `/Channel/State/actParts`                        | Zahl |
| `/Channel/State/actTNumber`                      | Zahl |
| `/Nck/State/numAlarms`                           | Zahl |
| `/Nck/Configuration/maxnumAlarms`                | Zahl |
| `/Nck/AlarmEvent/alarmNo`                        | Zahl |
| `/Nck/LastAlarm/alarmNo`                         | Zahl |
| `/Nck/TopPrioAlarm/alarmNo`                      | Zahl |
| `/Channel/ChannelDiagnose/cuttingTime`           | Zahl |
| `/Channel/State/progStatus`                      | Zahl |
| `/Channel/ProgramInfo/msg`                       |      |
| `/Channel/ProgramInfo/workPNameLong`             | Text |
| `/Channel/ProgramInfo/workPandProgName`          | Text |
| `/Channel/State/specParts`                       | Zahl |
| `/Channel/Spindle/turnState`                     | Zahl |
| `/Nck/Configuration/anLanguageOnHmi`             | Zahl |
| `/Nck/Configuration/basicLengthUnit`             |      |
| `/Nck/Configuration/nckType`                     | Zahl |
| `/Nck/Configuration/nckVersion`                  | Zahl |
| `/Channel/State/chanStatus`                      | Zahl |
| `/Channel/ProgramModification/optStopActive`     | Zahl |
| `/Channel/ProgramModification/progTestActive`    | Zahl |
| `/Channel/ProgramModification/trialRunActive`    | Zahl |

### PLC Datenpunkte

![PLC neue Datenpunktzeile](/img/datasource/plc.png)

Die Datenpunktadressen unterscheiden sich leicht von den in SIEMENS Step 7 oder SIEMENS TIA Portal verwendeten Variablenadressen. Der Hauptunterschied besteht darin, dass die Datenpunktadresse den Datentyp enthält, so dass der IoTconnector flex die Rohbytes richtig dekodieren kann. Sie können eine Datenpunktadressenkette in das Textfeld unter der Spalte Adresse in der Datenpunktzeile eingeben.

Beispiel für einen hinzugefügten PLC-Datenpunkt:
![Beispiel SPS-Datenpunkt](/img/datasource/plc_example.png)

Hier sind einige Beispiele, die Ihnen bei der Adressierung Ihrer Variablen helfen sollen:

| Adresse                       | Step7 Äquivalent   | JS Datentyp | Beschreibung                                                    |
| ----------------------------- | ------------------ | ----------- | --------------------------------------------------------------- |
| `DB5,X0.1`                    | `DB5.DBX0.1`       | Boolesch    | Bit 1 von Byte 0 des DB 5                                       |
| `DB23,B1` oder `DB23,BYTE1`   | `DB23.DBB1`        | Zahl        | Byte 1 (0-255) des DB 23                                        |
| `DB100,C2` oder `DB100,CHAR2` | `DB100.DBB2`       | Text        | Byte 2 des DB 100 als Char                                      |
| `DB42,I3` oder `DB42,INT3`    | `DB42.DBW3`        | Zahl        | Vorzeichenbehaftete 16-Bit-Zahl an Byte 3 des DB 42             |
| `DB57,WORD4`                  | `DB57.DBW4`        | Zahl        | Vorzeichenlose 16-Bit-Zahl an Byte 4 des DB 57                  |
| `DB13,DI5` oder `DB13,DINT5`  | `DB13.DBD5`        | Zahl        | Vorzeichenbehaftete 32-Bit-Zahl an Byte 5 des DB 13             |
| `DB19,DW6` oder `DB19,DWORD6` | `DB19.DBD6`        | Zahl        | Vorzeichenlose 32-Bit-Zahl an Byte 6 des DB 19                  |
| `DB21,R7` oder `DB21,REAL7`   | `DB21.DBD7`        | Zahl        | Fließkommazahl 32-Bit an Byte 7 des DB 21                       |
| `DB2,S7.10`\*                 | -                  | Text        | Zeichenkette der Länge 10 beginnend bei Byte 7 des DB 2         |
| `I1.0` oder `E1.0`            | `I1.0` oder `E1.0` | Boolesch    | Bit 0 von Byte 1 des Eingabebereichs                            |
| `Q2.1` oder `A2.1`            | `Q2.1` oder `A2.1` | Boolesch    | Bit 1 von Byte 2 des Ausgangsbereichs                           |
| `M3.2`                        | `QM3.2`            | Boolesch    | Bit 2 von Byte 3 des Speicherbereichs                           |
| `IB4` oder `EB4`              | `IB4` oder `EB4`   | Zahl        | Byte 4 (0 -255) des Eingabebereichs                             |
| `QB5` oder `AB5`              | `QB5` oder `AB5`   | Zahl        | Byte 5 (0 -255) des Ausgangsbereichs                            |
| `MB6`                         | `MB6`              | Zahl        | Byte 6 (0 -255) des Speicherbereichs                            |
| `IC7` oder `EC7`              | `IB7` oder `EB7`   | Text        | Byte 7 des Eingabebereichs als Char                             |
| `QC8` oder `AC8`              | `QB8` oder `AB8`   | Text        | Byte 8 des Ausgabebereichs als Char                             |
| `MC9`                         | `MB9`              | Text        | Byte 9 des Speicherbereichs als Char                            |
| `II10` oder `EI10`            | `IW10` oder `EW10` | Zahl        | Vorzeichenbehaftete 16-Bit-Zahl an Byte 10 des Eingabebereichs  |
| `QI12` oder `AI12`            | `QW12` oder `AW12` | Zahl        | Vorzeichenbehaftete 16-Bit-Zahl an Byte 12 des Ausgabebereichs  |
| `MI14`                        | `MW14`             | Zahl        | Vorzeichenbehaftete 16-Bit-Zahl an Byte 14 des Speicherbereichs |
| `IW16` oder `EW16`            | `IW16` oder `EW16` | Zahl        | Vorzeichenlose 16-Bit-Zahl an Byte 16 des Eingangsbereichs      |
| `QW18` oder `AW18`            | `QW18` oder `AW18` | Zahl        | 16-Bit-Zahl ohne Vorzeichen an Byte 18 des Ausgabebereichs      |
| `MW20`                        | `MW20`             | Zahl        | 16-Bit-Zahl ohne Vorzeichen an Byte 20 des Speicherbereichs     |
| `IDI22` oder `EDI22`          | `ID22` oder `ED22` | Zahl        | Vorzeichenbehaftete 32-Bit-Zahl an Byte 22 des Eingangsbereichs |
| `QDI24` oder `ADI24`          | `QD24` oder `AD24` | Zahl        | Vorzeichenbehaftete 32-Bit-Zahl an Byte 24 des Ausgabebereichs  |
| `MDI26`                       | `MD26`             | Zahl        | Vorzeichenbehaftete 32-Bit-Zahl an Byte 26 des Speicherbereichs |
| `ID28` oder `ED28`            | `ID28` oder `ED28` | Zahl        | Vorzeichenlose 32-Bit-Zahl an Byte 28 des Eingangsbereichs      |
| `QD30` oder `AD30`            | `QD30` oder `AD30` | Zahl        | 32-Bit-Zahl ohne Vorzeichen an Byte 30 des Ausgabebereichs      |
| `MD32`                        | `MD32`             | Zahl        | Vorzeichenlose 32-Bit-Zahl an Byte 32 des Speicherbereichs      |
| `IR34` oder `ER34`            | `IR34` oder `ER34` | Zahl        | 32-Bit-Fließkommazahl an Byte 34 des Eingabebereichs            |
| `QR36` oder `AR36`            | `QR36` oder `AR36` | Zahl        | 32-Bit-Fließkommazahl an Byte 36 des Ausgabebereichs            |
| `MR38`                        | `MR38`             | Zahl        | 32-Bit-Gleitkommazahl an Byte 38 des Speicherbereichs           |
| `DB1,DT0`                     | -                  | Datum\*\*   | Ein Zeitstempel im Format DATE_AND_TIME                         |
| `DB1,DTZ10`                   | -                  | Datum\*\*   | Ein Zeitstempel im Format DATE_AND_TIME, in UTC                 |
| `DB2,DTL2`                    | -                  | Datum\*\*   | Ein Zeitstempel im DTL-Format                                   |
| `DB2,DTLZ12`                  | -                  | Datum\*\*   | Ein Zeitstempel im DTL-Format, in UTC                           |

- \*) Beachten Sie, dass Strings in SIEMENS S7-SPSen zwei zusätzliche Bytes am Anfang für Größe und Länge des Strings verwenden
- \*\*) Beachten Sie, dass im IoTconnector flex die Datentypen "Datum" _immer_ in UTC dargestellt werden.
