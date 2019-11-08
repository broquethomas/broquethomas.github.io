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
let colorArray = [ "rgba(255, 255, 255, 1.00)","rgba(255, 255, 255, 1.00)","rgba(255, 255, 255, 1.00)","rgba(255, 255, 255, 1.00)","rgba(255, 255, 255, 1.00)","rgba(255, 255, 255, 1.00)","rgba(255, 255, 255, 1.00)","rgba(255, 255, 255, 1.00)","rgba(0, 0, 255, 1.00)","rgba(0, 0, 255, 1.00)","rgba(255, 0, 0, 1.00)"]
let temporaryBox = document.createElementNS("http://www.w3.org/2000/svg", 'svg');

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
    download.href = canvasD.toDataURL('image/png');
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
function removeFunction() {
    document.getElementById('titleLabel').textContent = "Pixel Junkie" 
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
    tempVar = prompt("Increase image scale by: (number >= 2)\nBe careful, it grows fast", "0")
    if (tempVar == 0 || tempVar == null){
    }else{
        let newSize = parseInt(tempVar)  
        if (newSize <= 0 || newSize > 50 || isNaN(newSize)){
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
        document.getElementById('titleLabel').textContent = "Pixel Junkie --> Processing complete."
        document.getElementById('titleLabel').classList.remove('rainbow'); 
        theBox.appendChild(temporaryBox)
    }
}

function setupRGB(){
    canvasR = document.getElementById('redImg');
    canvasR.height = imageHeight
    canvasR.width = imageWidth
    contextR = canvasR.getContext('2d');

    canvasG = document.getElementById('greenImg');
    canvasG.height = imageHeight
    canvasG.width = imageWidth
    contextG = canvasG.getContext('2d');

    canvasB = document.getElementById('blueImg');
    canvasB.height = imageHeight
    canvasB.width = imageWidth
    contextB = canvasB.getContext('2d');

    canvasGR = document.getElementById('grayImg');
    canvasGR.height = imageHeight
    canvasGR.width = imageWidth
    contextGR = canvasGR.getContext('2d');

    canvasNeg = document.getElementById('negImg');
    canvasNeg.height = imageHeight
    canvasNeg.width = imageWidth
    contextNeg = canvasNeg.getContext('2d');

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
        alert("Upload Success");
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

