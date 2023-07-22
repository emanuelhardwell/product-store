import {
  IsArray,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @MinLength(5)
  description: string;

  @IsString()
  @MinLength(3)
  slug: string;

  @IsInt()
  @IsPositive()
  stock: number;

  @IsArray()
  sizes: string[];

  @IsString()
  gender: string;
}
