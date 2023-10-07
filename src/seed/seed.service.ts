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
    await this.deleteTables();
    const userAdmin = await this.insertUsers();

    await this.insertNewProducts(userAdmin);
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.productsService.removeAll();
    const queryBuilder = await this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const arrayUsers = initialData.users;

    arrayUsers.forEach((user) => {
      this.userRepository.create(user);
    });

    const usersToSave = await this.userRepository.save(arrayUsers);
    return usersToSave[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.removeAll();

    const arrayProductsSeed = initialData.products;

    const productsSeedPromises = [];

    arrayProductsSeed.forEach((product) => {
      productsSeedPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(productsSeedPromises);
    return true;
  }
}
