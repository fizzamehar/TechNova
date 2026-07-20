"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
            if (origin === allowedOrigin || isLocalhost) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'), false);
        },
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 TechNova backend running on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map