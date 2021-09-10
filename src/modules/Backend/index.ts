import app from "./routes";
import winston from "winston";

export class Backend {
  start(): Backend {
    const port = process.env.PORT || 5000;
    app.listen(port, () =>
      winston.info(`Backend server listening on port ${port}`)
    );

    return this;
  }
}
