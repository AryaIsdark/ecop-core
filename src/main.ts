import { NestFactory } from '@nestjs/core';
import { CoreModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  await app.listen(3900);
}
bootstrap();
