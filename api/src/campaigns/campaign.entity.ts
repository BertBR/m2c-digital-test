import { createId } from "@paralleldrive/cuid2";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'campaigns' })
export class Campaign {
  @PrimaryColumn('varchar')
  id = createId();

  @Column()
  name: string;
  
  @Column({unique: true})
  external_id: string;

  @Column({default: false})
  deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}