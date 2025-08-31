import { IsEmail, IsString } from 'class-validator';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  @IsString()
  name: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
