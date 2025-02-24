import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { User } from './user.entity';
import { Repository } from '../config/db/config.service';
import { Repository as TypeORMRepository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { randomUUID } from 'crypto'
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class UserService {
  private repository!: TypeORMRepository<User>;

  constructor() {
    this.initializeRepository();
  }

  private async initializeRepository() {
    if (this.repository) {
      return;
    }
    this.repository = await new Repository(User).initRepository();
  }

  async create(data: CreateUserDto): Promise<User> {
    try {
      if (!this.repository) {
        throw new Error("Repository is not initialized yet.");
      }

      const hashedPassword = await hash(data.password, 10);

      const user = await this.repository.save({
        id: createId(),
        email: data.email,
        password: hashedPassword,
        external_id: randomUUID(),
      });


      return user;
    } catch (error) {
      Logger.error(`Error while creating a new user: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return this.repository.find();
    } catch (error) {
      Logger.error(`Error while finding all users: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(externalId: string): Promise<User> {
    try {
      const user = await this.repository.findOneBy({
        external_id: externalId,
      });

      if (!user) {
        throw new NotFoundException("User not found.")
      }

      return user;
    } catch (error) {
      Logger.error(`Error while finding user by externalId: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }


  async findOneByEmail(
    email: string,
  ): Promise<
    User
  > {

    try {
      const user = await this.repository.findOneBy({
        email,
      })

      if (!user) {
        throw new NotFoundException("User not found.")
      }

      return user;
    } catch (error) {
      Logger.error(`Error while finding user by email: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUser(email: string): Promise<UpdateResult> {
    return this.repository.update({ email }, { deleted: true });
  }


}
