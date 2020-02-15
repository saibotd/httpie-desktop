import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Command from "./Command";

@Entity()
export default class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 1024
  })
  title: string;

  @Column({
    nullable: true,
    transformer: {
      to(value: any): any {
        return JSON.stringify(value);
      },
      from(value: any): any {
        if (!value) return value;
        return JSON.parse(value);
      }
    }
  })
  environment?: string;

  @OneToMany(
    type => Command,
    commands => commands.project
  )
  commands: Command[];
}
