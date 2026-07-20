import { IsEnum, IsString, MinLength } from 'class-validator';

export enum TicketStatusDto {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatusDto)
  status: TicketStatusDto;
}

// Used when an ADMIN manually opens a ticket on behalf of a customer
export class CreateManualTicketDto {
  @IsString()
  userId: string;

  @IsString()
  @MinLength(1)
  subject: string;

  @IsString()
  @MinLength(1)
  message: string;
}