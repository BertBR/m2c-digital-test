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
import { PermissionGuard } from '../shared/guards/permission.guard';
import { GetCompanyResponseDTO } from './dtos/get-company-response.dto';
import { CompanyService } from './company.service';
import { CreateCompanyDTO } from './dtos/create-company';
import { Company } from './company.entity';

@Controller('company')
@ApiTags('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Create a company',
  })
  @ApiBody({ type: CreateCompanyDTO })
  async create(
    @Body() payload: CreateCompanyDTO,
  ): Promise<ResponseDTO<GetCompanyResponseDTO>> {
    const data = {
      name: payload.name,
      document: payload.document,
    };

    const company = await this.companyService.create(data);
    return {
      data: {
        name: company.name,
        createdAt: company.created_at.toISOString(),
        updatedAt: company.updated_at.toISOString(),
        external_id: company.external_id,
        document: company.document,
        deleted: company.deleted
      },
    };
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Get all Companies',
  })
  async getAll(): Promise<ResponseDTO<GetCompanyResponseDTO[]>> {
    const companies = await this.companyService.findAll();
    return {
      data: companies.map((company: Company) => ({
        name: company.name,
        createdAt: company.created_at.toISOString(),
        updatedAt: company.updated_at.toISOString(),
        external_id: company.external_id,
        document: company.document,
        deleted: company.deleted
      })),
    };
  }

  @Delete(':external_id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @ApiCreatedResponse({
    description: 'Delete a company',
  })
  @ApiParam({ name: 'external_id', type: String })
  @ApiBearerAuth()
  async delete(@Param('external_id') externalId: string): Promise<ResponseDTO<boolean>> {
    const res = await this.companyService.delete(externalId);
    return {
      data: !!res,
    };
  }

  @Get(':external_id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Get a company by external_id',
  })
  @ApiParam({ name: 'external_id', type: String })
  @ApiBearerAuth()
  async getOne(
    @Request() request: ExpressRequestWithPermission,
  ): Promise<ResponseDTO<GetCompanyResponseDTO>> {
    const company = await this.companyService.findOne(
      request.params.externalId,
    );
    return {
      data: {
        name: company.name,
        createdAt: company.created_at.toISOString(),
        updatedAt: company.updated_at.toISOString(),
        external_id: company.external_id,
        document: company.document,
        deleted: company.deleted
      },
    };
  }

}
