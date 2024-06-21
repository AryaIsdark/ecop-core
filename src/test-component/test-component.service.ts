import { Injectable } from '@nestjs/common';
import { CreateTestComponentDto } from './dto/create-test-component.dto';
import { UpdateTestComponentDto } from './dto/update-test-component.dto';
import { JobConfigurationsService } from 'src/job-configurations';

@Injectable()
export class TestComponentService {
  constructor(private readonly jobConfigurationsService : JobConfigurationsService){

  }
  create(createTestComponentDto: CreateTestComponentDto) {
    return 'This action adds a new testComponent';
  }

  findAll() {
    return `This action returns all testComponent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testComponent`;
  }

  update(id: number, updateTestComponentDto: UpdateTestComponentDto) {
    return `This action updates a #${id} testComponent`;
  }

  remove(id: number) {
    return `This action removes a #${id} testComponent`;
  }
}
