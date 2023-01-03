import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CheckStamp } from './checkStamp.entity';
import { Train } from '../../train/entity/train.entity';

@Entity('bible_track')
export class BibleTrack extends BaseEntity {
  @PrimaryColumn({
    name: 'train_id',
    type: 'int',
  })
  trainId: number;

  @PrimaryColumn({
    type: 'date',
  })
  date: Date;

  @Column({
    name: 'start_chapter',
    type: 'int',
  })
  startChapter: number;

  @Column({
    name: 'end_chapter',
    type: 'int',
  })
  endChapter: number;

  @Column({
    name: 'start_page',
    type: 'int',
  })
  startPage: number;

  @Column({
    name: 'end_page',
    type: 'int',
  })
  endPage: number;

  @Column({
    type: 'varchar',
  })
  content: string;

  @ManyToOne((type) => Train, (train) => train.tracks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'train_id' })
  train: Train;

  @OneToMany((type) => CheckStamp, (checkStamp) => checkStamp.track, {
    cascade: true,
  })
  checkStamps: CheckStamp[];

  // @OneToOne(type => CheckStamp, checkStamp=> checkstamp)
  // myCheckStamp : CheckStamp
}
