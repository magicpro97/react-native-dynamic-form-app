import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { FormConfiguration } from '../entities/form-configuration.entity';
import { FormResponse } from '../entities/form-response.entity';
import { FormResponseService } from './form-response.service';
import { FormResponseController } from './form-response.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FormConfiguration, FormResponse])],
  controllers: [FormController, FormResponseController],
  providers: [FormService, FormResponseService],
  exports: [FormService, FormResponseService],
})
export class FormModule {}
