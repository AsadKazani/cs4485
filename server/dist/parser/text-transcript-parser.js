"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const student_1 = __importDefault(require("../entity/student"));
const term_1 = __importDefault(require("../entity/term"));
const course_1 = __importDefault(require("../entity/course"));
const transcript_1 = __importDefault(require("../entity/transcript"));
const os_1 = require("os");
function parseTextTranscript(text) {
    const lines = text.split(os_1.EOL);
    const transcript = new transcript_1.default();
    const student = new student_1.default();
    student.name = parseStudentName(lines);
    student.id = parseStudentId(lines);
    student.terms = parseTerms(lines);
    transcript.student = student;
    return transcript;
}
exports.default = parseTextTranscript;
const parseStudentName = (lines) => {
    return lines[1].split(":")[1].substring(1);
};
const parseStudentId = (lines) => {
    return lines[3].split(":")[1].substring(1);
};
const parseCompletedCourses = (text) => {
    const courses = [];
    for (let i = 0; i < text.length; i++) {
        const tokens = text[i].split(" ");
        const length = tokens.length;
        const course = new course_1.default();
        course.coursePrefix = tokens[0];
        course.courseNumber = tokens[1];
        course.points = Number(tokens[length - 1]);
        course.grade = tokens[length - 2];
        course.earnedPoints = Number(tokens[length - 3]);
        course.attemptedPoints = Number(tokens[length - 4]);
        course.courseName = tokens.slice(2, length - 4).join(" ");
        courses.push(course);
    }
    return courses;
};
const parseInProgressCourse = (text) => {
    const courses = [];
    for (let i = 0; i < text.length; i++) {
        const tokens = text[i].split(" ");
        const length = tokens.length;
        const course = new course_1.default();
        course.coursePrefix = tokens[0];
        course.courseNumber = tokens[1];
        course.points = Number(tokens[length - 1]);
        course.grade = "IP";
        course.earnedPoints = Number(tokens[length - 2]);
        course.attemptedPoints = Number(tokens[length - 3]);
        course.courseName = tokens.slice(2, length - 3).join(" ");
        courses.push(course);
    }
    return courses;
};
const handleTransferTerms = (lines) => {
    const transferTerms = [];
    let startIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] == constants_1.TRANSFER_PREFIX) {
            startIdx = i + 1;
            break;
        }
    }
    if (startIdx == -1)
        return [];
    let graduateRecord = lines.slice(startIdx + 1);
    while (graduateRecord.length > 0) {
        const termCourses = [];
        if (graduateRecord[0] == constants_1.END_OF_TRANSFER)
            break;
        const term = new term_1.default();
        term.year = graduateRecord[0].split(" ")[0];
        term.name = `Transfer Term ${graduateRecord[0].split(" ")[1]}`;
        let endTermIdx = 0;
        for (let i = 0; i < graduateRecord.length; i++) {
            if (graduateRecord[i].startsWith(constants_1.TRANSFER_TERM_END)) {
                endTermIdx = i;
                let j = i - 1;
                while (!graduateRecord[j].startsWith(constants_1.START_OF_TERM)) {
                    termCourses.push(graduateRecord[j--]);
                }
                term.courses = parseCompletedCourses(termCourses);
                transferTerms.push(term);
                graduateRecord = graduateRecord.slice(endTermIdx + 1);
            }
        }
    }
    return transferTerms;
};
const hasRemaining = (lines) => {
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] == constants_1.END_OF_TRANSCRIPT)
            return false;
        if (lines[i] == constants_1.START_OF_TERM)
            return true;
    }
    return false;
};
const parseTerms = (lines) => {
    console.log('before');
    const terms = [];
    const transferTerms = handleTransferTerms(lines.concat([]));
    console.log('after transfer');
    let startIdx = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] == constants_1.START_OF_GRADUATE_RECORD) {
            startIdx = i + 1;
            break;
        }
    }
    let graduateRecord = lines.slice(startIdx);
    while (graduateRecord.length > 0) {
        console.log('stuck');
        const termCourses = [];
        if (graduateRecord[0] == constants_1.END_OF_TRANSCRIPT) {
            console.log('hello i Reached the nd :)');
            break;
        }
        const term = new term_1.default();
        term.year = graduateRecord[0].split(" ")[0];
        term.name = graduateRecord[0].split(" ")[1];
        console.log(`term name: ${term.name} and term year ${term.year}`);
        let endTermIdx = 0;
        for (let i = 0; i < graduateRecord.length; i++) {
            if (graduateRecord[i].startsWith(constants_1.END_OF_TERM_PREFIX)) {
                endTermIdx = i;
                break;
            }
            if (graduateRecord[i].startsWith(constants_1.INSTRUCTOR_LINE_PREFIX)) {
                termCourses.push(graduateRecord[i - 1]);
            }
        }
        if (graduateRecord[endTermIdx + 1].startsWith(constants_1.COMPLETED_SEMESTER_PREFIX)) {
            term.courses = parseCompletedCourses(termCourses);
            terms.push(term);
            graduateRecord = graduateRecord.slice(endTermIdx + 2);
        }
        else if (hasRemaining(graduateRecord.slice(endTermIdx + 1))) {
            term.courses = parseCompletedCourses(termCourses);
            terms.push(term);
            graduateRecord = graduateRecord.slice(endTermIdx + 1);
        }
        else {
            term.courses = parseInProgressCourse(termCourses);
            terms.push(term);
            return transferTerms.concat(terms);
        }
    }
    console.log('number of terms are: ', terms[2]);
    return transferTerms.concat(terms);
};
//# sourceMappingURL=text-transcript-parser.js.map