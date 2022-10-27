---
title: Changelog des Basisbildes
---

# Changelog des Basisbildes

## 2.3.0

### Aktualisiert

- Aktualisierung des Frontend/Webserver-Container-Images auf 2.3.0

## 2.1.3

### Behoben

- [DIGMDCLGHT-133](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-133) Behebung eines Leerzeichen-Fehlers im Container ssh-Schlüsseldienst.

### Aktualisiert

- Erhöhung der OS-Basis-Image-Version auf 2.0.1
- Aktualisierung des MDC Flex-Laufzeit-Container-Images auf 2.1.3
- Aktualisierung des Frontend/Webserver-Container-Images auf 2.1.3

## 2.0.0

### Hinzugefügt

- Volume "/etc/mdcflex-os-release" in der Datei docker-compose hinzugefügt

### Behoben

- [DIGMDCLGHT-97](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-97) Behebung von IPv6-Adresskollisionen, wenn sich zu viele MDC Flex-Geräte im selben Netzwerk befinden.
