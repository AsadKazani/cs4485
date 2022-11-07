import Track from "../tracks/track";
import Transcript from "../entity/transcript";
import { dataScienceRequirements } from "../tracks/data-science";
import Term from "../entity/term";
import Course from "../entity/course";

interface CourseMapping {
  requirementIdx: number;
  takenCourseIdxs: number[];
}

export const audit = (transcript: Transcript, track: string) => {
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

  console.log(additionalCoreCourseMapping);
  console.log(
    terms[additionalCoreCourseMapping[0].takenCourseIdxs[0]].courses[
      additionalCoreCourseMapping[0].takenCourseIdxs[1]
    ]
  );
  const coreGPA = calculateGPA(coreCourseMapping, terms);
  console.log("Core GPA is", coreGPA);
};

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

const calculateGPA = (mapping: CourseMapping[], terms: Term[]): number => {
  let sum = 0.0;
  let hours = 0.0;
  for (let i = 0; i < mapping.length; i++) {
    const value = mapping[i];
    if (
      terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].grade ==
      "IP"
    )
      continue;
    sum +=
      terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].points!;
    hours +=
      terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]]
        .attemptedPoints!;
  }
  return sum / hours;
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
