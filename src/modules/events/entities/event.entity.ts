import { User } from 'src/modules/auth/entities/user.entity';
import { Club } from 'src/modules/clubs/entities/club.entity';
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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  date: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  description: string;

  // Club to which the event belongs, future implementation.
  @ManyToOne(() => Club, (club) => club, { nullable: true })
  club: Club;

  // Owner of the event
  @ManyToOne(() => User, (user) => user)
  user: User;

  @ManyToOne(() => EventInvitedUser, (invitedUser) => invitedUser.event)
  invitedUsers: EventInvitedUser[];

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
