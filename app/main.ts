import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import { jsonFormat } from './utils';
import * as morgan from 'morgan';

async function bootstrap() {
  const transports = [
    new DailyRotateFile({
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: false,
      json: true,
      maxFiles: 30
    }),
    new DailyRotateFile({ filename: './logs/error.log', level: 'error' })
  ] as Transport[];

  if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }

  const logger = WinstonModule.createLogger({
    transports,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    exceptionHandlers: [
      new DailyRotateFile({ filename: './logs/exceptions.log' })
    ],
    exitOnError: false
  });

  const stream = {
    write: (data: string) => {
      const context = 'APP_REQUESTS';
      const message = JSON.parse(data);
      if (message.statusCode >= 400 && message.statusCode < 500) {
        logger.warn(message, context);
      } else if (message.statusCode >= 500) {
        logger.error(message, '', context);
      } else {
        logger.log(message, context);
      }
    }
  };

  const app = await NestFactory.create(
    AppModule,
    { logger }
  );
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true })
  );

  app.use(helmet());
  app.use(morgan(jsonFormat, { stream, skip: (req, res) => req.method === 'OPTIONS' }));

  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Public Parking Inspection')
      .setDescription('Public Parking Inspection API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}

bootstrap();
