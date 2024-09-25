import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  isEmailExit = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  };

  async create(CreateUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = CreateUserDto;

    // check email
    const isExist = await this.isEmailExit(email);
    if (isExist) {
      throw new BadRequestException(`Email already exists : ${email}`);
    }

    // hash password
    const hashPassword = await hashPasswordHelper(password);
    console.log(hashPassword);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });
    return {
      _id: user.id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (current - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(offset)
      .select('-password -createdAt')
      .sort(sort as any);
    return { results, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(_id: string) {
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      return this.userModel.deleteOne({ _id });
    } else {
      throw new BadRequestException(`User with id ${_id} invalid`);
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;

    // check email
    const isExist = await this.isEmailExit(email);
    if (isExist) {
      throw new BadRequestException(`Email already exists : ${email}`);
    }

    // hash password
    const hashPassword = await hashPasswordHelper(password);
    console.log(hashPassword);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive: false,
      codeId: codeId,
      // codeExpired: dayjs().add(1, 'day'), // manipulate
      codeExpired: dayjs().add(5, 'minutes'),
    });

    // send email
    this.mailerService
      .sendMail({
        to: user.email, // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        template: './register.hbs', // HTML body content
        context: {
          name: user?.name ?? user?.email,
          activationCode: codeId,
        },
      })
      .then((info) => {
        console.log('Email sent successfully');
        // In ra nội dung của email đã render từ template
        console.log('Rendered template content:', info);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        return 'Failed to send email';
      });
    return {
      _id: user.id,
    };
  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code,
    });
    if (!user) {
      throw new BadRequestException('Mã Code không hợp lệ hoặc đã hết hạn');
    }
    // check expire code
    const isBefforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBefforeCheck) {
      //valid
      await this.userModel.updateOne({_id: data._id}, { isActive: true });
    } else {
      throw new BadRequestException('Mã Code không hợp lệ hoặc đã hết hạn');
    }
    return { isBefforeCheck };
  }
}
