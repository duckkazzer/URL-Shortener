import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from './url.entity';
import { UrlService } from './urls.service';
import { UrlsController } from './urls.controller';
import { ClickEntity } from '../clicks/click.entity'

@Module({
    imports: [TypeOrmModule.forFeature([UrlEntity, ClickEntity])],
    providers: [UrlService],
    controllers: [UrlsController]
})

export class UrlsModule {}