import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Task } from './tasks/entities/task.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TasksModule,
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as
        | 'mysql'
        | 'postgres'
        | 'sqlite'
        | 'mariadb'
        | 'oracle'
        | 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'task-app',
      entities: [Task, User],
      synchronize: process.env.TYPEORM_SYNC === 'true' || true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
