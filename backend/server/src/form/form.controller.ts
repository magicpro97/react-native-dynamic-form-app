import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { FormService } from './form.service';

@Controller('forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get()
  async getForms(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.formService.findAll(Number(page), Number(limit));
  }

  @Get('search')
  async searchForms(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.formService.search(query, Number(page), Number(limit));
  }

  @Get('export')
  async exportAll() {
    return this.formService.exportAll();
  }

  @Get(':id')
  async getFormById(@Param('id') id: string) {
    return this.formService.findById(id);
  }

  @Get('name/:name')
  async getFormByName(@Param('name') name: string) {
    return this.formService.findByName(name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createForm(@Body() data: any) {
    return this.formService.create(data);
  }

  @Put(':id')
  async updateForm(@Param('id') id: string, @Body() updates: any) {
    return this.formService.update(id, updates);
  }

  @Delete(':id')
  async deleteForm(@Param('id') id: string) {
    return this.formService.remove(id);
  }
}
