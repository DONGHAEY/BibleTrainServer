import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Token } from '../../auth/entity/token.entity';
import { TrainProfile } from '../../train/entity/trainProfile.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany((type) => TrainProfile, (trainProfile) => trainProfile.user, {
    cascade: true,
  })
  myProfiles?: any[];

  @OneToMany((type) => Token, (token) => token.user)
  refereshTokens: Token[];
}
