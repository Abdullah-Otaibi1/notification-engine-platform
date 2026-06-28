import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class QueryNotificationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 20;

  @IsOptional() @IsString() @MaxLength(64)
  status?: string;

  @IsOptional() @IsString() @MaxLength(16)
  channel?: string;

  @IsOptional() @IsString() @MaxLength(128)
  providerId?: string;

  @IsOptional() @IsString() @MaxLength(128)
  requestId?: string;

  @IsOptional() @IsString() @MaxLength(128)
  eventId?: string;

  @IsOptional() @IsString() @MaxLength(128)
  messageId?: string;

  @IsOptional() @IsString() @MaxLength(128)
  businessReference?: string;

  @IsOptional() @IsString() @MaxLength(64)
  sortBy?: string;

  @IsOptional() @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
