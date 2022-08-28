import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TrainModule } from './train/train.module';
import { User } from './domain/user.entity';
import { UserAuthority } from './domain/user-authority.entity';
import { Train } from './domain/train.entitiy';
import { TrainProfile } from './domain/train-profile.entity';
import { RouterModule, Routes } from 'nest-router';
import { Bible } from './domain/bible.entity';
import { TrackModule } from './track/track.module';
import { BibleTrack } from './domain/bible-track.entity';
import { CheckStamp } from './domain/check-stamp.entity';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      // database: 'test2',
      // synchronize: true,
      database: 'test1',
      synchronize: false,
      entities: [UserAuthority,User, Train, TrainProfile, Bible, BibleTrack, CheckStamp],
      logging:true,
    }),
    // RouterModule.forRoutes(routes),
    AuthModule,
    TrainModule,
    TrackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({useFactory : ormConfig}),
//     CatsModule,
//     AuthModule,
//     BibleTrainModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })



export class AppModule {}
