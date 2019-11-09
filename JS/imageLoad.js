//Broque Thomas, Pixel Junkie, Oct 31, 2019
let imageHeight = 0;
let imageWidth = 0;
let imageCopy = new Image();
let imageData;
let canvas, context;
let canvasR, canvasG, canvasB, canvasGR, canvasNeg, contextR, contextG, contextB, contextGR, contextNeg
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
        alert("Copied to clipboard\n" + theData)
    }
    
}

function myFunction(color){
    //commit update revision
    if(color[1] == -1){
        copyToClipboard(color[0])
        alert("Copied to clipboard\n" + color[0])
    }else{
        copyToClipboard(color[0])
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
    var tempSwap = prompt("Use RED channel as src image?\n      (Y, N)")
    if(tempSwap == "Y" || tempSwap == "y"){
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
    var tempSwap = prompt("Use GREEN channel as src image?\n      (Y, N)")
    if(tempSwap == "Y" || tempSwap == "y"){
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
    var tempSwap = prompt("Use BLUE channel as src image?\n      (Y, N)")
    if(tempSwap == "Y" || tempSwap == "y"){
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
    var tempSwap = prompt("Use Gray Image as src image?\n      (Y, N)")
    if(tempSwap == "Y" || tempSwap == "y"){
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
    var tempSwap = prompt("Use Negative Image as src image?\n      (Y, N)")
    if(tempSwap == "Y" || tempSwap == "y"){
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
    document.getElementById('scaleSize').style.display = 'none'
    document.getElementById('titleLabel').textContent = "Pixel Junkie"
    canvasR.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)'); 
    canvasG.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)'); 
    canvasB.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)'); 
    canvasGR.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)'); 
    canvasNeg.style.setProperty('--box-shadow-color', 'rgb(51, 51, 51)'); 
    actual = 1
    document.getElementById('scaleSize').innerText = "Current Scale: 1px == " + actual*actual +"px"
    document.getElementById("myImg").src = ""
    document.getElementById("theBox").innerHTML = ""
    document.getElementById("zoomBox").innerHTML = ""
    document.getElementById('theBox').style.width = 1
    document.getElementById('theBox').style.height = 1
    document.getElementById("zoomBox").innerHTML = ""
    contextR.clearRect(0, 0, canvasR.width, canvasR.height);
    contextG.clearRect(0, 0, canvasG.width, canvasG.height);
    contextB.clearRect(0, 0, canvasB.width, canvasB.height);
    contextGR.clearRect(0, 0, canvasGR.width, canvasGR.height);
    contextNeg.clearRect(0, 0, canvasNeg.width, canvasNeg.height);
    ctx.clearRect(0, 0, canvasD.width, canvasD.height);
}

function setSize(){
    document.getElementById("theBox").innerHTML = ""
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
	document.getElementById("theBox").innerHTML = "";
    setupRGB();
    document.getElementById('titleLabel').classList.add('rainbow');
    temporaryBox.innerHTML = ""
    imageWork(0);
    document.getElementById('scaleSize').style.display = 'block'
}

function imageWork(height){
    imageData = context.getImageData(0, 0, imageWidth, imageHeight).data;
    let theHeight = height;
    let theWidth = 0;
    let theBox = document.getElementById('theBox');
    theBox.style.height = imageHeight*actual + "px";
    theBox.style.width = imageWidth*actual + "px";
    let iterations = 0;
    for(let i = 0; i < imageWidth; ++i) {
    	let n = 4 * (i + height*imageWidth);
        let color = "rgba(" + imageData[n] + ", " + imageData[n+1] + ", " + imageData[n+2] + ", " + (parseInt(imageData[n+3])/255).toFixed(2) + ")"
        let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        let theTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        theTitle.textContent = color;
        rect.setAttributeNS(null, 'x', theWidth);
        rect.setAttributeNS(null, 'y', height*actual);
        rect.setAttributeNS(null, 'height', size);
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

        ctx.fillStyle = color;
        ctx.fillRect(oldTheWidth, height*actual, check*actual, actual);
        let temp = height;
        let temp2 = i;
        rect.onclick = function(){
            myFunction([color, temp, temp2-(Math.ceil(check/2))])
        }
        rect.setAttributeNS(null, 'width', check*actual);
        rect.setAttributeNS(null, 'fill', color);
        rect.appendChild(theTitle);
        temporaryBox.appendChild(rect)
        //theBox.appendChild(rect);
        theWidth += actual;
    }
    if (height + 1 < imageHeight) {
    	window.requestAnimationFrame(function() {
            if(parseInt(((height+1) / imageHeight)*100) == 99){
                document.getElementById('titleLabel').textContent = "Pixel Junkie --> Rendering Image"
            }else{
                document.getElementById('titleLabel').textContent = "Pixel Junkie --> Processing Image: " + parseInt(((height+1) / imageHeight)*100) + "% complete."
            }
    		imageWork(height + 1);
    	});
    }else{
        downloadHref = canvasD.toDataURL('image/png');
        document.getElementById('titleLabel').textContent = "Pixel Junkie --> Processing complete."
        document.getElementById('titleLabel').classList.remove('rainbow'); 
        theBox.appendChild(temporaryBox)
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
    canvasNeg.style.setProperty('--box-shadow-color', 'white');


    canvasD = document.createElement('canvas')
    canvasD.height = imageHeight*actual
    canvasD.width = imageWidth*actual
    ctx = canvasD.getContext('2d')
}

function imageIsLoaded(e) { 
    if (this.width*this.height > 1000000 || this.width*this.height < 225){
        if (this.width*this.height > 1000000 ){
            alert("I don't want that many pixels, keep it under 1,000,000px")
        }else{
            alert( this.width*this.height + "px!? Not Enough! I Need More Pixels!")
        }
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
        var performance = window.performance;
        var t0 = performance.now();
        startImage();
        var t1 = performance.now();
        console.log("Call to doWork took " + (t1 - t0) + " milliseconds.")
    }
}   

