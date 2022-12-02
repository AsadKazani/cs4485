import {
  PDF_COMPLETED_SEMESTER_PREFIX,
  PDF_END_OF_TERM_PREFIX,
  PDF_END_OF_TRANSCRIPT,
  PDF_INSTRUCTOR_LINE_PREFIX,
  PDF_START_OF_GRADUATE_RECORD,
} from "../constants";
import Student from "../entity/student";
import Term from "../entity/term";
import Course from "../entity/course";
import Transcript from "../entity/transcript";
import { EOL } from "os";

export default function parseTextTranscript(text: string): Transcript {
  const lines: string[] = text.split(EOL);
  const transcript = new Transcript();
  const student: Student = new Student();
  student.name = parseStudentName(lines);
  student.id = parseStudentId(lines);
  student.terms = parseTerms(lines);
  transcript.student = student;
  return transcript;
}

const parseStudentName = (lines: string[]): string => {
  return lines[4].split(":")[1].substring(1).trim();
};

const parseStudentId = (lines: string[]): string => {
  return lines[6].split(":")[1].substring(1).trim();
};

const parseCompletedCourses = (text: string[]): Course[] => {
  const courses: Course[] = [];
  for (let i = 0; i < text.length; i++) {
    const tokens = text[i].split(" ");
    const length = tokens.length;
    const course = new Course();
    course.coursePrefix = tokens[0];
    course.courseNumber = tokens[1].slice(0, 4);
    const endString = tokens[length - 1];
    let gradeLetterChecker: boolean = false;
    let newEndString: string = "";
    if (
      endString.slice(-10, -1).includes("A") ||
      endString.slice(-10, -1).includes("a")
    ) {
      gradeLetterChecker = true;
      course.points = Number(endString.slice(-6));
      let newEndString: string = endString.slice(0, -7);
      if (
        endString[endString.length - 7] == "+" ||
        endString[endString.length - 7] == "-"
      ) {
        course.grade = endString.slice(-8, -6);
        const newEndString = endString.slice(0, -8);
      } else {
        course.grade = endString.slice(-7, -6);
        const newEndString = endString.slice(0, -7);
      }
    } else {
      gradeLetterChecker = false;
      course.points = Number(endString.slice(-5));
      let newEndString: string = endString.slice(0, -6);
      if (
        endString[endString.length - 7] == "+" ||
        endString[endString.length - 7] == "-"
      ) {
        course.grade = endString.slice(-7, -6);
        const newEndString = endString.slice(0, -7);
      } else {
        course.grade = endString.slice(-6, -5);
        const newEndString = endString.slice(0, -6);
      }
    }

    course.earnedPoints = Number(newEndString.slice(-5));
    course.attemptedPoints = Number(newEndString.slice(-10, -5));

    let tempEndPart: string = newEndString.slice(0, -10);
    let tempCourseName: string =
      tokens.slice(1, length - 1).join(" ") + " " + tempEndPart;
    tempCourseName = tempCourseName.slice(4);
    course.courseName = tokens.slice(1, length).join(" ");
    courses.push(course);
  }
  return courses;
};

const parseInProgressCourse = (text: string[]): Course[] => {
  const courses: Course[] = [];
  for (let i = 0; i < text.length; i++) {
    const tokens = text[i].split(" ");
    const length = tokens.length;
    const course = new Course();
    course.coursePrefix = tokens[0];
    course.courseNumber = tokens[1].slice(0, 4);

    const endString = tokens[length - 1];
    course.points = Number(endString.slice(-5));
    course.grade = "IP";
    course.earnedPoints = Number(endString.slice(-10, -5));
    course.attemptedPoints = Number(endString.slice(-15, -10));

    let tempEndPart: string = endString.slice(0, -15);
    let tempCourseName: string =
      tokens.slice(1, length - 1).join(" ") + " " + tempEndPart;
    tempCourseName = tempCourseName.slice(4);
    course.courseName = tokens.slice(1, length).join(" ");
    courses.push(course);
  }
  return courses;
};

const parseTerms = (lines: string[]): Term[] => {
  const terms: Term[] = [];
  let startIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == PDF_START_OF_GRADUATE_RECORD) {
      startIdx = i + 1;
      break;
    }
  }

  let graduateRecord = lines.slice(startIdx);
  while (graduateRecord.length > 0) {
    const termCourses = [];
    if (graduateRecord[0] == PDF_END_OF_TRANSCRIPT) break;
    const term = new Term();
    term.year = graduateRecord[0].split(" ")[0];
    term.name = graduateRecord[0].split(" ")[1];
    let endTermIdx = 0;
    for (let i = 0; i < graduateRecord.length; i++) {
      if (graduateRecord[i].startsWith(PDF_END_OF_TERM_PREFIX)) {
        endTermIdx = i;
        break;
      }
      if (graduateRecord[i].startsWith(PDF_INSTRUCTOR_LINE_PREFIX)) {
        termCourses.push(graduateRecord[i - 1]);
      }
    }
    if (
      !graduateRecord[endTermIdx + 1].startsWith(PDF_COMPLETED_SEMESTER_PREFIX)
    ) {
      term.courses = parseInProgressCourse(termCourses);
      terms.push(term);
      break;
    } else {
      term.courses = parseCompletedCourses(termCourses);
      terms.push(term);
      graduateRecord = graduateRecord.slice(endTermIdx + 2);
    }
  }
  return terms;
};
