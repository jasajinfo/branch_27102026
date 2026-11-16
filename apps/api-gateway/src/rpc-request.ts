import { HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';

/** Converte erros de transporte/RPC em HTTP, sem expor informações internas. */
export async function rpcRequest<T>(
  client: ClientProxy,
  pattern: string,
  payload: unknown,
): Promise<T> {
  try {
    return await firstValueFrom(client.send<T>(pattern, payload).pipe(timeout(5000)));
  } catch (error: unknown) {
    if (error instanceof TimeoutError || isConnectivityFailure(error)) {
      throw new HttpException('Microserviço indisponível ou sem resposta', HttpStatus.SERVICE_UNAVAILABLE);
    }
    const remote = error as { statusCode?: unknown; status?: unknown; message?: unknown } | null;
    const code = Number(remote?.statusCode ?? remote?.status);
    if (Number.isInteger(code) && code >= 400 && code <= 599) {
      const message = typeof remote?.message === 'string' ? remote.message : 'Operação não concluída';
      throw new HttpException(message, code);
    }
    throw new HttpException('Falha ao executar operação no microserviço', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
function isConnectivityFailure(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const code = (err as { code?: unknown }).code;
  return ['ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH', 'ENOTFOUND'].includes(String(code));
}
