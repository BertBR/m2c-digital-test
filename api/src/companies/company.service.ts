import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Company } from './company.entity';
import { Repository } from '../config/db/config.service';
import { Repository as TypeORMRepository, UpdateResult } from 'typeorm';
import { randomUUID } from 'crypto'
import { CreateCompanyDTO } from './dtos/create-company';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class CompanyService {
  private repository!: TypeORMRepository<Company>;

  constructor() {
    this.initializeRepository();
  }

  private async initializeRepository() {
    if (this.repository) {
      return;
    }
    this.repository = await new Repository(Company).initRepository();
  }

  async create(data: CreateCompanyDTO): Promise<Company> {
    try {
      if (!this.repository) {
        throw new Error("Repository is not initialized yet.");
      }

      const company = await this.repository.save({
        id: createId(),
        name: data.name,
        document: data.document,
        external_id: randomUUID()
      });


      return company;
    } catch (error) {
      Logger.error(`Error while creating a new company: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      return this.repository.find();
    } catch (error) {
      Logger.error(`Error while finding all companies: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(externalId: string): Promise<Company> {
    try {
      const company = await this.repository.findOneBy({
        external_id: externalId,
      });

      if (!company) {
        throw new NotFoundException("Company not found.")
      }

      return company;
    } catch (error) {
      Logger.error(`Error while finding user by externalId: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async update(externalId: string, data: Partial<Company>): Promise<UpdateResult> {
    return this.repository.update({ external_id: externalId }, data);
  }

  async delete(externalId: string): Promise<UpdateResult> {
    return this.repository.update({ external_id: externalId }, { deleted: true });
  }


}
