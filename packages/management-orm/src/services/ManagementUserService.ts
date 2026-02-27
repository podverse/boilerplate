import { managementDataSource } from '../data-source.js';
import { ManagementUser } from '../entities/ManagementUser.js';

export class ManagementUserService {
  static async findByEmail(email: string): Promise<ManagementUser | null> {
    const repo = managementDataSource.getRepository(ManagementUser);
    return repo.findOne({
      where: { credentials: { email } },
      relations: ['credentials', 'bio', 'permissions'],
    });
  }

  static async findSuperAdmin(): Promise<ManagementUser | null> {
    const repo = managementDataSource.getRepository(ManagementUser);
    return repo.findOne({
      where: { isSuperAdmin: true },
      relations: ['credentials', 'bio', 'permissions'],
    });
  }

  static async findById(id: string): Promise<ManagementUser | null> {
    const repo = managementDataSource.getRepository(ManagementUser);
    return repo.findOne({
      where: { id },
      relations: ['credentials', 'bio', 'permissions'],
    });
  }
}
