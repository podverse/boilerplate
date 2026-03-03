import { generateShortId } from '@boilerplate/helpers';
import { appDataSourceRead, appDataSourceReadWrite } from '../data-source.js';
import { Bucket } from '../entities/Bucket.js';

export class BucketService {
  static async findById(id: string): Promise<Bucket | null> {
    const repo = appDataSourceRead.getRepository(Bucket);
    return repo.findOne({ where: { id } });
  }

  static async findByShortId(shortId: string): Promise<Bucket | null> {
    const repo = appDataSourceRead.getRepository(Bucket);
    return repo.findOne({ where: { shortId } });
  }

  /**
   * List buckets where user is owner or has a bucket_admin row (any permission).
   */
  static async findAccessibleByUser(userId: string): Promise<Bucket[]> {
    const repo = appDataSourceRead.getRepository(Bucket);
    const qb = repo
      .createQueryBuilder('bucket')
      .leftJoin('bucket_admin', 'ba', 'ba.bucket_id = bucket.id AND ba.user_id = :userId', {
        userId,
      })
      .where('bucket.owner_id = :userId', { userId })
      .orWhere('ba.user_id IS NOT NULL')
      .setParameter('userId', userId)
      .orderBy('bucket.created_at', 'DESC');
    return qb.getMany();
  }

  static async findChildren(parentBucketId: string): Promise<Bucket[]> {
    const repo = appDataSourceRead.getRepository(Bucket);
    return repo.find({
      where: { parentBucketId },
      order: { createdAt: 'DESC' },
    });
  }

  static async create(data: {
    ownerId: string;
    name: string;
    isPublic?: boolean;
    parentBucketId?: string | null;
  }): Promise<Bucket> {
    const repo = appDataSourceReadWrite.getRepository(Bucket);
    const maxRetries = 5;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const bucket = repo.create({
        ownerId: data.ownerId,
        name: data.name,
        isPublic: data.isPublic ?? false,
        parentBucketId: data.parentBucketId ?? null,
        shortId: generateShortId(),
      });
      try {
        return await repo.save(bucket);
      } catch (err) {
        const isUniqueViolation =
          err !== null &&
          typeof err === 'object' &&
          'code' in err &&
          (err as { code: string }).code === '23505';
        if (!isUniqueViolation || attempt === maxRetries - 1) {
          throw err;
        }
      }
    }
    throw new Error('BucketService.create: failed after retries');
  }

  static async update(id: string, data: { name?: string; isPublic?: boolean }): Promise<void> {
    const repo = appDataSourceReadWrite.getRepository(Bucket);
    const update: Partial<Pick<Bucket, 'name' | 'isPublic'>> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.isPublic !== undefined) update.isPublic = data.isPublic;
    if (Object.keys(update).length > 0) {
      await repo.update(id, update);
    }
  }

  static async delete(id: string): Promise<void> {
    const repo = appDataSourceReadWrite.getRepository(Bucket);
    await repo.delete(id);
  }
}
