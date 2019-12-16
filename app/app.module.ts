import { Module } from '@nestjs/common';
import { MongooseHealthIndicator, TerminusModule, TerminusModuleOptions } from '@nestjs/terminus';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

const getTerminusOptions = (
  db: MongooseHealthIndicator
): TerminusModuleOptions => ({
  endpoints: [
    {
      // The health check will be available with /health
      url: '/health',
      // All the indicator which will be checked when requesting /health
      healthIndicators: [
        // Set the timeout for a response to 300ms
        async () => db.pingCheck('database', { timeout: 300 })
      ]
    }
  ]
});

@Module({
  imports: [
    CommonModule,
    TerminusModule.forRootAsync({
      inject: [MongooseHealthIndicator],
      useFactory: db => getTerminusOptions(db)
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: config => config.get('database')
    }),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
