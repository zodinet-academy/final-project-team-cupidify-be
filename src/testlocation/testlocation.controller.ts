import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestlocationService } from './testlocation.service';
import { CreateTestlocationDto } from './dto/create-testlocation.dto';
import { UpdateTestlocationDto } from './dto/update-testlocation.dto';
import { TestLocation } from './entities/testlocation.entity';

@Controller('testlocation')
export class TestlocationController {
  constructor(private serv: TestlocationService) {}

  @Get()
  public async getAll() {
    return await this.serv.getAll();
  }
  @Post()
  createLocation(@Body() location: TestLocation): void {
    this.serv.create(location);
  }
  @Post('range')
  public async getRange(
    @Body() location: { lat: number; long: number; range: number },
  ) {
    return await this.serv.getRange(
      location.lat,
      location.long,
      location.range,
    );
  }
}
