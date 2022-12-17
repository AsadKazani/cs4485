import Course from "./course"
import Requirements from "./requirements";
import "./transcript.css";

const Audit = ({audit, transcript, track})=>{
  const {coreGPAInfo, electiveGPAInfo, outstandingRequirements, track: trackReq} = audit
  console.log('yabdadba', outstandingRequirements)
  const combinedGPA = (coreGPAInfo.gpa + electiveGPAInfo.gpa)/ 2
  const coreCourseNames = []
  coreGPAInfo.factoredCourses.forEach(course=> coreCourseNames.push(`${course.coursePrefix} ${course.courseNumber}`))
  const electiveCourseNames = []
  electiveGPAInfo.factoredCourses.forEach(course=> electiveCourseNames.push(`${course.coursePrefix} ${course.courseNumber}`))
  const remainingAdditionalCoreNum = outstandingRequirements.remainingAdditionalCoreClasses


  const nameTokens = transcript.student.name.split(" ")
  

  const numElectivesNeededToTake =  (trackReq.requiredElectiveHours /3) - (electiveGPAInfo.factoredCourses.length + electiveGPAInfo.inProgressCourses.length) 


  const offeredAdditionalCores = trackReq.additionalCoreChoices.map(course=> `${course.coursePrefix} ${course.courseNumber}`)

  const totCoreCourses = coreGPAInfo.factoredCourses.concat(coreGPAInfo.inProgressCourses)

  const totCoreCourseNames = totCoreCourses.map(course=> `${course.coursePrefix} ${course.courseNumber}`)

  const takenCoreCourseNamesSet = new Set(totCoreCourseNames)

  const untakenOfferedAdditionalCoresNames = offeredAdditionalCores.filter(name=> !takenCoreCourseNamesSet.has(name))

  const untakenOfferedAdditionalCoresCourses = []

  for(let i = 0; i < untakenOfferedAdditionalCoresNames.length; i++){
    for(let j = 0; j < offeredAdditionalCores.length; j++){
      if(untakenOfferedAdditionalCoresNames[i] === offeredAdditionalCores[j]){
        untakenOfferedAdditionalCoresCourses.push(trackReq.additionalCoreChoices[j])
      }
    }
  }


  const untakenOfferedAdditionalCoresCoursesJSX = untakenOfferedAdditionalCoresCourses.map((course, idx)=> <Course key={idx} info={course}/>)

  const notTakenCores = outstandingRequirements.requiredIncompleteCoreCourses.filter(course=>!course.grade)

  const inProgressCores = outstandingRequirements.requiredIncompleteCoreCourses.filter(course=>course.grade)

  const notTakenCoresJSX = notTakenCores.map((course, idx)=> <Course key={idx} info={course}/>)

  const inProgressCoresJSX = inProgressCores.map((course, idx)=> <Course key={idx} info={course}/>)


  const inProgressElectivesJSX = outstandingRequirements.requiredIncompleteElectiveCourses.map((course, idx)=> <Course key={idx} info={course}/>)

const gpaInfo = [
  <p key = 'core'>Core GPA: {coreGPAInfo.gpa}</p>,
  <p key = 'elec'>Elective GPA: {electiveGPAInfo.gpa}</p>,
  <p key = 'comb'>Combined GPA: {combinedGPA}</p>
]

const studentInfo = [
  <p key ="name">Name: {transcript.student.name}</p>,
  <p key="id">ID: {transcript.student.id}</p>,
  <p key="plan">Plan: Master</p>,
  <p key="major">Major: Computer Science</p>,
  <p key="track">Track: {track} </p>
]

const completeCoreInfo = coreGPAInfo.factoredCourses.map((course, idx)=><Course key={idx} info={course}/>)

const completedElectiveInfo = electiveGPAInfo.factoredCourses.map((course, idx) => <Course key={idx} info={course}/>)


  return (
    <div>
      <Requirements header={'Student Info'} content={studentInfo}/>
      <Requirements header={'GPA Info'} content={gpaInfo}/>
      <Requirements header={'Completed Core Courses'}  content={completeCoreInfo}/>
      <Requirements header={'Completed Elective Courses'} content={completedElectiveInfo} /> 
      <div>
        <br></br>
        <h1>Oustanding Requirements</h1>
        {remainingAdditionalCoreNum > 0? <p>Required to Take one of the following as additional Core: {offeredAdditionalCores}</p> : ""}
        {notTakenCores.length > 0 ? <Requirements header={`${nameTokens[0]} Has To Take The Following Required Cores`} content={notTakenCoresJSX}/> : ""}
        {inProgressCoresJSX.length > 0 ? <Requirements header={`${nameTokens[0]} Needs to Pass The Following In Progress Core Courses`} content={inProgressCoresJSX}/> : ""}
        {inProgressElectivesJSX.length > 0? <Requirements header={`${nameTokens[0]} Needs to Pass The Following In Progress Elective Courses`} content={inProgressElectivesJSX}/> : ""}
        {remainingAdditionalCoreNum <= 0 ? "" : <Requirements header={`${nameTokens[0]} Needs to Take ${remainingAdditionalCoreNum} Courses Chosen From Below`} content={untakenOfferedAdditionalCoresCoursesJSX}/>}
        {/* {numElectivesNeededToTake ? <div className="acc">{nameTokens[0]} Still Needs To Take {numElectivesNeededToTake} Elective Courses</div> : ""} */}
        {outstandingRequirements.requiredCoreGPA !== -1? <Requirements header={`To Maintain a ${audit.track.requiredCoreGPA} ${nameTokens[0]} must maintain a GPA of ${outstandingRequirements.requiredCoreGPA} in the remaining Core Classes`}/> : ""}
        {outstandingRequirements.requiredElectiveGPA !== -1? <Requirements header={`To Maintain a ${audit.track.requiredCoreGPA} ${nameTokens[0]} must maintain a GPA of ${outstandingRequirements.requiredElectiveGPA} in the remaining Elective Classes`}/> : ""}
        {outstandingRequirements.requiredCoreLetterGrade.length?  <Requirements header={`To Maintain a ${audit.track.requiredCoreGPA} ${nameTokens[0]} must get a Letter Grade of  ${outstandingRequirements.requiredCoreLetterGrade} in the remaining Core Class`}/> : ""}
        {outstandingRequirements.requiredElectiveLetterGrade.length?  <Requirements header={`To Maintain a ${audit.track.requiredCoreGPA} ${nameTokens[0]} must get a Letter Grade of  ${outstandingRequirements.requiredElectiveLetterGrade} in the remaining Core Class`}/> : ""}
        {numElectivesNeededToTake <= 0 ? "": <Requirements header={`${nameTokens[0]} Still Needs To Take ${numElectivesNeededToTake} Elective Courses`} />}
      </div>
    </div>
  )
}

export default Audit;