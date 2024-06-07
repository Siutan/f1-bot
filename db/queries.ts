import { LessThan, Like, MoreThan, type DataSource } from "typeorm";
import { Event } from "./entities/event";
import { Race } from "./entities/race";

export default {
  // race queries
  getRace: async (db: DataSource, id: string) => {
    // return the race and its events
    const race = await db.manager.findOne(Race, { where: { id } });

    if (!race) {
      console.log(`No race found for ${id}`);
      return null;
    }
    const events = await db.manager.find(Event, { where: { race } });

    return { race, events };
  },
  getRaces: async (db: DataSource) => {
    return await db.manager.find(Race);
  },
  getNextRace: async (db: DataSource) => {
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

    const events = await db
      .getRepository(Event)
      .createQueryBuilder("event")
      .where("event.raceId = :raceId", { raceId: nextEvent.race.id })
      .orderBy("event.startTime", "ASC")
      .getMany();

    return { nextRace: nextEvent.race, events };
  },
  getRaceByLocation: async (db: DataSource, location: string) => {
    const raceRepo = db.getRepository(Race);

    const races = await raceRepo
      .createQueryBuilder("race")
      .where("race.location LIKE :location OR race.summary LIKE :location", { location: `%${location}%` })
      .orderBy("CASE WHEN race.location LIKE :location THEN 1 ELSE 2 END, CASE WHEN race.summary LIKE :location THEN 1 ELSE 2 END")
      .getMany();

    if (!races || races.length === 0) {
      console.log(`No race found for ${location}`);
      return null;
    }

    const raceId = races[0].id;
    const events = await db
      .getRepository(Event)
      .createQueryBuilder("event")
      .where("event.raceId = :raceId", { raceId })
      .orderBy("event.startTime", "ASC")
      .getMany();
      
      console.log(events.length)

    return { race: races[0], events };
  },
  getTimeUntilNextRace: async (db: DataSource) => {
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

    const events = await db
      .getRepository(Event)
      .createQueryBuilder("event")
      .where("event.raceId = :raceId", { raceId: nextEvent.race.id })
      .orderBy("event.startTime", "ASC")
      .getMany();
      
      // find event where type is grand prix
      const grandPrix = events.find((event) => event.type === "Grand Prix");
      if (!grandPrix) {
        return null;
      }

      const grandPrixTime = grandPrix.startTime;

      return { nextRace: nextEvent.race, grandPrixTime };
  },
  //--------------------------------------------------------------- event queries
  getEvent: async (db: DataSource, id: string) => {
    return await db.manager.findOne(Event, { where: { id } });
  },
  getEvents: async (db: DataSource) => {
    return await db.manager.find(Event);
  },
  getNextEvent: async (db: DataSource) => {
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

    return nextEvent;
  },
  getCurrentEvent: async (db: DataSource) => {
    const currentTime = new Date();
    return await db.getRepository(Event).findOne({
      where: {
        startTime: LessThan(currentTime),
        endTime: MoreThan(currentTime),
      },
      relations: {
        race: true,
      },
      order: {
        startTime: "DESC",
      },
    });
  },
};
