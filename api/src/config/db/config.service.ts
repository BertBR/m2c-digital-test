import { DataSource, Repository as TypeORMRepository, ObjectType, ObjectLiteral } from 'typeorm';
import { User } from '../../users/user.entity';
import { Company } from '../../companies/company.entity';
import { Campaign } from '../../campaigns/campaign.entity';

export class Repository<T extends ObjectLiteral> {
  private dataSource: DataSource;

  constructor(private entity: ObjectType<T>) {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Company, Campaign]
    });
  }

  public async initRepository(): Promise<TypeORMRepository<T>> {
    if (!this.dataSource.isInitialized) {
      console.log('Initializing data source');
      await this.dataSource.initialize();
    }

    return this.dataSource.getRepository<T>(this.entity);
  }
}