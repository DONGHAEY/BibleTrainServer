import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { RoleFormat } from "src/domain/train-profile.entity";

export class TrainMembersValidationPipe implements PipeTransform {
    
    readonly StatusOptions = [
        RoleFormat.CREW,
        RoleFormat.VIEWER
    ];

    transform(value: any, metadata: ArgumentMetadata) {

        value = value.toUpperCase();

        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} isn't in the change-role options`);
        }
        return value;
    }

    private isStatusValid(status:any) {
        const index = this.StatusOptions.indexOf(status);
        return index !== -1;
    }
    
}