"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.PhotoService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var photo_entity_1 = require("./entities/photo.entity");
var PhotoService = /** @class */ (function () {
    function PhotoService(_user) {
        this._user = _user;
    }
    PhotoService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(photo_entity_1.Photo))
    ], PhotoService);
    return PhotoService;
}());
exports.PhotoService = PhotoService;
