"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = void 0;
const data_science_1 = require("../tracks/data-science");
class GPAInfo {
    constructor() {
        this.gpa = 0.0;
        this.totalPoints = 0.0;
        this.attemptedPoints = 0.0;
        this.inProgressCourses = [];
        this.factoredCourses = [];
        this.numberCourses = 0;
    }
}
const audit = (transcript, track) => {
    const trackRequirements = getTrackRequirements(track);
    const terms = transcript.student.terms;
    const coreCourseMapping = createCourseMapping(terms, trackRequirements.requiredCoreCourses);
    const additionalCoreCourseMapping = createCourseMapping(terms, trackRequirements.additionalCoreChoices);
    const coreGPAInfo = calculateGPA(coreCourseMapping, terms);
    const additionalGPAInfo = calculateGPA(additionalCoreCourseMapping, terms);
    const nonCoreCourses = retrieveElectiveGPA(terms, coreCourseMapping, additionalCoreCourseMapping);
    const audit = {
        coreGPAInfo: coreGPAInfo,
        additionalCoreGPAInfo: additionalGPAInfo,
        electiveGPAInfo: nonCoreCourses
    };
    return audit;
};
exports.audit = audit;
const retrieveElectiveGPA = (terms, coreMapping, additionalCoreMapping) => {
    const nonCoreCourses = retrieveNonCoreCourses(terms, coreMapping, additionalCoreMapping);
    const electiveGPAInfo = new GPAInfo();
    nonCoreCourses.forEach((course) => {
        if (course.coursePrefix == 'CS' && course.courseNumber[0] == '6') {
            electiveGPAInfo.numberCourses++;
            if (course.grade == "IP") {
                electiveGPAInfo.inProgressCourses.push(course);
            }
            else {
                electiveGPAInfo.factoredCourses.push(course);
                electiveGPAInfo.attemptedPoints += course.attemptedPoints;
                electiveGPAInfo.totalPoints += course.points;
            }
        }
    });
    electiveGPAInfo.gpa = electiveGPAInfo.totalPoints / electiveGPAInfo.attemptedPoints;
    return electiveGPAInfo;
};
const retrieveNonCoreCourses = (terms, coreMapping, additionalCoreMapping) => {
    let mapping = [];
    for (let i = 0; i < terms.length; i++) {
        mapping.push([...terms[i].courses]);
    }
    for (let i = 0; i < coreMapping.length; i++) {
        delete mapping[coreMapping[i].takenCourseIdxs[0]][coreMapping[i].takenCourseIdxs[1]];
    }
    for (let i = 0; i < additionalCoreMapping.length; i++) {
        delete mapping[additionalCoreMapping[i].takenCourseIdxs[0]][additionalCoreMapping[i].takenCourseIdxs[1]];
    }
    const flattenedMapping = mapping.flat();
    return flattenedMapping;
};
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
    const courseGPAInfo = new GPAInfo();
    courseGPAInfo.numberCourses = mapping.length;
    for (let i = 0; i < mapping.length; i++) {
        const value = mapping[i];
        if (terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].grade == "IP") {
            courseGPAInfo.inProgressCourses.push(terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]]);
            continue;
        }
        courseGPAInfo.factoredCourses.push(terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]]);
        courseGPAInfo.totalPoints += terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].points;
        courseGPAInfo.attemptedPoints += terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].attemptedPoints;
    }
    courseGPAInfo.gpa = courseGPAInfo.totalPoints / courseGPAInfo.attemptedPoints;
    return courseGPAInfo;
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