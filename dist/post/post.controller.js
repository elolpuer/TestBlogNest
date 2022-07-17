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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const dto_1 = require("../dto/dto");
const users_service_1 = require("../users/users.service");
const post_service_1 = require("./post.service");
let PostController = class PostController {
    constructor(postService, usersService) {
        this.postService = postService;
        this.usersService = usersService;
    }
    async addPage(req) {
        return {
            title: 'Add',
            user: { username: req.cookies.username }
        };
    }
    async add(files, body, req, res) {
        const filenames = await this.postService.createFilenamesString(files);
        await this.postService.add(req.cookies.id, body.text, filenames);
        res.status(200).redirect(`/post/all`);
    }
    async getAll(req) {
        const posts = await this.postService.getAll();
        const postsWithUsername = await this.postService.addUsernameToPosts(posts);
        return {
            title: "Posts",
            posts: postsWithUsername,
            user: req.cookies.username === undefined ? null : { username: req.cookies.username }
        };
    }
    async getOne(userID, ID, req) {
        const post = await this.postService.getOne(ID);
        const username = (await this.usersService.findOneByID(userID)).username;
        let user;
        let usersPost;
        if (req.cookies.email !== undefined) {
            const _user = await this.usersService.findOne(req.cookies.email);
            usersPost = userID == _user.ID;
            user = { username: req.cookies.username };
        }
        else {
            user = null;
            usersPost = false;
        }
        return {
            title: "Post",
            post,
            user,
            usersPost,
            username
        };
    }
    async delete(ID, req, res) {
        await this.postService.delete(req.cookies.id, ID, res);
        res.status(200).redirect(`/post/all`);
    }
    async updateGet(userID, ID, req, res) {
        const post = await this.postService.getOne(ID);
        if (post.userID != req.cookies.id) {
            res.status(400).json({ message: "You are not post owner" });
        }
        else {
            return { title: "Update", post, user: { username: req.cookies.username } };
        }
    }
    async update(files, userID, ID, body, res, req) {
        let filesToDelete = [];
        for (let i = 0; i < 10; i++) {
            if (body[i.toString()] !== undefined) {
                filesToDelete.push(body[i.toString()]);
            }
        }
        await this.postService.update(req.cookies.id, ID, body.text, filesToDelete, files, res);
        res.status(200).redirect(`/post/user/${userID}/${ID}`);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('add'),
    (0, common_1.Render)('add'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Page", type: dto_1.RenderPageDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "addPage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files")),
    (0, swagger_1.ApiBody)({ type: dto_1.PostDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Page", type: dto_1.RenderPageDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, dto_1.PostDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "add", null);
__decorate([
    (0, common_1.Get)('/all'),
    (0, common_1.Render)('posts'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Page", type: dto_1.RenderPageDto }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('/user/:userID/:id'),
    (0, common_1.Render)('post'),
    (0, swagger_1.ApiParam)({ name: 'userID', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Page", type: dto_1.RenderPageDto }),
    __param(0, (0, common_1.Param)('userID')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/user/:userID/:id/delete'),
    (0, swagger_1.ApiParam)({ name: 'userID', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Page", type: dto_1.RenderPageDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "You are not post owner" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/user/:userID/:id/update'),
    (0, common_1.Render)('update'),
    (0, swagger_1.ApiParam)({ name: 'userID', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Page", type: dto_1.RenderPageDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Your not post owner" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Param)('userID')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updateGet", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/user/:userID/:id/update'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files")),
    (0, swagger_1.ApiParam)({ name: 'userID', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: dto_1.PostDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Page", type: dto_1.RenderPageDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "You are not post owner" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Param)('userID')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Res)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number, Number, dto_1.PostDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "update", null);
PostController = __decorate([
    (0, swagger_1.ApiTags)('post'),
    (0, common_1.Controller)('post'),
    __metadata("design:paramtypes", [post_service_1.PostService,
        users_service_1.UsersService])
], PostController);
exports.PostController = PostController;
//# sourceMappingURL=post.controller.js.map