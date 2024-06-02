import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Event } from "./event";

@Entity({ name: "races" })
export class Race {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  location!: string;
  
  @Column()
  summary!: string;

  @OneToMany(() => Event, event => event.race)
  events!: Relation<Event>[];
}
