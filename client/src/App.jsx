import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./App.css";
import { Buffer } from "buffer";
import Transcript from "./components/transcript";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Audit from "./components/audit";

Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {
  const [transcript, setTranscript] = useState(null);
  const [audit, setAudit] = useState(null)
  const [track, setTrack] = useState('Select Track')
  const [showAudit, setShowAudit] = useState(false)

  const handleResetClick = () => {
    setTranscript(null);
    setAudit(null)
    setTrack('Select Track')
    setShowAudit(false)
  };

  let handleFile = async (e) => {
    const content = e.target.result;
    const res = await axios.post("http://localhost:5000/text", { text: content, track: track });
    setTranscript(res.data.transcript);
    setAudit(res.data.audit)
  };

  let handleChangeFile = async (file) => {
    if(track === 'Select Track'){
      alert("Need to Select Track and Then Upload File") 
      return
    }
    const {name} = file 
    const nameTokens = name.split('.')
    const fileType = nameTokens[nameTokens.length -1 ]
    if(fileType == "pdf"){
      const formData = new FormData()
      formData.append("file", file)
      const res = await axios.post("http://localhost:5000/pdf", formData);
      console.log(res.data)
      //TODO: setTranscript and audit 
    }else{
      let fileData = new FileReader();
      fileData.onloadend = handleFile;
      fileData.readAsText(file);
    }
  };

  const handleAudit = async ()=>{
    const res = await axios.get("http://localhost:5000/file");
    console.log(audit)
  }

  if (!transcript) {
    return (
      <div className="App">
        <form>
          <h1>Transcript Upload</h1>
          <span>
            <Form.Group controlId="formFileLg" className="mb-3">
              <br></br>
              <Form.Control
                type="file"
                size="lg"
                onChange={(e) => handleChangeFile(e.target.files[0])}
              />
            </Form.Group>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {track}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick = {()=>setTrack('Networks and Telecommunications')}>Networks and Telecommunications</Dropdown.Item>
                <Dropdown.Item onClick = {()=>setTrack('Intelligent Systems')}>Intelligent Systems</Dropdown.Item>
                <Dropdown.Item onClick = {()=>setTrack('Interactive Computing')}>Interactive Computing</Dropdown.Item>
                <Dropdown.Item onClick = {()=>setTrack('Systems')}>Systems</Dropdown.Item>
                <Dropdown.Item onClick = {()=>setTrack('Data Science')}>Data Science</Dropdown.Item>
                <Dropdown.Item onClick = {()=>setTrack('Cyber Security')}>Cyber Security</Dropdown.Item>
                <Dropdown.Item onClick = {()=>setTrack('Traditional Computer Science')}>Traditional Computer Science</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </span>
        </form>
      </div>
    );
  }

  if(showAudit){
    return <div>
      display audit info
    </div>
  }
  return (
    <div className="audit-info">
      <h1>Transcript Info</h1> 
      <Transcript transcript={transcript} />
      <br />
      <h1>Audit Report</h1>
      <Audit audit={audit} transcript={transcript} track={track}/>
      <br></br>
      <div className="upbutton">
        <Button onClick={handleResetClick} variant="outline-dark">
          Upload New File
        </Button>{" "}
        <Button onClick={handleAudit} variant="dark">Generate PDF Audit</Button>
      </div>

      <div>
       
      </div>
    </div>
  );
}

export default App;
