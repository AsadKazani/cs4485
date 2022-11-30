import Track from "./track";

export const cyberSecurityRequirements: Track = {
  requiredCoreHours: 15,
  requiredCoreGPA: 3.19,
  numberRequiredCoreCourses: 3,
  numberRequiredAdditionalCoreCourses: 2,
  requiredCoreCourses: [
    {
      courseName: "Information Security",
      coursePrefix: "CS",
      courseNumber: "6324",
    },
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
  ],
  additionalCoreChoices: [
    {
      courseName: "System Security & Malicious Code Analysis",
      coursePrefix: "CS",
      courseNumber: "6332",
    },
    {
      courseName: "Data and Applications Security",
      coursePrefix: "CS",
      courseNumber: "6348",
    },
    {
      courseName: "Network Security",
      coursePrefix: "CS",
      courseNumber: "6349",
    },
    {
      courseName: "Introduction To Cryptography",
      coursePrefix: "CS",
      courseNumber: "6377",
    },
  ],
  requiredElectiveHours: 12,
  requiredElectiveGPA: 3.0,
};