import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);

      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { offset = 0, limit = 10 } = paginationDto;

      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        // TODO: relaciones
      });
      return products;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    let product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title)= :title OR slug= :slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`El producto con ${term} no existe`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if (product) {
      await this.productRepository.delete(id);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    console.log('----------');
    console.log(error.message);

    throw new InternalServerErrorException('Internal Server Error');
  }
}
