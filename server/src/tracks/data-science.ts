import Track from "./track";

export const dataScienceRequirements: Track = {
  requiredCoreHours: 15, 
  requiredCoreGPA: 3.19, 
  numberRequiredCoreCourses: 4,
  numberRequiredAdditionalCoreCourses: 1,
  requiredCoreCourses: [
    {
      courseName: "Statistical Methods for Data Sciences",
      coursePrefix: "CS",
      courseNumber: "6313",
    },
    {
      courseName: "Big Data Management and Analytics",
      coursePrefix: "CS",
      courseNumber: "6350",
    },
    {
      courseName: "Design and Analysis of Computer Algorithms",
      coursePrefix: "CS",
      courseNumber: "6363",
    },
    {
      courseName: "Machine Learning",
      coursePrefix: "CS",
      courseNumber: "6375",
    },
  ], 
  additionalCoreChoices: [
    {
        courseName: "Social Network Analytics",
        coursePrefix: "CS",
        courseNumber: "6301",
      },
      {
        courseName: "Natural Language Processing",
        coursePrefix: "CS",
        courseNumber: "6320",
      },
      {
        courseName: "Video Analytics",
        coursePrefix: "CS",
        courseNumber: "6327",
      },
      {
        courseName: "Statistics for Machine Learning",
        coursePrefix: "CS",
        courseNumber: "6347",
      },
      {
        courseName: "Database Design",
        coursePrefix: "CS",
        courseNumber: "6360",
      }
  ], 
  requiredElectiveHours: 15, 
  requiredElectiveGPA: 3.0,
    /**
  admissionPrerequisites: [
    {
      courseName: "Social Network Analytics",
      coursePrefix: "CS",
      courseNumber: "6301",
    },
    {
      courseName: "Natural Language Processing",
      coursePrefix: "CS",
      courseNumber: "6320",
    },
    {
      courseName: "Video Analytics",
      coursePrefix: "CS",
      courseNumber: "6327",
    },
    {
      courseName: "Statistics for Machine Learning",
      coursePrefix: "CS",
      courseNumber: "6347",
    },
    {
      courseName: "Database Design",
      coursePrefix: "CS",
      courseNumber: "6360",
    }
  ]
   */
}