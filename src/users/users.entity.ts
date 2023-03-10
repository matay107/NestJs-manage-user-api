import { AfterInsert, AfterUpdate, AfterRemove, Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @AfterInsert()
  logInsart(){
    console.log('Log Inseart',this.id)
  }

  @AfterUpdate()
  logUpdate(){
    console.log('Log Update',this.id)
  }

  @AfterRemove()
  logRemove(){
    console.log('Log Remove',this.id)
  }
}