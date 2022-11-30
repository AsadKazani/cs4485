import Track from "./track";

export const systemsRequirements: Track = {
  requiredCoreHours: 15,
  requiredCoreGPA: 3.19,
  numberRequiredCoreCourses: 5, 
  numberRequiredAdditionalCoreCourses: 1,
  requiredCoreCourses: [
    {
      courseName: "Computer Architecture",
      coursePrefix: "CS",
      courseNumber: "6304",
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
      courseName: "Real-Time Systems",
      coursePrefix: "CS",
      courseNumber: "6396",
    },
  ],
  additionalCoreChoices: [
    {
      courseName: "Network Security",
      coursePrefix: "CS",
      courseNumber: "6349",
    },
    {
      courseName: "Parallel Processing",
      coursePrefix: "CS",
      courseNumber: "6376",
    },
    {
      courseName: "Distributed Computing",
      coursePrefix: "CS",
      courseNumber: "6380",
    },
    {
      courseName: "Synthesis and Opt. of High-Perf. Systems",
      coursePrefix: "CS",
      courseNumber: "6397",
    },
    {
      courseName: "Parallel Architectures and Systems",
      coursePrefix: "CS",
      courseNumber: "6399",
    },
  ],
  requiredElectiveHours: 15,
  requiredElectiveGPA: 3.0,
};