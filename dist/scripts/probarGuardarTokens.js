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
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/probarGuardarTokens.ts
const tokenStore_1 = require("../store/tokenStore");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, tokenStore_1.guardarTokens)({
            access_token: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwieC5vcmciOiJIMCJ9..XlZjVqRXZBK10rrPnDbWHg.X4AfD4cMZgU9FvyGYIOV7KcS6KXXFs-lcNIi3ZRGsTzB7zpw6IKBj7KwfuZ2pJv9HLrFC30NvG-lArGtw9T8UYDrIu00SQzxXur64R_kRDTtk9OX8TEV2TPCjQ7aSI_txn2peW9lEpXHpycsFqh6nsJ9AwqyBK2S_h8yjFwkRKfBw4VTOOgKhNZ31k9vk99I9s5VeUW5tygRnUXNDR5_7bUAOtTbbsZWFVShVjzVl7xLs5VcJqvZIKRtYfKIeNGEkTYPDfAhbpwmbztOp--RtqvQo3afQoZfukPy_P2xX1KmC3bi7_460zZtzPbnP344lJc0oc8xHOwblOZSAd0qhSVcwSIUXoyvoS-wt_WnhwD5IfwKJwiKHpr9yvZsJ6Rh_bF6b-BUmO7xVUsdmNyoGMHpFqc6QuVrKdh2tAkMttwXiAWrveUQhRBO3v9uZ07hbk2H905MSt02r-ppUkmpXgetRzGkY-4ISr4dmLJt7DU.K5RSNEFp3ClHklfiUz21ow',
            refresh_token: 'RT1-213-H0-17565869659eul8udsq410qiuqfr3q',
            realmId: '9341454706879716',
            expiry: 1747940890289
        });
        console.log('✅ Tokens guardados correctamente en la BD');
    });
}
main().catch(err => console.error('❌ Error guardando tokens', err));
