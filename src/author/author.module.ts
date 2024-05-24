import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Author]), LogsModule],
  providers: [AuthorService],
  controllers: [AuthorController],
})
export class AuthorModule {}
