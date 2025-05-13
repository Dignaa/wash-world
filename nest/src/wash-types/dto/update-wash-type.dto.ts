import { PartialType } from '@nestjs/mapped-types';
import { CreateWashTypeDto } from './create-wash-type.dto';

export class UpdateWashTypeDto extends PartialType(CreateWashTypeDto) {}
