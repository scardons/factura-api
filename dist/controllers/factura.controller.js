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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesarFacturaPDF = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const procesarFacturaPDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ error: 'No se subió ningún archivo' });
        return;
    }
    try {
        const dataBuffer = fs_1.default.readFileSync(req.file.path);
        const pdfData = yield (0, pdf_parse_1.default)(dataBuffer);
        res.json({
            success: true,
            textoExtraido: pdfData.text
        });
    }
    catch (error) {
        console.error('Error al procesar el PDF:', error);
        res.status(500).json({ error: 'Error al procesar el PDF' });
        return;
    }
});
exports.procesarFacturaPDF = procesarFacturaPDF;
