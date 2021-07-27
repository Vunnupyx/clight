import { DataPointMapper } from "..";
import { ConfigManager } from "../../ConfigManager";
import {
  IDataSinkConfig,
  IDataSourceConfig,
} from "../../ConfigManager/interfaces";
import { EventBus } from "../../EventBus";

describe("Test DataPointMapper", () => {
  test("should map a source to it's target", async () => {
    const config = new ConfigManager({
      errorEventsBus: new EventBus<null>(),
      lifecycleEventsBus: new EventBus<null>(),
    });

    const dataSource: IDataSourceConfig = {
      id: "",
      name: "",
      protocol: "",
      dataPoints: [
        {
          id: "source1",
          name: "",
          address: "",
          readFrequency: 1000,
        },
      ],
    };
    const dataSink: IDataSinkConfig = {
      id: "",
      name: "",
      protocol: "",
      dataPoints: [{ id: "target1", name: "", type: "event", map: {} }],
    };
    config.config = {
      dataSources: [dataSource],
      dataSinks: [dataSink],
      virtualDataPoints: [],
      mapping: [
        {
          source: "source1",
          target: "target1",
        },
      ],
    };

    const mapper = new DataPointMapper(config);
    const mapping = mapper.getTarget(dataSource.dataPoints[0].id);

    expect(mapping).toBe(config.config.mapping[0]);
  });
});
