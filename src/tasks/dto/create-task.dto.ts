import { IsEnum, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'Title must be a string' })
  title!: string;
  description: string;
  @IsEnum(['Open', 'In Progress', 'Completed'], {
    message: 'Status is wrong',
  })
  status: 'Open' | 'In Progress' | 'Completed';
}
