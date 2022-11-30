import Track from "./track";

export const interactiveSystemsRequirement: Track = {
  requiredCoreHours: 15,
  requiredCoreGPA: 3.19,
  numberRequiredCoreCourses: 2,
  numberRequiredAdditionalCoreCourses: 3,
  requiredCoreCourses: [
    {
      courseName: "Human Computer Interaction",
      coursePrefix: "CS",
      courseNumber: "6326",
    },
    {
      courseName: "Design and Analysis of Computer Algorithms",
      coursePrefix: "CS",
      courseNumber: "6363",
    },
  ],
  additionalCoreChoices: [
    {
      courseName: "Computer Animation and Gaming",
      coursePrefix: "CS",
      courseNumber: "6323",
    },
    {
      courseName: "Modeling and Simulation",
      coursePrefix: "CS",
      courseNumber: "6328",
    },
    {
      courseName: "Multimedia Systems",
      coursePrefix: "CS",
      courseNumber: "6331",
    },
    {
      courseName: "Virtual Reality",
      coursePrefix: "CS",
      courseNumber: "6334",
    },
    {
      courseName: "Computer Graphics",
      coursePrefix: "CS",
      courseNumber: "6366",
    },
  ],
  requiredElectiveHours: 15,
  requiredElectiveGPA: 3.0,
};