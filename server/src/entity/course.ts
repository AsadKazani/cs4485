export default class Course{
    coursePrefix: string; 
    courseNumber: string; 
    courseName: string
    attemptedPoints?: number; 
    earnedPoints?: number; 
    grade?: string; 
    points?: number

    getFullCourseNumber?(): string{
        return this.coursePrefix + " " + this.courseNumber
    }
}