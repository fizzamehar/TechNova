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
exports.CreateManualTicketDto = exports.UpdateTicketStatusDto = exports.TicketStatusDto = void 0;
const class_validator_1 = require("class-validator");
var TicketStatusDto;
(function (TicketStatusDto) {
    TicketStatusDto["OPEN"] = "OPEN";
    TicketStatusDto["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatusDto["RESOLVED"] = "RESOLVED";
    TicketStatusDto["CLOSED"] = "CLOSED";
})(TicketStatusDto || (exports.TicketStatusDto = TicketStatusDto = {}));
class UpdateTicketStatusDto {
}
exports.UpdateTicketStatusDto = UpdateTicketStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(TicketStatusDto),
    __metadata("design:type", String)
], UpdateTicketStatusDto.prototype, "status", void 0);
class CreateManualTicketDto {
}
exports.CreateManualTicketDto = CreateManualTicketDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateManualTicketDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateManualTicketDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateManualTicketDto.prototype, "message", void 0);
//# sourceMappingURL=support.dto.js.map