import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
@Entity('token')
export class Token extends BaseEntity {
  @PrimaryColumn({
    length: 300,
  })
  token: string;

  @Column({
    default: true,
  })
  valid: boolean;

  @Column({
    nullable: false,
  })
  userId: number;

  @ManyToOne((type) => User, (user) => user.refereshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  createdAt: Date;
}
