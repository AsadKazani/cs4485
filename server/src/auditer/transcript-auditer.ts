import Track from "../tracks/track";
import Transcript from "../entity/transcript";
import { dataScienceRequirements } from "../tracks/data-science";
import Term from "../entity/term";
import Course from "../entity/course";

interface CourseMapping {
  requirementIdx: number;
  takenCourseIdxs: number[];
}

interface OutstandingRequirements{
  requiredIncompleteCoreCourses: Course[]; 
  requiredIncompleteElectiveCourses: Course[];
}

export interface Audit{
  coreGPAInfo: GPAInfo; 
  additionalCoreGPAInfo: GPAInfo; 
  electiveGPAInfo: GPAInfo; 
  track: Track; 
  outstandingRequirements: OutstandingRequirements
}

class GPAInfo {
  gpa: number = 0.0;
  totalPoints: number = 0.0; 
  attemptedPoints: number = 0.0; 
  inProgressCourses: Course[] = [];
  factoredCourses: Course[] = [];
  numberCourses: number = 0;
  meetsCoreGPARequirement: boolean = true
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

  const coreGPAInfo = calculateGPA(coreCourseMapping, terms, trackRequirements);
  const additionalGPAInfo = calculateGPA(additionalCoreCourseMapping, terms, trackRequirements)
  const nonCoreCourses = retrieveElectiveGPA(terms, coreCourseMapping, additionalCoreCourseMapping, trackRequirements)
  coreGPAInfo.factoredCourses.sort(descendingCourseGPAComparator)
  additionalGPAInfo.factoredCourses.sort(descendingCourseGPAComparator)
  nonCoreCourses.factoredCourses.sort(descendingCourseGPAComparator)

  const incompleteRequirements: OutstandingRequirements = {
    requiredIncompleteCoreCourses: [], 
    requiredIncompleteElectiveCourses: []
  }

  const audit: Audit ={
    coreGPAInfo: coreGPAInfo, 
    additionalCoreGPAInfo: additionalGPAInfo,
    electiveGPAInfo: nonCoreCourses, 
    track: trackRequirements,
    outstandingRequirements: incompleteRequirements
  }
  aggregateAuditInfo(trackRequirements, audit)
  computeOutstandingRequirements(audit)
  return audit
};

const computeOutstandingRequirements = (audit: Audit)=>{
  const {requiredCoreCourses} = audit.track
  const {coreGPAInfo, electiveGPAInfo, outstandingRequirements} = audit
  const requiredCoursesSet = new Set<string>()
  requiredCoreCourses.forEach(course=> requiredCoursesSet.add(`${course.coursePrefix} ${course.courseNumber}`))
  const allCores = coreGPAInfo.factoredCourses.concat(coreGPAInfo.inProgressCourses)
  const takenCoreCourseNames: string[] = []
  allCores.forEach(course=> takenCoreCourseNames.push(`${course.coursePrefix} ${course.courseNumber}`))


  for(let i=0; i < takenCoreCourseNames.length; i++){
    const courseName = takenCoreCourseNames[i]
    if(requiredCoursesSet.has(courseName)){
      requiredCoursesSet.delete(courseName)
      delete takenCoreCourseNames[i]
    }
  }

  const additionalCoreRequirementCourseNames = takenCoreCourseNames.flat()
  const incompleteAdditionalCoreRequirements = []
  for(let i = 0; i < additionalCoreRequirementCourseNames.length; i++){
    for(let j = 0; j < allCores.length; j++){
      const course = allCores[j]
      const cName = `${course.coursePrefix} ${course.courseNumber}`
      if(cName === additionalCoreRequirementCourseNames[i]){
        incompleteAdditionalCoreRequirements.push(allCores[j])
        break;
      }
    }
  }

  outstandingRequirements.requiredIncompleteCoreCourses = incompleteAdditionalCoreRequirements


}

const aggregateAuditInfo = (track: Track, audit: Audit)=>{
  let needed_courses = track.numberRequiredAdditionalCoreCourses
  const {coreGPAInfo, additionalCoreGPAInfo, electiveGPAInfo} = audit
  const {factoredCourses: coreCourses} = coreGPAInfo
  const {factoredCourses: extraCore} = additionalCoreGPAInfo
  const {factoredCourses: electiveCourses} = electiveGPAInfo
  while(extraCore.length && needed_courses){
    coreCourses.push(extraCore[extraCore.length-1])
    needed_courses--
    extraCore.pop()
  }
  
  extraCore.forEach(course=> electiveCourses.push(course))
  electiveCourses.sort(descendingCourseGPAComparator)
  
  coreCourses.forEach(course=> {
    coreGPAInfo.attemptedPoints += course.attemptedPoints!
    coreGPAInfo.totalPoints+= course.points!
  })

  coreGPAInfo.gpa = coreGPAInfo.totalPoints / coreGPAInfo.attemptedPoints
  coreGPAInfo.meetsCoreGPARequirement = coreGPAInfo.gpa >= track.requiredCoreGPA

  electiveCourses.forEach(course=>{
    electiveGPAInfo.attemptedPoints += course.attemptedPoints!
    electiveGPAInfo.totalPoints+= course.points!
  })

  electiveGPAInfo.gpa = electiveGPAInfo.totalPoints / electiveGPAInfo.attemptedPoints
  electiveGPAInfo.meetsCoreGPARequirement = electiveGPAInfo.gpa >= track.requiredElectiveGPA
}

const descendingCourseGPAComparator = (a: Course, b: Course)=>{
  return a.points! >= b.points! ? -1: 1
}


const retrieveElectiveGPA = (terms: Term[], coreMapping: CourseMapping[], additionalCoreMapping: CourseMapping[], track: Track) =>{
  const nonCoreCourses = retrieveNonCoreCourses(terms, coreMapping, additionalCoreMapping)
  const electiveGPAInfo: GPAInfo = new GPAInfo()
  nonCoreCourses.forEach((course: Course)=>{
    if(course.coursePrefix == 'CS' && course.courseNumber[0] == '6'){
      electiveGPAInfo.numberCourses++
      if(course.grade == "IP"){
        electiveGPAInfo.inProgressCourses.push(course)
      }else{
        electiveGPAInfo.factoredCourses.push(course)
      }
    }
  })
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

const calculateGPA = (mapping: CourseMapping[], terms: Term[], track: Track): GPAInfo => {
  const courseGPAInfo = new GPAInfo()
  courseGPAInfo.numberCourses = mapping.length
  for (let i = 0; i < mapping.length; i++) {
    const value = mapping[i];
    if (terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].grade == "IP"){
      courseGPAInfo.inProgressCourses.push(terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]])
      continue;
    }
    courseGPAInfo.factoredCourses.push(terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]])
  }
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
