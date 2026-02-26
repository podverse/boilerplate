import { appDataSource } from '../data-source.js';
import { User } from '../entities/User.js';

export class UserService {
  static async findById(id: string): Promise<User | null> {
    const repo = appDataSource.getRepository(User);
    return repo.findOne({ where: { id } });
  }

  static async findByEmail(email: string): Promise<User | null> {
    const repo = appDataSource.getRepository(User);
    return repo.findOne({ where: { email } });
  }

  static async create(data: {
    email: string;
    password: string;
    displayName?: string | null;
    profileVisibility?: boolean;
  }): Promise<User> {
    const repo = appDataSource.getRepository(User);
    const user = repo.create({
      email: data.email,
      password: data.password,
      displayName: data.displayName ?? null,
      profileVisibility: data.profileVisibility ?? false,
    });
    return repo.save(user);
  }

  static async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const repo = appDataSource.getRepository(User);
    await repo.update(userId, { password: hashedPassword });
  }
}
