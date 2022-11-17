import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.css";
import logo from "./logo.png";
import "./App.css";
function NavBarTop() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <div className="nav">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            UTD ECS Graduate Student Advising
          </Navbar.Brand>
        </div>
      </Navbar>
    </>
  );
}

export default NavBarTop;
