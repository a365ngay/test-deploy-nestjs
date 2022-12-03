import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { json } from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from './config';
import { EnvConfig, validateInput } from './utils';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const fs = require('fs')

const RateLimit = require('express-rate-limit');

function setupMiddleware(app: INestApplication, configurations: EnvConfig) {
  const limiter = RateLimit({ 
    windowMs: 30 * 1000, // 30 seconds
    max: 100, // limit each IP to 100 requests per windowMs
  });

  const whitelist = (configurations.WHITELIST || '').split(',');
  const corsOptions = {
    origin: (origin: any, callback: any) => {
      // if (whitelist.indexOf(origin) !== -1 || !origin) {
      if (true) {
        callback(null, true);
      } else {
        callback(new Error('ERRORMESSAGE.NOT_ALLOW_CORS'));
      }
    },
    allowedHeaders: [
      configurations.ELASTIC_APM_TRACEPARENT,
      configurations.TRANSACTION_NAME,
      'Authorization',
      'Content-Type',
    ],
  };

  app.enableCors(corsOptions);
  app.use(json({ limit: '10mb' }));
  app.use(helmet(), compression(), limiter);
}

async function bootstrap() {
  const envConfig = validateInput();
  const app = await NestFactory.create(AppModule.forRoot(envConfig), { 
    // httpsOptions: {
    //   key: fs.readFileSync(__dirname + '/../src/security/cert.key'),
    //   cert: fs.readFileSync(__dirname + '/../src/security/cert.pem'),
    // }
  });
  app.useWebSocketAdapter(new WsAdapter(app));
  setupMiddleware(app, envConfig);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('API Epic Medical')
    .setDescription('API Epic Medical description')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await Promise.all([app.listen(configService.port)]);
}
bootstrap();