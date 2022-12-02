
import { writeFile } from 'fs/promises'
import { PDFDocument } from 'pdf-lib';
import fetch from 'cross-fetch';
import { DegreeAudit } from './index';
import Course from './entity/course';
import { FieldsMapping } from './pdf-mapping/pdf-mapping';
import Transcript from './entity/transcript';
import { dataScienceMapping } from './pdf-mapping/data-science';
import { PDFFieldMapping } from './pdf-mapping/pdf-mapping';
import { networkAndTelecomMapping } from './pdf-mapping/networks-telecom';
import { intelligentSystemMapping } from './pdf-mapping/intelligent-systems';
import { interactiveComputingMapping } from './pdf-mapping/interactive-computing';
import { systemMapping } from './pdf-mapping/system';
import { cyberSecurityMapping } from './pdf-mapping/cyber-security';
import { traditionCSMapping } from './pdf-mapping/traditional-cs';



async function createPDF(track: string, output: string, degreeAudit: DegreeAudit){
    try{

        const formUrl = getTrackPDFURL(track);
        const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())

        const pdfDoc = await PDFDocument.load(formPdfBytes);

        const fields = pdfDoc.getForm().getFields().map((f, i) => f.getName());
        const fields2 = pdfDoc.getForm().getFields().map((f, i) => `Field#${i} -->${f.getName()}`);
        await writeFile('testing.txt', fields2.join('\n'))
        const form = pdfDoc.getForm();
        if(track == "Cyber Security"){
          form.getTextField('NameOfStudent').setText(degreeAudit.transcript.student.name);
          form.getTextField('StudentID').setText(degreeAudit.transcript.student.id)
        }else{
          form.getTextField('Name of Student').setText(degreeAudit.transcript.student.name);
          form.getTextField('Student ID Number').setText(degreeAudit.transcript.student.id)
        }
        
        const fc = degreeAudit.audit.coreGPAInfo.factoredCourses.concat(degreeAudit.audit.coreGPAInfo.inProgressCourses).concat(degreeAudit.audit.additionalCoreGPAInfo.factoredCourses)
        const pdfFieldsMappingObj = getPDFFieldsMapping(track)
        const coreIDXs = pdfFieldsMappingObj.coreMapping
        const electiveIdxs = pdfFieldsMappingObj.electiveMapping
        for(let i = 0; i < fc.length; i++){
          const mappingIdx = getCoreIdx(fc[i], coreIDXs)
          if(mappingIdx == -1) continue
          const info = coreIDXs[mappingIdx]
          const term = getTerm(degreeAudit.transcript, fc[i])
          form.getTextField(fields[info.idxs[0]]).setText(term?.name.startsWith("Transfer")?`${term?.name.substring(14)} ${term?.year}`: `${term?.name} ${term?.year}`)
          form.getTextField(fields[info.idxs[1]]).setText(term?.name.startsWith("Transfer")? "F/T" : "")
          form.getTextField(fields[info.idxs[2]]).setText(fc[i].grade)
        }        

        const ec = degreeAudit.audit.electiveGPAInfo.factoredCourses.concat(degreeAudit.audit.electiveGPAInfo.inProgressCourses)

        const dupElectiveIdxs = electiveIdxs.concat([]) 
        let i = 0
        let j=0
        while(i < dupElectiveIdxs.length && j < ec.length){
          const mIdxs = dupElectiveIdxs[i++]
          const course = ec[j++]
          const term = getTerm(degreeAudit.transcript,course)
          form.getTextField(fields[mIdxs[0]]).setText(course.courseName)
          form.getTextField(fields[mIdxs[1]]).setText(`${course.coursePrefix} ${course.courseNumber}`)
          form.getTextField(fields[mIdxs[2]]).setText(term.name.startsWith("Transfer")?`${term?.name.substring(14)} ${term?.year}`: `${term?.name} ${term?.year}`)
          form.getTextField(fields[mIdxs[3]]).setText(term.name.startsWith("Transfer")? "F/T" : "")
          form.getTextField(fields[mIdxs[4]]).setText(course.grade)
        }
        

        const pdfBytes = await pdfDoc.save();
        
        await writeFile(output, pdfBytes);
    } catch (err) {
    }

}

const getTerm = (transcript: Transcript, course: Course)=>{
  for(let i = 0; i < transcript.student.terms.length; i++){
    for(let j = 0; j < transcript.student.terms[i].courses.length; j++){
      const c = transcript.student.terms[i].courses[j]
      if(c.coursePrefix == course.coursePrefix && c.courseNumber == course.courseNumber){
        return transcript.student.terms[i]
      }
    }
  }
  return transcript.student.terms[0]
}

const getCoreIdx = (course: Course, coreIDXs: FieldsMapping[]) =>{
  const currentName = `${course.coursePrefix} ${course.courseNumber}`
  for(let i = 0; i < coreIDXs.length; i++){
    if(coreIDXs[i].name == currentName){
      return i
    }
  }
  return -1
}

const getTrackPDFURL = (track: string): string => {
    switch (track) {
      case "Networks and Telecommunications":
        return 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Networks-Telecommunication.pdf';
      case "Intelligent Systems":
        return 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Intelligent-Systems.pdf';
      case "Interactive Computing":
        return 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Interactive-Computing.pdf';
      case "Systems":
        return 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Systems.pdf';
      case "Data Science":
        return 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Data-Science.pdf';
      case "Cyber Security":
        return 'https://cs.utdallas.edu/wp-content/uploads/2022/05/Cyber-Security.pdf';
      default:
        return "https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Traditional.pdf"; // Traditional computer science
    }
}

const getPDFFieldsMapping = (track: string): PDFFieldMapping => {
  switch (track) {
    case "Networks and Telecommunications":
      return networkAndTelecomMapping;
    case "Intelligent Systems":
      return intelligentSystemMapping;
    case "Interactive Computing":
      return interactiveComputingMapping;
    case "Systems":
      return systemMapping;
    case "Data Science":
      return dataScienceMapping
    case "Cyber Security":
      return cyberSecurityMapping;
    default:
      return traditionCSMapping; // Traditional computer science
  }
}
export default createPDF;