//Broque Thomas, Pixel Junkie, Oct 31, 2019
let imageHeight = 0;
let imageWidth = 0;
let imageCopy = new Image();
let imageData;
let canvas, context;
let img = new Image();
let actual = 1
let size = actual + "px"
let imgSrc = ""
let coreHTMlString = ""


window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            actual = 1
            document.getElementById('scaleSize').innerText = "Current Scale: 1px == " + actual*actual +"px"
            var img = document.querySelector('img');  // $('img')[0]
            img.src = URL.createObjectURL(this.files[0]); // set src to file url
            imgSrc = img.src
            img.onload = imageIsLoaded; // optional onload event listener
        }
    });
});

function wayTooBig(bigWidth, bigHeight){

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



function myFunction(color){
    copyToClipboard(color)
    alert("Copied to clipboard\n" + color)    
}
function removeFunction() {
    document.getElementById("myImg").src = ""
    document.getElementById("theBox").innerHTML = ""
    document.getElementById('theBox').style.width = 1
    document.getElementById('theBox').style.height = 1
}

function setSize(){
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
            imageWork()
        }
        
    }
    
    
}

function imageWork(){
    coreHTMlString = ""
    imageData = context.getImageData(0, 0, imageWidth, imageHeight).data
    let theHeight = 0
    let theWidth = 0
    let theBox = document.getElementById('theBox');
    theBox.innerHTML = ""
    theBox.style.width = imageWidth*actual
    theBox.style.height = imageHeight*actual
    let iterations = 0
    for(n = 0; n < imageData.length; n += 4){
        let color = "rgba(" + imageData[n] + ", " + imageData[n+1] + ", " + imageData[n+2] + ", " + (parseInt(imageData[n+3])/255).toFixed(2) + ")"
        let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        if(iterations == imageWidth){
            theWidth = 0
            theHeight += actual
            iterations = 0 
        }
        let theTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        theTitle.textContent = color
        rect.setAttributeNS(null, 'x', theWidth);
        rect.setAttributeNS(null, 'y', theHeight);
        rect.setAttributeNS(null, 'height', size);
        let check = 1
        while(color == "rgba(" + imageData[n+4] + ", " + imageData[n+5] + ", " + imageData[n+6] + ", " + (parseInt(imageData[n+7])/255).toFixed(2) + ")" && iterations < imageWidth-1){
            n += 4 
            theWidth += actual 
            iterations += 1 
            check += 1
        }
        iterations += 1
        rect.setAttributeNS(null, 'width', check*actual);
        rect.setAttributeNS(null, 'fill', color);
        rect.onclick = function(){
            myFunction(color)
        }
        rect.appendChild(theTitle)
        //coreHTMlString += rect.outerHTML
        theBox.appendChild(rect)
        theWidth += actual
    }
    console.log("finished")
    //theBox.innerHTML = coreHTMlString
}

function imageIsLoaded(e) { 
    if (this.width*this.height > 1000000){
        alert("I don't want that many pixels, keep it under 1,000,000px")
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
        context.drawImage(img, 0, 0);
        imageWork()
    }
    
}   

/*

async function imageSetup(){
    imageData = context.getImageData(0, 0, imageWidth, imageHeight).data
    
    var theBox = document.getElementById('theBox');
    var subcount = 0
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var linebreak = document.createElement("div");
    
    linebreak.className = "theDivs";
    linebreak.style.height = size
    for(n = 0; n < imageData.length; n += 4){
            var color = "rgba(" + imageData[n] + ", " + imageData[n+1] + ", " + imageData[n+2] + ", " + imageData[n+3]+ ")"
            if(subcount == imageWidth){
                subcount = 0;
                linebreak.appendChild(svg)
                svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                theBox.appendChild(linebreak);
                linebreak = document.createElement("div");
                linebreak.className = "theDivs";
                linebreak.style.height = size
            }
            var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            rect.setAttributeNS(null, 'x', subcount*actual);
            rect.setAttributeNS(null, 'y', 0);
            rect.setAttributeNS(null, 'height', size);
            check = 1
            while(color == "rgba(" + imageData[n+4] + ", " + imageData[n+5] + ", " + imageData[n+6] + ", " + imageData[n+7]+ ")" && subcount < imageWidth-1){
                check += 1
                subcount += 1
                n += 4   
                console.log("here") 
            }
            subcount += 1
            rect.setAttributeNS(null, 'width', actual*check + "px");
            rect.setAttributeNS(null, 'fill', color);
            
            svg.appendChild(rect);
    }
}

async function beginWork(){
    imageData = context.getImageData(0, 0, imageWidth, imageHeight).data
    
    var theBox = document.getElementById('theBox');
    var subcount = 0
    var linebreak = document.createElement("div");
    linebreak.className = "theDivs";
    for(n = 0; n < imageData.length; n += 4){
        var color = "rgba(" + imageData[n] + ", " + imageData[n+1] + ", " + imageData[n+2] + ", " + imageData[n+3]+ ")"
            if(subcount == imageWidth){
                subcount = 0;
                theBox.appendChild(linebreak);
                linebreak = document.createElement("div");
                linebreak.className = "theDivs";
            }
            var newElm = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            newElm.setAttribute('width', size);
            newElm.setAttribute('height', size);
            newElm.style.backgroundColor = color
            newElm.innerHTML = color
            linebreak.appendChild(newElm);
            subcount += 1;
    }
}
*/

