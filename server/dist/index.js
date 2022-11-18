"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transcript_parser_1 = __importDefault(require("./parser/transcript-parser"));
const cors_1 = __importDefault(require("cors"));
const transcript_auditer_1 = require("./auditer/transcript-auditer");
const main = async () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    const port = 5000;
    app.get("/", (_, res) => {
        res.send("hello :)");
    });
    app.post('/', (req, res) => {
        const content = req.body;
        const transcript = (0, transcript_parser_1.default)(content.text);
        const completedAudit = (0, transcript_auditer_1.audit)(transcript, "track");
        const degreeAudit = {
            transcript: transcript,
            audit: completedAudit
        };
        res.json(degreeAudit);
    });
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
main();
//# sourceMappingURL=index.js.map