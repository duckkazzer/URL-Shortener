import { Controller, Post, Get, Delete, Param, Body, Res, NotFoundException, Req, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { UrlService } from './urls.service';
import { validate as validateUuid } from 'uuid';

@Controller('urls')
export class UrlsController {
    constructor(private readonly urlsService: UrlService) {}

    @Post('shorten')
    async createShortUrl(@Body() body: { originalUrl: string; expiresAt?: Date; alias?: string }) {
        try {
            const shortUrl = await this.urlsService.createShortUrl(body);
            return { shortUrl };
        } catch (error) {
            console.error('Error creating short URL:', error);
            throw new InternalServerErrorException('Failed to create short URL');
        }
    }

    @Get(':alias')
    async redirect(@Param('alias') alias: string,  @Res() res: Response, @Req() req: Request) {
        if (!alias) {
            throw new BadRequestException('Alias is required');
          }
        const url = await this.urlsService.findByAlias(alias);
        if (!url) {
            throw new NotFoundException('URL not found');
        }
        const ipAddress = req.ip || 'unknown';
        await this.urlsService.recordClick(url, ipAddress);
        return res.redirect(url.originalUrl);
    }

    @Get()
    async getAllUrls() {
      const urls = await this.urlsService.getAllUrls();
      return urls;
    }
  

    @Get('info/:alias')
    async getInfo(@Param('alias') alias: string) {
        const info = await this.urlsService.getInfo(alias);
        if (!info) {
            throw new NotFoundException('URL not found');
        }
        return info;
    }

    @Delete('delete/:alias')
    async deleteUrl(@Param('alias') alias: string) {
        if (!alias) {
          throw new BadRequestException('Alias is required');
        }
        const result = await this.urlsService.deleteUrl(alias);
        if (!result) {
          throw new NotFoundException('URL not found');
        }
        return { message: 'URL deleted successfully' };
      }

    @Get('analytics/:alias')
    async analytics(@Param('alias') alias: string) {
        const analytics = await this.urlsService.getAnalytics(alias);
        if (!analytics) {
            throw new NotFoundException('URL not found');
        }
        return analytics;
    }
}