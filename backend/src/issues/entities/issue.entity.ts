import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  @Index()
  error: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array', { nullable: true })
  screenshots: string[];

  @Column('simple-array')
  tags: string[];

  @Column({ type: 'varchar', length: 255, unique: true })
  contentHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
