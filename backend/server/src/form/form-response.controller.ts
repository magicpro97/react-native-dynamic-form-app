import { Controller, Post, Body, Req, UseGuards, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FormResponseService } from './form-response.service';
import { CreateFormResponseDto } from './dto/create-form-response.dto';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Form Responses')
@ApiBearerAuth()
@Controller('form-responses')
@UseGuards(JwtAuthGuard)
export class FormResponseController {
  constructor(private readonly formResponseService: FormResponseService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a filled form' })
  @ApiBody({ type: CreateFormResponseDto })
  @ApiResponse({ status: 201, description: 'Form response created' })
  async submitForm(@Body() dto: CreateFormResponseDto, @Req() req: Request) {
    const user: any = req.user;
    return this.formResponseService.create(dto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all responses for a form' })
  @ApiQuery({ name: 'formId', required: true, type: String })
  @ApiResponse({ status: 200, description: 'List of responses' })
  async getResponsesByForm(@Query('formId') formId: string) {
    return this.formResponseService.findByForm(formId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all responses submitted by the current user' })
  @ApiResponse({ status: 200, description: 'List of user responses' })
  async getMyResponses(@Req() req: Request) {
    const user: any = req.user;
    return this.formResponseService.findByUser(user.userId);
  }
}
