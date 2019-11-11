//Broque Thomas, Pixel Junkie, Oct 31, 2019
let imageHeight = 0;
let imageWidth = 0;
let imageCopy = new Image();
let imageData;
let canvas, context;
let canvasR, canvasG, canvasB, canvasGR, canvasNeg, canvasCore, canvasHist, contextR, contextG, contextB, contextGR, contextNeg, contextCore, contextHist
let lastSRC = ""
let img = new Image();
let actual = 1
let size = actual + "px"
let imgSrc = ""
let canvasD = document.createElement('canvas')
let ctx = canvasD.getContext('2d')
let imgD  = new Image();
let temporaryBox = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
let imageArray = []
let imageSelection = 0
let downloadHref = ""
let firstSetup = true
let LSC = ""
let RGBCount = [[],[],[]]
let doIt = false

window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            actual = 1
            document.getElementById('scaleSize').innerText = "Current Scale: 1px == " + actual*actual +"px"
            var img = document.getElementById('myImg');  // $('img')[0]
            img.src = URL.createObjectURL(this.files[0]); // set src to file url
            imgSrc = img.src
            lastSRC = img.src
            img.onload = imageIsLoaded; // optional onload event listener
        }
    });
});

function setSidePixel(color){
    document.getElementById('colorRepresentation').innerHTML = ""
    let rectNew = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    let theTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    theTitle.textContent = color
    rectNew.setAttributeNS(null, 'x', 0);
    rectNew.setAttributeNS(null, 'y', 0);
    rectNew.setAttributeNS(null, 'height', '100px');
    rectNew.setAttributeNS(null, 'width', '100px');
    rectNew.setAttributeNS(null, 'rx', 15);
    rectNew.setAttributeNS(null, 'fill', color);
    rectNew.appendChild(theTitle)
    document.getElementById('colorRepresentation').appendChild(rectNew)
}

function getCursorPosition(canvasIn, event) {
    
    const rect = canvasIn.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left)/actual)
    const y = Math.floor((event.clientY - rect.top)/actual)
    //let color = "rgba(" + imageData[((imageWidth*y*4) + x*4)] + ", " + imageData[((imageWidth*y*4) + x*4)+1] + ", " + imageData[((imageWidth*y*4) + x*4)+2] + ", " + (parseInt(imageData[((imageWidth*y*4) + x*4)+3])/255).toFixed(2) + ")"
    //console.log("x: " + x + " y: " + y)
    document.getElementById('pixelData').textContent = LSC + " *Copied to clipboard*"
    setSidePixel(LSC)
    copyToClipboard(LSC)
    myFunction(["jib", y, x])
}

function getMousePos(canvasIn, event) {
    var rect = canvasIn.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left)/actual)
    const y = Math.floor((event.clientY - rect.top)/actual)
    getPixelData(x, y)
    console.log("x: " + x + " y: " + y)
  }



function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}

function saveCanvasImg(){
    download()
}

function download(){
    let download = document.createElement('a');
    //download.href = canvasD.toDataURL('image/png');
    download.href = downloadHref
    console.log(canvasD.width*canvasD.height)
    download.download = 'yourImage.Scale-' + actual + 'x' + '.png';
    download.click(); 
}

function alertFunction(theData){
    if(theData == "rgba(undefined, undefined, undefined, NaN)"){

    }else{
        copyToClipboard(theData)
        setSidePixel(theData)
        document.getElementById('pixelData').textContent = theData + "  *Copied*"
        alert("Copied to clipboard\n" + theData)
    }
    
}

function RGBAToHexA(r,g,b,a) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    a = Math.round(a * 255).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    if (a.length == 1)
      a = "0" + a;
  
    return "#" + r + g + b + a;
  }

function getPixelData(x, y){
    let color = "rgba(" + imageData[((imageWidth*y*4) + x*4)] + ", " + imageData[((imageWidth*y*4) + x*4)+1] + ", " + imageData[((imageWidth*y*4) + x*4)+2] + ", " + (parseInt(imageData[((imageWidth*y*4) + x*4)+3])/255).toFixed(2) + ")"
    if(color != "rgba(undefined, undefined, undefined, NaN)"){
        LSC = color
        document.getElementById('colorRepresentation').innerHTML = ""
        let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        let theTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        theTitle.textContent = color
        rect.setAttributeNS(null, 'x', 0);
        rect.setAttributeNS(null, 'y', 0);
        rect.setAttributeNS(null, 'height', '100px');
        rect.setAttributeNS(null, 'width', '100px');
        rect.setAttributeNS(null, 'rx', 15);
        rect.setAttributeNS(null, 'fill', color);
        rect.appendChild(theTitle)
        document.getElementById('colorRepresentation').appendChild(rect)
        document.getElementById('pixelData').textContent = color 
    }
    
}

function myFunction(color){
    //commit update revision
    if(color[1] == -1){
        copyToClipboard(color[0])
        alert("Copied to clipboard\n" + color[0])
    }else{
        //copyToClipboard(color[0])
        
        //alert("Copied to clipboard\n" + color[0])
        document.getElementById("zoomBox").innerHTML = ""
        let yCord = imageWidth*4
        let sub = 5
        let miniBox = document.getElementById('zoomBox')
        miniBox.style.height = 11*40 + "px"
        miniBox.style.width = 11*40 + "px"
        iteration = 5
        let xCord = color[2]*4 + (imageWidth*color[1])*4
        for(x = 0; x < 11; x++){
            sub = 5
            for(i = 0; i < 11; i++){
                let colorTemp = "rgba(" + imageData[(xCord+(sub*4))+(yCord*iteration)] + ", " + imageData[(xCord+(sub*4))+(yCord*iteration)+1] + ", " + imageData[(xCord+(sub*4))+(yCord*iteration)+2] + ", " + (parseInt(imageData[(xCord+(sub*4))+(yCord*iteration)+3])/255).toFixed(2) + ")"
                let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                let theTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
                theTitle.textContent = colorTemp
                rect.setAttributeNS(null, 'x', i*40);
                rect.setAttributeNS(null, 'y', x*40);
                rect.setAttributeNS(null, 'height', '40px');
                rect.onclick = function(){
                    alertFunction(colorTemp)
                }
                rect.setAttributeNS(null, 'width', '40px');
                rect.setAttributeNS(null, 'fill', colorTemp);
                rect.appendChild(theTitle)
                miniBox.appendChild(rect)
                sub -= 1
            }
            iteration -= 1
        }
    } 
}



function swapFunctionR(){
    //var tempSwap = prompt("Use RED channel as src image?\n      (Y, N)")
    if (window.confirm("Use RED channel as src image?")) { 
        imageSelection = 0
        actual = 1
        var img = document.getElementById('myImg')
        img.src = imageArray[imageSelection].src
        imgSrc = img.src
        lastSRC = img.src
        img.onload = imageIsLoaded
      }
}

function swapFunctionG(){
    if (window.confirm("Use GREEN channel as src image?")) { 
        imageSelection = 1
        actual = 1
        var img = document.getElementById('myImg')
        img.src = imageArray[imageSelection].src
        imgSrc = img.src
        lastSRC = img.src
        img.onload = imageIsLoaded
      }
}

function swapFunctionB(){
    if (window.confirm("Use BLUE channel as src image?")) { 
        imageSelection = 2
        actual = 1
        var img = document.getElementById('myImg')
        img.src = imageArray[imageSelection].src
        imgSrc = img.src
        lastSRC = img.src
        img.onload = imageIsLoaded
      }
}

function swapFunctionGR(){
    if (window.confirm("Use GRAY image as src image?")) { 
        imageSelection = 3
        actual = 1
        var img = document.getElementById('myImg')
        img.src = imageArray[imageSelection].src
        imgSrc = img.src
        lastSRC = img.src
        img.onload = imageIsLoaded
      }
}

function swapFunctionNeg(){
    if (window.confirm("Use NEGATIVE image as src image?")) { 
        imageSelection = 4
        actual = 1
        var img = document.getElementById('myImg')
        img.src = imageArray[imageSelection].src
        imgSrc = img.src
        lastSRC = img.src
        img.onload = imageIsLoaded
      }
}

function removeFunction() {
    actual = 1
    document.getElementById('rgbHeader').textContent = ""

    document.getElementById('colorRepresentation').innerHTML = ""
    document.getElementById('pixelData').textContent = ""
    document.getElementById('zoomBox').style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)');
    document.getElementById('scaleSize').style.display = 'none'
    document.getElementById('titleLabel').textContent = "Pixel Junkie"
    canvasR.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)'); 
    canvasG.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)'); 
    canvasB.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)'); 
    canvasGR.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)'); 
    canvasNeg.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)');
    canvasCore.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)'); 
    document.getElementById('scaleSize').innerText = "Current Scale: 1px == " + actual*actual +"px"
    document.getElementById("myImg").src = ""
    document.getElementById("zoomBox").innerHTML = ""
    document.getElementById("zoomBox").innerHTML = ""
    contextR.clearRect(0, 0, canvasR.width, canvasR.height);
    contextG.clearRect(0, 0, canvasG.width, canvasG.height);
    contextB.clearRect(0, 0, canvasB.width, canvasB.height);
    contextGR.clearRect(0, 0, canvasGR.width, canvasGR.height);
    contextNeg.clearRect(0, 0, canvasNeg.width, canvasNeg.height);
    ctx.clearRect(0, 0, canvasD.width, canvasD.height);
    contextCore.clearRect(0, 0, canvasCore.width, canvasCore.height)
    canvasCore.height = 0
    canvasCore.width = 0
    canvasR.height = 0
    canvasR.width = 0
    canvasG.height = 0
    canvasG.width = 0
    canvasB.height = 0
    canvasB.width = 0
    canvasGR.height = 0
    canvasGR.width = 0
    canvasNeg.height = 0
    canvasNeg.width = 0
}

function setSize(){
    let tempVar = ""
    tempVar = prompt("Increase image scale by: (Number >= 1)\nBrowser limitations may not allow downloads of images scaled over 250,000,000px", "0")
    if (tempVar == 0 || tempVar == null || tempVar == "0"){

    }else{
        
        let newSize = parseInt(tempVar)  
        if (newSize <= 0 || newSize > 100|| isNaN(newSize)){
            setSize()
        }
        actual = newSize
        size = actual + "px"
        document.getElementById('scaleSize').innerText = "Current Scale: 1px == " + actual*actual +"px"
        if(imgSrc != ""){
            imageCopy.src = imgSrc
            canvas = document.createElement('canvas');
            canvas.height = imageHeight
            canvas.width = imageWidth
            context = canvas.getContext('2d');
            img.src = imageCopy.src;
            context.drawImage(img, 0, 0);
            startImage();
        }
    }
}

function startImage() {
    setupRGB();
    document.getElementById('titleLabel').classList.add('rainbow');
    temporaryBox.innerHTML = ""
    document.getElementById('rgbHeader').textContent = "*RGB Data*  " + (imageWidth*actual) + "x" + (imageHeight*actual) + "px image."
    imageWork(0);
    document.getElementById('scaleSize').style.display = 'block'
}

function histogramHelper(rgbData){
    
}
function imageWork(height){
    imageData = context.getImageData(0, 0, imageWidth, imageHeight).data;
    let theHeight = height;
    let theWidth = 0;
    let iterations = 0;
    for(let i = 0; i < imageWidth; ++i) {
    	let n = 4 * (i + height*imageWidth);
        let color = "rgba(" + imageData[n] + ", " + imageData[n+1] + ", " + imageData[n+2] + ", " + (parseInt(imageData[n+3])/255).toFixed(2) + ")"
        let check = 1;
        let rVal = imageData[n];
        let gVal = imageData[n+1];
        let bVal = imageData[n+2];
        var average = parseInt((rVal+gVal+bVal)/3);
        let r = "rgba(" + rVal + ", " + 0 + ", " + 0 + ", " + 1 + ")";
        let g = "rgba(" + 0 + ", " + gVal + ", " + 0 + ", " + 1 + ")";
        let b = "rgba(" + 0 + ", " + 0 + ", " + bVal + ", " + 1 + ")";
        let neg = "rgba(" + (255-rVal) + ", " + (255-gVal) + ", " + (255-bVal) + ", " + 1 + ")"
        let gr = "rgba(" + average + ", " + average + ", " + average + ", " + 1 + ")";
        contextR.fillStyle = r;
        contextR.fillRect(Math.floor(parseInt(theWidth/actual)), height, check, 1);
        contextG.fillStyle = g;
        contextG.fillRect(Math.floor(parseInt(theWidth/actual)), height, check, 1);
        contextB.fillStyle = b;
        contextB.fillRect(Math.floor(parseInt(theWidth/actual)), height, check, 1);
        contextGR.fillStyle = gr;
        contextGR.fillRect(Math.floor(parseInt(theWidth/actual)), height, check, 1);
        contextNeg.fillStyle = neg;
        contextNeg.fillRect(Math.floor(parseInt(theWidth/actual)), height, check, 1);

        let oldTheWidth = theWidth;
        while(color == "rgba(" + imageData[n+4] + ", " + imageData[n+5] + ", " + imageData[n+6] + ", " + (parseInt(imageData[n+7])/255).toFixed(2) + ")" && iterations < imageWidth-1){
            i++;
            n = 4 * (i + height*imageWidth);
            theWidth += actual;
            check += 1;
            contextR.fillStyle = r;
            contextR.fillRect(Math.floor(parseInt(theWidth/actual)), height, check, 1);
            contextG.fillStyle = g;
            contextG.fillRect(Math.floor(parseInt(theWidth/actual)), height, check, 1);
            contextB.fillStyle = b;
            contextB.fillRect(Math.floor(parseInt(theWidth/actual)), height, check, 1);
            contextGR.fillStyle = gr;
            contextGR.fillRect(Math.floor(parseInt(theWidth/actual)), height, check, 1);
            contextNeg.fillStyle = neg;
            contextNeg.fillRect(Math.floor(parseInt(theWidth/actual)), height, check, 1);
        }
        for(rgbCheck = 0; rgbCheck < check; rgbCheck += 1){
            RGBCount[0].push(rVal)
            RGBCount[1].push(gVal)
            RGBCount[2].push(bVal)
        }

        ctx.fillStyle = color;
        ctx.fillRect(oldTheWidth, height*actual, check*actual, actual);
        contextCore.fillStyle = color;
        contextCore.fillRect(oldTheWidth, height*actual , check*actual, actual);
        theWidth += actual;
    }
    if (height + 1 < imageHeight) {
        if(doIt){
            imageWork(height + 1);
        }else{
            window.requestAnimationFrame(function() {
                if(parseInt(((height+1) / imageHeight)*100) == 99){
                    document.getElementById('titleLabel').textContent = "Pixel Junkie --> Rendering Image"
                }else{
                    document.getElementById('titleLabel').textContent = "Pixel Junkie --> Processing Image: " + parseInt(((height+1) / imageHeight)*100) + "% complete."
                }
                //RGBCount[0].push([])
                //RGBCount[1].push([])
                //RGBCount[2].push([])
                imageWork(height + 1);
            });        
        }
    	
    }else{
        for(rgbSCheck = 0; rgbSCheck < 3; rgbSCheck += 1){
            //Histogram stuff
            //var temp = RGBCount[rgbSCheck].sort((a, b) => a - b);
            //RGBCount[rgbSCheck] = temp
        }
        document.getElementById('zoomBox').style.setProperty('--box-shadow-color', 'white');
        downloadHref = canvasD.toDataURL('image/png');
        document.getElementById('titleLabel').textContent = "Pixel Junkie --> Processing complete."
        document.getElementById('titleLabel').classList.remove('rainbow'); 
        let tempImageR = new Image()
        tempImageR.src = canvasR.toDataURL()
        imageArray.push(tempImageR)
        let tempImageG = new Image()

        tempImageG.src = canvasG.toDataURL()
        imageArray.push(tempImageG)
        let tempImageB = new Image()

        tempImageB.src = canvasB.toDataURL()
        imageArray.push(tempImageB)
        let tempImageGR = new Image()

        tempImageGR.src = canvasGR.toDataURL()
        imageArray.push(tempImageGR)
        let tempImageNeg = new Image()

        tempImageNeg.src = canvasNeg.toDataURL()
        imageArray.push(tempImageNeg)
        myFunction(["color", Math.floor(imageHeight/2), Math.floor(imageWidth/2)])
    }
}

function setupRGB(){
    
    canvasCore = document.getElementById('coreImg');
    canvasCore.height = imageHeight*actual
    canvasCore.width = imageWidth*actual
    contextCore = canvasCore.getContext('2d');
    canvasCore.style.setProperty('--box-shadow-color', 'white');
    if(firstSetup){
        canvasCore.addEventListener('mousedown', function(e) {
            getCursorPosition(canvasCore, e)
        })
        canvasCore.addEventListener('mousemove', function(evt) {
            getMousePos(canvasCore, evt);
        
          }, false);
        firstSetup = false
    }

    canvasHist = document.getElementById('redImg');
    canvasHist.height = 800
    canvasHist.width = 1020
    contextHist = canvasHist.getContext('2d');

    canvasR = document.getElementById('redImg');
    canvasR.height = imageHeight
    canvasR.width = imageWidth
    contextR = canvasR.getContext('2d');
    canvasR.style.setProperty('--box-shadow-color', 'red');

    canvasG = document.getElementById('greenImg');
    canvasG.height = imageHeight
    canvasG.width = imageWidth
    contextG = canvasG.getContext('2d');
    canvasG.style.setProperty('--box-shadow-color', 'green');

    canvasB = document.getElementById('blueImg');
    canvasB.height = imageHeight
    canvasB.width = imageWidth
    contextB = canvasB.getContext('2d');
    canvasB.style.setProperty('--box-shadow-color', 'blue');

    canvasGR = document.getElementById('grayImg');
    canvasGR.height = imageHeight
    canvasGR.width = imageWidth
    contextGR = canvasGR.getContext('2d');
    canvasGR.style.setProperty('--box-shadow-color', 'gray');

    canvasNeg = document.getElementById('negImg');
    canvasNeg.height = imageHeight
    canvasNeg.width = imageWidth
    contextNeg = canvasNeg.getContext('2d');
    canvasNeg.style.setProperty('--box-shadow-color', 'black');

    canvasD = document.createElement('canvas')
    canvasD.height = imageHeight*actual
    canvasD.width = imageWidth*actual
    ctx = canvasD.getContext('2d')
}

function imageIsLoaded(e) { 
    if (this.width*this.height < 225){
        alert( this.width*this.height + "px!? Not Enough! I Need More Pixels!")
    }else{
        imageArray = []
        imageCopy.src = this.src
        imageHeight = this.height;
        imageWidth = this.width; 
        canvas = document.createElement('canvas');
        canvas.height = imageHeight
        canvas.width = imageWidth
        context = canvas.getContext('2d');
        img.src = imageCopy.src;
        context.drawImage(img, 0, 0)
        document.getElementById('scaleSize').innerText = "Current Scale: 1px == " + actual*actual +"px"
        var performance = window.performance;
        var t0 = performance.now();
        document.getElementById('pixelData').textContent = "rgba(000, 000, 000, 1.00)"
        document.getElementById('rgbHeader').textContent = "*RGB Data*  " + (imageWidth*actual) + "x" + (imageHeight*actual) + "px image."
        startImage();
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        var t1 = performance.now();
        console.log("Call to doWork took " + (t1 - t0) + " milliseconds.")
    }
}   

