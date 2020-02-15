const path = require("path");
import "reflect-metadata";
import { createConnection } from "typeorm";
import Command from "./entity/Command";
import Project from "./entity/Project";

export default async function(config) {
  return await createConnection({
    type: config.connection.dbtype,
    ...config[config.connection.dbtype],
    entities: [Project, Command],
    synchronize: true
  });
}
