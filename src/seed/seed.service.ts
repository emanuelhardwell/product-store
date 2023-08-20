import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  generateSeed() {
    return `This action returns all seed`;
  }

  async deleteAllProducts() {}
}
