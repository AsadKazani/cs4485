import express from 'express'
import Transcript from './entity/transcript'
import parseTranscript from './parser/transcript-parser'
import cors from 'cors'

interface TextContent{
    text: string
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
        console.log(content.text)
        const transcript: Transcript = parseTranscript(content.text)
        res.json(transcript)
    })

    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`)
    })
}

main();
