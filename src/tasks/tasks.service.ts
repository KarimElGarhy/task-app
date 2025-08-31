import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  create(CreateTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create(CreateTaskDto);
    return this.taskRepository.save(task);
  }

  async findAll({ title, status }: { title?: string; status?: string }) {
    const query = this.taskRepository.createQueryBuilder('task');

    if (title) {
      query.andWhere('task.title LIKE :title', { title: `%${title}%` });
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    const tasks = await query.getMany();
    if (!tasks.length) {
      throw new NotFoundException('No tasks found.');
    }
    return tasks;
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const editTask = await this.taskRepository.findOneBy({ id });
    if (!editTask) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    Object.assign(editTask, updateTaskDto);
    return this.taskRepository.save(editTask);
  }

  async remove(id: number) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    await this.taskRepository.delete(task);
  }
}
