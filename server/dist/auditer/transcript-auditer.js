"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = void 0;
const data_science_1 = require("../tracks/data-science");
const audit = (transcript, track) => {
    const trackRequirements = getTrackRequirements(track);
    const terms = transcript.student.terms;
    const coreCourseMapping = createCourseMapping(terms, trackRequirements.requiredCoreCourses);
    const additionalCoreCourseMapping = createCourseMapping(terms, trackRequirements.additionalCoreChoices);
    console.log(additionalCoreCourseMapping);
    console.log(terms[additionalCoreCourseMapping[0].takenCourseIdxs[0]].courses[additionalCoreCourseMapping[0].takenCourseIdxs[1]]);
    const coreGPA = calculateGPA(coreCourseMapping, terms);
    console.log("Core GPA is", coreGPA);
};
exports.audit = audit;
const createCourseMapping = (terms, trackCourses) => {
    const coreCourseMapping = [];
    for (let i = 0; i < terms.length; i++) {
        const courses = terms[i].courses;
        for (let j = 0; j < courses.length; j++) {
            const courseNum = courses[j].courseNumber;
            const coursePrefix = courses[j].coursePrefix;
            for (let k = 0; k < trackCourses.length; k++) {
                const requiredCore = trackCourses[k];
                if (requiredCore.courseNumber == courseNum &&
                    requiredCore.coursePrefix == coursePrefix) {
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
const calculateGPA = (mapping, terms) => {
    let sum = 0.0;
    let hours = 0.0;
    for (let i = 0; i < mapping.length; i++) {
        const value = mapping[i];
        if (terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].grade ==
            "IP")
            continue;
        sum +=
            terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].points;
        hours +=
            terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]]
                .attemptedPoints;
    }
    return sum / hours;
};
const getTrackRequirements = (track) => {
    switch (track) {
        case "Networks and Telecommunications":
            return data_science_1.dataScienceRequirements;
        case "Intelligent Systems":
            return data_science_1.dataScienceRequirements;
        case "Interactive Computing":
            return data_science_1.dataScienceRequirements;
        case "Systems":
            return data_science_1.dataScienceRequirements;
        case "Data Science":
            return data_science_1.dataScienceRequirements;
        case "Cyber Security":
            return data_science_1.dataScienceRequirements;
        default:
            return data_science_1.dataScienceRequirements;
    }
};
//# sourceMappingURL=transcript-auditer.js.map