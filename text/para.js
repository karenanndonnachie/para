/**************
Politics of paratext
early concept sketch by k.donnachie & a.simionato
november 2020
based on these libraries : p5.js, p5speech.js, p5dom.js
using MIT sentiment analysis database afinn165
using these typefaces : Adobe Garamond and Helvetica Now 
----------------
Requires microphone input (speech to text)
Press DOWN ARROW or add ?frame to the url ==> https://karenanndonnachie.github.io/para/para/index.html?frame
Space-bar will toggle logging info of sentiment analysis count
***************/
var img, xPosition, yPosition, size, rand, letter, speed,fade, sentCol, textCol, i;
var letterCount=0;
var wigglyLetters = [];
//var longtext/layout stuff;
var sentence, words, spoken, columns, fontpos, fontneg,pStartX, pStartY, pWidthX, pWidthY, fontSize;
// Sentiment stuff
var sentimentRef, queryString;
var scoreOn = false;
var list= [];
var totalScore = 0;
// speech to text stuff
let lang = navigator.language || 'en-US';
let speechRec = new p5.SpeechRec(lang, gotSpeech);
let continuous = true;
let interim = true;
var sentence = '';
function preload () {
    sentimentRef = loadJSON('MIT_afinn_165.json');
    fontneg=loadFont('data/AGaramondPro-Regular.otf');
    fontpos=fontneutral=loadFont('data/HelveticaNowDisplay.otf');
    img = loadImage('data/donnachie_simionato_para.png');
}

function setup() {
  queryString = window.location.search;
  if (queryString=='?frame'){ img.save('donnachie_simionato_paraText', 'png');}
  spoken = new p5.Speech(); // speech synthesis object
  createCanvas(windowWidth,windowHeight);
  background (0);
  fontSize=36;
  textSize(fontSize);
  fill(255);
  textFont(fontpos);
  sentCol=([0,0,0]);
  xPosition = 100;
  yPosition = 100;
  pStartX=100;
  pStartY=100; 
  pWidthX=width-200; 
  pWidthY=height-200;
  speechRec.onResult = showResult;
  speechRec.start(continuous, interim);
  fill (120);
  textAlign(CENTER, BASELINE);
  text ("we need to talk...", width/2, height/2);
  words=shuffle(sentence.split(' '));
  textCol=([120,120,120]);
}
function draw() {
 fill(textCol);
 show();
 textSize(36);
 textAlign(LEFT, BASELINE);
 if (scoreOn == true){
 text ('Score: '+totalScore+' from '+words.length+'words', 100, height-50);
 }
}

function showResult(){
 if (speechRec.resultValue === true) { 
   sentence = speechRec.resultString;
   words=sentence.split(' ');
   totalScore=0;
   for (var i = 0; i < words.length; i++) {
      var word = words[i].toLowerCase();
      console.log(word);
      if (sentimentRef.hasOwnProperty(word)){
        console.log('yippee');
        var score = sentimentRef[word];
        console.log(word, score);
        totalScore += Number(score);
        list.push(word + ': ' + score + ' ');
      }
   }
   letter = sentence[letterCount];
   wigglyLetters.push(new Wiggle (random(windowWidth), random(windowHeight), 40, letter));
   if (letterCount<sentence.length){
      letterCount++;
     } else {
       letterCount =0; 
     }
   words=shuffle(sentence.split(' '));  
  }
}

function show(){
 if (sentence.length>0){
 if (totalScore>0){
   textLeading(width/15);
   textSize(width/20);
   textAlign(CENTER, CENTER);
   fill(255,0,255);
   background(sentCol);
   sentenceNow=sentence.toLowerCase();
   sentCol=([255,255,0]);
   pStartX=width/2; pStartY=height/2; pWidthX=width/2; pWidthY=height/2;
   for (var i=0; i<wigglyLetters.length; i++){
     wigglyLetters[i].wiggle();
     wigglyLetters[i].display();
   }
  }
  else if (totalScore<0) {
   background(0); 
   sentCol=([0,0,0]); 
   fill(180);
   sentenceNow=sentence.toUpperCase(); pStartX=150; pStartY=100; pWidthX=width-300; pWidthY=height-300; textLeading(width/10);textAlign(LEFT, BASELINE); textFont(fontneg); textSize(width/10);}
  else { 
    sentenceNow=sentence; textAlign(CENTER, BASELINE); sentCol=([200,200,200]); pStartX=100; pStartY=100; pWidthX=width-200; pWidthY=height-200; background (255); fill(100);textFont(fontneutral);textSize(36); 
  }
  text(sentenceNow, pStartX, pStartY, pWidthX, pWidthY); 
  }
}
function gotSpeech(){
  if(speechRec.resultValue === true){    
    sentence=speechRec.resultString;
  }
}
  
function mousePressed(){
 //spoken.speak(words); 
  size = int(random(6,100));
  //letter = char(int(random(60,160)));
  letter = sentence[letterCount];
  wigglyLetters.push(new Wiggle (mouseX, mouseY, size, letter));
  if (letterCount<sentence.length){
    letterCount++;
   } else {
 letterCount =0; 
 }
}
// This keyTyped function 
function keyTyped() {
//  wigglyLetters.push (new Wiggle (xPosition, yPosition, 54, key));
//  xPosition += 54;
  if (key == ' '){
    scoreOn=!scoreOn;
  }
}
function keyPressed(){
  if (keyCode === DOWN_ARROW){
    save('donnachie_simionato_para.png');
  }
//  else if (keyCode === RIGHT_ARROW) {
//   yposition +=60;
//   xposition = 0;
//  }
}
class Wiggle {  
  constructor (x, y, size, letter) {
    this.x = x;
    this.y = y;
    this.textSize = fontSize;
    this.letter = letter;
    this.fade = 255;
  }
  wiggle() {
    //this.x += random (-2,2);
    //this.y += random (-2,2);
    speed = map(mouseY, 0, windowHeight, 0,10);
    this.x += random (-speed, speed);
    this.y += random (-speed, speed);
    this.textSize+=random (-speed/4, speed/4);
    if (this.fade >0){
      this.fade -= random (0,1);
    }
  }
  display(sentCol) {
    //background(sentCol,1);
    //ellipse (this.x, this.y, this.textSize, this.textSize);
    noStroke();
    textSize(this.textSize);
    fill (255,0,255, this.fade);
    //ellipse (this.x, this.y, this.textSize, this.textSize);
    text(this.letter, this.x, this.y);
  }
}
