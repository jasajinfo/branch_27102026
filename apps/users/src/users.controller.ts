import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

interface CreateUserPayload {
  name: string;
  email: string;
}

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'users.findAll' })
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'users.findOne' })
  findOne(@Payload() payload: { id: number }) {
    return this.usersService.findOne(payload.id);
  }

  @MessagePattern({ cmd: 'users.create' })
  create(@Payload() payload: CreateUserPayload) {
    return this.usersService.create(payload);
  }
}
