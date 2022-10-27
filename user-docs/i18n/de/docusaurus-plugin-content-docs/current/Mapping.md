---
title: Mapping
---

# Mapping

## Einleitung

Mapping beschreibt die Beziehung zwischen Quelldatenpunkten (`NC`/`DI`/`AI`/`VDP`) und den Zieldatenpunkten (`MTConnect`/`OPC UA`). Es ist notwendig, den Quelldatenwert an die Zieldatenpunkte für verschiedene [`Anwendungsschnittstellen`](ApplicationInterface.md) weiterzuleiten.

**Hinweis:** Die Zieldatenpunkte in [`Anwendungsschnittstellen`](ApplicationInterface.md) müssen vorher definiert sein, bevor Sie ein Mapping erstellen können, da Sie diesen Zieldatenpunkt bei der Erstellung des VDPs auswählen müssen.

### Hinzufügen eines Mappings

![Mapping neue Datenzuordnung hinzufügen](/img/mapping/adding.png)

1. Klicken Sie auf die blaue Schaltfläche mit dem weißen Plus-Symbol ![Mapping neue Schaltfläche hinzufügen](/img/mapping/mapping_addbutton.png)
2. Die neue Zeile wird am Ende der Tabelle hinzugefügt.
3. Wählen Sie den gewünschten Quellpunkt aus dem Dropdown-Menü in der Spalte Quelle.
4. Wählen Sie den gewünschten Zieldatenpunkt (für die gewünschte [`Application Interface`](ApplicationInterface.md)) in der Spalte Target.
5. Klicken Sie auf die grüne Schaltfläche zum Speichern oder auf das rote Kreuz, um Ihre Eingabe zu verwerfen.
6. Klicken Sie auf die Schaltfläche `Änderungen übernehmen`, um Ihren neuen Datenpunkt an das Gerät zu senden.

### Löschen einer Zuordnung

1. Klicken Sie für das zu löschende Mapping auf das Müllsymbol rechts in der Spalte `Aktionen`.
2. Wählen Sie im Dialog mit der Frage Ja: "Sind Sie sicher, dass Sie einen Datenpunkt löschen wollen?"
3. Klicken Sie auf die Schaltfläche `Änderungen übernehmen`, um die Änderung an das Backend zu senden.

### Mapping bearbeiten

1. Klicken Sie auf der rechten Seite des zu löschenden Eintrags im Abschnitt `Aktionen` auf das Bleistiftsymbol
2. Der Listeneintrag kann nun wie ein neu erzeugter Datenpunkt bearbeitet werden (siehe Abschnitt [Mapping hinzufügen](Mapping.md#add-a-mapping) oben, beginnen Sie mit Schritt 3 und fahren Sie fort).
3. Klicken Sie nach Ihren Änderungen auf die grüne Schaltfläche zum Speichern oder auf das rote Kreuz, um Ihren Eintrag zu verwerfen.
4. Klicken Sie auf die Schaltfläche `Änderungen übernehmen`, um Ihren neuen Datenpunkt an das Gerät zu senden.
