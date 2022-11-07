import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import "./App.css";
import { Buffer } from "buffer";
import Transcript from "./components/transcript";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;


function App() {
  const [text, setText] = useState(null);
  const [transcript, setTranscript] = useState(null)

  const handleResetClick = ()=>{
    setText(null)
    setTranscript(null)
  }

  let handleFile = async (e) => {
    const content = e.target.result;
    const res = await axios.post("http://localhost:5000", {text: content})
    setTranscript(res.data)
    setText(content);
  };

  let handleChangeFile = (file) => {
    let fileData = new FileReader();
    fileData.onloadend = handleFile;
    fileData.readAsText(file);
  };

  if(!text) {return (
    <div className="App">
      <form>
        <h1>Transcript Upload</h1>
        <span>
        <Form.Group controlId="formFileLg" className="mb-3">
          <h2>Transcript Upload</h2>
          <br></br>
          <Form.Control type="file" size="lg" onChange={e => 
            handleChangeFile(e.target.files[0])}/>
        </Form.Group>
        <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Track
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Data Science</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Something else</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

        </span>
      </form>
    </div>
  );
  }
  return (<div>
    <Transcript transcript={transcript} />
    <br/>
    <Button onClick={handleResetClick} variant="outline-primary">Upload New File</Button>{' '}
    </div>)
}

export default App;
