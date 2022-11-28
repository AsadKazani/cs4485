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
const parseTerms = (lines) => {
    const terms = [];
    let startIdx = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] == constants_1.START_OF_GRADUATE_RECORD) {
            startIdx = i + 1;
            break;
        }
    }
    let graduateRecord = lines.slice(startIdx);
    while (graduateRecord.length > 0) {
        const termCourses = [];
        if (graduateRecord[0] == constants_1.END_OF_TRANSCRIPT)
            break;
        const term = new term_1.default();
        term.year = graduateRecord[0].split(" ")[0];
        term.name = graduateRecord[0].split(" ")[1];
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
        if (!graduateRecord[endTermIdx + 1].startsWith(constants_1.COMPLETED_SEMESTER_PREFIX)) {
            term.courses = parseInProgressCourse(termCourses);
            terms.push(term);
            break;
        }
        else {
            term.courses = parseCompletedCourses(termCourses);
            terms.push(term);
            graduateRecord = graduateRecord.slice(endTermIdx + 2);
        }
    }
    return terms;
};
//# sourceMappingURL=text-transcript-parser.js.map