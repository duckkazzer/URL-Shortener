import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { UrlEntity } from '../urls/url.entity';

//Table to store clicks for each URL(with Date and IP Address)
@Entity('clicks')
export class ClickEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ManyToOne(() => UrlEntity, url => url.clicks, { onDelete: 'CASCADE' })
    url: UrlEntity;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    ipAddress: string;

    constructor() {
        this.id = '';
        this.url = new UrlEntity();
        this.createdAt = new Date();
        this.ipAddress = '';
      }
}