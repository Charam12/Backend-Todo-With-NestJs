import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  todo_date: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: Enumerator;

  @Column()
  user_id: number;
}
