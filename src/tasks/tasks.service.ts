import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(CreateTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create(CreateTaskDto);
    return this.taskRepository.save(task);
  }

  async findAll({
    title,
    status,
    page = 1,
    limit = 10,
    search,
  }: {
    title?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const query = this.taskRepository.createQueryBuilder('task');

    if (title) {
      query.andWhere('task.title LIKE :title', { title: `%${title}%` });
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const [tasks, total] = await query
      .take(limit)
      .skip(((page || 1) - 1) * (limit || 10))
      .getManyAndCount();

    if (!tasks.length) {
      throw new NotFoundException('No tasks found.');
    }
    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
      },
    };
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
    await this.taskRepository.softRemove(task);
    return { message: `Task with ID ${id} has been deleted.` };
  }

  async findDeleted() {
    const query = this.taskRepository.createQueryBuilder('task');

    const [task, count] = await query
      .where('task.deletedAt IS NOT NULL')
      .withDeleted()
      .getManyAndCount();

    return {
      data: task,
      meta: {
        total: count,
      },
    };
  }
}
