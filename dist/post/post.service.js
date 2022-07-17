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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities/entities");
const users_service_1 = require("../users/users.service");
const typeorm_2 = require("typeorm");
let PostService = class PostService {
    constructor(postRepository, userService) {
        this.postRepository = postRepository;
        this.userService = userService;
    }
    async add(userID, text, filenames) {
        const newPost = new entities_1.Post;
        newPost.userID = userID;
        newPost.text = text;
        newPost.date = new Date;
        newPost.filenames = filenames;
        await this.postRepository.save(newPost);
    }
    async getOne(ID) {
        const post = await this.postRepository.findOneBy({ ID });
        if (post.filenames.length !== 0) {
            const filenames = await this.createJsonFilenames(post.filenames);
            return { ID: post.ID, userID: post.userID, text: post.text, date: post.date, filenames };
        }
        else {
            return { ID: post.ID, userID: post.userID, text: post.text, date: post.date, filenames: [] };
        }
    }
    async getAll() {
        const posts = await this.postRepository
            .createQueryBuilder()
            .getMany();
        if (posts.length === 0) {
            return [];
        }
        else {
            return posts;
        }
    }
    async addUsernameToPosts(posts) {
        let postsToSend = [];
        for (let i = 0; i < posts.length; i++) {
            const user = await this.userService.findOneByID(posts[i].userID);
            let post = {
                ID: posts[i].ID,
                userID: posts[i].userID,
                username: user.username,
                text: posts[i].text,
                date: posts[i].date,
                filenames: [],
            };
            postsToSend[i] = post;
        }
        return postsToSend;
    }
    async delete(userID, ID, res) {
        const post = await this.postRepository.findOneBy({ ID });
        if (post.userID != userID) {
            res.status(400).json({ message: "You are not post owner" });
        }
        else {
            await this.postRepository.delete({ ID, userID });
        }
    }
    async update(userID, ID, text, filesToDelete, filesToAdd, res) {
        const previousPost = await this.getOne(ID);
        if (previousPost.userID != userID) {
            res.status(400).json({ message: "You are not post owner" });
        }
        else {
            previousPost.filenames =
                previousPost.filenames
                    .filter((v) => {
                    for (let i = 0; i < filesToDelete.length; i++) {
                        if (v.filename == filesToDelete[i]) {
                            return false;
                        }
                    }
                    return true;
                })
                    .map(v => {
                    return {
                        filename: v.filename,
                        mimetype: v.mimetype
                    };
                });
            filesToAdd.forEach(v => {
                previousPost.filenames.push({
                    filename: v.filename,
                    mimetype: v.mimetype
                });
            });
            const filenames = previousPost.filenames
                .map((v) => {
                return JSON.stringify({ "filename": v.filename, "mimetype": v.mimetype });
            })
                .toString();
            await this.postRepository
                .createQueryBuilder()
                .update(entities_1.Post)
                .set({
                text,
                filenames
            })
                .where("userID = :userID", { userID })
                .where("ID = :ID", { ID })
                .execute();
        }
    }
    async createFilenamesString(files) {
        const filenames = files.map((v) => {
            return JSON.stringify({ "filename": v.filename, "mimetype": v.mimetype });
        });
        return filenames.toString();
    }
    async createJsonFilenames(filenames) {
        return filenames.split("},")
            .map((v, i, arr) => {
            if (i != arr.length - 1) {
                v = v.concat("}");
            }
            return JSON.parse(v);
        })
            .map((v) => {
            if (v.mimetype.includes("video")) {
                v.video = true;
            }
            else {
                v.video = false;
            }
            return v;
        });
    }
};
PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map