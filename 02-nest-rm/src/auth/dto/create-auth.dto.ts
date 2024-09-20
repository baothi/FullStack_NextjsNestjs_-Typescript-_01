import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Please enter a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Please enter a valid password' })
  password: string;

  @IsOptional()
  name: string;
}
