import Track from "../tracks/track";
import Transcript from "../entity/transcript";
import { dataScienceRequirements } from "../tracks/data-science";
import Term from "../entity/term";
import Course from "../entity/course";

interface CourseMapping {
  requirementIdx: number;
  takenCourseIdxs: number[];
}

export interface Audit{
  coreGPAInfo: GPAInfo; 
  additionalCoreGPAInfo: GPAInfo; 
  electiveGPAInfo: GPAInfo; 
}

class GPAInfo {
  gpa: number = 0.0;
  totalPoints: number = 0.0; 
  attemptedPoints: number = 0.0; 
  inProgressCourses: Course[] = [];
  factoredCourses: Course[] = [];
  numberCourses: number = 0;
}

export const audit = (transcript: Transcript, track: string): Audit => {
  const trackRequirements = getTrackRequirements(track);
  const terms = transcript.student.terms;
  const coreCourseMapping = createCourseMapping(
    terms,
    trackRequirements.requiredCoreCourses
  );
  const additionalCoreCourseMapping = createCourseMapping(
    terms,
    trackRequirements.additionalCoreChoices
  );

  const coreGPAInfo = calculateGPA(coreCourseMapping, terms);
  const additionalGPAInfo = calculateGPA(additionalCoreCourseMapping, terms)
  const nonCoreCourses = retrieveElectiveGPA(terms, coreCourseMapping, additionalCoreCourseMapping)
  const audit: Audit ={
    coreGPAInfo: coreGPAInfo, 
    additionalCoreGPAInfo: additionalGPAInfo,
    electiveGPAInfo: nonCoreCourses
  } 
  return audit
};

const retrieveElectiveGPA = (terms: Term[], coreMapping: CourseMapping[], additionalCoreMapping: CourseMapping[]) =>{
  const nonCoreCourses = retrieveNonCoreCourses(terms, coreMapping, additionalCoreMapping)
  const electiveGPAInfo: GPAInfo = new GPAInfo()
  nonCoreCourses.forEach((course: Course)=>{
    if(course.coursePrefix == 'CS' && course.courseNumber[0] == '6'){
      electiveGPAInfo.numberCourses++
      if(course.grade == "IP"){
        electiveGPAInfo.inProgressCourses.push(course)
      }else{
        electiveGPAInfo.factoredCourses.push(course)
        electiveGPAInfo.attemptedPoints += course.attemptedPoints!
        electiveGPAInfo.totalPoints+= course.points!
      }
    }
  })
  electiveGPAInfo.gpa = electiveGPAInfo.totalPoints / electiveGPAInfo.attemptedPoints
  return electiveGPAInfo
}

const retrieveNonCoreCourses = (terms: Term[], coreMapping: CourseMapping[], additionalCoreMapping: CourseMapping[]): Course[] =>{
  let mapping: Course[][] = []
  for(let i =0; i < terms.length; i++){
    mapping.push([...terms[i].courses])
  }
  for(let i =0; i < coreMapping.length; i++){
    delete mapping[coreMapping[i].takenCourseIdxs[0]][coreMapping[i].takenCourseIdxs[1]]
  }
  for(let i =0; i < additionalCoreMapping.length; i++){
    delete mapping[additionalCoreMapping[i].takenCourseIdxs[0]][additionalCoreMapping[i].takenCourseIdxs[1]]
  }
  const flattenedMapping = mapping.flat()
  return flattenedMapping
}

const createCourseMapping = (
  terms: Term[],
  trackCourses: Course[]
): CourseMapping[] => {
  const coreCourseMapping: CourseMapping[] = [];
  for (let i = 0; i < terms.length; i++) {
    const courses = terms[i].courses;
    for (let j = 0; j < courses.length; j++) {
      const courseNum = courses[j].courseNumber;
      const coursePrefix = courses[j].coursePrefix;
      for (let k = 0; k < trackCourses.length; k++) {
        const requiredCore = trackCourses[k];
        if (
          requiredCore.courseNumber == courseNum &&
          requiredCore.coursePrefix == coursePrefix
        ) {
          coreCourseMapping.push({
            requirementIdx: k,
            takenCourseIdxs: [i, j],
          });
        }
      }
    }
  }
  return coreCourseMapping;
};

const calculateGPA = (mapping: CourseMapping[], terms: Term[]): GPAInfo => {
  const courseGPAInfo = new GPAInfo()
  courseGPAInfo.numberCourses = mapping.length
  for (let i = 0; i < mapping.length; i++) {
    const value = mapping[i];
    if (terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].grade == "IP"){
      courseGPAInfo.inProgressCourses.push(terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]])
      continue;
    }
    courseGPAInfo.factoredCourses.push(terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]])
    courseGPAInfo.totalPoints += terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].points!;
    courseGPAInfo.attemptedPoints += terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].attemptedPoints!;
  }
  courseGPAInfo.gpa = courseGPAInfo.totalPoints / courseGPAInfo.attemptedPoints
  return courseGPAInfo;
};

const getTrackRequirements = (track: string): Track => {
  switch (track) {
    case "Networks and Telecommunications":
      return dataScienceRequirements;
    case "Intelligent Systems":
      return dataScienceRequirements;
    case "Interactive Computing":
      return dataScienceRequirements;
    case "Systems":
      return dataScienceRequirements;
    case "Data Science":
      return dataScienceRequirements;
    case "Cyber Security":
      return dataScienceRequirements;
    default:
      return dataScienceRequirements; // Traditional computer science
  }
};
