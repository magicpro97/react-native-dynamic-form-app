import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormResponse } from '../entities/form-response.entity';
import { CreateFormResponseDto } from './dto/create-form-response.dto';

@Injectable()
export class FormResponseService {
  constructor(
    @InjectRepository(FormResponse)
    private readonly formResponseRepo: Repository<FormResponse>,
  ) {}

  async create(createDto: CreateFormResponseDto, userId: string) {
    const response = this.formResponseRepo.create({
      formId: createDto.formId,
      answers: createDto.answers,
      submittedBy: userId,
    });
    return this.formResponseRepo.save(response);
  }

  async findByForm(formId: string) {
    return this.formResponseRepo.find({ where: { formId } });
  }

  async findByUser(userId: string) {
    return this.formResponseRepo.find({ where: { submittedBy: userId } });
  }
}
