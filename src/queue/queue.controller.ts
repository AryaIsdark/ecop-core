import { Controller, Param, Get } from '@nestjs/common';
import { QueueService } from './queue.service';

export type TestParams = { 
  clientSupplierId: number 
}


@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) { }

  @Get('/run-job/:jobConfigurationId')
  runJob(@Param('jobConfigurationId') jobConfigurationId: string ) {
    return this.queueService.runJob(+jobConfigurationId)
  }

}
