import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestComponentService } from './test-component.service';
import { CreateTestComponentDto } from './dto/create-test-component.dto';
import { UpdateTestComponentDto } from './dto/update-test-component.dto';

@Controller('test-component')
export class TestComponentController {
  constructor(private readonly testComponentService: TestComponentService) {}

  @Post()
  create(@Body() createTestComponentDto: CreateTestComponentDto) {
    return this.testComponentService.create(createTestComponentDto);
  }

  @Get()
  findAll() {
    return this.testComponentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testComponentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestComponentDto: UpdateTestComponentDto) {
    return this.testComponentService.update(+id, updateTestComponentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testComponentService.remove(+id);
  }
}
