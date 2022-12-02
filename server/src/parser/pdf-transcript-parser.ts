import {
  PDF_START_OF_GRADUATE_RECORD,
  PDF_START_OF_TERM,
  PDF_END_OF_TERM_PREFIX,
  PDF_INSTRUCTOR_LINE_PREFIX,
  PDF_END_OF_TRANSCRIPT,
  PDF_COMPLETED_SEMESTER_PREFIX,
  PDF_TRANSFER_PREFIX,
  PDF_END_OF_TRANSFER,
  PDF_TRANSFER_TERM_END,
  PDF_COURSE_TOPIC,
  PDF_UNOFFICIAL_TRANSCRIPT_PREF,
  PDF_ALTERNATE_START_OF_TERM,
} from "../constants";
import Student from "../entity/student";
import Term from "../entity/term";
import Course from "../entity/course";
import Transcript from "../entity/transcript";

export default function parsePDFTranscript(text: string): Transcript {
  const lines: string[] = text.split("\n");
  const transcript = new Transcript();
  const student: Student = new Student();
  student.name = parseStudentName(lines);
  student.id = parseStudentId(lines);
  student.terms = parseTerms(lines);
  transcript.student = student;
  //student.terms.forEach((term) => console.log(term.courses));
  return transcript;
}

const parseStudentName = (lines: string[]): string => {
  return lines[3].split(":")[1].substring(1).trim();
};

const parseStudentId = (lines: string[]): string => {
  return lines[5].split(":")[1].substring(1).trim();
};

const parseCompletedCourses = (text: string[]): Course[] => {
  const courses: Course[] = [];
  for (let i = 0; i < text.length; i++) {
    let tokens = text[i].split(" ");
    tokens = tokens.filter((t) => t.length);
    if (tokens.length == 1) {
      continue;
    }
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
      newEndString = endString.slice(0, -7);
      if (
        endString[endString.length - 7] == "+" ||
        endString[endString.length - 7] == "-"
      ) {
        course.grade = endString.slice(-8, -6);
        newEndString = endString.slice(0, -8);
      } else {
        course.grade = endString.slice(-7, -6);
        newEndString = endString.slice(0, -7);
      }
    } else {
      gradeLetterChecker = false;
      course.points = Number(endString.slice(-5));
      newEndString = endString.slice(0, -6);
      if (
        endString[endString.length - 6] == "+" ||
        endString[endString.length - 6] == "-"
      ) {
        course.grade = endString.slice(-7, -5);
        newEndString = endString.slice(0, -7);
      } else {
        course.grade = endString.slice(-6, -5);
        newEndString = endString.slice(0, -6);
      }
    }
    course.earnedPoints = Number(newEndString.slice(-5));
    course.attemptedPoints = Number(newEndString.slice(-10, -5));

    let tempEndPart: string = newEndString.slice(0, -10);
    let tempCourseName: string =
      tokens.slice(1, length - 1).join(" ") + " " + tempEndPart;
    tempCourseName = tempCourseName.slice(4);
    course.courseName = tempCourseName;
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
    course.courseName = tempCourseName;
    courses.push(course);
  }

  return courses;
};

const parseFastTrackCourse = (text: string[]): Course[] => {
  const courses: Course[] = [];
  for (let i = 0; i < text.length; i++) {
    const tokens = text[i].split(" ");
    const length = tokens.length;
    const course = new Course();
    course.coursePrefix = tokens[0];
    course.courseNumber = tokens[1].slice(0, 4);

    const endString = tokens[length - 1];
    const newEndString: string = tokens[length - 2];
    let gradeLetterChecker: boolean = false;

    if (
      endString.slice(-10, -1).includes("A") ||
      endString.slice(-10, -1).includes("a")
    ) {
      gradeLetterChecker = true;
      course.points = Number(endString.slice(-6));
      if (
        endString[endString.length - 7] == "+" ||
        endString[endString.length - 7] == "-"
      ) {
        course.grade = endString.slice(-8, -6);
      } else {
        course.grade = endString.slice(-7, -6);
      }
    } else {
      gradeLetterChecker = false;
      course.points = Number(endString.slice(-5));
      if (
        endString[endString.length - 6] == "+" ||
        endString[endString.length - 6] == "-"
      ) {
        course.grade = endString.slice(-7, -5);
      } else {
        course.grade = endString.slice(-6, -5);
      }
    }
    course.earnedPoints = Number(newEndString.slice(-5));
    course.attemptedPoints = Number(newEndString.slice(-10, -5));

    let tempEndPart: string = newEndString.slice(0, -10);
    let tempCourseName: string =
      tokens.slice(1, length - 2).join(" ") + " " + tempEndPart;
    tempCourseName = tempCourseName.slice(4);
    course.courseName = tempCourseName;
    courses.push(course);
  }
  return courses;
};

const handleTransferTerms = (lines: string[]) => {
  const transferTerms: Term[] = [];
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == PDF_TRANSFER_PREFIX) {
      startIdx = i + 1;
      break;
    }
  }
  if (startIdx == -1) return [];
  let graduateRecord = lines.slice(startIdx + 1);
  while (graduateRecord.length > 0) {
    const termCourses = [];
    if (graduateRecord[0] == PDF_END_OF_TRANSFER) break;
    const term = new Term();
    term.year = graduateRecord[0].split(" ")[0];
    term.name = `Transfer Term ${graduateRecord[0].split(" ")[1]}`;
    let endTermIdx = 0;
    for (let i = 0; i < graduateRecord.length; i++) {
      if (graduateRecord[i].startsWith(PDF_TRANSFER_TERM_END)) {
        endTermIdx = i;
        let j = i - 1;
        while (!graduateRecord[j].includes(PDF_START_OF_TERM)) {
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

const hasRemaining = (lines: string[]) => {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == PDF_END_OF_TRANSCRIPT) return false;
    if (lines[i].includes(PDF_START_OF_TERM)) return true;
  }
  return false;
};

const nextTermStartIdx = (lines: string[], idx: number) => {
  while (idx < lines.length) {
    if (lines[idx] == PDF_END_OF_TRANSCRIPT) return -1;
    if (lines[idx].includes(PDF_START_OF_TERM)) {
      if (lines[idx - 1] == "Course") {
        console.log("LINE IS: ", lines[idx - 2]);
        return idx - 2;
      }
      return idx - 1;
    }
    if (lines[idx] == PDF_ALTERNATE_START_OF_TERM) return idx - 1;
    idx++;
  }
  return -1;
};

const parseTerms = (lines: string[]): Term[] => {
  const terms: Term[] = [];
  const transferTerms = handleTransferTerms(lines.concat([]));
  //const transferTerms: Term[] = [];
  let startIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == PDF_START_OF_GRADUATE_RECORD) {
      startIdx = i + 1;
      break;
    }
  }

  let graduateRecord = lines.slice(startIdx);
  graduateRecord = graduateRecord.filter((line) => line.trim().length);
  while (graduateRecord.length > 0) {
    const termCourses = [];
    if (graduateRecord[0] == PDF_END_OF_TRANSCRIPT) {
      console.log("BREAKING OUT");
      break;
    }
    const term = new Term();
    term.year = graduateRecord[0].split(" ")[0];
    term.name = graduateRecord[0].split(" ")[1];
    console.log(`term name: ${term.name} and term year ${term.year}`);
    let endTermIdx = 0;
    for (let i = 0; i < graduateRecord.length; i++) {
      if (graduateRecord[i].startsWith(PDF_END_OF_TERM_PREFIX)) {
        endTermIdx = i;
        break;
      }
      if (graduateRecord[i].startsWith(PDF_INSTRUCTOR_LINE_PREFIX)) {
        if (graduateRecord[i - 1].startsWith(PDF_COURSE_TOPIC)) {
          termCourses.push(graduateRecord[i - 2]);
        } else if (graduateRecord[i - 1].includes(PDF_START_OF_TERM)) {
          let j = i - 1;
          while (
            !graduateRecord[j].startsWith(PDF_UNOFFICIAL_TRANSCRIPT_PREF)
          ) {
            j--;
          }
          termCourses.push(graduateRecord[j - 1]);
        } else termCourses.push(graduateRecord[i - 1]);
      }
    }
    if (
      graduateRecord[endTermIdx + 1].startsWith(
        PDF_COMPLETED_SEMESTER_PREFIX
      ) ||
      hasRemaining(graduateRecord.slice(endTermIdx + 1))
    ) {
      term.courses = parseCompletedCourses(termCourses);
      terms.push(term);
      const nextTerm = nextTermStartIdx(graduateRecord, endTermIdx);
      console.log("TERM IS: ", term.name + term.year);
      graduateRecord = graduateRecord.slice(nextTerm);
    } else {
      term.courses = parseInProgressCourse(termCourses);
      terms.push(term);
      return transferTerms.concat(terms);
    }
  }
  console.log("OBJ:", transferTerms.concat(terms));
  return transferTerms.concat(terms);
};
