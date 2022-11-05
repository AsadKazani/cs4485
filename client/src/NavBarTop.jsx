import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './logo.png';

function NavBarTop() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            UTD ECS Graduate Student Advising
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBarTop;