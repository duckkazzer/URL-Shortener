import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClickEntity } from './click.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClickEntity])],
  exports: [TypeOrmModule],
})
export class ClicksModule {}