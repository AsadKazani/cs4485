import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";

import "./course.css";
function Course(props) {
  return (
    /*<Card style={{ width: "30rem" }}>
      <Card.Header>{props.info.courseName}</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          {props.info.coursePrefix + " " + props.info.courseNumber}
        </ListGroup.Item>
        <ListGroup.Item>{props.info.grade}</ListGroup.Item>
      </ListGroup>
    </Card>*/
    <div className="table-width">
      <Table striped bordered hover variant="dark">
        <tbody className="table-body">
          <tr>
            <td className="table-class">{props.info.courseName}</td>
            <td className="table-prefix">
              {props.info.coursePrefix + " " + props.info.courseNumber}
            </td>
            <td className="table-grade">{props.info.grade}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default Course;
