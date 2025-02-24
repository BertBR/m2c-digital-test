import { Request } from 'express';
import { GetUserResponseDTO } from '../dtos/get-user-response.dto';

export type JwtToken = {
  uuid: string;
  iat: number;
  exp: number;
};

export type ExpressRequestWithPermission = Request & {
  user: GetUserResponseDTO;
};