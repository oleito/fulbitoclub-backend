import { User } from 'src/modules/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  name: string;

  @Column({ default: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
