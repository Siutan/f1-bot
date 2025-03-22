import ical from "node-ical";
import { Race } from "../db/entities/race";
import { Event } from "../db/entities/event";
import { db } from "../db/dbInit";

const path = "./F1-2025.ics";
const file = Bun.file(path);
const text = await file.text();

interface IEvent {
  type: string;
  params: string[];
  uid: string;
  summary: string;
  dtstamp: string;
  start: Date;
  datetype: string;
  end: Date;
  sequence: string;
  geo: {
    lat: number;
    lon: number;
  };
  location: string;
  status: string;
  categories: string[];
  method: string;
}

interface IProcessedEvent {
  location: string;
  summary: string;
  times: {
    type: string;
    event: string;
    start: Date;
    end: Date;
  }[];
}

export const getEvents = () => {
  const events = ical.sync.parseICS(text);
  if (!events) {
    console.error("No events found");
    return;
  }
  const CalObj = Object.values(events);
  const vEvents = CalObj.filter((event: any) => event.type === "VEVENT") as IEvent[];
  if (vEvents.length === 0) {
    console.error("No valid events found");
    return;
  }
  const sortedEvents = vEvents.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const uniqueLocations = new Set(sortedEvents.map(event => event.location));

  uniqueLocations.forEach((location) => {
    const raceEvents = sortedEvents.filter(
      (e) => e.location === location
    );
    const processedEvents = processRaceEvents(raceEvents);
    storeRaceData(processedEvents).catch(console.error);
  });
};

function processRaceEvents(events: IEvent[]): IProcessedEvent {
  if (events.length === 0) {
    throw new Error("The events array is empty");
  }

  const location = events[0].location;
  const summary = events[0].summary.split(" (")[1].replace(")", "");

  const times = events.map((event) => ({
    type: event.categories[0],
    event: event.summary.split(": ")[1],
    start: event.start,
    end: event.end,
  }));

  return {
    location,
    summary,
    times,
  };
}

const storeRaceData = async (data: IProcessedEvent) => {
  if (!data) {
    console.error("No data found");
    return;
  }

  let race = await db.manager.findOne(Race, { where: { location: data.location } });

  if (!race) {
    race = new Race();
    race.location = data.location;
    race.summary = data.summary;
    await db.manager.save(race);
  }

  // check if there are new events
  const existingEvents = await db.manager.find(Event, { where: { race: race } });
  if (existingEvents.length === data.times.length) {
    console.log(`No new events for ${data.location}`);
    return;
  }
  const events = data.times.map((time) => {
    const event = new Event();
    event.type = time.type;
    event.event = time.event;
    event.startTime = time.start;
    event.endTime = time.end;
    event.race = race;
    return event;
  });

  await db.manager.save(events);

  console.log(`Saved ${events.length} events for ${data.location}`);
};
