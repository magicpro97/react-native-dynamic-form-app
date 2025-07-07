import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FormModule } from './form/form.module';
import { User } from './entities/user.entity';
import { FormConfiguration } from './entities/form-configuration.entity';
import { FormResponse } from './entities/form-response.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'dynamic_form',
      entities: [User, FormConfiguration, FormResponse],
      synchronize: true,
    }),
    AuthModule,
    FormModule,
  ],
})
export class AppModule {}
