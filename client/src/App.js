import React, { useState } from 'react';
import './App.css';
import { Buffer } from "buffer";
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
        <form>
          <h1>Transcript Upload</h1>
          <input type="file" accept=".txt" onChange={e => 
            handleChangeFile(e.target.files[0])} />           
        </form>
    </div>
  );
}

export default App;
