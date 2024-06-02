import "reflect-metadata";
import { DataSource } from "typeorm";
import { Race } from "./entities/race";
import { Event } from "./entities/event";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "main.sqlite",
  synchronize: true,
  logging: false,
  entities: [Race, Event],
  migrations: [],
  subscribers: [],
});

export let db = AppDataSource;
