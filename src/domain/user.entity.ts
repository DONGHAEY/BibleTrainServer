import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Token } from './token.entity';
import { TrainProfile } from './train-profile.entity';

@Entity('user')
export class User {
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
