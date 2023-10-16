import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces/valid-roles';
import { GetUserDecorator } from 'src/auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Product was created',
    type: CreateProductDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Bad properties' })
  @ApiResponse({ status: 403, description: 'Forbidden. Check the Token' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Contact the Admin',
  })
  @Auth(validRoles.user)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUserDecorator() user: User,
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Products get',
    type: CreateProductDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found. Products not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Check the Token' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Contact the Admin',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiResponse({
    status: 200,
    description: 'Product get',
    type: CreateProductDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found. Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Check the Token' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Contact the Admin',
  })
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(validRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUserDecorator() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(validRoles.superUser)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
