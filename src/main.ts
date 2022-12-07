import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  /*----------------------Swagger docs page build part start-----------------------*/
  const config = new DocumentBuilder()
    .setTitle('Car-rent api')
    .setDescription('The car-rent API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  /*----------------------Swagger docs page build part end-----------------------*/
  await app.listen(3000);
}
bootstrap();

async function bootstrapMicroservices() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672/cars-import'],
      queue: 'cars-import',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}
bootstrapMicroservices();
