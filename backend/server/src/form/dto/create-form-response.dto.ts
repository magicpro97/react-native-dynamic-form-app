import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateFormResponseDto {
  @IsString()
  @IsNotEmpty()
  formId: string;

  @IsObject()
  @IsNotEmpty()
  answers: any;
}
