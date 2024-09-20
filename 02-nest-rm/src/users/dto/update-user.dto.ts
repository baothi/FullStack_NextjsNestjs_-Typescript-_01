import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsMongoId({ message: '_id not provided' })
  @IsNotEmpty({ message: '_id not empty' })
  _id: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Please enter your name address' })
  name: string;

  phone: string;
  address: string;
  image: string;
}
