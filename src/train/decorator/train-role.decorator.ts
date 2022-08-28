import { SetMetadata } from "@nestjs/common";
import { RoleFormat as RoleType } from "../../domain/train-profile.entity";

export const TrainRoles = (...roles : RoleType[]):any => {
    return SetMetadata('train-roles', roles);
};