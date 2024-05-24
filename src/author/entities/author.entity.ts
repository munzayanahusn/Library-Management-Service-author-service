import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsUUID, IsString, IsDateString } from 'class-validator';

@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column('date')
  @IsDateString()
  birthdate: string;
}
