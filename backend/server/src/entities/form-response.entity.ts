import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class FormResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  formId: string;

  @Column({ type: 'jsonb' })
  answers: any;

  @Column()
  submittedBy: string;

  @CreateDateColumn()
  submittedAt: Date;
}
