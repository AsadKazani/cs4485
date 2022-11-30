import {
  COMPLETED_SEMESTER_PREFIX,
  END_OF_TERM_PREFIX,
  END_OF_TRANSCRIPT,
  END_OF_TRANSFER,
  INSTRUCTOR_LINE_PREFIX,
  START_OF_GRADUATE_RECORD,
  START_OF_TERM,
  TRANSFER_PREFIX,
  TRANSFER_TERM_END,
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

const handleTransferTerms = (lines: string[]) =>{
  const transferTerms: Term[] = [];
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == TRANSFER_PREFIX) {
      startIdx = i + 1;
      break;
    }
  }
  if(startIdx == -1) return []
  let graduateRecord = lines.slice(startIdx + 1)
  while(graduateRecord.length > 0){
    const termCourses = [];
    if (graduateRecord[0] == END_OF_TRANSFER) break;
    const term = new Term();
    term.year = graduateRecord[0].split(" ")[0];
    term.name = `Transfer Term ${graduateRecord[0].split(" ")[1]}`;
    let endTermIdx = 0
    for(let i = 0; i < graduateRecord.length; i++){
      if(graduateRecord[i].startsWith(TRANSFER_TERM_END)){
        endTermIdx = i
        let j = i-1
        while(!graduateRecord[j].startsWith(START_OF_TERM)){
          termCourses.push(graduateRecord[j--])
        }
        term.courses = parseCompletedCourses(termCourses)
        transferTerms.push(term)
        graduateRecord = graduateRecord.slice(endTermIdx + 1)
      }
    }
  }
  return transferTerms
}

const hasRemaining = (lines: string[])=>{
  for(let i = 0; i < lines.length; i++){
    if(lines[i] == END_OF_TRANSCRIPT) return false; 
    if(lines[i] == START_OF_TERM) return true; 
  }
  return false; 
}

const parseTerms = (lines: string[]): Term[] => {
  console.log('before')
  const terms: Term[] = [];
  const transferTerms = handleTransferTerms(lines.concat([]))
  console.log('after transfer')
  let startIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == START_OF_GRADUATE_RECORD) {
      startIdx = i + 1;
      break;
    }
  }


  let graduateRecord = lines.slice(startIdx);
  while (graduateRecord.length > 0) {
    console.log('stuck')
    const termCourses = [];
    if (graduateRecord[0] == END_OF_TRANSCRIPT){
      console.log('hello i Reached the nd :)')
      break
    }
    const term = new Term();
    term.year = graduateRecord[0].split(" ")[0];
    term.name = graduateRecord[0].split(" ")[1];
    console.log(`term name: ${term.name} and term year ${term.year}`)
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
    if (graduateRecord[endTermIdx + 1].startsWith(COMPLETED_SEMESTER_PREFIX)) {
      term.courses = parseCompletedCourses(termCourses);
      terms.push(term);
      graduateRecord = graduateRecord.slice(endTermIdx + 2);
    }else if(hasRemaining(graduateRecord.slice(endTermIdx + 1))){
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

  console.log('number of terms are: ', terms[2])
  return transferTerms.concat(terms);
};


//Elective Courses: CS 6320, CS 6326, CS 6334, CS 6367 