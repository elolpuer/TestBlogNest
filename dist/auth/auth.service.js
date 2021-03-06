"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities/entities");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userRepository, usersService, jwtService) {
        this.userRepository = userRepository;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async payload(token) {
        return this.jwtService.decode(token);
    }
    async signin(user, res) {
        const findedUser = await this.usersService.findOne(user.email);
        if (!findedUser) {
            return res.status(400).json({ message: 'Wrong data' });
        }
        const isMatch = await bcrypt.compare(user.password, findedUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong data' });
        }
        const payload = { email: findedUser.email };
        return {
            access_token: this.jwtService.sign(payload),
            username: findedUser.username,
            userID: findedUser.ID,
        };
    }
    async signup(user, res) {
        const checkUser = await this.userRepository.findOneBy({ username: user === null || user === void 0 ? void 0 : user.username })
            ||
                await this.userRepository.findOneBy({ email: user === null || user === void 0 ? void 0 : user.email });
        if (checkUser) {
            return res.status(400).json({ message: 'User with this username/email has been created' });
        }
        const hash = await bcrypt.hash(user.password, 13);
        const newUser = new entities_1.User;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = hash;
        await this.userRepository.save(newUser);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map