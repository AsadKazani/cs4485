import express from "express";
import Transcript from "./entity/transcript";
import parseTextTranscript from "./parser/text-transcript-parser";
import cors from "cors";
import { Audit, audit } from "./auditer/transcript-auditer";
import pdf from "pdf-parse";
import multer from "multer";
import fs from "fs";
import createPDF from "./pdf";
import os from 'os'
import parsePDFTranscript from "./parser/pdf-transcript-parser";

interface TextContent {
  text?: string;
  track: string;
}

export interface DegreeAudit {
  transcript: Transcript;
  audit: Audit;
}

const main = async () => {
  const app = express();
  const upload = multer({ dest: "uploads/" });
  app.use(cors());
  app.use(express.json());
  const port = 5000;
  app.get("/", (_, res) => {
    res.send("hello :)");
  });

  app.post("/text", (req, res) => {
    const content: TextContent = req.body;

    const trackName = content.track;
    const transcript: Transcript = parseTextTranscript(content.text!);
    const completedAudit: Audit = audit(transcript, trackName);
    const degreeAudit: DegreeAudit = {
      transcript: transcript,
      audit: completedAudit,
    };
    createPDF(trackName, os.tmpdir() + '/output.pdf', degreeAudit);
    res.json(degreeAudit);
  });

  app.post("/pdf", upload.single("file"), async (req, res) => {
    const path = req.file?.path;
    const pdfDataBuffer = await fs.readFileSync(path!);
    const pdfData = await pdf(pdfDataBuffer);
    const { text } = pdfData;
    fs.writeFile("./uploads/test.txt", text, (_) => {});
    fs.unlinkSync(path!);
    const content: TextContent = req.body;
    const trackName = content.track;
    const transcript: Transcript = parsePDFTranscript(text);
    const completedAudit: Audit = audit(transcript, trackName);
    const degreeAudit: DegreeAudit = {
      transcript: transcript,
      audit: completedAudit,
    };
    createPDF(trackName, os.tmpdir() + '/output.pdf', degreeAudit);
    res.json(degreeAudit);
  });

  app.get('/pdfDownload', (_, res)=>{
    res.download(os.tmpdir() + '/output.pdf')
  })

  app.get('/pdfFile', (_, res)=>{
    res.sendFile(os.tmpdir() + '/output.pdf')
  })

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

main();
