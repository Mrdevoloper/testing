import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './reports/report.entity';
import { User } from './users/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    username: 'postgres',
    password: 'hello',
    host: 'localhost',
    port: 5432,
    database: 'nestcli',
    entities: [User, Report],
    synchronize: false
  }), UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
