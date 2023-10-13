import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Tesla m4 car',
    // minimum: 1,
    // default: 1,
    // type: Number, // No es necesario ponerlo ya que lo infiere
    // required: true, // No es necesario ya que por defecto lo es
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({
    description: 'Product price $',
    example: 35,
    default: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Product description',
    example:
      'The Relaxed T Logo Hat is a classic silhouette combined with modern ...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product slug',
    example: 'thermal_cuffed_beanie',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Product stock',
    example: 40,
    default: 0,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({
    description: 'Product sizes',
    example: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    type: [String],
    // isArray: true
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  // tags[]
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  // images[]
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
