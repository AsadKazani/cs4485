import { DegreeAudit,  } from './index';
const { writeFile } = require('fs/promises');
const { PDFDocument } = require('pdf-lib');
import fetch from 'cross-fetch';
import Course from './entity/course';
import Transcript from './entity/transcript';
import Term from './entity/term';
import e from 'express';
const fs = require('fs')

async function createPDF(track: string, output: string, degreeAudit: DegreeAudit){



    
    try{

        let formUrl = "";
        
        if (track == "Traditional Computer Science"){
            formUrl = 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Traditional.pdf';
        }
        if (track == "Data Science"){
            formUrl = "https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Data-Science.pdf";
        }
        if (track == "Cyber Security"){
            formUrl ="https://cs.utdallas.edu/wp-content/uploads/2022/05/Cyber-Security.pdf";
        }
        if (track == "Networks and Telecommunications"){
            formUrl ="https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Networks-Telecommunication.pdf";
        }
        if (track == "Intelligent Systems"){
            formUrl ="https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Intelligent-Systems.pdf";
        }
        if (track == "Interactive Computing"){
            formUrl ="https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Interactive-Computing.pdf";
        }
        if (track == "Systems"){
            formUrl ="https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Systems.pdf";
        }

        const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(formPdfBytes);

        const fields = pdfDoc.getForm().getFields().map((f: any) => f.getName());
        console.log({ fields });

        fs.writeFile('./fields.txt', fields.join("\n"), (err: any) => {
          
            if (err) throw err;
        })
        const form = pdfDoc.getForm();
        if (track == "Data Science"){
            form.getTextField('Name of Student').setText(degreeAudit.transcript.student.name);
            form.getTextField('Student ID Number').setText(degreeAudit.transcript.student.id);
            form.getTextField('Semester Admitted to Program').setText(degreeAudit.transcript.student.terms[0].year + degreeAudit.transcript.student.terms[0].name);
            console.log(degreeAudit.transcript.student.terms[0].year);

            for(let i = 0; i < degreeAudit.audit.coreGPAInfo.factoredCourses.length; i++){
                
                if(degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6313"){
                    form.getTextField('CS 6313.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade)
                }
                if(degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6350"){
                    form.getTextField('CS 6350.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade)
                }
                if(degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6363"){
                    form.getTextField('CS 6363.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade)
                }
                if(degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6375"){
                    form.getTextField('CS 6375.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade)
                }
                if(degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6301"){
                    form.getTextField('CS 6301.0.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade)
                }
                if(degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6320"){
                    form.getTextField('CS 6320.0.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade)
                }
                if(degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6327"){
                    form.getTextField('CS 6327.0.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade)
                }
                if(degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6347"){
                    form.getTextField('CS 6347.0.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade)
                }
                if(degreeAudit.audit.coreGPAInfo.factoredCourses[i].courseNumber == "6360"){
                    const term: Term = getTerm(degreeAudit.audit.coreGPAInfo.factoredCourses[i], degreeAudit)
                    if(term.name.startsWith("Transfer") && term.name.includes('Spring')){
                        form.getTextField('CS 6360.0.0').setText(`${term.year.substring(2)}U`)
                    }else{

                    }
                    form.getTextField('CS 6360.0.2').setText(degreeAudit.audit.coreGPAInfo.factoredCourses[i].grade)
                }
                
                 /*if(degreeAudit.audit.electiveGPAInfo.factoredCourses[i].courseNumber == "5303"){
                    form.getTextField('UTD Admission Prerequisites Course Semester Waiver GradeRow7_3.0').setText("1")
                }
                if(degreeAudit.audit..factoredCourses[i].courseNumber == "5330"){
                    form.getTextField('UTD Admission Prerequisites Course Semester Waiver GradeRow7_3.0').setText("1")
                }
                if(degreeAudit.audit..factoredCourses[i].courseNumber == "5333"){
                    form.getTextField('UTD Admission Prerequisites Course Semester Waiver GradeRow7_3.0').setText("1")
                }
                if(degreeAudit.audit..factoredCourses[i].courseNumber == "5343"){
                    form.getTextField('UTD Admission Prerequisites Course Semester Waiver GradeRow7_3.0').setText("1")
                }
                if(degreeAudit.audit..factoredCourses[i].courseNumber == "5348"){
                    form.getTextField('UTD Admission Prerequisites Course Semester Waiver GradeRow7_3.0').setText("1")
                }
                if(degreeAudit.audit..factoredCourses[i].courseNumber == "3341"){
                    form.getTextField('UTD Admission Prerequisites Course Semester Waiver GradeRow7_3.0').setText("1")
                } */
            }

            let classVals = ["CS 6327.1.0.0.0",
                    "CS 6327.1.0.0.1",
                    "CS 6327.1.0.0.2",
                    "CS 6327.1.0.0.3",
                    "CS 6327.1.0.0.4",
                    "CS 6327.1.0.0.5",
                    "CS 6327.1.0.0.6",
                    "CS 6327.1.0.0.7",]

            let col1 = ['CS 6327.1.0.1', 'CS 6347.1.0','CS 6360.1.0', 'CS 6301.2.0','CS 6320.2.2']
            let col2 = ['CS 6327.1.1','CS 6347.1.1','CS 6360.1.1','CS 6301.2.1','CS 6320.2.1']
            let col3 =['CS 6327.1.2','CS 6347.1.2','CS 6360.1.2','CS 6301.2.2','CS 6320.2.2']


            for(let i = 0; i < degreeAudit.audit.electiveGPAInfo.factoredCourses.length; i++){
                
                form.getTextField((i+1).toString()).setText(degreeAudit.audit.electiveGPAInfo.factoredCourses[i].courseName);
                form.getTextField(classVals[i]).setText(degreeAudit.audit.electiveGPAInfo.factoredCourses[i].coursePrefix + " " + degreeAudit.audit.electiveGPAInfo.factoredCourses[i].courseNumber);
                form.getTextField(col3[i]).setText(degreeAudit.audit.electiveGPAInfo.factoredCourses[i].grade);
                 /*
                form.getTextField('CS 6301.2.0').setText("test1"); //4
                form.getTextField('CS 6301.2.1').setText("test2");
                form.getTextField('CS 6301.2.2').setText("test3");
                
                form.getTextField('CS 6360.1.0').setText("test1"); //3
                form.getTextField('CS 6360.1.1').setText("test2");
                form.getTextField('CS 6360.1.2').setText("test3");
                
                form.getTextField('CS 6320.2.0').setText("test1"); //5
                form.getTextField('CS 6320.2.1').setText("test2");
                form.getTextField('CS 6320.2.2').setText("test3");
                
                form.getTextField('CS 6327.1.0.1').setText("test1"); //1
                form.getTextField('CS 6327.1.1').setText("test2");
                form.getTextField('CS 6327.1.2').setText("test3");
                
                form.getTextField('CS 6347.1.0').setText("test1"); //2
                form.getTextField('CS 6347.1.1').setText("test2");
                form.getTextField('CS 6347.1.2').setText("test3");*/
    
            }

            console.log(degreeAudit.audit.electiveGPAInfo.factoredCourses);
            
        }
        

        const pdfBytes = await pdfDoc.save();
        
        await writeFile(output, pdfBytes);
        console.log("pdf created");
        console.log(track);

    } catch (err) {
        console.log(err)
    }

}

const getTerm = (course: Course, degreeAudit: DegreeAudit): Term=>{
    const transcript = degreeAudit.transcript
    const terms = transcript.student.terms
    for(let i = 0; i < terms.length; i++){
        const term = terms[i]
        const courses = term.courses
        for(let j=0; j < courses.length; j++){
            const curr = courses[j]
            if(curr.courseName == course.courseName && curr.coursePrefix == course.coursePrefix) return term
        }
    }

    return terms[0]
}

export default createPDF;