import Track from "./track";

export const networksAndCommunicationsRequirements: Track = {
  requiredCoreHours: 15,
  requiredCoreGPA: 3.19,
  numberRequiredCoreCourses: 5, 
  numberRequiredAdditionalCoreCourses: 0,
  requiredCoreCourses: [
    {
      courseName: "Perf. of Computer Systems and Networks",
      coursePrefix: "CS",
      courseNumber: "6352",
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
    {
      courseName: "Algorithmic Aspects of Telecomm. Networks",
      coursePrefix: "CS",
      courseNumber: "6385",
    },
    {
      courseName: "Advanced Computer Networks",
      coursePrefix: "CS",
      courseNumber: "6390",
    },
  ],
  additionalCoreChoices: [],
  requiredElectiveHours: 15,
  requiredElectiveGPA: 3.0,
};