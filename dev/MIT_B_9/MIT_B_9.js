var font, font2, middle, para, left, topMargin, right, wordsPlaced, prevwordsPlaced, wordpoly, wWidth, queryString;
var beep, bop, first, sent, timer, columns, pages, polySynth, played, currfreq, syll, allFonts, numPages, pageNum;
var myText="";
var go = false;
var fontSizes = [16, 24, 48, 72];
var baseFontSize;
var list=[];
var allSentences=[];
var vertices = [];
var allWords=[];
var sentimentRef, sentVal;
var shortest= 6;
var corpus = ["data/books/austen-emma.txt", "data/books/moby_short.txt", "data/books/austen-sense.txt", "data/books/blake-poems.txt", "data/books/whitman-leaves.txt", "data/books/shakespeare-macbeth.txt"];
var titles = ["Jane Austen", "Moby Dick", "Sense & Sensibility", "William Blake Poetry", "Walt Whitman", "Macbeth"] ;
function preload () {
  list = loadStrings(random(corpus));
  font=loadFont('data/fonts/HelveticaNowDisplay.otf');
  font2=loadFont('data/NewRocker-Regular.ttf');
  sentimentRef = loadJSON('data/sentiment/MIT_afinn_165.json');
  sentimentRef2 = loadJSON('data/sentiment/vader.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let params = getURLParams();
  if(params.seed>0 && params.page>0){
  randomSeed(params.seed);
  pageNum=params.page;
  }
  go=false;
  allFonts=[font, font2];
  numPages=[1,2];
  pages=random(numPages);
  baseFontSize = random(fontSizes);
  textFont(random(allFonts));
  columns=random([1,2,4]);
  textAlign(LEFT, TOP);
  polySynth = new p5.PolySynth();
  currfreq=60;
}

function draw() {
  //if (go==true){
  background(235);
  drawPageSpace();
  //setNumbers();
  //setText(); // could be only on text change / windowrefresh & first draw
  //left = middle + 40;
  topMargin = 40;
  right = width-40;
  wordsPlaced=0;
  //console.log('all'+allSentences);
  allWords.forEach(each => {
    each.showWord();
    wordsPlaced++;
    //console.log(first);
  }
  );
  //allSentences.forEach(para => {
  //  para.display();
  //  //console.log(first);
  //});
  //setIllust();
  //wordpoly.show();
  //} else {ellipse(width/2, height/2, 60, 60);}
  //noLoop();
}

function drawPageSpace() {
  stroke(0);
  middle = int(width/2);
  if (pages==2) {
    background(235);
    line(middle, 0, middle, height);
    left = middle + 40;
    push();
    noFill();
    stroke(255);
    strokeWeight(10);
    rect(10, 5, width-20, height-10);
    pop();
    } 
  else {
    if (columns==1) {
    left = 40;}
    else if (columns==4) {
      left = random(40,width-200);
    background(200);
  }  
}
}
//function setNumbers(){}

function setText() {
  shortest=9;
  allSentences=[];
  para=[];
  para = RiTa.splitSentences(list.join(' ').toString());
  //console.log(para);
  for (var p=0; p<para.length; p++) {
    allSentences.push(new Paras(p, para[p]));
    //if (para[p].length<=shortest) {shortest=para[p].length;}
  }
  allWords=[];
  allSentences.forEach(sent => {
    sent.setval(columns, pages);
  }
  );
  frameCount=0;
  //setIllust();
  //text(para.join('\n'), 40, 40, middle-60,height-80 );
  //first=true;
}

// function setIllust() {
//   if (wordsPlaced !== prevwordsPlaced) {
//     generateVertices(width/4, height/4, wordsPlaced);
//   }
//   push();
//   fill(100);
//   stroke(0, 0, 255);
//   strokeWeight(3);
//   translate(width / 4, height /2);
//   beginShape();
//   for (let i = 0; i < vertices.length; i++) { // loop for each point in the current shape.
//     //console.log(vertices[i]);
//     vertex(vertices[i].x, vertices[i].y); // as a vertex with the point coordinates.
//   }
//   endShape(CLOSE);
//   pop();
//   wordpoly=new Polygon();
//   wordpoly.x = width/4;
//   wordpoly.y = height/2;
//   wordpoly.size = 300;
//   wordpoly.sides = wordsPlaced;
//   wordpoly.color = 'darkgray';
//   wordpoly.spin = 0;
//   prevwordsPlaced = wordsPlaced;
// }

// function generateVertices(minSize, maxSize, numpoints) { // the minSize is only there to prevent two verticies opposite eachother ending up too close since those shapes looks very odd.
//   push();
//   vertices = [];
//   translate(width/2, height/2);
//   let spread = 2*PI/(numpoints+1); // divide 360 deg (in radians) on the amount of points to later spread the points out. The +1 is used to prevent generating to angles withing the first section when looping, which can cause crossing of lines. The whole generation process can be done in "more random" ways, but this is one of the simpler.
//   for (let i = 0; i < numpoints; i++) { // repeat a amount of times equal to the amount of points we want.
//     vertices.push(p5.Vector.fromAngle(random(i*spread, (i+1)*spread)).mult(random(minSize, maxSize)));
//     // generate an angle within the first section of the rotation, then create a vector with a length of 1 pointing that direction and multiply it by a random number before adding it to a array.
//   }
//   pop();
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawPageSpace();
  setText();
  //generateVertices(width/4, height/4, wordsPlaced);
  setIllust();
}

// This keyTyped function 
function keyTyped() {
  //loop();
  //go=true;
  switch(key) {
  case '1':
    frameCount=0;
    //myText="";
    go=!go;
    pages=1;
    loadStrings("data/books/milton-paradise.txt", newText);
    break;
  case '2':
    frameCount=0;
    //myText="";
    pages=2;
    myText = "It fell out as Wemmick had told me it would, that I had an early opportunity of comparing my guardian’s establishment with that of his cashier and clerk. My guardian was in his room, washing his hands with his scented soap, when I went into the office from Walworth; and he called me to him, and gave me the invitation for myself and friends which Wemmick had prepared me to receive. “No ceremony,” he stipulated, “and no dinner dress, and say to-morrow.” I asked him where we should come to (for I had no idea where he lived), and I believe it was in his general objection to make anything like an admission, that he replied, “Come here, and I’ll take you home with me.” I embrace this opportunity of remarking that he washed his clients off, as if he were a surgeon or a dentist. He had a closet in his room, fitted up for the purpose, which smelt of the scented soap like a perfumer’s shop. It had an unusually large jack-towel on a roller inside the door, and he would wash his hands, and wipe them and dry them all over this towel, whenever he came in from a police court or dismissed a client from his room. When I and my friends repaired to him at six o’clock next day, he seemed to have been engaged on a case of a darker complexion than usual, for we found him with his head butted into this closet, not only washing his hands, but laving his face and gargling his throat. And even when he had done all that, and had gone all round the jack-towel, he took out his penknife and scraped the case out of his nails before he put his coat on.";
    setText(myText);
    break;
  case '3':
    frameCount=0;
    pages=1;
    //myText="";
    loadStrings(random(corpus), newText);
    break;
  case '4':
    frameCount=0;
    pages=2;
    //myText="";
    loadStrings(random(corpus), newText);
    break;
  case '5':
    bgcol= [255, 5];
    break;
  case 'c':
    pages=1;
    break;
  case 'v':
    go=!go;
    break;
  case 'x':
    pages=2;
    break;
  }
}

function newText(result) {
  background(200);
  baseFontSize=random(fontSizes);
  textSize(baseFontSize);
  textFont(random(allFonts));
  pages=int(random(1,3));
  columns=int(random(1,4));
  myText="";
  list=[];
  var randomselection = random(result.length);
  list=subset(result, randomselection, randomselection+8) ;
  //var myTextID=int(random(result.length-20));
  //console.log(myTextID);
  //shortestSentence=12;
//   for (i=myTextID; i<8+myTextID; i++) {
//     //console.log(result[i]);
//     let addtext=result[i].substring(0, result[i].length - 1);
//     //console.log(addtext);
//     myText+=' '+addtext;
  //}
  console.log('f:'+ font + ' / s:' + baseFontSize + ' / p:' + pages + ' / c:'+columns);
  setText();
}

function mousePressed() {
  go=!go;
  firstdraw();
}

function firstdraw() {
  drawPageSpace();
  setText();
  //setIllust();
  go=true;
}

function playSynth(tone, size, syll) {
  userStartAudio();

  // note duration (in seconds)
  let dur = 3.0 * size;

  // time from now (in seconds)
  let time = 0;

  // velocity (volume, from 0 to 1)
  let vel = 0.1;

  // notes can overlap with each other
  if (tone==1) {
    polySynth.play('G2', vel*3, 0, dur);
    polySynth.play('C3', vel*3, time += 1/4, dur);
    polySynth.play('G3', vel*3, time += 1/4, dur);
    //currfreq=60;
  } else if (tone==2) {
    polySynth.play('B4', vel*3, 0, dur);
    polySynth.play('C5', vel*3, time += 1/4, dur);
    polySynth.play('A4', vel*3, time += 1/4, dur);
    //currfreq=60;
  } else if (tone==3) {
    //currfreq=60;
    polySynth.play(midiToFreq(64-syll), 0.2, 0, syll/8 );
    //currfreq++;
    //polySynth.play('D4', vel, time += 1/3, dur*0.5);
  }
}
