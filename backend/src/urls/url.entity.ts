import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ClickEntity } from '../clicks/click.entity';
//Table to store URLs and their associated shortened versions

@Entity('urls')
export class UrlEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    originalUrl: string;

    @Column({ unique: true, length: 20 })
    alias: string;

    @Column()
    shortUrl: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date | null;

    @Column({ default: 0 })
    clickCount: number;

    @OneToMany(() => ClickEntity, click => click.url, { cascade: true, onDelete: 'CASCADE' })
    clicks!: ClickEntity[];

    constructor() {
        this.id = '';
        this.originalUrl = '';
        this.alias = '';
        this.shortUrl = '';
        this.createdAt = new Date();
        this.expiresAt = null;
        this.clickCount = 0;
      }
}
