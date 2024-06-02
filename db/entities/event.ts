import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Race } from "./race";

@Entity({ name: "events" })
export class Event {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  type!: string;
  
  @Column()
  event!: string;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  @ManyToOne(() => Race, race => race.events)
  race!: Relation<Race>;
}
