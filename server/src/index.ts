import express from 'express'
import Transcript from './entity/transcript'
import parseTranscript from './parser/transcript-parser'
import cors from 'cors'
import { Audit, audit } from './auditer/transcript-auditer'

interface TextContent{
    text: string
}

interface DegreeAudit{
    transcript: Transcript; 
    audit: Audit; 
}

const main = async()=>{
    const app = express()
    app.use(cors())
    app.use(express.json())
    const port = 5000 
    app.get("/", (_, res)=>{
        res.send("hello :)")
    })

    app.post('/', (req, res)=>{
        const content: TextContent = req.body
        const transcript: Transcript = parseTranscript(content.text)
        const completedAudit: Audit = audit(transcript, "track")
        const degreeAudit: DegreeAudit = {
            transcript: transcript, 
            audit: completedAudit
        }
        res.json(degreeAudit)
    })

    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`)
    })
}

main();
