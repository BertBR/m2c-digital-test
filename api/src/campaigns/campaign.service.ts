import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from '../config/db/config.service';
import { Repository as TypeORMRepository, UpdateResult } from 'typeorm';
import { randomUUID } from 'crypto'
import { createId } from '@paralleldrive/cuid2';
import { Campaign } from './campaign.entity';
import { CreateCampaignDTO } from './dtos/create-campaign';

@Injectable()
export class CampaignService {
  private repository!: TypeORMRepository<Campaign>;

  constructor() {
    this.initializeRepository();
  }

  private async initializeRepository() {
    if (this.repository) {
      return;
    }
    this.repository = await new Repository(Campaign).initRepository();
  }

  async create(data: CreateCampaignDTO): Promise<Campaign> {
    try {
      if (!this.repository) {
        throw new Error("Repository is not initialized yet.");
      }

      const Campaign = await this.repository.save({
        id: createId(),
        name: data.name,
        external_id: randomUUID()
      });


      return Campaign;
    } catch (error) {
      Logger.error(`Error while creating a new Campaign: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<Campaign[]> {
    try {
      return this.repository.find();
    } catch (error) {
      Logger.error(`Error while finding all campaigns: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(externalId: string): Promise<Campaign> {
    try {
      const campaign = await this.repository.findOneBy({
        external_id: externalId,
      });

      if (!campaign) {
        throw new NotFoundException("Campaign not found.")
      }

      return campaign;
    } catch (error) {
      Logger.error(`Error while finding user by externalId: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async update(externalId: string, data: Partial<Campaign>): Promise<UpdateResult> {
    return this.repository.update({ external_id: externalId }, data);
  }

  async delete(externalId: string): Promise<UpdateResult> {
    return this.repository.update({ external_id: externalId }, { deleted: true });
  }


}
