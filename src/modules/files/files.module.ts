import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { IndexesModule } from '../indexes/indexes.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [IndexesModule, PrismaModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
