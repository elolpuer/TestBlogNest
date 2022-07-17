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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderPageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
class RenderPageDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    __metadata("design:type", String)
], RenderPageDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Array)
], RenderPageDto.prototype, "filenames", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: dto_1.PostDto }),
    __metadata("design:type", dto_1.PostDto)
], RenderPageDto.prototype, "post", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: (Array) }),
    __metadata("design:type", Array)
], RenderPageDto.prototype, "posts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: dto_1.UserDto }),
    __metadata("design:type", dto_1.UserDto)
], RenderPageDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], RenderPageDto.prototype, "usersPost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], RenderPageDto.prototype, "username", void 0);
exports.RenderPageDto = RenderPageDto;
//# sourceMappingURL=render-page-dto.js.map