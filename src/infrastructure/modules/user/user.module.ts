import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AppCoreModule } from '../app-core';

@Module({
  imports: [AppCoreModule],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
