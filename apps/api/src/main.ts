/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import {NestFactory} from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';

import {ApplicationModule} from './app/app.module';
import {LoggerService} from './app/modules/logger';
import {environment} from './environments/environment';
import {version} from '../package.json';
import {writeFileSync} from 'fs';
import {serverPath} from './server-path.function';
import {safeDump} from 'js-yaml';

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule, {
        // logger: environment.production ? false : console,
        logger: console,
    });
    app.setGlobalPrefix('api');
    app.use(compression());

    const options = new DocumentBuilder()
        .setTitle('Kitchen OpenAPI')
        .setDescription('Kitchen StaticSettings description')
        .setVersion(version)
        .setContact('Vladimir Shabalin', 'https://github.com/mustordont','mustordont@gmail.com')
        .addTag('kitchen')
        .addTag('landscape')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        })
        .build();
    const document = SwaggerModule.createDocument(app, options);
    if (!environment.production) {
        writeFileSync(serverPath('swagger.yml', '/apps/api/src'), safeDump(document));
    }
    SwaggerModule.setup('swagger', app, document);

    const port = process.env.PORT || 3333;
    await app.listen(port, () => {
        const logger: LoggerService = app.get(LoggerService);
        logger.info(`Start listening at http://localhost:${port}`);
    });
}

bootstrap().catch(err => console.error(err));
