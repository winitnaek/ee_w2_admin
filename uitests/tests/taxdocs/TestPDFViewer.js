import React from 'react';
import { PDF_ANCHOR_ID } from '../../../src/base/constants/AppConstants';

class PDFViewer extends React.Component {
    render() {
        return (
            <div>
                <canvas id="the-canvas"></canvas>
                <div id="pageContainer"></div>
                <iframe id={PDF_ANCHOR_ID} width="100%" height="100%" allowfullscreen webkitallowfullscreen></iframe>
            </div>
        );
    }

    componentWillMount() {
        this.renderPDFData();
    }
    renderPDFAFData() {
        var pdfjsLib = window['pdfjs-dist/build/pdf'];
       // pdfjsLib.GlobalWorkerOptions.workerSrc ='./res/js/pdfjs-1.9.426-dist/build/pdf.worker.js';

        var DEFAULT_URL = './IsrealFullerton.base64';
        var DEFAULT_SCALE = 1.0;
        
        var container = document.getElementById('pageContainer');
        
        // Fetch the PDF document from the URL using promises.
        pdfjsLib.getDocument(DEFAULT_URL).then(function (doc) {
          // Use a promise to fetch and render the next page.
          var promise = Promise.resolve();
        
          for (var i = 1; i <= doc.numPages; i++) {
            promise = promise.then(function (pageNum) {
              return doc.getPage(pageNum).then(function (pdfPage) {
                // Create the page view.
                var pdfPageView = new pdfjsViewer.PDFPageView({
                  container: container,
                  id: pageNum,
                  scale: DEFAULT_SCALE,
                  defaultViewport: pdfPage.getViewport(DEFAULT_SCALE),
                  annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
                  renderInteractiveForms: true,
                });
        
                // Associate the actual page with the view and draw it.
                pdfPageView.setPdfPage(pdfPage);
                return pdfPageView.draw();
              });
            }.bind(null, i));
          }
        });

    }
    renderPDFFile(){
        let file2 = 'http://cdn.mozilla.net/pdfjs/tracemonkey.pdf';
        var printFrame = document.getElementById(PDF_ANCHOR_ID)
        //if (printFrame) {
           printFrame.src = './res/js/pdfjs-1.9.426-dist/web/viewer.html?file='+file2; 
       // }
    }
    renderPDFData() {
        // atob() is used to convert base64 encoded PDF to binary-like data.
        // (See also https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/
        // Base64_encoding_and_decoding.)
        //var pdfData;
        var pdfData = atob('JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
            'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
            'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
            'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
            'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
            'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
            'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
            'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
            'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
            'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
            'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
            'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
            'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        var pdfjsLib = window['pdfjs-dist/build/pdf'];


        let file = './response.base64';
       
        console.log(file);
        //var pdfData;
        fetch(file).then(function(response) {
                return response.text();
        }).then(function(data) {
                var raw = window.atob(data);
                var rawLength = raw.length;
                var array = new Uint8Array(new ArrayBuffer(rawLength));
            
                for(var i = 0; i < rawLength; i++) {
                array[i] = raw.charCodeAt(i);
                }
                var pdfAsArray = array;
                var url = 'http://localhost:8080/res/js/pdfjs-1.9.426-dist/web/viewer.html?file=';

                var binaryData = [];
                binaryData.push(pdfAsArray);
                var dataPdf = window.URL.createObjectURL(new Blob(binaryData, {type: "application/pdf"}))
                document.getElementById(PDF_ANCHOR_ID).setAttribute('src',url + encodeURIComponent(dataPdf));
                //Worked 1===============Start==>
                //let file2 = 'http://localhost:8080/response.pdf';
                //var printFrame = document.getElementById('pdfi-frame');
                //printFrame.src = 'http://localhost:8080/res/js/pdfjs-1.9.426-dist/web/viewer.html?file='+file2; 
                //Worked 1===============Ends==>

                //Worked 2===============Start==>
                //pdfData =  atob(data);
                //var cc = document.getElementById('pdfi-frame');
                //cc.src = "data:application/pdf;base64,"+data
                //Worked 2===============Ends==>

                //Worked 3===============Start==>
                /* pdfjsLib.getDocument({data: pdfData}).then(function getPdfHelloWorld(pdf) {
                    // Fetch the first page.
                    pdf.getPage(1).then(function getPageHelloWorld(page) {
                      var scale = 1.5;
                      var viewport = page.getViewport(scale);
                      // Prepare canvas using PDF page dimensions.
                      var canvas = document.getElementById('the-canvas');
                      var context = canvas.getContext('2d');
                      canvas.height = viewport.height;
                      canvas.width = viewport.width;
                      // Render PDF page into canvas context.
                      var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                      };
                      page.render(renderContext);
                    });
                  });*/
                  //Worked 2===============Ends==>
                
        });

        // The workerSrc property shall be specified.
        //pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

        // Using DocumentInitParameters object to load binary data.
       
    }
    dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }
    renderMyPDF() {
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        var url = './sample.pdf';
        var pdfjsLib = window['pdfjs-dist/build/pdf'];
        console.log(pdfjsLib);
        // The workerSrc property shall be specified.
        //pdfjsLib.GlobalWorkerOptions.workerSrc = './res/js/pdfjs-1.9.426-dist/build/pdf.worker.js';

        // Asynchronous download of PDF
        var loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(function (pdf) {
            //console.log('PDF loaded');
            //console.log(pdf);
            // Fetch the first page
            var pageNumber = 1;
            pdf.getPage(pageNumber).then(function (page) {
                console.log('Page loaded');
                console.log('page');
                console.log(page);

                var scale = 1.5;
                var viewport = page.getViewport(scale);

                // Prepare canvas using PDF page dimensions
                var canvas = document.getElementById('the-canvas');
                console.log('canvas');
                console.log(canvas);
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.then(function () {
                    console.log('Page rendered');
                });
            });
        }, function (reason) {
            // PDF loading error
            console.error(reason);
        });
    }
}
export default PDFViewer;