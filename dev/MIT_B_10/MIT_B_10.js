var font, font2, middle, para, left, topMargin, right, wordsPlaced, prevwordsPlaced, wordpoly, wWidth, queryString;
var beep, bop, first, sent, timer, columns, pages, polySynth, played, syll, allFonts, numPages, pageNum, params, r, chapters;
var myText="";
var go = false;
var toggle=false;
var fontSizes = [18, 48, 72]; //16, 24,
var baseFontSize;
var toPrint=false;
var list=[];
var allSentences=[];
var vertices = [];
var allWords=[];
var sentimentRef, sentVal;
var shortest= 6;
var info = "";
var corpus = ["data/books/austen-emma.txt", "data/books/moby_short.txt", "data/books/austen-sense.txt", "data/books/blake-poems.txt", "data/books/shakespeare-macbeth.txt"];
var titles = ["Jane Austen", "Moby Dick", "Sense & Sensibility", "William Blake Poetry", "Macbeth"] ;
function preload () {
  list = loadStrings("data/books/moby_short.txt");
  font=loadFont('data/fonts/HelveticaNowDisplay.otf');
  font2=loadFont('data/NewRocker-Regular.ttf');
  sentimentRef = loadJSON('data/sentiment/MIT_afinn_165.json');
  sentimentRef2 = loadJSON('data/sentiment/vader.json');
}

function setup() {
  let params = getURLParams();
   numPages=[1, 2];
  if (params.seed > 0 && params.page > 0) {
    randomSeed(params.seed);
    pageNum=params.page;
    toPrint=true;
    fontSizes = [48, 72, 96];
    if (pageNum==1){
    createCanvas(2412, 3074);
    pages=1;
    }
    else if (5>=pageNum>1){
      createCanvas(4824, 3074);
      pages=random(numPages);
    }}
  else{createCanvas(windowWidth, windowHeight);  pages=random(numPages);}
  frameRate(30);
  go=false;
  allFonts=[font, font2];
  baseFontSize = random(fontSizes);
  textFont(random(allFonts));
  columns=random([1, 2, 4]);
  textAlign(LEFT, TOP);
  //list = loadStrings(random(corpus), newText);
  drawPageSpace();
}

function draw() {
  if (go==false) {
    ellipse(width/2, height/2, 50, 50);
  } else { 
    background(215);
    topMargin = 40;
    right = width-40;
    drawPageSpace();
    wordsPlaced=0;
    allWords.forEach(each => {
      each.showWord();
      wordsPlaced++;
    } );
    if (toggle==true) {
      if (info[0]=='[') {
        push();
        textSize(24);
        textAlign(LEFT, TOP);
        fill(255);
        rect (40, height-44, textWidth(info)+4, 36);
        fill(0);
        text(info.toString(), 40, height-44);
        text(chapters+' / '+frameRate(), 40, height-88);
        pop();
      }
      }
  }
}

function drawPageSpace() {
  if (go==false) {
    ellipse(width/2, height/2, 50, 50);
  } else {
    middle = int(width/2);
    if (pages==2) {
      left = middle + 40;
    } else if (pages==1) {
      background(215);
      left = 40;
    } else {
      left = random(40, width-200);
    }
  }
}  

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawPageSpace();
  setText(list);
  //generateVertices(width/4, height/4, wordsPlaced);
  //setIllust();
}
function mousePressed() {
  //only draw if user has clicked
  if (go == false) {    
    go=!go;
      polySynth = new p5.PolySynth();
      frameCount = 0;
      redraw();
    //list = loadStrings(random(corpus), newText);
  }
  drawPageSpace();
}
// This keyTyped function 
function keyTyped() {
  //loop();
  go=true;
  switch(key) {
  case '1':
    frameCount=0;
    pages=1;
    loadStrings("data/books/milton-paradise.txt", newText);
    break;
  case '3':
    frameCount=0;
    pages=1;
    //myText="";
    loadStrings(random(corpus), newText);
    break;
  case '4':
    pages=2;
    let next=random(corpus);
    console.log(next);
        frameCount=0;
    loadStrings(next, newText);
    break;
  case '5':
    bgcol= [255, 5];
    break;
  case 'c':
    pages=1;
    break;
  case 'v':
    toggle=!toggle;
    break;
  case 'x':
    pages=2;
    break;
  case 'b':
    toggle=!toggle;
    break;
  }
}

function newText(result) {
  background(215);
  baseFontSize=random(fontSizes);
  textSize(baseFontSize);
  textFont(random(allFonts));
  pages=int(random(1, 3));
  columns=int(random(1, 4));
  list=[];
  var randomselection = random(result.length-8);
  console.log(randomselection);
  info=result[0];
  chapters=randomselection;
  list=subset(result, randomselection, randomselection+8) ;
  setText(list);
}

function setText(list) {
  allSentences=[];
  allWords=[];
  para=[];
  para = RiTa.splitSentences(list.join(' ').toString());
  for (var p=0; p<para.length; p++) {
    allSentences.push(new Paras(p, para[p], info));
  }
  allWords=[];
  timer=0;
  allSentences.forEach(sent => {
    sent.setval(columns, pages);
  }
  );
  frameCount=0;
}

function playSynth(tone, size, syll) {
  let dur = 3.0 * size;
  // time from now (in seconds)
  let time = 0;
  // volume, from 0 to 1
  let vol = 0.1;
  if (tone==1) {
    polySynth.play('G2', vol*3, 0, dur);
    polySynth.play('C3', vol*3, time += 1/4, dur);
    polySynth.play('G3', vol*3, time += 1/4, dur);
    //currfreq=60;
  } else if (tone==2) {
    polySynth.play('B4', vol*3, 0, dur);
    polySynth.play('C5', vol*3, time += 1/4, dur);
    polySynth.play('A4', vol*3, time += 1/4, dur);
    //currfreq=60;
  } else if (tone==3) {
    polySynth.play(midiToFreq(64-syll), 0.2, 0, syll/8 );
  }
}

//function setIllust() {
//  if (wordsPlaced !== prevwordsPlaced) {
//    generateVertices(width/4, height/4, wordsPlaced);
//  }
//  push();
//  fill(100);
//  stroke(0, 0, 255);
//  strokeWeight(3);
//  translate(width / 4, height /2);
//  beginShape();
//  for (let i = 0; i < vertices.length; i++) { // loop for each point in the current shape.
//    //console.log(vertices[i]);
//    vertex(vertices[i].x, vertices[i].y); // as a vertex with the point coordinates.
//  }
//  endShape(CLOSE);
//  pop();
//  wordpoly=new Polygon();
//  wordpoly.x = width/4;
//  wordpoly.y = height/2;
//  wordpoly.size = 300;
//  wordpoly.sides = wordsPlaced;
//  wordpoly.color = 'darkgray';
//  wordpoly.spin = 0;
//  prevwordsPlaced = wordsPlaced;
//}

//function generateVertices(minSize, maxSize, numpoints) { // the minSize is only there to prevent two verticies opposite eachother ending up too close since those shapes looks very odd.
//  push();
//  vertices = [];
//  translate(width/2, height/2);
//  let spread = 2*PI/(numpoints+1); // divide 360 deg (in radians) on the amount of points to later spread the points out. The +1 is used to prevent generating to angles withing the first section when looping, which can cause crossing of lines. The whole generation process can be done in "more random" ways, but this is one of the simpler.
//  for (let i = 0; i < numpoints; i++) { // repeat a amount of times equal to the amount of points we want.
//    vertices.push(p5.Vector.fromAngle(random(i*spread, (i+1)*spread)).mult(random(minSize, maxSize)));
//    // generate an angle within the first section of the rotation, then create a vector with a length of 1 pointing that direction and multiply it by a random number before adding it to a array.
//  }
//  pop();
//}
