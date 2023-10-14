// import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

//Cuando se documenta un Dto que extiende de una clase padre se usa el PartialType de @nestjs/swagger
import { PartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
