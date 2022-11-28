const Audit = ({audit, transcript, track})=>{
  const {coreGPAInfo, electiveGPAInfo} = audit
  const combinedGPA = (coreGPAInfo.gpa + electiveGPAInfo.gpa)/ 2
  const coreCourseNames = []
  coreGPAInfo.factoredCourses.forEach(course=> coreCourseNames.push(`${course.coursePrefix} ${course.courseNumber}`))
  const electiveCourseNames = []
  electiveGPAInfo.factoredCourses.forEach(course=> electiveCourseNames.push(`${course.coursePrefix} ${course.courseNumber}`))
  
  return (
    <div>
      <p>Name: {transcript.student.name}</p>
      <p>ID: {transcript.student.id}</p>
      <p>Plan: Master</p>
      <p>Major: Computer Science</p>
      <p>Track: {track} </p>
      <p>Core GPA: {coreGPAInfo.gpa}</p>
      <p>Elective GPA: {electiveGPAInfo.gpa}</p>
      <p>Combined GPA: {combinedGPA}</p>
      <p>Core Courses: {coreCourseNames.join()}</p>
      <p>Elective Courses: {electiveCourseNames.join()}</p>
    </div>
  )
}

export default Audit;