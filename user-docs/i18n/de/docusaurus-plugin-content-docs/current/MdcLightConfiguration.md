---
title: Konfigurationsdatei
---

# Konfigurationsdatei

Die Konfigurationsdatei ist eine JSON-Datei, in der verschiedene Informationen und Einstellungen über die Laufzeit gespeichert werden. Sie hat die folgende Struktur:

```json
{
  "general": {
    // Informationen über das Gerät
  },
  "networkConfig": {
    // Konfiguration von Netzwerkschnittstellen, Proxy und Zeit
  },
  "dataSources": {
    // Eine Liste der südlichen Datenquellen (derzeit unterstützt: Siemens S7, ioshield)
  },
  "dataSinks": {
    // Eine Liste von Anwendungsschnittstellen (derzeit unterstützt: MTConnect, OPC UA, CELOS Exchange)
  },
  "virtualDataPoints": {
    //A Liste der virtuellen Datenpunkte, um mehrere Quelldatenpunkte miteinander zu verbinden
  },
  "mapping": {
    // Eine Liste von Verbindungen für Datenpunkte der Datenquelle und Anwendungsschnittstelle
  },
  "quickStart": {
    // Status des Schnellstartverfahrens
  },
  "env": {
    // Tags der zu verwendenden Softwareversionen
  }
}
```

Im Ordner befinden sich zwei Beispielkonfigurationen: `_mdclight/config/`

## Datenquellen

Es gibt zwei Arten von Datenquellen: Die S7-Com PLC Datenquelle "s7" und das digitale Eingangsschild "ioshield".

Hinweis: Die minimale Lesefrequenz der Datenquelle beträgt 500 Millisekunden.

- **S7**: Mit der S7-Datenquelle können Sie Daten von S7-SPSen lesen. Das Lesen von DBs, Eingängen, Ausgängen und Speicherdaten ("Merker") wird unterstützt.

Struktur für S7 Typ:

```json
{
  // Protokoll der Datenquelle
  "protocol": "s7",
  // Ob diese Datenquelle aktiviert ist
  "enabled": true,
  // Die Verbindungsinformationen der Datenquellen
  "connection": {
    // IP Adresse
    "ipAddr": "192.168.0.114",
    // Anschluss. Standard für Protokoll "s7": 102
    "port": 102,
    // Gestell.
    // Für S7 300, S7 1200 und S7 1500: Immer 0
    // Für S7 400: Das Rack, in dem die S7-CPU montiert ist
    "rack": 0,
    // Steckplatz.
    // Für S7 300: Immer 2
    // Für S7 1200 und S7 1500: Immer 1
    // Für S7 400: Der Steckplatz, auf dem die S7-CPU im Rack montiert ist
    "slot": 2
  },
  // Eine Liste von Datenpunkten
  "dataPoints": [
    {
      // Id des Datenpunkts. MUSS eindeutig sein (über alle Datenquellen hinweg)
      "id": "a6cc9e0e-34a8-456a-85ac-f8780b6dd52b",
      // Typ kann "nck" oder "s7" für SPS-Eingänge sein
      "type": "nck",
      // Ein beschreibender Name
      "name": "Not Aus",
      // Datenpunktadresse
      // Einige Beispiele für das Protokoll "s7":
      // Lesen eines Eingangsbits: "I0.0"
      // Lesen eines Eingangsbits: "Q0.0"
      // Lesen eines Speicherbits: "M50.0"
      // Lesen eines booleschen Wertes: "DB93,X0.0"
      // Lesen eines Integer-Wertes: "DB93,INT44"
      // Lesen eines reellen Wertes: "DB93,REAL100"
      // Lesen eines String-Wertes mit der Länge 10: "DB100,S0.10"
      // Lesen eines Stringwerts mit der Länge 255: "DB100,S0.255"
      // Lesen eines DWORD: "DB25,DWORD4"
      // Lesen eines Bytes: "DB340,BYTE60"
      "address": "DB93,X0.0",
      // Lesefrequenz in ms
      "readFrequency": 1200
    }
  ]
}
```

- **IO-Shield**: Mit dem IO-Shield können Sie Daten von digitalen Eingängen lesen, die direkt mit dem IoT2050 verdrahtet sind. Jeder digitale Eingang des IO-Shields ist ein Datenpunkt auf der Datenquelle. Jeder Datenpunkt kann drei verschiedene Zustände haben: 0 - aus (Low, 0V), 1 - an (High, 24V) oder 2 - blinkend, der
  Ausgang ändert seinen Zustand mit einer Mindestfrequenz von 2Hz (die Höchstfrequenz beträgt 10Hz).

Struktur für IO Shield:

```json
{
  // Protokoll der Datenquelle
  "protocol": "ioshield",
  // Ob diese Datenquelle aktiviert ist
  "enabled": true,
  // Typ des IO Shield
  "type": "ai-150+5di",
  // Eine Liste von Datenpunkten
  "dataPoints": [
    {
      // Id des Datenpunkts. MUSS eindeutig sein (über alle Datenquellen hinweg)
      "id": "a6cc9e0e-34a8-456a-85ac-f8780b6dd52b",
      // Ein beschreibender Name
      "name": "Not Aus",
      // Typ muss für ioshield null sein
      "type": null,
      // Datenpunktadresse, z. B. Leseeingänge "DI0" - "DI9"
      "address": "DI2"
    }
  ]
}
```

#### Sinumerik 840D 4.5 PLC Schnittstelle - S7 Adresse für MTConnect Werte

EXECUTION

- ACTIVE - DB21,X35.5 (BOOL) - E_ChanActive // Kanal aktiv
- OPERIONAL_STOP - DB21,X35.6 (BOOL) E_ChanInterrupt // Kanal unterbrochen
- PROGRAM_COMPLETED - DB21,X35.7 (BOOL) E_ChanReset // Kanalreset
- READY - DB21,X36.5 (BOOL) - E_ChanRO // Kanal betriebsbereit

CONTROLLER_MODE

- AUTOMATIC - DB11,X6.0 (BOOL) - „BAG”.E_AUTO // Auto aktiv
- MANUAL_DATA_INPUT DB11,X6.1 - „BAG”.E_MDA // MDA aktiv
- MANUAL - DB11,DBX6.2 - „BAG”.E_JOG // Jog aktiv

TOOL_NUMBER - %DB1072.DBW28 (INT) // Werkzeug Ident

## Virtuelle Datenpunkte

Virtuelle Datenpunkte müssen aus einer oder mehreren Quellen (IDs von Datenpunkten aus realen Datenquellen oder IDs anderer virtueller Datenpunkte), einer eindeutigen ID (über alle Datenpunkte hinweg) und der Art der Operation zur Berechnung des Wertes bestehen.

Wichtig: Wenn ein virtueller Datenpunkt als Quelle eines anderen virtuellen Datenpunkts definiert ist, muss der virtuelle Quelldatenpunkt definiert werden, bevor er verwendet wird!

Derzeit unterstützte VDP-Operationstyp-Werte: `and`, `or`, `not`, `counter`,`thresholds`, `greater`, `greaterEqual`, `smaller`, `smallerEqual`, `equal`, `unequal`, `enumeration`, `calculation`

Format eines VDP in der Konfigurationsdatei (dies beinhaltet auch alle möglichen operationsspezifischen Einstellungen, die nur verwendet werden, wenn diese Operation gewählt wird):

```json
{
  // Eindeutige ID des VDP
  "id": "9d62359b-c48b-4084-825f-1ce56c93e202",
  // Name für den VDP
  "name": "meine Berechnung",
  // Eindeutige IDs der Datenquellen. Sie muss mindestens 1 Quelle enthalten. Für und/oder eine Operation müssen mindestens 2 Quellen vorhanden sein. Die Datenquellen müssen alle Datenpunkte enthalten, die in der nachstehenden Operation/Formel/Enumeration verwendet werden.
  "sources": ["dd88cdb9-994c-40ce-be60-1d37f3aa755a", "fda5000e-0942-4605-a995-9c49bd1e99d6"],
  // Typ kann einer der oben genannten Typen sein
  "operationType": "and",
  //Nur für die Operation Schwellenwerte:
  "thresholds": {
        "0": 0,
        "1": 40
      },
  // Nur für Vergleichsoperationen:
  "comparativeValue": "100",
  // Nur für Rechenoperationen:
  "formula": "(dd88cdb9-994c-40ce-be60-1d37f3aa755a + fda5000e-0942-4605-a995-9c49bd1e99d6) / 100",
  // Nur für Enumerationoperationen:
  "enumeration": {
    // Optionaler Standardwert, wenn keine anderen übereinstimmen
    "defaultValue": "TEST",
    // Liste der Enumerationpunkte
    "items": [
          {
            "source": "dd88cdb9-994c-40ce-be60-1d37f3aa755a",
            "priority": 0,
            "returnValueIfTrue": "1"
          },
          {
            "source": "fda5000e-0942-4605-a995-9c49bd1e99d6",
            "priority": 1,
            "returnValueIfTrue": "2"
          }
        ]
  }
},

```

## Mapping

Ein einzelnes Mapping unterstützt die folgenden Konfigurationselemente:

```json
{
  // Eindeutige ID des Quelldatenpunkts
  "source": "55455122-9e2b-4473-b6e9-8463089cd299",
  // Eindeutige ID des Zieldatenpunkts
  "target": "1a468843-e2e1-4835-a111-a6844589526d",
  // Eindeutige ID des Mappings
  "id": "03b9488e-364e-4fed-8713-33a8eb005d18"
}
```

## Anwendungsschnittstelle

In der Konfigurationsdatei befinden sich diese Einstellungen unter dem Schlüssel `dataSinks`.

Eine einzelne Anwendungsschnittstelle unterstützt die folgenden Konfigurationspunkte:

- Hinweis: Es sollte nur eine Anwendungsschnittstelle konfiguriert werden

```json
{
  // Protokoll der Datenquelle. Unterstützte Protokolle sind: "mtconnect", "opcua" und "datahub"
  "protocol": "mtconnect",
  // Ob die Anwendungsschnittstelle aktiviert ist
  "enabled": true,
  // Authentifizierungsoption, falls erforderlich, nur für das "opcua"-Protokoll
  "auth": {
    "type": "anonymous"
  },
  // Nur für das "datahub"-Protokoll:
  "datahub1": {
    //Hostname für die Bereitstellung
    "provisioningHost": "",
    "scopeId": "",
    "regId": "",
    "symKey": ""
  },
  // Eine Liste von Datenpunkten
  "dataPoints": [
    {
      // Id des Datenpunktes. MUSS eindeutig sein (über alle Datenquellen hinweg)
      // Für das Protokoll MTconnect wird diese Kennung mit der Kennung eines MTConnect-Datenpunkts verknüpft
      "id": "0c24235c-f56d-435b-a560-6874079effb4",
      // Ein beschreibender Name
      "name": "Emergency Stop",
      // Der Typ des mtcoonect-Datenelements. Derzeit unterstützt: "event".
      // Erforderlich für Protokoll "mtconnect".
      "type": "event",
      // Eine Zuordnung für das Datenelement "mtconnect".
      // Boolesche Werte können auf String-Werte abgebildet werden. Zum Beispiel könnte der Notausschalter auf den entsprechenden mtconnect-Wert "TRIGGERED" oder "ARMED" abgebildet werden.
      // Wenn mehr als zwei String-Werte benötigt werden, können entweder Integer-Werte verwendet werden oder die Werte können durch separate boolesche Werte gesetzt werden, indem "mapValues" in der Zuordnung gesetzt werden muss. Wenn mehr als ein boolescher Wert "true" ist, wird der niedrigste aktive Wert verwendet.
      // Optional für das Protokoll "mtconnect".
      "map": {
        // Boolesche Werte
        "true": "TRIGGERED",
        "false": "ARMED",
        // Ganzzahl oder "mapValues"
        "0": "AUTOMATIC",
        "1": "MANUAL_DATA_INPUT",
        "2": "SEMI_AUTOMATIC",
        // IO-Shield vollständige Mapping
        "0": "ON",
        "1": "OFF",
        "2": "BLINKING"
      },
      // Optional - Anfangswert, kann auch zum Setzen eines konstanten Wertes verwendet werden. Wird überschrieben, sobald Daten gelesen werden
      "initialValue": "TRIGGERED"
    }
  ]
}
```

## Häufig gestellte Fragen

1. _Kann ich für einen Datenpunkt einer Datenquelle und einen Datenpunkt einer Anwendungsschnittstelle die gleiche ID verwenden?_
   Ja, Datenpunkt-IDs müssen nur innerhalb aller Datenquellen und getrennt innerhalb aller Anwendungsschnittstellen eindeutig sein.
   Virtuelle Datenpunkte zählen auch als Datenquellen-Datenpunkte.

Zum Beispiel wäre folgendes gültig:

```json
{
  // Identische Quelle und identisches Ziel
  "source": "10456f7b-6d0c-4488-8d19-71de07754305",
  "target": "10456f7b-6d0c-4488-8d19-71de07754305",
  // eine eindeutige Kennung der Zuordnung über alle Datenpunkte hinweg
  "id": "0c24235c-f56d-435b-a560-6874079effb4"
}
```

2. _Kann ich einen konstanten Wert in einer Anwendungsschnittstelle festlegen?_
   Ja, konfigurieren Sie einfach einen Enumerationdatenpunkt mit einem Anfangswert, dem kein realer oder virtueller Datenpunkt zugeordnet ist.
   Zum Beispiel:

```json
{
  // Eindeutige ID für alle Datenpunkte
  "id": "d8090a1a-9e7f-494b-a695-ff077f4df75a",
  "sources": [],
  "operationType": "enumeration",
  "name": "MyConstant",
  "enumeration": {
    // Ihr Konstantenwert hier
    "defaultValue": "46.149"
  }
}
```
