import Track from "./track";

export const softwareEngineeringRequirements: Track = {
  requiredCoreHours: 15,
  requiredCoreGPA: 3.19,
  numberRequiredCoreCourses: 5, 
  numberRequiredAdditionalCoreCourses: 0,
  requiredCoreCourses: [
    {
      courseName: "Object Oriented Software Engineering",
      coursePrefix: "SE",
      courseNumber: "6329",
    },
    {
      courseName: "Advanced Requirements Engineering",
      coursePrefix: "SE",
      courseNumber: "6361",
    },
    {
      courseName: "Adv Software Archtctr & Design",
      coursePrefix: "SE",
      courseNumber: "6362",
    },
    {
      courseName: "Software Testing, Validation, Verification",
      coursePrefix: "SE",
      courseNumber: "6367",
    },
    {
      courseName: "Advanced Software Engineering Project",
      coursePrefix: "SE",
      courseNumber: "6387",
    },
  ],
  additionalCoreChoices: [],
  requiredElectiveHours: 15,
  requiredElectiveGPA: 3.0,
};