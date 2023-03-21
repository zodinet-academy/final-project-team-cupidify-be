import { PartialType } from '@nestjs/mapped-types';
import { CreateTestlocationDto } from './create-testlocation.dto';

export class UpdateTestlocationDto extends PartialType(CreateTestlocationDto) {}
