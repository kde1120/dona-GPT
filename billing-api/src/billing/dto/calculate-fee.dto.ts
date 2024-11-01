import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CalculateFeeDto {
  @ApiProperty()
  @IsString()
  planName: string;

  @ApiProperty()
  @IsNumber()
  usage: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  age?: number;
}
