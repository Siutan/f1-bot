import { MoreThan, type DataSource } from "typeorm";
import { Event } from "./entities/event";
import { Race } from "./entities/race";

export default {
  // race queries
  getRace: async (db: DataSource, id: string) => {
    return await db.manager.findOne(Race, { where: { id } });
  },
  getRaces: async (db: DataSource) => {
    return await db.manager.find(Race);
  },
  getNextRace: async (db: DataSource) => {
    // Get the next event that has not started yet and includes race relation
    const currentTime = new Date();
    const nextEvent = await db.getRepository(Event).findOne({
      where: {
        startTime: MoreThan(currentTime),
      },
      relations: {
        race: true,
      },
      order: {
        startTime: "ASC",
      },
    });

    if (!nextEvent) {
      console.log("No upcoming events found.");
      return null;
    }

    // get all events for the next race
    const events = await db
      .getRepository(Event)
      .createQueryBuilder("event")
      .where("event.raceId = :raceId", { raceId: nextEvent.race.id })
      .orderBy("event.startTime", "ASC")
      .getMany();

    // Return the race details and the next event
    return { nextRace: nextEvent.race, events };
  },
  // event queries
  getEvent: async (db: DataSource, id: string) => {
    return await db.manager.findOne(Event, { where: { id } });
  },
  getEvents: async (db: DataSource) => {
    return await db.manager.find(Event);
  },
  getNextEvent: async (db: DataSource) => {
    const events = await db.manager.find(Event);

    // sort events by start time
    events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const currentTime = new Date();

    const nextEvent = events.find((event) => {
      return event.startTime > currentTime;
    });

    return nextEvent;
  },
};
