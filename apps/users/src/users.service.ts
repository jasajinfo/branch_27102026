import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserPayload {
  name: string;
  email: string;
}

@Injectable()
export class UsersService {
  // Demonstração em memória: para persistência real, conecte PostgreSQL/Prisma.
  private readonly users: User[] = [];
  private nextId = 1;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | null {
    return this.users.find((user) => user.id === id) ?? null;
  }

  create(data: CreateUserPayload): User {
    const user: User = {
      id: this.nextId++,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
    };
    this.users.push(user);
    return user;
  }
}
