import { PartialType } from '@nestjs/mapped-types';
import { CreateWashDto } from './create-wash.dto';

export class UpdateWashDto extends PartialType(CreateWashDto) {}
