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
function parsePDFTranscript(text) {
    const lines = text.split("\n");
    const transcript = new transcript_1.default();
    const student = new student_1.default();
    student.name = parseStudentName(lines);
    student.id = parseStudentId(lines);
    student.terms = parseTerms(lines);
    transcript.student = student;
    return transcript;
}
exports.default = parsePDFTranscript;
const parseStudentName = (lines) => {
    return lines[3].split(":")[1].substring(1).trim();
};
const parseStudentId = (lines) => {
    return lines[5].split(":")[1].substring(1).trim();
};
const parseCompletedCourses = (text) => {
    const courses = [];
    for (let i = 0; i < text.length; i++) {
        let tokens = text[i].split(" ");
        tokens = tokens.filter((t) => t.length);
        if (tokens.length == 1) {
            continue;
        }
        const length = tokens.length;
        const course = new course_1.default();
        course.coursePrefix = tokens[0];
        course.courseNumber = tokens[1].slice(0, 4);
        const endString = tokens[length - 1];
        let gradeLetterChecker = false;
        let newEndString = "";
        if (endString.slice(-10, -1).includes("A") ||
            endString.slice(-10, -1).includes("a")) {
            gradeLetterChecker = true;
            course.points = Number(endString.slice(-6));
            newEndString = endString.slice(0, -7);
            if (endString[endString.length - 7] == "+" ||
                endString[endString.length - 7] == "-") {
                course.grade = endString.slice(-8, -6);
                newEndString = endString.slice(0, -8);
            }
            else {
                course.grade = endString.slice(-7, -6);
                newEndString = endString.slice(0, -7);
            }
        }
        else {
            gradeLetterChecker = false;
            course.points = Number(endString.slice(-5));
            newEndString = endString.slice(0, -6);
            if (endString[endString.length - 6] == "+" ||
                endString[endString.length - 6] == "-") {
                course.grade = endString.slice(-7, -5);
                newEndString = endString.slice(0, -7);
            }
            else {
                course.grade = endString.slice(-6, -5);
                newEndString = endString.slice(0, -6);
            }
        }
        course.earnedPoints = Number(newEndString.slice(-5));
        course.attemptedPoints = Number(newEndString.slice(-10, -5));
        let tempEndPart = newEndString.slice(0, -10);
        let tempCourseName = tokens.slice(1, length - 1).join(" ") + " " + tempEndPart;
        tempCourseName = tempCourseName.slice(4);
        course.courseName = tempCourseName;
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
        course.courseNumber = tokens[1].slice(0, 4);
        const endString = tokens[length - 1];
        course.points = Number(endString.slice(-5));
        course.grade = "IP";
        course.earnedPoints = Number(endString.slice(-10, -5));
        course.attemptedPoints = Number(endString.slice(-15, -10));
        let tempEndPart = endString.slice(0, -15);
        let tempCourseName = tokens.slice(1, length - 1).join(" ") + " " + tempEndPart;
        tempCourseName = tempCourseName.slice(4);
        course.courseName = tempCourseName;
        courses.push(course);
    }
    return courses;
};
const parseFastTrackCourse = (text) => {
    const courses = [];
    for (let i = 0; i < text.length; i++) {
        const tokens = text[i].split(" ");
        const length = tokens.length;
        const course = new course_1.default();
        course.coursePrefix = tokens[0];
        course.courseNumber = tokens[1].slice(0, 4);
        const endString = tokens[length - 1];
        const newEndString = tokens[length - 2];
        let gradeLetterChecker = false;
        if (endString.slice(-10, -1).includes("A") ||
            endString.slice(-10, -1).includes("a")) {
            gradeLetterChecker = true;
            course.points = Number(endString.slice(-6));
            if (endString[endString.length - 7] == "+" ||
                endString[endString.length - 7] == "-") {
                course.grade = endString.slice(-8, -6);
            }
            else {
                course.grade = endString.slice(-7, -6);
            }
        }
        else {
            gradeLetterChecker = false;
            course.points = Number(endString.slice(-5));
            if (endString[endString.length - 6] == "+" ||
                endString[endString.length - 6] == "-") {
                course.grade = endString.slice(-7, -5);
            }
            else {
                course.grade = endString.slice(-6, -5);
            }
        }
        course.earnedPoints = Number(newEndString.slice(-5));
        course.attemptedPoints = Number(newEndString.slice(-10, -5));
        let tempEndPart = newEndString.slice(0, -10);
        let tempCourseName = tokens.slice(1, length - 2).join(" ") + " " + tempEndPart;
        tempCourseName = tempCourseName.slice(4);
        course.courseName = tempCourseName;
        courses.push(course);
    }
    return courses;
};
const handleTransferTerms = (lines) => {
    const transferTerms = [];
    let startIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] == constants_1.PDF_TRANSFER_PREFIX) {
            startIdx = i + 1;
            break;
        }
    }
    if (startIdx == -1)
        return [];
    let graduateRecord = lines.slice(startIdx + 1);
    while (graduateRecord.length > 0) {
        const termCourses = [];
        if (graduateRecord[0] == constants_1.PDF_END_OF_TRANSFER)
            break;
        const term = new term_1.default();
        term.year = graduateRecord[0].split(" ")[0];
        term.name = `Transfer Term ${graduateRecord[0].split(" ")[1]}`;
        let endTermIdx = 0;
        for (let i = 0; i < graduateRecord.length; i++) {
            if (graduateRecord[i].startsWith(constants_1.PDF_TRANSFER_TERM_END)) {
                endTermIdx = i;
                let j = i - 1;
                while (!graduateRecord[j].includes(constants_1.PDF_START_OF_TERM)) {
                    termCourses.push(graduateRecord[j--]);
                }
                term.courses = parseFastTrackCourse(termCourses);
                transferTerms.push(term);
                graduateRecord = graduateRecord.slice(endTermIdx + 1);
            }
        }
    }
    return transferTerms;
};
const hasRemaining = (lines) => {
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] == constants_1.PDF_END_OF_TRANSCRIPT)
            return false;
        if (lines[i].includes(constants_1.PDF_START_OF_TERM))
            return true;
    }
    return false;
};
const nextTermStartIdx = (lines, idx) => {
    while (idx < lines.length) {
        if (lines[idx] == constants_1.PDF_END_OF_TRANSCRIPT)
            return -1;
        if (lines[idx].includes(constants_1.PDF_START_OF_TERM)) {
            if (lines[idx - 1] == "Course") {
                console.log("LINE IS: ", lines[idx - 2]);
                return idx - 2;
            }
            return idx - 1;
        }
        if (lines[idx] == constants_1.PDF_ALTERNATE_START_OF_TERM)
            return idx - 1;
        idx++;
    }
    return -1;
};
const parseTerms = (lines) => {
    const terms = [];
    const transferTerms = handleTransferTerms(lines.concat([]));
    let startIdx = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] == constants_1.PDF_START_OF_GRADUATE_RECORD) {
            startIdx = i + 1;
            break;
        }
    }
    let graduateRecord = lines.slice(startIdx);
    graduateRecord = graduateRecord.filter((line) => line.trim().length);
    while (graduateRecord.length > 0) {
        const termCourses = [];
        if (graduateRecord[0] == constants_1.PDF_END_OF_TRANSCRIPT) {
            console.log("BREAKING OUT");
            break;
        }
        const term = new term_1.default();
        term.year = graduateRecord[0].split(" ")[0];
        term.name = graduateRecord[0].split(" ")[1];
        console.log(`term name: ${term.name} and term year ${term.year}`);
        let endTermIdx = 0;
        for (let i = 0; i < graduateRecord.length; i++) {
            if (graduateRecord[i].startsWith(constants_1.PDF_END_OF_TERM_PREFIX)) {
                endTermIdx = i;
                break;
            }
            if (graduateRecord[i].startsWith(constants_1.PDF_INSTRUCTOR_LINE_PREFIX)) {
                if (graduateRecord[i - 1].startsWith(constants_1.PDF_COURSE_TOPIC)) {
                    termCourses.push(graduateRecord[i - 2]);
                }
                else if (graduateRecord[i - 1].includes(constants_1.PDF_START_OF_TERM)) {
                    let j = i - 1;
                    while (!graduateRecord[j].startsWith(constants_1.PDF_UNOFFICIAL_TRANSCRIPT_PREF)) {
                        j--;
                    }
                    termCourses.push(graduateRecord[j - 1]);
                }
                else
                    termCourses.push(graduateRecord[i - 1]);
            }
        }
        if (graduateRecord[endTermIdx + 1].startsWith(constants_1.PDF_COMPLETED_SEMESTER_PREFIX) ||
            hasRemaining(graduateRecord.slice(endTermIdx + 1))) {
            term.courses = parseCompletedCourses(termCourses);
            terms.push(term);
            const nextTerm = nextTermStartIdx(graduateRecord, endTermIdx);
            console.log("TERM IS: ", term.name + term.year);
            graduateRecord = graduateRecord.slice(nextTerm);
        }
        else {
            term.courses = parseInProgressCourse(termCourses);
            terms.push(term);
            return transferTerms.concat(terms);
        }
    }
    console.log("OBJ:", transferTerms.concat(terms));
    return transferTerms.concat(terms);
};
//# sourceMappingURL=pdf-transcript-parser.js.map