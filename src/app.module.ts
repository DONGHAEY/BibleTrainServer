import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { Cat } from './cats/entity/cats.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entity/user.entity';
import { UserAuthority } from './auth/entity/user-authority.entity';
import { ormConfig } from './orm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test1',
      entities: [Cat, User, UserAuthority],
      synchronize: false,
      logging:true,
    }),
    CatsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({useFactory : ormConfig}),
//     CatsModule,
//     AuthModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })



export class AppModule {}
