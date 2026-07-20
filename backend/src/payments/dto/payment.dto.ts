import { IsIn, IsOptional, IsString } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  orderId: string;

  @IsIn(['card', 'cod', 'jazzcash', 'easypaisa'])
  method: string;
}

export class ConfirmPaymentDto {
  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
