import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TrainModule } from './train/train.module';
import { TrackModule } from './track/track.module';
import { UserModule } from './user/user.module';
import { User } from './user/entity/user.entity';
import { Token } from './auth/entity/token.entity';
import { Train } from './train/entity/train.entity';
import { BibleTrack } from './track/entity/bibleTrack.entity';
import { CheckStamp } from './track/entity/checkStamp.entity';
import { TrainProfile } from './train/entity/trainProfile.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/work.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      entities: [User, Token, Train, TrainProfile, BibleTrack, CheckStamp],
      logging: true,
    }),
    AuthModule,
    TrainModule,
    TrackModule,
    UserModule,
  ],
})
export class AppModule {}
