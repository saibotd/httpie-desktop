import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Project from "./Project";

@Entity()
export default class Command {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 1024
  })
  title: string;

  @Column({
    length: 2048,
    nullable: true
  })
  args?: string;

  @ManyToOne(
    type => Project,
    project => project.commands
  )
  project: Project;
}
