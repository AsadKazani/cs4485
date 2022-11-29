import Accordion from "react-bootstrap/Accordion";
import "./transcript.css";

const Requirements = ({header, content})=>{

  return <div className="acc">
  <Accordion defaultActiveKey="0" className="accord">
  <Accordion.Item eventKey="1">
    <Accordion.Header>
      {header}
    </Accordion.Header>
    <Accordion.Body>{content}</Accordion.Body>
  </Accordion.Item>
</Accordion>
  </div>


}


export default Requirements; 