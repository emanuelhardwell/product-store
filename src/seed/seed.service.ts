import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async generateSeed() {
    await this.insertNewProducts();

    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.productsService.removeAll();
    const queryBuilder = await this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertNewProducts() {
    await this.productsService.removeAll();

    const arrayProductsSeed = initialData.products;

    const productsSeedPromises = [];

    // arrayProductsSeed.forEach((product) => {
    //   productsSeedPromises.push(this.productsService.create(product));
    // });

    await Promise.all(productsSeedPromises);
    return true;
  }
}
