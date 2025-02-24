import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard'
import { ResponseDTO } from '../shared/dtos/response.dto';
import { ExpressRequestWithPermission } from '../shared/types';
import { CampaignService } from './campaign.service';

import { Campaign } from './campaign.entity';
import { CreateCampaignDTO } from './dtos/create-campaign';
import { GetCampaignResponseDTO } from './dtos/get-campaign-response.dto';
import { PermissionGuard } from '../shared/guards/permission.guard';
import { ProducerService } from '../shared/producer.service';

@Controller('campaign')
@ApiTags('campaign')
export class CampaignController {
  constructor(
    private campaignService: CampaignService,
    private producerService: ProducerService
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Create a campaign',
  })
  @ApiBody({ type: CreateCampaignDTO })
  async create(
    @Body() payload: CreateCampaignDTO,
  ): Promise<ResponseDTO<GetCampaignResponseDTO>> {
    const data = {
      name: payload.name
    };

    const maxMessageCount = parseInt(process.env.MAX_MESSAGES_COUNT!) || 3;
    const campaign = await this.campaignService.create(data);
    const fakeNumber = "+5511999999999";
    for (let i = 0; i < maxMessageCount; i++) {
      await this.producerService.sendMessage('send_sms', {
        campaign_id: campaign.external_id,
        phone_number: fakeNumber,
        message: 'Hello World!!!'
      });
    }
    return {
      data: {
        name: campaign.name,
        createdAt: campaign.created_at.toISOString(),
        updatedAt: campaign.updated_at.toISOString(),
        external_id: campaign.external_id,
        deleted: campaign.deleted
      },
    };
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Get all Companies',
  })
  async getAll(): Promise<ResponseDTO<GetCampaignResponseDTO[]>> {
    const companies = await this.campaignService.findAll();
    return {
      data: companies.map((campaign: Campaign) => ({
        name: campaign.name,
        createdAt: campaign.created_at.toISOString(),
        updatedAt: campaign.updated_at.toISOString(),
        external_id: campaign.external_id,
        deleted: campaign.deleted
      })),
    };
  }


  @Delete(':external_id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard,PermissionGuard)
  @ApiCreatedResponse({
    description: 'Delete a Campaign',
  })
  @ApiParam({ name: 'external_id', type: String })
  @ApiBearerAuth()
  async delete(@Param('external_id') externalId: string): Promise<ResponseDTO<boolean>> {
    const res = await this.campaignService.delete(externalId);

    return {
      data: !!res,
    };
  }

  @Get(':external_id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Get a Campaign by external_id',
  })
  @ApiParam({ name: 'external_id', type: String })
  @ApiBearerAuth()
  async getOne(
    @Request() request: ExpressRequestWithPermission,
  ): Promise<ResponseDTO<GetCampaignResponseDTO>> {
    const campaign = await this.campaignService.findOne(
      request.params['external_id'],
    );
    return {
      data: {
        name: campaign.name,
        createdAt: campaign.created_at.toISOString(),
        updatedAt: campaign.updated_at.toISOString(),
        external_id: campaign.external_id,
        deleted: campaign.deleted
      },
    };
  }

}
