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
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { FormService } from './form.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Role } from '../entities/user.entity';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Form Configurations')
@ApiBearerAuth()
@Controller('forms')
@UseGuards(JwtAuthGuard)
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get()
  @ApiOperation({ summary: 'Get all form configurations' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of forms' })
  async getForms(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.formService.findAll(Number(page), Number(limit));
  }

  @Get('search')
  @ApiOperation({ summary: 'Search form configurations' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchForms(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.formService.search(query, Number(page), Number(limit));
  }

  @Get('export')
  @ApiOperation({ summary: 'Export all forms' })
  @ApiResponse({ status: 200, description: 'Exported data' })
  async exportAll() {
    return this.formService.exportAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get form by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Form detail' })
  async getFormById(@Param('id') id: string) {
    return this.formService.findById(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get form by name' })
  @ApiParam({ name: 'name', type: String })
  @ApiResponse({ status: 200, description: 'Form detail' })
  async getFormByName(@Param('name') name: string) {
    return this.formService.findByName(name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create form configuration' })
  @ApiBody({ type: CreateFormDto })
  @ApiResponse({ status: 201, description: 'Form created' })
  async createForm(@Body() createFormDto: CreateFormDto, @Req() req: Request) {
    const user: any = req.user;
    if (![Role.ADMIN, Role.EDITOR].includes(user.role)) {
      throw new ForbiddenException('You do not have permission to create form configurations');
    }
    return this.formService.create(createFormDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update form configuration' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateFormDto })
  @ApiResponse({ status: 200, description: 'Form updated' })
  async updateForm(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    return this.formService.update(id, updateFormDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete form configuration' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Form deleted' })
  async deleteForm(@Param('id') id: string) {
    return this.formService.remove(id);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve form configuration' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Form approved' })
  async approveForm(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user: any = req.user;
    if (![Role.ADMIN, Role.EDITOR].includes(user.role)) {
      throw new ForbiddenException('You do not have permission to approve forms');
    }
    return this.formService.approve(id, user.id);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject form configuration' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Form rejected' })
  async rejectForm(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user: any = req.user;
    if (![Role.ADMIN, Role.EDITOR].includes(user.role)) {
      throw new ForbiddenException('You do not have permission to reject forms');
    }
    return this.formService.reject(id, user.id);
  }
}
