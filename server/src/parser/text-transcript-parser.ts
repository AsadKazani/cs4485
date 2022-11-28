import {
  COMPLETED_SEMESTER_PREFIX,
  END_OF_TERM_PREFIX,
  END_OF_TRANSCRIPT,
  INSTRUCTOR_LINE_PREFIX,
  START_OF_GRADUATE_RECORD,
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
  return lines[1].split(":")[1].substring(1);
};

const parseStudentId = (lines: string[]): string => {
  return lines[3].split(":")[1].substring(1);
};

const parseCompletedCourses = (text: string[]): Course[] => {
  const courses: Course[] = [];
  for (let i = 0; i < text.length; i++) {
    const tokens = text[i].split(" ");
    const length = tokens.length;
    const course = new Course();
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

const parseInProgressCourse = (text: string[]): Course[] => {
  const courses: Course[] = [];
  for (let i = 0; i < text.length; i++) {
    const tokens = text[i].split(" ");
    const length = tokens.length;
    const course = new Course();
    course.coursePrefix = tokens[0];
    course.courseNumber = tokens[1];
    course.points = Number(tokens[length - 1]);
    course.grade = "IP"; //denote in progress
    course.earnedPoints = Number(tokens[length - 2]);
    course.attemptedPoints = Number(tokens[length - 3]);
    course.courseName = tokens.slice(2, length - 3).join(" ");
    courses.push(course);
  }
  return courses;
};

const parseTerms = (lines: string[]): Term[] => {
  const terms: Term[] = [];
  let startIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == START_OF_GRADUATE_RECORD) {
      startIdx = i + 1;
      break;
    }
  }

  let graduateRecord = lines.slice(startIdx);
  while (graduateRecord.length > 0) {
    const termCourses = [];
    if (graduateRecord[0] == END_OF_TRANSCRIPT) break;
    const term = new Term();
    term.year = graduateRecord[0].split(" ")[0];
    term.name = graduateRecord[0].split(" ")[1];
    let endTermIdx = 0;
    for (let i = 0; i < graduateRecord.length; i++) {
      if (graduateRecord[i].startsWith(END_OF_TERM_PREFIX)) {
        endTermIdx = i;
        break;
      }
      if (graduateRecord[i].startsWith(INSTRUCTOR_LINE_PREFIX)) {
        termCourses.push(graduateRecord[i - 1]);
      }
    }
    if (!graduateRecord[endTermIdx + 1].startsWith(COMPLETED_SEMESTER_PREFIX)) {
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
