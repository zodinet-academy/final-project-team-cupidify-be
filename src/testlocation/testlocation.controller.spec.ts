import { Test, TestingModule } from '@nestjs/testing';
import { TestlocationController } from './testlocation.controller';
import { TestlocationService } from './testlocation.service';

describe('TestlocationController', () => {
  let controller: TestlocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestlocationController],
      providers: [TestlocationService],
    }).compile();

    controller = module.get<TestlocationController>(TestlocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
