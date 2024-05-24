import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { MongooseConfigModule } from './mongoose/mongoose.module';
import { AuthorModule } from './author/author.module';
import { LogsModule } from './logs/logs.module';
import { Author } from './author/entities/author.entity';
import { AuthorController } from './author/author.controller';
import { AuthorService } from './author/author.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Author],
      synchronize: true,
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthorModule,
    LogsModule,
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AppModule {}
