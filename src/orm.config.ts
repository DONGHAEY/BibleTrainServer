import { TypeOrmModuleOptions } from "@nestjs/typeorm";

function ormConfig() : TypeOrmModuleOptions {
    const commonConf = {
        SYNCRONIZE: false,
        ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
        MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
        CLI: {
            migrationsDir: 'src/migrations',
        },
        MIGRATIONS_RUN: false,
      };
      console.log(commonConf.ENTITIES);

    const ormconfig : TypeOrmModuleOptions = {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'test1',
        entities: commonConf.ENTITIES,
        logging:true,
        synchronize: commonConf.SYNCRONIZE,
        migrations : commonConf.MIGRATIONS,
        cli:commonConf.CLI,
        migrationsRun: commonConf.MIGRATIONS_RUN
    }

    return ormconfig;
}

export { ormConfig }