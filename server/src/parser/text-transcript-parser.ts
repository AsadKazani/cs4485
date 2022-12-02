import {
  ALTERNATE_START_OF_TERM,
  COMPLETED_SEMESTER_PREFIX,
  COURSE_TOPIC,
  END_OF_TERM_PREFIX,
  END_OF_TRANSCRIPT,
  END_OF_TRANSFER,
  INSTRUCTOR_LINE_PREFIX,
  START_OF_GRADUATE_RECORD,
  START_OF_TERM,
  TRANSFER_PREFIX,
  TRANSFER_TERM_END,
  UNOFFICIAL_TRANSCRIPT_PREF,
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

const nextTermStartIdx = (lines: string[], idx: number)=>{
  while(idx < lines.length){
    if(lines[idx] == END_OF_TRANSCRIPT) return -1
    if(lines[idx] == START_OF_TERM) return idx -1; 
    if(lines[idx] == ALTERNATE_START_OF_TERM) return idx -1
    idx++
  }
  return -1
}


const parseTerms = (lines: string[]): Term[] => {
  const terms: Term[] = [];
  const transferTerms = handleTransferTerms(lines.concat([]))
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
    if (graduateRecord[0] == END_OF_TRANSCRIPT){
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
        if(graduateRecord[i-1].startsWith(COURSE_TOPIC)){
          termCourses.push(graduateRecord[i-2])
        }else if(graduateRecord[i-1].startsWith(START_OF_TERM)){
          let j = i-1
          while(!graduateRecord[j].startsWith(UNOFFICIAL_TRANSCRIPT_PREF)){
            j--;
          }
          termCourses.push(graduateRecord[j-1])
        }
        else termCourses.push(graduateRecord[i - 1]);
      }
    }
    if (graduateRecord[endTermIdx + 1].startsWith(COMPLETED_SEMESTER_PREFIX) || hasRemaining(graduateRecord.slice(endTermIdx + 1))) {
      term.courses = parseCompletedCourses(termCourses);
      terms.push(term);
      const nextTerm = nextTermStartIdx(graduateRecord, endTermIdx)
      graduateRecord = graduateRecord.slice(nextTerm);
    }else {
      term.courses = parseInProgressCourse(termCourses);
      terms.push(term);
      return transferTerms.concat(terms);
    }
  }

  return transferTerms.concat(terms);
};


// Core Courses:  CS 6V81 

// Elective Courses: CS 6320, CS 6364, CS 6378, CS 6384, CS 6V98, CS 6V98  