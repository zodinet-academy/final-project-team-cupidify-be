import { Test, TestingModule } from '@nestjs/testing';
import { TestlocationService } from './testlocation.service';

describe('TestlocationService', () => {
  let service: TestlocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestlocationService],
    }).compile();

    service = module.get<TestlocationService>(TestlocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
