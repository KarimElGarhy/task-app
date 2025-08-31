import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'Title must be a string' })
  title!: string;

  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description: string;

  @IsEnum(['Open', 'In Progress', 'Completed'], {
    message: 'Status is wrong',
  })
  status: 'Open' | 'In Progress' | 'Completed';
}
