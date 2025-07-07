import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { FormConfiguration } from '../entities/form-configuration.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(FormConfiguration)
    private readonly formRepo: Repository<FormConfiguration>,
  ) {}

  async create(data: Partial<FormConfiguration>) {
    const form = this.formRepo.create(data);
    return this.formRepo.save(form);
  }

  async findAll(page = 1, limit = 10) {
    const [forms, total] = await this.formRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });
    return { forms, total, page, limit };
  }

  async findById(id: string) {
    const form = await this.formRepo.findOne({ where: { id } });
    if (!form) throw new NotFoundException('Form not found');
    return form;
  }

  async findByName(name: string) {
    const form = await this.formRepo.findOne({ where: { name } });
    if (!form) throw new NotFoundException('Form not found');
    return form;
  }

  async update(id: string, updates: Partial<FormConfiguration>) {
    const form = await this.findById(id);
    Object.assign(form, updates);
    return this.formRepo.save(form);
  }

  async remove(id: string) {
    const form = await this.findById(id);
    await this.formRepo.remove(form);
    return { success: true };
  }

  async search(query: string, page = 1, limit = 10) {
    const [forms, total] = await this.formRepo.findAndCount({
      where: [
        { name: ILike(`%${query}%`) },
        { title: ILike(`%${query}%`) },
        { description: ILike(`%${query}%`) },
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });
    return { forms, total, page, limit };
  }

  async exportAll() {
    const forms = await this.formRepo.find();
    return {
      exportInfo: {
        exportDate: new Date().toISOString(),
        totalForms: forms.length,
        exportedBy: 'Dynamic Form Backend',
        version: '1.0.0',
      },
      formConfigurations: forms,
    };
  }
}
