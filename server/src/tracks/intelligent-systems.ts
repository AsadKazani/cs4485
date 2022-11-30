import Track from "./track";

export const intelligentSystemsRequirement: Track = {
  requiredCoreHours: 15,
  requiredCoreGPA: 3.19,
  numberRequiredCoreCourses: 4,
  numberRequiredAdditionalCoreCourses: 1,
  requiredCoreCourses: [
    {
      courseName: "Natural Language Processing",
      coursePrefix: "CS",
      courseNumber: "6320",
    },
    {
      courseName: "Design and Analysis of Computer Algorithms",
      coursePrefix: "CS",
      courseNumber: "6363",
    },
    {
      courseName: "Artificial Intelligence",
      coursePrefix: "CS",
      courseNumber: "6364",
    },
    {
      courseName: "Machine Learning",
      coursePrefix: "CS",
      courseNumber: "6375",
    },
  ],
  additionalCoreChoices: [
    {
      courseName: "Database Design",
      coursePrefix: "CS",
      courseNumber: "6360",
    },
    {
      courseName: "Advanced Operating Systems",
      coursePrefix: "CS",
      courseNumber: "6378",
    },
  ],
  requiredElectiveHours: 15,
  requiredElectiveGPA: 3.0,
};