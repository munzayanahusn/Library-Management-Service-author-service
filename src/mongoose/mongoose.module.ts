import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseService } from './mongoose.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/library_logs'),
  ],
  providers: [MongooseService],
})
export class MongooseConfigModule {}
