const pdfjsLib = window['pdfjs-dist/build/pdf'];

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
function checkForXrefErrors(arrayBuffer) {
    // Load the PDF using pdf.js
    pdfjsLib.getDocument({ data: arrayBuffer }).promise.then(function (pdf) {
        // PDF loaded successfully, check for potential Xref errors
        const numPages = pdf.numPages;
        let xrefErrors = false;
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            pdf.getPage(pageNum).then(function (page) {
                // Attempting to extract the text from each page.
                // If the page has a corrupted Xref, this might throw an error.
                page.getTextContent().then(function () { }).catch(function () {
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
