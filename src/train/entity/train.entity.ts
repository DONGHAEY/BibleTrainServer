import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BibleTrack } from '../../track/entity/bibleTrack.entity';
import { TrainProfile } from './trainProfile.entity';
@Entity('bible_train')
export class Train extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'train_name',
    unique: true,
    nullable: false,
  })
  trainName: string;

  @Column('int', { name: 'member_count', default: 0, nullable: true })
  memberCount: number;

  @OneToMany((type) => TrainProfile, (trainProfile) => trainProfile.trainId, {
    cascade: true,
  })
  members?: any[];

  @OneToMany((type) => BibleTrack, (bibleTrack) => bibleTrack.train, {
    cascade: true,
  })
  tracks: BibleTrack[];

  @Column('varchar', {
    name: 'join_key',
    default: '',
    select: false,
  })
  joinKey: string;

  @Column()
  captain: number;

  @Column({
    type: 'int',
    name: 'track_amount',
    default: 0,
  })
  trackAmount: number;
}
