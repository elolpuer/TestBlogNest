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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const render_page_dto_1 = require("../dto/render-page-dto");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const dto_1 = require("../dto/dto");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signinPage(req, res) {
        if (req.cookies.token) {
            res.status(400).redirect("/post/all");
        }
        else {
            return { title: 'Sign In' };
        }
    }
    async signin(user, req, res) {
        if (!req.cookies.token) {
            const token = await this.authService.signin(user, res);
            res.cookie('token', token.access_token);
            res.cookie('email', user.email);
            res.cookie('username', token.username);
            res.cookie('id', token.userID);
            res.redirect("/post/all");
        }
        else {
            res.status(400).redirect("/post/all");
        }
    }
    signupPage(req, res) {
        if (req.cookies.token) {
            res.status(400).redirect("/post/all");
        }
        else {
            return { title: 'Sign Up' };
        }
    }
    async signup(newUser, req, res) {
        if (!req.cookies.token) {
            await this.authService.signup(newUser, res).then(() => {
                res.status(200).redirect("/auth/signin");
            });
        }
        else {
            res.status(400).redirect("/post/all");
        }
    }
    async logout(res) {
        res.clearCookie('token');
        res.clearCookie('email');
        res.clearCookie('id');
        res.clearCookie('username');
        res.status(200).redirect('/post/all');
    }
};
__decorate([
    (0, common_1.Get)('signin'),
    (0, common_1.Render)('signin'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Page", type: render_page_dto_1.RenderPageDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Logout first' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", render_page_dto_1.RenderPageDto)
], AuthController.prototype, "signinPage", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: dto_1.SigninUserDto }),
    (0, common_1.Post)('signin'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Page", type: render_page_dto_1.RenderPageDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Wrong data' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Logout first' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SigninUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Get)('signup'),
    (0, common_1.Render)('signup'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Page", type: render_page_dto_1.RenderPageDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Logout first' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", render_page_dto_1.RenderPageDto)
], AuthController.prototype, "signupPage", null);
__decorate([
    (0, swagger_1.ApiBody)({ type: dto_1.CreateUserDto }),
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User has been created", type: render_page_dto_1.RenderPageDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "User with this username/email has been created" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Logout first' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Logout", type: render_page_dto_1.RenderPageDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map