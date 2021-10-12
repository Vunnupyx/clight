# Runtime structure

The apps entry point is located here: ./src/index.ts
There the Bootstrap Manager is initialized, which manages all programme modules like event buses, configuration, data sources and data sinks.

## Event buses

There are 3 main event buses that the modules use to communicate with each other.

- Measurement Event Bus: This is used to distribute all measurements from different data sources to the data sinks.
- Life cycle bus: This is used to distribute all life cycle events.
- Error bus: This is used to share all errors.

## Configuration

The configuration manages loads and parses the runtime and user configuration for data sources and data sinks.

## Data sources

All data sources are managed by the data source manager. New data sources can easily be added in the src/modules/DataSource folder.

## Data sinks

All data sources are managed by the data sink manager. New data sinks can easily be added in the src/modules/DataSource folder.
