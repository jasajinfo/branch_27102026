import { IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  userId!: number;

  @IsString()
  @MinLength(3)
  description!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  total!: number;
}

// Extensão do exercício: atualização parcial de pedidos.
export class UpdateOrderDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  total?: number;
}
