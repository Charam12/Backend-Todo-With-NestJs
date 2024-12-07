import { Controller, Get, Post, Delete, Query, Param, Body, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { TodoService } from './todo.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTodo(@Body() body: { todo_date: string; title: string; description: string; status: string }, @Request() req) {
    const { todo_date, title, description, status } = body;
    const userId = req.user.userId;
    console.log(req.user);
    if (!title || !['TODO', 'DOING', 'DONE'].includes(status)) {
      throw new BadRequestException('Invalid data');
    }
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid userId');
    }
    return await this.todoService.createTodo({ todo_date, title, description, userId, status });
  }

  @Get()
  @UseGuards(AuthGuard)
  async getTodos(
    @Query('status') status: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('isSortTodoDateDesc') isSortTodoDateDesc: string,
  ) {
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedSort = isSortTodoDateDesc === 'false' ? false : true;

    return await this.todoService.getTodos(status, parsedPage, parsedLimit, parsedSort);
  }

  @Delete(':todoId')
  @UseGuards(AuthGuard)
  async deleteTodo(@Param('todoId') todoId: string) {
    return await this.todoService.deleteTodo(Number(todoId));
  }
}
