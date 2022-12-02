"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { writeFile } = require('fs/promises');
const { PDFDocument } = require('pdf-lib');
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const fs = require('fs');
async function createPDF(track, output, degreeAudit) {
    try {
        let formUrl = "";
        if (track == "Traditional Computer Science") {
            formUrl = 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Traditional.pdf';
        }
        if (track == "Data Science") {
            formUrl = "https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Data-Science.pdf";
        }
        if (track == "Cyber Security") {
            formUrl = "https://cs.utdallas.edu/wp-content/uploads/2022/05/Cyber-Security.pdf";
        }
        if (track == "Networks and Telecommunications") {
            formUrl = "https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Networks-Telecommunication.pdf";
        }
        if (track == "Intelligent Systems") {
            formUrl = "https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Intelligent-Systems.pdf";
        }
        if (track == "Interactive Computing") {
            formUrl = "https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Interactive-Computing.pdf";
        }
        if (track == "Systems") {
            formUrl = "https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Systems.pdf";
        }
        const formPdfBytes = await (0, cross_fetch_1.default)(formUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(formPdfBytes);
        const fields = pdfDoc.getForm().getFields().map((f) => f.getName());
        console.log({ fields });
        fs.writeFile('./fields.txt', fields.join("\n"), (err) => {
            if (err)
                throw err;
        });
        const form = pdfDoc.getForm();
        if (track == "Data Science") {
            form.getTextField('Name of Student').setText(degreeAudit.transcript.student.name);
            form.getTextField('Student ID Number').setText(degreeAudit.transcript.student.id);
            form.getTextField('Semester Admitted to Program').setText(degreeAudit.transcript.student.terms[0].year + degreeAudit.transcript.student.terms[0].name);
            console.log(degreeAudit.transcript.student.terms[0].year);
            for (let i = 0; i < degreeAudit.audit.coreGPAInfo.factoredCourses.length; i++) {
                if (degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6313") {
                    form.getTextField('CS 6313.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6313.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6313.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6350") {
                    form.getTextField('CS 6350.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6350.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6350.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6363") {
                    form.getTextField('CS 6363.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6363.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6363.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6375") {
                    form.getTextField('CS 6375.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6375.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6375.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6301") {
                    form.getTextField('CS 6301.0.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6301.0.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6301.0.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6320") {
                    form.getTextField('CS 6320.0.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6320.0.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6320.0.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6327") {
                    form.getTextField('CS 6327.0.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6327.0.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6327.0.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6347") {
                    form.getTextField('CS 6347.0.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6347.0.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6347.0.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6360") {
                    form.getTextField('CS 6360.0.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6360.0.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6360.0.1').setText('F/T');
                    }
                }
            }
            for (let i = 0; i < degreeAudit.audit.coreGPAInfo.inProgressCourses.length; i++) {
                if (degreeAudit.audit.coreGPAInfo.inProgressCourses[i].courseNumber == "6313") {
                    form.getTextField('CS 6313.2').setText(degreeAudit.audit.coreGPAInfo.inProgressCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6313.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6313.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.inProgressCourses[i].courseNumber == "6350") {
                    form.getTextField('CS 6350.2').setText(degreeAudit.audit.coreGPAInfo.inProgressCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6350.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6350.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.inProgressCourses[i].courseNumber == "6363") {
                    form.getTextField('CS 6363.2').setText(degreeAudit.audit.coreGPAInfo.inProgressCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6363.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6363.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.inProgressCourses[i].courseNumber == "6375") {
                    form.getTextField('CS 6375.2').setText(degreeAudit.audit.coreGPAInfo.inProgressCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6375.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6375.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.inProgressCourses[i].courseNumber == "6301") {
                    form.getTextField('CS 6301.0.2').setText(degreeAudit.audit.coreGPAInfo.inProgressCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6301.0.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6301.0.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.inProgressCourses[i].courseNumber == "6320") {
                    form.getTextField('CS 6320.0.2').setText(degreeAudit.audit.coreGPAInfo.inProgressCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6320.0.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6320.0.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.inProgressCourses[i].courseNumber == "6327") {
                    form.getTextField('CS 6327.0.2').setText(degreeAudit.audit.coreGPAInfo.inProgressCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6327.0.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6327.0.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.inProgressCourses[i].courseNumber == "6347") {
                    form.getTextField('CS 6347.0.2').setText(degreeAudit.audit.coreGPAInfo.inProgressCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6347.0.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6347.0.1').setText('F/T');
                    }
                }
                if (degreeAudit.audit.coreGPAInfo.inProgressCourses[i].courseNumber == "6360") {
                    form.getTextField('CS 6360.0.2').setText(degreeAudit.audit.coreGPAInfo.inProgressCourses[i].grade);
                    const term = getTerm(degreeAudit.audit.coreGPAInfo.inProgressCourses[i], degreeAudit);
                    parseTerm(term, 'CS 6360.0.0', form);
                    if (term.name.startsWith("Transfer")) {
                        form.getTextField('CS 6360.0.1').setText('F/T');
                    }
                }
            }
            let classVals = ["CS 6327.1.0.0.0", "CS 6327.1.0.0.1", "CS 6327.1.0.0.2", "CS 6327.1.0.0.3", "CS 6327.1.0.0.4", "CS 6327.1.0.0.5", "CS 6327.1.0.0.6", "CS 6327.1.0.0.7",];
            let col1 = ['CS 6327.1.0.1', 'CS 6347.1.0', 'CS 6360.1.0', 'CS 6301.2.0', 'CS 6320.2.2', "CS 6347.2.0", "CS 6360.2.0.0", "CS 6360.2.0.1"];
            let col2 = ['CS 6327.1.1', 'CS 6347.1.1', 'CS 6360.1.1', 'CS 6301.2.1', 'CS 6320.2.1', "CS 6347.2.1", "CS 6360.2.1.0", "CS 6360.2.1.1"];
            let col3 = ['CS 6327.1.2', 'CS 6347.1.2', 'CS 6360.1.2', 'CS 6301.2.2', 'CS 6320.2.2', "CS 6347.2.2", "CS 6360.2.2.0", "CS 6360.2.2.1"];
            for (let i = 0; i < degreeAudit.audit.electiveGPAInfo.factoredCourses.length; i++) {
                form.getTextField((i + 1).toString()).setText(degreeAudit.audit.electiveGPAInfo.factoredCourses[i].courseName);
                form.getTextField(classVals[i]).setText(degreeAudit.audit.electiveGPAInfo.factoredCourses[i].coursePrefix + " " + degreeAudit.audit.electiveGPAInfo.factoredCourses[i].courseNumber);
                form.getTextField(col3[i]).setText(degreeAudit.audit.electiveGPAInfo.factoredCourses[i].grade);
                const term = getTerm(degreeAudit.audit.electiveGPAInfo.factoredCourses[i], degreeAudit);
                if (term.name.startsWith("Transfer")) {
                    form.getTextField(col2[i]).setText('F/T');
                }
                parseTerm(term, col1[i], form);
            }
            for (let i = degreeAudit.audit.electiveGPAInfo.factoredCourses.length; i < degreeAudit.audit.electiveGPAInfo.inProgressCourses.length + degreeAudit.audit.electiveGPAInfo.factoredCourses.length; i++) {
                form.getTextField((i + 1).toString()).setText(degreeAudit.audit.electiveGPAInfo.inProgressCourses[i].courseName);
                form.getTextField(classVals[i]).setText(degreeAudit.audit.electiveGPAInfo.factoredCourses[i].coursePrefix + " " + degreeAudit.audit.electiveGPAInfo.factoredCourses[i].courseNumber);
                form.getTextField(col3[i]).setText(degreeAudit.audit.electiveGPAInfo.factoredCourses[i].grade);
                const term = getTerm(degreeAudit.audit.electiveGPAInfo.factoredCourses[i], degreeAudit);
                if (term.name.startsWith("Transfer")) {
                    form.getTextField(col2[i]).setText('F/T');
                }
                parseTerm(term, col1[i], form);
            }
        }
        const pdfBytes = await pdfDoc.save();
        await writeFile(output, pdfBytes);
        console.log("pdf created");
        console.log(track);
    }
    catch (err) {
        console.log(err);
    }
}
const getTerm = (course, degreeAudit) => {
    const transcript = degreeAudit.transcript;
    const terms = transcript.student.terms;
    for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        const courses = term.courses;
        for (let j = 0; j < courses.length; j++) {
            const curr = courses[j];
            if (curr.courseName == course.courseName && curr.coursePrefix == course.coursePrefix)
                return term;
        }
    }
    return terms[0];
};
const parseTerm = (term, box, form) => {
    if (term.name.startsWith("Transfer") && term.name.includes('Spring')) {
        form.getTextField(box).setText(`${term.year.substring(2)}U`);
    }
    if (term.name.startsWith("Transfer") && term.name.includes('Fall')) {
        form.getTextField(box).setText(`${term.year.substring(2)}U`);
    }
    if (term.name.includes("Spring")) {
        form.getTextField(box).setText(`${term.year.substring(2)}S`);
    }
    if (term.name.includes("Fall")) {
        form.getTextField(box).setText(`${term.year.substring(2)}F`);
    }
};
exports.default = createPDF;
//# sourceMappingURL=pdf.js.map