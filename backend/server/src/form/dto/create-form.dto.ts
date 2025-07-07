import { IsString, IsObject, IsOptional, IsArray } from 'class-validator';

export class CreateFormDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  fields: any[];

  @IsObject()
  @IsOptional()
  metadata?: any;
}
