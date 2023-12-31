var PDFDocument = PDFLib.PDFDocument;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
function checkPDF() {
    const fileInput = document.getElementById('pdfFileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a PDF file.");
        return;
    }
    // Read the PDF file using pdf.js
    const fileReader = new FileReader();
    fileReader.onload = function () {
        const arrayBuffer = this.result;
        checkForXrefErrors(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(file);
}
async function checkForXrefErrors(arrayBuffer) {
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    console.log(pdfDoc);
    const src = {
        data: arrayBuffer,
        verbosity: 5,
        stopAtErrors: true,
        pdfBug: true,
      };
    // Load the PDF using pdf.js
    pdfjsLib.getDocument(src).promise.then(function (pdf) {
        //console.log(pdf);
        // PDF loaded successfully, check for potential Xref errors
        const numPages = pdf.numPages;
        let xrefErrors = false;
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            pdf.getPage(pageNum).then(function (page) {
                // Attempting to extract the text from each page.
                // If the page has a corrupted Xref, this might throw an error.
                page.getTextContent().then(function () { }).catch(function (error) {
                    console.error(error);
                    xrefErrors = true;
                    displayResult('The PDF may have Xref errors.');
                });
            });
        }
        if (!xrefErrors) {
            displayResult('The PDF does not seem to have Xref errors.');
        }
    }).catch(function (error) {
        console.error('Error loading PDF:', error);
        displayResult('Error loading PDF.');
    });
}
function displayResult(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = message;
}
