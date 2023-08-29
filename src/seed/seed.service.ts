import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async generateSeed() {
    await this.insertNewProducts();

    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    await this.productsService.removeAll();

    const arrayProductsSeed = initialData.products;

    const productsSeedPromises = [];

    arrayProductsSeed.forEach((product) => {
      productsSeedPromises.push(this.productsService.create(product));
    });

    await Promise.all(productsSeedPromises);
    return true;
  }
}
