import "reflect-metadata";
import { DataSource } from "typeorm";
import { Race } from "./entities/race";
import { Event } from "./entities/event";
console.log(__dirname)

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "main.sqlite",
  synchronize: true,
  logging: false,
  entities: [Race, Event],
  migrations: [],
  subscribers: [],
});

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export let db = AppDataSource;
