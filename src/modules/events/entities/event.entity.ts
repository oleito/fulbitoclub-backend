import { User } from 'src/modules/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventInvitedUser } from './event-invited-user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'int' })
  players_per_team: number;

  @Column({ type: 'text' })
  place: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  invitationCode: string;

  // Owner of the event
  @ManyToOne(() => User, (user) => user)
  owner: User;

  @ManyToOne(() => EventInvitedUser, (invitedUser) => invitedUser.event)
  invitedUsers: EventInvitedUser[];

  @Column({ default: true })
  isActive: boolean;

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
