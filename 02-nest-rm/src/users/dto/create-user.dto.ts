import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Please enter your name address'})
    name: string;

    @IsNotEmpty({ message: 'Please enter your email address'})
    @IsEmail({},{message: 'Invalid email message'})
    email: string;

    @IsNotEmpty()
    password: string;

    phone: string;
    address: string;
    image: string;
}
