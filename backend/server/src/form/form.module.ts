import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormConfiguration } from '../entities/form-configuration.entity';
import { FormService } from './form.service';
import { FormController } from './form.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FormConfiguration])],
  providers: [FormService],
  controllers: [FormController],
  exports: [TypeOrmModule],
})
export class FormModule {}
