import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OngoingWmsConnectorService } from './ongoing-wms-connector.service';
import { CreateOngoingWmsConnectorDto } from './dto/create-ongoing-wms-connector.dto';
import { UpdateOngoingWmsConnectorDto } from './dto/update-ongoing-wms-connector.dto';

@Controller('ongoing-wms-connector')
export class OngoingWmsConnectorController {
  constructor(private readonly ongoingWmsConnectorService: OngoingWmsConnectorService) {}

  @Post()
  create(@Body() createOngoingWmsConnectorDto: CreateOngoingWmsConnectorDto) {
    return this.ongoingWmsConnectorService.create(createOngoingWmsConnectorDto);
  }

  @Get()
  findAll() {
    return this.ongoingWmsConnectorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ongoingWmsConnectorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOngoingWmsConnectorDto: UpdateOngoingWmsConnectorDto) {
    return this.ongoingWmsConnectorService.update(+id, updateOngoingWmsConnectorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ongoingWmsConnectorService.remove(+id);
  }
}
