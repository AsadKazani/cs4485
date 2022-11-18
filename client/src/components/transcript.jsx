import Course from "./course";
import Term from "./term";
import Badge from "react-bootstrap/Badge";
import "./transcript.css";
import Accordion from "react-bootstrap/Accordion";
import "./transcript.css";

function Transcript(props) {
  const array = props.transcript.student.terms.map((value, idx) => {
    const c = value.courses.map((v, idx) => {
      return (
        <div className="bdn">
          <Course info={v} />
        </div>
      );
    });
    return (
      <div key={idx}>
        <div className="acc">
          <Accordion defaultActiveKey="0" className="accord">
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                {value.name} {value.year}
              </Accordion.Header>
              <Accordion.Body>{c}</Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    );
  });
  return (
    <>
      <div className="transcript">
        <h1>
          <Badge bg="dark">Student: {props.transcript.student.name}</Badge>
          <br />
          <Badge bg="dark">Id: {props.transcript.student.id}</Badge>
        </h1>
        {array}
      </div>
    </>
  );
}

export default Transcript;
