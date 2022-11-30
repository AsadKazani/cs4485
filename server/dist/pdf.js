"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { writeFile } = require('fs/promises');
const { PDFDocument } = require('pdf-lib');
const cross_fetch_1 = __importDefault(require("cross-fetch"));
async function createPDF(input, output) {
    try {
        const formUrl = 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Traditional.pdf';
        const formPdfBytes = await (0, cross_fetch_1.default)(formUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(formPdfBytes);
        const fields = pdfDoc.getForm().getFields().map((f) => f.getName());
        console.log({ fields });
        const form = pdfDoc.getForm();
        form.getTextField('Name of Student').setText('Nick Pant');
        const pdfBytes = await pdfDoc.save();
        await writeFile(output, pdfBytes);
        console.log("pdf created");
    }
    catch (err) {
        console.log(err);
    }
}
exports.default = createPDF;
//# sourceMappingURL=pdf.js.map