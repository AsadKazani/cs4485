const { writeFile } = require('fs/promises');
const { PDFDocument } = require('pdf-lib');
import fetch from 'cross-fetch';

async function createPDF(input: string, output: string){
    try{

        const formUrl = 'https://cs.utdallas.edu/wp-content/uploads/2020/10/DP-Traditional.pdf';
        const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())

        const pdfDoc = await PDFDocument.load(formPdfBytes);

        const fields = pdfDoc.getForm().getFields().map((f) => f.getName());
        // console.log({ fields });

        const form = pdfDoc.getForm();

        form.getTextField('Name of Student').setText('Nick Pant');

        const pdfBytes = await pdfDoc.save();
        
        await writeFile(output, pdfBytes);
        // console.log("pdf created");

    } catch (err) {
        console.log(err)
    }

}

export default createPDF;