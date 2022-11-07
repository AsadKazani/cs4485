"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transcript_parser_1 = __importDefault(require("./parser/transcript-parser"));
const cors_1 = __importDefault(require("cors"));
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
        console.log(content.text);
        const transcript = (0, transcript_parser_1.default)(content.text);
        res.json(transcript);
    });
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
main();
//# sourceMappingURL=index.js.map