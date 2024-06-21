import { Module } from '@nestjs/common';
import { TestComponentService } from './test-component.service';
import { TestComponentController } from './test-component.controller';
import { JobConfigurationsModule } from 'src/job-configurations';

@Module({
  imports: [JobConfigurationsModule],
  controllers: [TestComponentController],
  providers: [TestComponentService],
})
export class TestComponentModule {}
