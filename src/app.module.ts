import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TrainModule } from './train/train.module';
import { User } from './domain/user.entity';
import { Train } from './domain/train.entitiy';
import { TrainProfile } from './domain/train-profile.entity';
import { Bible } from './domain/bible.entity';
import { TrackModule } from './track/track.module';
import { BibleTrack } from './domain/bible-track.entity';
import { CheckStamp } from './domain/check-stamp.entity';
import { Token } from './domain/token.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '9310',
      database: 'bibleTrain3',
      synchronize: false,
      entities: [
        User,
        Token,
        Train,
        TrainProfile,
        Bible,
        BibleTrack,
        CheckStamp,
      ],
      logging: true,
    }),
    AuthModule,
    TrainModule,
    TrackModule,
    UserModule,
  ],
})
export class AppModule {}
