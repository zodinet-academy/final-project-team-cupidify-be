import { Module } from '@nestjs/common';
import { TestlocationService } from './testlocation.service';
import { TestlocationController } from './testlocation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestLocation } from './entities/testlocation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestLocation])],
  controllers: [TestlocationController],
  providers: [TestlocationService],
  exports: [TestlocationService],
})
export class TestlocationModule {}
