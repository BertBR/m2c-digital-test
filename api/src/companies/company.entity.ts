import { createId } from "@paralleldrive/cuid2";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'companies' })
export class Company {
  @PrimaryColumn('varchar')
  id = createId();

  @Column()
  name: string;

  @Column({unique: true})
  document: string;

  @Column({unique: true})
  external_id: string;

  @Column({default: false})
  deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}