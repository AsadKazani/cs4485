import Course from "./course"
import Term from "./term"
import Badge from 'react-bootstrap/Badge';
import './transcript.css'


function Transcript(props){

    const array = props.transcript.student.terms.map((value, idx)=>{
        const c = value.courses.map((v, idx)=>{
            return <div className="bdn"><Course info = {v}/></div>
        })
        return <div key={idx}>
            <Term name={value.name} year={value.year}/>
            {c}
            </div> 
    })
    return <div className="transcript">
        <h1>
        <Badge bg="secondary">Student: {props.transcript.student.name}</Badge>
        <br />
        <Badge bg="secondary">Id: {props.transcript.student.id}</Badge>
      </h1>
        {array}
    </div>
}

export default Transcript