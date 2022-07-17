"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const hbs = require("hbs");
const path_1 = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Blog Testwork Nest.js')
        .setDescription('Allows to add/see/update/delete posts with files')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.setViewEngine('hbs');
    app.set('view options', { layout: '/layouts/main' });
    hbs.registerPartials((0, path_1.join)(__dirname, "../", "/views/partials"));
    app.use(express.static("uploads"));
    app.use(cookieParser());
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map