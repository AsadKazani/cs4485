"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const text_transcript_parser_1 = __importDefault(require("./parser/text-transcript-parser"));
const cors_1 = __importDefault(require("cors"));
const transcript_auditer_1 = require("./auditer/transcript-auditer");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const pdf_1 = __importDefault(require("./pdf"));
const os_1 = __importDefault(require("os"));
const pdf_transcript_parser_1 = __importDefault(require("./parser/pdf-transcript-parser"));
const main = async () => {
    const app = (0, express_1.default)();
    const upload = (0, multer_1.default)({ dest: "uploads/" });
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    const port = 5000;
    app.get("/", (_, res) => {
        res.send("hello :)");
    });
    app.post("/text", (req, res) => {
        const content = req.body;
        const trackName = content.track;
        const transcript = (0, text_transcript_parser_1.default)(content.text);
        const completedAudit = (0, transcript_auditer_1.audit)(transcript, trackName);
        const degreeAudit = {
            transcript: transcript,
            audit: completedAudit,
        };
        (0, pdf_1.default)(trackName, os_1.default.tmpdir() + '/output.pdf', degreeAudit);
        res.json(degreeAudit);
    });
    app.post("/pdf", upload.single("file"), async (req, res) => {
        var _a;
        const path = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        const pdfDataBuffer = await fs_1.default.readFileSync(path);
        const pdfData = await (0, pdf_parse_1.default)(pdfDataBuffer);
        const { text } = pdfData;
        fs_1.default.writeFile("./uploads/test.txt", text, (_) => { });
        fs_1.default.unlinkSync(path);
        const content = req.body;
        const trackName = content.track;
        const transcript = (0, pdf_transcript_parser_1.default)(text);
        const completedAudit = (0, transcript_auditer_1.audit)(transcript, trackName);
        const degreeAudit = {
            transcript: transcript,
            audit: completedAudit,
        };
        (0, pdf_1.default)(trackName, os_1.default.tmpdir() + '/output.pdf', degreeAudit);
        res.json(degreeAudit);
    });
    app.get('/pdfDownload', (_, res) => {
        res.download(os_1.default.tmpdir() + '/output.pdf');
    });
    app.get('/pdfFile', (_, res) => {
        res.sendFile(os_1.default.tmpdir() + '/output.pdf');
    });
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
main();
//# sourceMappingURL=index.js.map