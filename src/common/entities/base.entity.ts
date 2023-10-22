import {
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  VersionColumn,
  Index,
} from 'typeorm';

export abstract class AppBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  pkid: number;

  @Column({ unique: true })
  @Generated('uuid')
  @Index({ unique: true })
  id: string;

  @VersionColumn({ default: 1 })
  version: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
