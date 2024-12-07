import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoController } from './todo/todo.controller';
import { TodoService } from './todo/todo.service';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [TodoModule, AuthModule],
  controllers: [AppController, TodoController, AuthController],
  providers: [AppService, TodoService],
})
export class AppModule {}
