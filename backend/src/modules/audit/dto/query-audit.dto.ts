import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class QueryAuditDto {
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
  pageSize: number = 25;

  @IsOptional() @IsString() @MaxLength(128)
  resource?: string;

  @IsOptional() @IsString() @MaxLength(128)
  username?: string;

  @IsOptional() @IsString() @MaxLength(128)
  action?: string;
}
