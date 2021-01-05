/*
THE POLITICS OF THE PARATEXT, 2021, by Karen ann Donachie and Andy Simionato 
This generative work has been created for the 2021 MIT CAST Symposium exhibition, 
"Generative Unfoldings", curated by Nick Montfort.
*
All p5js code and design is claimed as original by the authors, including paratext classes, 
with the exception of the following open [re]source libraries:
  -  Processing / P5js / p5 Sound / RiTajs
  -  Gutenberg texts
  -  Sentiment analysis dictionaries [MIT_affin_165 and Vader]
The authors are extremely grateful to the administrators, coders, and designers of these resources & libraries.
*/
var corpus = ["data/books/blake-poems.txt", "data/books/austen-emma.txt", "data/books/austen-persuasion.txt", "data/books/austen-sense.txt", "data/books/bible-kjv.txt", "data/books/blake-poems.txt", "data/books/bryant-stories.txt", "data/books/burgess-busterbrown.txt", "data/books/carroll-alice.txt", "data/books/chesterton-brown.txt", "data/books/chesterton-thursday.txt", "data/books/edgeworth-parents.txt", "data/books/melville-moby_dick.txt", "data/books/milton-paradise.txt", "data/books/moby_short.txt", "data/books/shakespeare-hamlet.txt", "data/books/shakespeare-macbeth.txt", "data/books/whitman-leaves.txt"];
var list=[];
var which=[];
var para="";
var first, sentSent, sentence, middle, right, left, columns, pages, ID, polySynth, tone, size, rParams, sentVal, sentimentRef, sentimentRef2, l, word, rWord, syll, pos1, pos2, sentVal, boxh, boxw, currfreq, played;
var title="";
var fontSizes = [36, 72, 96];
var baseFontSize=36;
var words=[];
var topMargin=30;
var allwords=[];
var allsentences=[];
var paranalysis=[];
var debug=false; 
var read=false; 
function preload() {
  font=loadFont('data/fonts/HelveticaNowDisplay.otf');
  sentimentRef = loadJSON('data/sentiment/MIT_afinn_165.json');
  sentimentRef2 = loadJSON('data/sentiment/vader.json');
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  if(params.seed > 0 && params.page>0){
    randomSeed(params.seed);
    pageNum=params.page;
    toPrint=true;
    fontSizes = [72, 96, 120];
    toPrint();
    //pg=createGraphics(2412, 3074);
    //createCanvas(4824, 3074); // OR HALF IF PIXEL DENSITY @ 2!!
    //DOM control with p5.dom.js OR force reload
    //<canvas id="c" width="2412" height="3074" style="width: 840px; height: 1025px;"></canvas>
  }
  loadStrings(random(corpus), newText);
  rParams = {ignoreStopWords: 
  true, ignoreCase: 
  true, ignorePunctuation: 
    true
  };
  bgcol=[210];
  boxh=height/8;
  boxw=height/8;
  textFont(font);
  textSize(baseFontSize);
  textAlign(LEFT, TOP);
  polySynth = new p5.PolySynth();
  frameRate(30);
  right=width-50;
  left=50;
  middle=width/2;
  columns=random([1, 2, 4]);
}

function mousePressed() {
  bgcol=[0];
  title="";
  paranalysis=[];
  para="";
  sentence=0;
  columns=random([1, 2, 4]);
  background(bgcol);
  loadStrings(random(corpus), newText);
}
function keyTyped() {
  switch(key) {
  case ' ':
    read=!read;
    break;
  case 'x':
    debug=!debug;
    break;
  }
}

/****** PARSE STRINGS ******/
function newText(result) {
  allwords=[];
  sentSent=0;
  para="";
  bgcol=[210];
  list=[];
  // IF NOT ENOUGH TEXT HAS LOADED
  if (result.length<300) {
    list=[]; 
    paranalysis=[]; 
    para="";
    background(bgcol);
    loadStrings(random(corpus), newText);
  } else {
    let randomselection = round(random(result.length-300));
    let numsent=1;
    list = result.slice(randomselection, randomselection+numsent);
    while (list.toString().length < 1000) { 
      numsent+= 1;
      list = result.slice(randomselection, randomselection+numsent);
    }
    console.log(randomselection+', '+ list.length+', '+list.toString().length);
  }
  // GRAB TITLE BEFORE CLEARING VARIABLE
  title=result[0];
  console.log(title);
  result=[];
  ID=0;
  // RITA PARSE KNOWN WORDS
  for (let l=0; l<list.length; l++) {
    let i;
    para = list[l].toString();
    para = para.replace(/,, /g, ', ');
    let test=new RiString(para);
    words = test.words();
    for (i=0; i<words.length; i++) {
      ID++;
      let rWord = RiTa.stripPunctuation(words[i]);
      if (sentimentRef.hasOwnProperty(rWord.toLowerCase())) {
        sentVal=sentimentRef[rWord.toLowerCase()];
      } else if (sentimentRef2.hasOwnProperty(rWord.toLowerCase())) {
        sentVal=sentimentRef2[rWord.toLowerCase()];
      } else {
        sentVal=0;
      }
      if (RiTa.getSyllables(rWord, rParams)>"") {
        let syll=RiTa.getSyllables(rWord, rParams);
        let lex = new RiString(rWord.toLowerCase());
        let flex = lex.features();
        if (words[i+1]==',' || words[i]=='.') {
          words[i]=join([words[i], words[i+1]], '');
          allwords.push(new Word(l, words[i], rWord, syll, flex.pos, sentVal, ID));
          i++;
        } else { 
          allwords.push(new Word(l, words[i], rWord, syll, flex.pos, sentVal, ID));
        }
        paranalysis.push([l, words[i], rWord, syll, flex.pos[0], flex.pos[1], sentVal]);
        //allwords.push(new Word(l, words[i], rWord, syll, flex.pos[0], flex.pos[1], sentVal, ID));
      } else {//text('ignored that one!'+ words[i], width/2, 100+i*20);
        paranalysis.push([l, words[i], rWord, [""], "", "", sentVal]);
        if (words[i]!==',' && words[i]!=='.') { 
          allwords.push(new Word(l, words[i], rWord, [""], "", "", sentVal, ID));
        }
      }
    }
  }
  sentence=0;
  baseFontSize = random(fontSizes);
  textSize(baseFontSize);
  topMargin=baseFontSize;
  frameCount=0;
  allwords.forEach(each => {
    each.place(columns, pages, baseFontSize, sentence);
  }
  );
  frameCount=0;
  // HUMAN READABLE TEXT ==>DEBUG
  para = join(list, ' ');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sentence=0;
  right=width-40;
  topMargin=baseFontSize;
  allwords.forEach(each => {
    each.place(columns, pages, baseFontSize, sentence);
  }
  );
}

function draw() {
  background(bgcol);
  fill(0);
  allwords.forEach(each => {
    each.build();
    if (debug==true) {
      console.log(each);
    }
  }
  ); 
  push();
  fill(255);
  textSize(24);
  if (read==true) {
    fill(0);
    text(title, width/2-textWidth(title)/2, height-60);
  }  
  pop();
}
function makeShape(pos1, pos2, pos3, x, y, syll, sentVal, wWidth, ID, listID, first) {
  switch(pos1) {
  case 'p':
    push();
    //noStroke();
    stroke(0);
    translate(x, y);
    fill(120, 120, 120, 2 );
    let min=boxw-wWidth/2;
    stroke(0, 0, 0, 100);
    rotate(QUARTER_PI*sin(ID));
    quad(0, wWidth, wWidth*cos(listID), boxw*(sentVal+1), (unchar(pos2)-65)*2, wWidth, syll.length, 0);
    for (let m=min; m<boxw; m++){
       fill(currfreq,100,100,0.1);
       quad(0, wWidth, wWidth*cos(listID), boxw*(sentVal+1), unchar(first)-65, wWidth, syll.length, 0) ;
      }
    pop();   
    break;
  case 'v':
    push();
    translate(x, y);
    stroke(0);
    line(-boxw, boxh/2, 2*boxw, boxh/2);
    line(boxw/2, -boxh, boxw/2, 2*boxh);
    let cx, cy;
    let secondsRadius= wWidth;
    stroke(255, 0, 0);
    translate(boxw/2, boxw/2);
    cx = 0;
    cy = 0;
    let arm = map(unchar(pos3), 65, 115, 1, 12);
       rotate(sin(frameCount/wWidth-ID));
      let s = map(arm, 0, 12, 0, TWO_PI) - QUARTER_PI; 
    line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
    pop();
    break;
  case 'w':
    push();
    translate(x, y);
    stroke(0, 0, 255);
    line(0, -boxh, boxw/2, -boxh/2);
    line(boxw/2, -boxh/2, 0, 0);
    line(0, 0, boxw/2, boxh/2);
    line(boxw/2, boxh/2, 0, boxh);
    pop();
    break;
  case 'n':
    push();
    translate(x+wWidth/2, y+baseFontSize/2);
    rotate(syll.length/2*PI);
    noFill();
    if (first>95){first-=30;}
    first-=65;   
    let closed=[OPEN, OPEN, PIE, PIE, CHORD, CHORD];
    for (let c=0; c<20; c++){
      stroke(c*10);
      arc(c, c, wWidth, wWidth, syll.length*QUARTER_PI, sentVal*QUARTER_PI, closed[abs(sentVal)]);
    }
    pop();
    break;
  case 'j':
    push();
    translate(x, y);
    first=(unchar(first));
    if (first>95){first-=30;}
    first-=65;
    currFreq=map(first, 0, 25, 0, 100);
    colorMode(HSB, 100);
    fill(currFreq, 100, 100, 50);
    noStroke();
    rotate(sentVal*QUARTER_PI);
    rect(0, 5*boxw/12, wWidth, boxw/6);
    colorMode(RGB);
    pop();
    break;
  case 'i':
    push();
    translate(x, y);
    fill(0);
    ellipse(boxw/2, boxh/2, 20, 20);
    pop();
    break;
  case 't':
    push();
    translate(int(x+wWidth/2), int(y+baseFontSize/2));
    stroke(0); 
    star(0, 0, wWidth, words.length, sentVal);
    pop();
    break;
   case 'r':
     push();
     translate(x-wWidth,y-wWidth);
     for (let g=0; g<wWidth; g+= 5){
      fill(10, 10, 10, 1);
      rect(g,g,2*wWidth, 2*wWidth+2);
     }
    pop();
  }
}
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
function playSynth(tone, size, syll) {
  userStartAudio();
  let dur = 3.0 * size;
  let time = 0;
  let vel = 0.1;
  if (tone==1) {
    polySynth.play('G2', vel*3, 0, dur);
    polySynth.play('C3', vel*3, time += 1/4, dur);
    polySynth.play('G3', vel*3, time += 1/4, dur);
  } else if (tone==2) {
    polySynth.play('B4', vel*3, 0, dur);
    polySynth.play('C5', vel*3, time += 1/4, dur);
    polySynth.play('A4', vel*3, time += 1/4, dur);
  } else if (tone==3) {
    polySynth.play(midiToFreq(64-syll.length), 0.2, 0, syll.length/8 );
  }
}
