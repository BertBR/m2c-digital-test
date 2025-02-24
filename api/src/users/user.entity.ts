import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { createId } from "@paralleldrive/cuid2";

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn('varchar') 
  id = createId();

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  external_id: string;

  @Column({ default: false })
  is_admin: boolean;
}

