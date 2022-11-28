import express from 'express'
import Transcript from './entity/transcript'
import parseTranscript from './parser/transcript-parser'
import cors from 'cors'
import { Audit, audit } from './auditer/transcript-auditer'
import pdf from 'pdf-parse'
import multer from 'multer'
import fs from 'fs'

interface TextContent{
    text: string; 
    track: string
}

interface DegreeAudit{
    transcript: Transcript; 
    audit: Audit; 
}

const main = async()=>{
    const app = express()
    const upload = multer({dest: 'uploads/'})
    app.use(cors())
    app.use(express.json())
    const port = 5000 
    app.get("/", (_, res)=>{
        res.send("hello :)")
    })

    app.post('/', (req, res)=>{
        const content: TextContent = req.body
        const trackName = content.track
        const transcript: Transcript = parseTranscript(content.text)
        const completedAudit: Audit = audit(transcript, trackName)
        const degreeAudit: DegreeAudit = {
            transcript: transcript, 
            audit: completedAudit
        }
        res.json(degreeAudit)
    })



    // {
    //     fieldname: 'file',
    //     originalname: 'SSR_TSRPT_S11.pdf',
    //     encoding: '7bit',
    //     mimetype: 'application/pdf',
    //     destination: 'uploads/',
    //     filename: '9c43ecb9d868c8488866bcdb1d7ef2c7',
    //     path: 'uploads\\9c43ecb9d868c8488866bcdb1d7ef2c7',    
    //     size: 527961
    //   }
    app.post('/test', upload.single('file'), async (req, res)=>{
        const file = req.file
        const path = req.file?.path
        const pdfDataBuffer = await fs.readFileSync(path!) 
        const pdfData = await pdf(pdfDataBuffer)
        console.log('pdf data is: ', pdfData.text)
        fs.unlinkSync(path!)
    })

    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`)
    })
}

main();
