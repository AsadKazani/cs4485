import Course from "../entity/course";

export default interface Track {
  requiredCoreHours: number;
  requiredCoreGPA: number;
  numberRequiredCoreCourses: number;
  numberRequiredAdditionalCoreCourses: number;
  requiredCoreCourses: Course[];
  additionalCoreChoices: Course[];
  requiredElectiveHours: number;
  requiredElectiveGPA: number;
  
}
