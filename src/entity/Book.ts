import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { array: true })
  content: string[];

  @Column()
  lastReadPage: number;

  @Column()
  author: string;
}
