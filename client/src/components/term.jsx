import Badge from 'react-bootstrap/Badge';

function Term(props){
    return <div>
        <Badge bg="primary">{props.name} {props.year}</Badge>{' '}
    </div>
}

export default Term