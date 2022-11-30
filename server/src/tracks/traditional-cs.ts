import Track from "./track";

export const traditionanlCSRequirements: Track = {
  requiredCoreHours: 15,
  requiredCoreGPA: 3.19,
  numberRequiredCoreCourses: 3,
  numberRequiredAdditionalCoreCourses: 2,
  requiredCoreCourses: [
    {
      courseName: "Design and Analysis of Computer Algorithms",
      coursePrefix: "CS",
      courseNumber: "6363",
    },
    {
      courseName: "Advanced Operating Systems",
      coursePrefix: "CS",
      courseNumber: "6378",
    },
    {
      courseName: "Advanced Computer Networks",
      coursePrefix: "CS",
      courseNumber: "6390",
    },
  ],
  additionalCoreChoices: [
    {
      courseName: "Compiler Construction",
      coursePrefix: "CS",
      courseNumber: "6353",
    },
    {
      courseName: "Database Design",
      coursePrefix: "CS",
      courseNumber: "6360",
    },
    {
      courseName: "Advanced Programming Languages",
      coursePrefix: "CS",
      courseNumber: "6371",
    },
  ],
  requiredElectiveHours: 15,
  requiredElectiveGPA: 3.0,
};