import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/entity/user.entity';
import { TrainProfileRepository } from '../repository/trainProfile.repository';

@Injectable()
export class TrainRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private trainProfileRepository: TrainProfileRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const trainRoles = this.reflector.get<string[]>(
      'train-roles',
      context.getHandler(),
    );
    if (!trainRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const trainId = request.params.trainId;

    const license = await this.trainProfileRepository.findOne({
      userId: user.id,
      trainId: trainId,
    });
    request.body.license = license;

    return license && trainRoles.indexOf(license.role) !== -1;
  }
}
