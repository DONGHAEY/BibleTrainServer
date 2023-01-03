import { SetMetadata } from '@nestjs/common';
import { RoleFormat as RoleType } from '../entity/trainProfile.entity';

export const TrainRoles = (...roles: RoleType[]): any => {
  return SetMetadata('train-roles', roles);
};
