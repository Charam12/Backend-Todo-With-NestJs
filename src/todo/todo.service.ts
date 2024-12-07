import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TodoService {
  private readonly prisma = new PrismaClient();

  async createTodo(data: { todo_date: string; title: string; description: string; userId: number; status: string}): Promise<any> {
    if (!data.todo_date || !data.title || !data.description || !data.status) {
      throw new BadRequestException('Missing required fields');
    }
    if (!['TODO', 'DOING', 'DONE'].includes(data.status)) {
      throw new BadRequestException('Invalid status value');
    }

    return await this.prisma.todo.create({
      data: {
        todo_date: new Date(data.todo_date),
        title: data.title,
        description: data.description,
        user_id: data.userId,
        status: data.status,
      },
    });
  }

  async getTodos(
    status: string | null,
    page: number = 1,
    limit: number = 10,
    isSortTodoDateDesc: boolean = true,
  ): Promise<any> {
    const where: any = {};
    if (status === 'TODO' || status === 'DOING' || status === 'DONE') {
      where.status = status;
    }

    const offset = Math.max(page - 1, 0) * Math.max(limit, 1);
    const take = Math.max(limit, 1);

    try {
      const todos = await this.prisma.todo.findMany({
        where,
        skip: offset,
        take,
        orderBy: {
          todo_date: isSortTodoDateDesc ? 'desc' : 'asc',
        },
      });

      return {
        data: todos,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching todos');
    }
  }

  async deleteTodo(todoId: number): Promise<any> {
    if (!todoId || typeof todoId !== 'number') {
      throw new BadRequestException('Invalid todoId');
    }

    try {
      return await this.prisma.todo.delete({
        where: { id: todoId },
      });
    } catch (error) {
      throw new BadRequestException('Todo not found or already deleted');
    }
  }
}
