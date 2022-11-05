import React, { useState } from 'react';
import './App.css';
import { Buffer } from "buffer";
import Form from 'react-bootstrap/Form';
Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {
  const [text, setText] = useState(0);

  let handleFile = (e) => {
    const content = e.target.result;
    console.log('file content',  content)
    console.log(typeof(content))
    setText(content);
  }
  
  let handleChangeFile = (file) => {
    let fileData = new FileReader();
    fileData.onloadend = handleFile;
    fileData.readAsText(file);
  }
  
  return (
    <div className="App">
        <Form.Group controlId="formFileLg" className="mb-3">
          <h2>Transcript Upload</h2>
          <br></br>
          <Form.Control type="file" size="lg" onChange={e => 
            handleChangeFile(e.target.files[0])}/>
        </Form.Group>
    </div>

  );
}

export default App;
