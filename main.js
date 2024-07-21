"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var musicStream = 'k2Fjn90aB0M';
var nonMusicStream = 'MvsAesQ-4zA';
var data = (0, fs_1.readFileSync)('unified_instances.txt', 'utf8').split('\n\n');
var newData = {};
setImmediate(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data_1, data_1_1, v, _b, name_1, _, piped, invidious, score, e_1_1, sortedList;
    var _c, e_1, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 6, 7, 12]);
                _a = true, data_1 = __asyncValues(data);
                _f.label = 1;
            case 1: return [4 /*yield*/, data_1.next()];
            case 2:
                if (!(data_1_1 = _f.sent(), _c = data_1_1.done, !_c)) return [3 /*break*/, 5];
                _e = data_1_1.value;
                _a = false;
                v = _e;
                _b = v.split(', '), name_1 = _b[0], _ = _b[1], piped = _b[2], invidious = _b[3];
                return [4 /*yield*/, fetchAudioUrl(name_1, piped, invidious)];
            case 3:
                score = _f.sent();
                newData[v] = score;
                _f.label = 4;
            case 4:
                _a = true;
                return [3 /*break*/, 1];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_1_1 = _f.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 7:
                _f.trys.push([7, , 10, 11]);
                if (!(!_a && !_c && (_d = data_1.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _d.call(data_1)];
            case 8:
                _f.sent();
                _f.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12:
                sortedList = Object.entries(newData).sort(function (a, b) { return b[1] - a[1]; }).map(function (v) { return v[0]; });
                (0, fs_1.writeFileSync)('unified_instances.txt', sortedList.join('\n\n'));
                return [2 /*return*/];
        }
    });
}); });
function fetchAudioUrl(name, piped, invidious) {
    return __awaiter(this, void 0, void 0, function () {
        var pipedInstance, invidiousInstance, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pipedInstance = "https://".concat(piped, ".").concat(name);
                    invidiousInstance = "https://".concat(invidious, ".").concat(name);
                    score = 0;
                    return [4 /*yield*/, fetch("".concat(pipedInstance, "/streams/").concat(musicStream))
                            .then(function (res) { return res.json(); })
                            .then(function (data) {
                            if ('audioStreams' in data) {
                                score++;
                                var audioUrl = data.audioStreams[0].url;
                                var proxiedUrl = audioUrl.replace(new URL(audioUrl).origin, invidiousInstance);
                                fetch(proxiedUrl)
                                    .then(function (data) { return data.blob(); })
                                    .then(function () {
                                    console.log('\n✅ loaded music stream on ' + name);
                                    score++;
                                })
                                    .catch(function () {
                                    console.log('\n❌ failed to load music stream on ' + name);
                                });
                            }
                            else
                                throw new Error();
                        })
                            .catch(function () {
                            console.log("\n\u274C failed to fetch music stream data on ".concat(name));
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fetch("".concat(pipedInstance, "/streams/").concat(nonMusicStream))
                            .then(function (res) { return res.json(); })
                            .then(function (data) {
                            if ('audioStreams' in data) {
                                score++;
                                var audioUrl = data.audioStreams[0].url;
                                var construct = new URL(audioUrl);
                                var deproxiedUrl = audioUrl.replace(construct.host, construct.searchParams.get('host'));
                                fetch(deproxiedUrl)
                                    .then(function (data) { return data.blob(); })
                                    .then(function () {
                                    console.log('\n✅ loaded deproxified non-music stream on ' + name);
                                    score++;
                                })
                                    .catch(function () {
                                    console.log('\n❌ failed to load deproxified non-music stream on ' + name);
                                });
                            }
                            else
                                throw new Error();
                        })
                            .catch(function () {
                            console.log("\n\u274C failed to fetch non-music stream data on ".concat(name));
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, score];
            }
        });
    });
}
