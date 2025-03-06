import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlEntity } from './url.entity';
import { ClickEntity } from '../clicks/click.entity';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

@Injectable()
export class UrlService {
    constructor(
        @InjectRepository(UrlEntity) 
        private readonly urlRepository: Repository<UrlEntity>,
        @InjectRepository(ClickEntity) 
        private readonly clickRepository: Repository<ClickEntity>,
    ) {}

    // Gets Data, Checks correctness of the alias, generate it if necessary, save Url to DB, and returns shortened URL
    async createShortUrl(dto: { originalUrl: string; expiresAt?: Date; alias?: string }): Promise<string> {
      try{
        let { originalUrl, expiresAt, alias } = dto;
        
        if (alias && alias.length > 20) {
            throw new BadRequestException('Alias must be less than or equal to 20 characters');
        }

        if (!alias) {
            alias = uuidv4().split('-')[0];
        } else {
            const exist = await this.urlRepository.findOne({ where: {alias} });
            if (exist) {
                throw new BadRequestException('Alias already in use');
            }
        }
        const shortUrl = `http://localhost:3000/urls/${alias}`;
        const url = this.urlRepository.create({ 
            id: uuidv4(),
            originalUrl, 
            alias, 
            shortUrl,
            createdAt: new Date(), 
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            clickCount: 0, 
        });
        await this.urlRepository.save(url);
        return shortUrl;
        } catch (error) {
        console.error('Error creating short URL:', error);
        throw new InternalServerErrorException('Failed to create short URL');
      }
    }

    // Gets the original URL by its alias
    async findByAlias(alias: string): Promise<UrlEntity | null> {
        return this.urlRepository.findOne({ where: { alias } });
    }

    // Adds to the click count and saves the click to the DB with the current IP address
    async recordClick( url: UrlEntity, ipAddress: string): Promise<void> {
        url.clickCount += 1;
        await this.urlRepository.save(url);
        const click = this.clickRepository.create({
            id: uuidv4(),
            url,
            createdAt: new Date(),
            ipAddress,
        });
        await this.clickRepository.save(click);
    }

    // Get info about the URL
    async getInfo(alias: string) {
        const url = await this.urlRepository.findOne({ where: { alias } });
        if (!url) return null;
        return {
          originalUrl: url.originalUrl,
          createdAt: url.createdAt,
          expiresAt: url.expiresAt,
          clickCount: url.clickCount,
        };
      }
    
      // Delete the URL and all related clicks from the DB
      async deleteUrl(alias: string): Promise<boolean> {
        try {
          const url = await this.urlRepository.findOne({ where: { alias } });
          if (!url) {
            throw new NotFoundException('URL not found');
          }
          await this.urlRepository.remove(url);
          return true;
        } catch (error) {
          console.error('Error deleting URL:', error);
          throw new InternalServerErrorException('Failed to delete URL');
        }
      }
    

      // Get analytics for the URL (click count, recent clicks)
      async getAnalytics(alias: string) {
        const url = await this.urlRepository.findOne({ where: { alias } });
        if (!url) return null;
        const clicks = await this.clickRepository.find({
          where: { url },
          order: { createdAt: 'DESC' },
          take: 5,
        });
        return {
          clickCount: url.clickCount,
          recentClicks: clicks.map(c => ({ clickedAt: c.createdAt, ipAddress: c.ipAddress })),
        };
      }

      async getAllUrls(): Promise<UrlEntity[]> {
        return this.urlRepository.find();
      }
    }

