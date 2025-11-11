"use strict";
/**
 * Shared types between client and server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerStatus = exports.GamePhase = void 0;
var GamePhase;
(function (GamePhase) {
    GamePhase["LOBBY"] = "LOBBY";
    GamePhase["RULE_CONFIG"] = "RULE_CONFIG";
    GamePhase["STARTING"] = "STARTING";
    GamePhase["PLAYING"] = "PLAYING";
    GamePhase["SCORING"] = "SCORING";
    GamePhase["COMPLETE"] = "COMPLETE";
})(GamePhase || (exports.GamePhase = GamePhase = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus["CONNECTED"] = "CONNECTED";
    PlayerStatus["DISCONNECTED"] = "DISCONNECTED";
    PlayerStatus["READY"] = "READY";
})(PlayerStatus || (exports.PlayerStatus = PlayerStatus = {}));
//# sourceMappingURL=game.types.js.map