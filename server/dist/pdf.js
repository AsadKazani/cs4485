"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const pdf_lib_1 = require("pdf-lib");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const data_science_1 = require("./pdf-mapping/data-science");
const networks_telecom_1 = require("./pdf-mapping/networks-telecom");
const intelligent_systems_1 = require("./pdf-mapping/intelligent-systems");
const interactive_computing_1 = require("./pdf-mapping/interactive-computing");
const system_1 = require("./pdf-mapping/system");
const cyber_security_1 = require("./pdf-mapping/cyber-security");
const traditional_cs_1 = require("./pdf-mapping/traditional-cs");
async function createPDF(track, output, degreeAudit) {
    try {
        const formUrl = getTrackPDFURL(track);
        const formPdfBytes = await (0, cross_fetch_1.default)(formUrl).then(res => res.arrayBuffer());
        const pdfDoc = await pdf_lib_1.PDFDocument.load(formPdfBytes);
        const fields = pdfDoc.getForm().getFields().map((f, i) => f.getName());
        const fields2 = pdfDoc.getForm().getFields().map((f, i) => `Field#${i} -->${f.getName()}`);
        await (0, promises_1.writeFile)('testing.txt', fields2.join('\n'));
        const form = pdfDoc.getForm();
        if (track == "Cyber Security") {
            form.getTextField('NameOfStudent').setText(degreeAudit.transcript.student.name);
            form.getTextField('StudentID').setText(degreeAudit.transcript.student.id);
        }
        else {
            form.getTextField('Name of Student').setText(degreeAudit.transcript.student.name);
            form.getTextField('Student ID Number').setText(degreeAudit.transcript.student.id);
        }
        const fc = degreeAudit.audit.coreGPAInfo.factoredCourses.concat(degreeAudit.audit.coreGPAInfo.inProgressCourses).concat(degreeAudit.audit.additionalCoreGPAInfo.factoredCourses);
        const pdfFieldsMappingObj = getPDFFieldsMapping(track);
        const coreIDXs = pdfFieldsMappingObj.coreMapping;
        const electiveIdxs = pdfFieldsMappingObj.electiveMapping;
        for (let i = 0; i < fc.length; i++) {
            const mappingIdx = getCoreIdx(fc[i], coreIDXs);
            if (mappingIdx == -1)
                continue;
            const info = coreIDXs[mappingIdx];
            const term = getTerm(degreeAudit.transcript, fc[i]);
            form.getTextField(fields[info.idxs[0]]).setText((term === null || term === void 0 ? void 0 : term.name.startsWith("Transfer")) ? `${term === null || term === void 0 ? void 0 : term.name.substring(14)} ${term === null || term === void 0 ? void 0 : term.year}` : `${term === null || term === void 0 ? void 0 : term.name} ${term === null || term === void 0 ? void 0 : term.year}`);
            form.getTextField(fields[info.idxs[1]]).setText((term === null || term === void 0 ? void 0 : term.name.startsWith("Transfer")) ? "F/T" : "");
            form.getTextField(fields[info.idxs[2]]).setText(fc[i].grade);
        }
        const ec = degreeAudit.audit.electiveGPAInfo.factoredCourses.concat(degreeAudit.audit.electiveGPAInfo.inProgressCourses);
        const dupElectiveIdxs = electiveIdxs.concat([]);
        let i = 0;
        let j = 0;
        while (i < dupElectiveIdxs.length && j < ec.length) {
            const mIdxs = dupElectiveIdxs[i++];
            const course = ec[j++];
            const term = getTerm(degreeAudit.transcript, course);
            form.getTextField(fields[mIdxs[0]]).setText(course.courseName);
            form.getTextField(fields[mIdxs[1]]).setText(`${course.coursePrefix} ${course.courseNumber}`);
            form.getTextField(fields[mIdxs[2]]).setText(term.name.startsWith("Transfer") ? `${term === null || term === void 0 ? void 0 : term.name.substring(14)} ${term === null || term === void 0 ? void 0 : term.year}` : `${term === null || term === void 0 ? void 0 : term.name} ${term === null || term === void 0 ? void 0 : term.year}`);
            form.getTextField(fields[mIdxs[3]]).setText(term.name.startsWith("Transfer") ? "F/T" : "");
            form.getTextField(fields[mIdxs[4]]).setText(course.grade);
        }
        const pdfBytes = await pdfDoc.save();
        await (0, promises_1.writeFile)(output, pdfBytes);
    }
    catch (err) {
    }
}
const getTerm = (transcript, course) => {
    for (let i = 0; i < transcript.student.terms.length; i++) {
        for (let j = 0; j < transcript.student.terms[i].courses.length; j++) {
            const c = transcript.student.terms[i].courses[j];
            if (c.coursePrefix == course.coursePrefix && c.courseNumber == course.courseNumber) {
                return transcript.student.terms[i];
            }
        }
    }
    return transcript.student.terms[0];
};
const getCoreIdx = (course, coreIDXs) => {
    const currentName = `${course.coursePrefix} ${course.courseNumber}`;
    for (let i = 0; i < coreIDXs.length; i++) {
        if (coreIDXs[i].name == currentName) {
            return i;
        }
    }
    return -1;
};
const getTrackPDFURL = (track) => {
    switch (track) {
        case "Networks and Telecommunications":
            return 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Networks-Telecommunication.pdf';
        case "Intelligent Systems":
            return 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Intelligent-Systems.pdf';
        case "Interactive Computing":
            return 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Interactive-Computing.pdf';
        case "Systems":
            return 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Systems.pdf';
        case "Data Science":
            return 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Data-Science.pdf';
        case "Cyber Security":
            return 'https://cs.utdallas.edu/wp-content/uploads/2022/05/Cyber-Security.pdf';
        default:
            return "https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Traditional.pdf";
    }
};
const getPDFFieldsMapping = (track) => {
    switch (track) {
        case "Networks and Telecommunications":
            return networks_telecom_1.networkAndTelecomMapping;
        case "Intelligent Systems":
            return intelligent_systems_1.intelligentSystemMapping;
        case "Interactive Computing":
            return interactive_computing_1.interactiveComputingMapping;
        case "Systems":
            return system_1.systemMapping;
        case "Data Science":
            return data_science_1.dataScienceMapping;
        case "Cyber Security":
            return cyber_security_1.cyberSecurityMapping;
        default:
            return traditional_cs_1.traditionCSMapping;
    }
};
exports.default = createPDF;
//# sourceMappingURL=pdf.js.map