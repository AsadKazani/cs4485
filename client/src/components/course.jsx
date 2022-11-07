import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
function Course(props){
    return <Card style={{ width: '18rem' }}>
    <Card.Header>{props.info.courseName}</Card.Header>
    <ListGroup variant="flush">
      <ListGroup.Item>{props.info.coursePrefix + " " + props.info.courseNumber}</ListGroup.Item>
      <ListGroup.Item>{props.info.grade}</ListGroup.Item>
    </ListGroup>
  </Card>
    
}



export default Course