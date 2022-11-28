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
        this.meetsCoreGPARequirement = true;
    }
}
const audit = (transcript, track) => {
    const trackRequirements = getTrackRequirements(track);
    const terms = transcript.student.terms;
    const coreCourseMapping = createCourseMapping(terms, trackRequirements.requiredCoreCourses);
    const additionalCoreCourseMapping = createCourseMapping(terms, trackRequirements.additionalCoreChoices);
    const coreGPAInfo = calculateGPA(coreCourseMapping, terms, trackRequirements);
    const additionalGPAInfo = calculateGPA(additionalCoreCourseMapping, terms, trackRequirements);
    const nonCoreCourses = retrieveElectiveGPA(terms, coreCourseMapping, additionalCoreCourseMapping, trackRequirements);
    coreGPAInfo.factoredCourses.sort(descendingCourseGPAComparator);
    additionalGPAInfo.factoredCourses.sort(descendingCourseGPAComparator);
    nonCoreCourses.factoredCourses.sort(descendingCourseGPAComparator);
    const incompleteRequirements = {
        requiredIncompleteCoreCourses: [],
        requiredIncompleteElectiveCourses: []
    };
    const audit = {
        coreGPAInfo: coreGPAInfo,
        additionalCoreGPAInfo: additionalGPAInfo,
        electiveGPAInfo: nonCoreCourses,
        track: trackRequirements,
        outstandingRequirements: incompleteRequirements
    };
    aggregateAuditInfo(trackRequirements, audit);
    computeOutstandingRequirements(audit);
    return audit;
};
exports.audit = audit;
const computeOutstandingRequirements = (audit) => {
    const { requiredCoreCourses } = audit.track;
    const { coreGPAInfo, electiveGPAInfo, outstandingRequirements } = audit;
    const requiredCoursesSet = new Set();
    requiredCoreCourses.forEach(course => requiredCoursesSet.add(`${course.coursePrefix} ${course.courseNumber}`));
    const allCores = coreGPAInfo.factoredCourses.concat(coreGPAInfo.inProgressCourses);
    const takenCoreCourseNames = [];
    allCores.forEach(course => takenCoreCourseNames.push(`${course.coursePrefix} ${course.courseNumber}`));
    for (let i = 0; i < takenCoreCourseNames.length; i++) {
        const courseName = takenCoreCourseNames[i];
        if (requiredCoursesSet.has(courseName)) {
            requiredCoursesSet.delete(courseName);
            delete takenCoreCourseNames[i];
        }
    }
    const additionalCoreRequirementCourseNames = takenCoreCourseNames.flat();
    const incompleteAdditionalCoreRequirements = [];
    for (let i = 0; i < additionalCoreRequirementCourseNames.length; i++) {
        for (let j = 0; j < allCores.length; j++) {
            const course = allCores[j];
            const cName = `${course.coursePrefix} ${course.courseNumber}`;
            if (cName === additionalCoreRequirementCourseNames[i]) {
                incompleteAdditionalCoreRequirements.push(allCores[j]);
                break;
            }
        }
    }
    outstandingRequirements.requiredIncompleteCoreCourses = incompleteAdditionalCoreRequirements;
};
const aggregateAuditInfo = (track, audit) => {
    let needed_courses = track.numberRequiredAdditionalCoreCourses;
    const { coreGPAInfo, additionalCoreGPAInfo, electiveGPAInfo } = audit;
    const { factoredCourses: coreCourses } = coreGPAInfo;
    const { factoredCourses: extraCore } = additionalCoreGPAInfo;
    const { factoredCourses: electiveCourses } = electiveGPAInfo;
    while (extraCore.length && needed_courses) {
        coreCourses.push(extraCore[extraCore.length - 1]);
        needed_courses--;
        extraCore.pop();
    }
    extraCore.forEach(course => electiveCourses.push(course));
    electiveCourses.sort(descendingCourseGPAComparator);
    coreCourses.forEach(course => {
        coreGPAInfo.attemptedPoints += course.attemptedPoints;
        coreGPAInfo.totalPoints += course.points;
    });
    coreGPAInfo.gpa = coreGPAInfo.totalPoints / coreGPAInfo.attemptedPoints;
    coreGPAInfo.meetsCoreGPARequirement = coreGPAInfo.gpa >= track.requiredCoreGPA;
    electiveCourses.forEach(course => {
        electiveGPAInfo.attemptedPoints += course.attemptedPoints;
        electiveGPAInfo.totalPoints += course.points;
    });
    electiveGPAInfo.gpa = electiveGPAInfo.totalPoints / electiveGPAInfo.attemptedPoints;
    electiveGPAInfo.meetsCoreGPARequirement = electiveGPAInfo.gpa >= track.requiredElectiveGPA;
};
const descendingCourseGPAComparator = (a, b) => {
    return a.points >= b.points ? -1 : 1;
};
const retrieveElectiveGPA = (terms, coreMapping, additionalCoreMapping, track) => {
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
            }
        }
    });
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
const calculateGPA = (mapping, terms, track) => {
    const courseGPAInfo = new GPAInfo();
    courseGPAInfo.numberCourses = mapping.length;
    for (let i = 0; i < mapping.length; i++) {
        const value = mapping[i];
        if (terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]].grade == "IP") {
            courseGPAInfo.inProgressCourses.push(terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]]);
            continue;
        }
        courseGPAInfo.factoredCourses.push(terms[value.takenCourseIdxs[0]].courses[value.takenCourseIdxs[1]]);
    }
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