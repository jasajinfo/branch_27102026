import { ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

/** Mantém validações de DTO em mensagens TCP com códigos inteligíveis no Gateway. */
export function rpcValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => new RpcException({
      statusCode: 400,
      message: errors.flatMap((item) => Object.values(item.constraints ?? {})).join('; ') || 'Dados inválidos',
    }),
  });
}
