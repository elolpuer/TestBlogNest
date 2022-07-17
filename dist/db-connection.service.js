"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnectionService = void 0;
const common_1 = require("@nestjs/common");
require('dotenv').config();
let DBConnectionService = class DBConnectionService {
    createTypeOrmOptions() {
        return {
            name: 'default',
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB,
            synchronize: true,
            entities: ['dist/**/*.entity.js']
        };
    }
};
DBConnectionService = __decorate([
    (0, common_1.Injectable)()
], DBConnectionService);
exports.DBConnectionService = DBConnectionService;
//# sourceMappingURL=db-connection.service.js.map