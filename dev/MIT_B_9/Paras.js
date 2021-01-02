class Paras {
  constructor(id, sentence) {
    this.id = id;
    this.sentence = sentence;
    this.words = sentence.split(' ');
    this.newstatus = 0;
  }
  setval(columns, pages){
    //if (this.words.length<=shortest) {text(this.sentence,20,this.id*baseFontSize+20);shortest=this.words.length;}
    //console.log(this.words.length+' vs '+shortest);
    if (pages==1){left=40;}
    else if (pages==2){left=middle +40;}
    for (var l=0; l<this.words.length; l++){ 
       var word = this.words[l];
       var lcword = word.toLowerCase();
        if (left + textWidth(word) < right) { 
          if (topMargin + baseFontSize + baseFontSize/3< height-40) {
          //text (word, left, topMargin);  
          if (sentimentRef.hasOwnProperty(lcword)){
           sentVal=sentimentRef[lcword];
         }
         else if (sentimentRef2.hasOwnProperty(lcword)){
           sentVal=sentimentRef2[lcword];
         }
         else {sentVal=0;}
           timer=allWords.length*20;
           //timer = 1;
           syll=RiTa.getSyllables(RiTa.stripPunctuation(word)).length;
           let lex=RiTa.pos(lcword);
           allWords.push(new Word(word, left, topMargin, textWidth(word), sentVal, timer, syll, lex));
           left += textWidth(word)+ 5;
        }}
        else {
          if (pages==2) {
            left = middle+40;}
          else {
            left = random(0, middle) + 40;}
            topMargin += baseFontSize + baseFontSize/3;
          l--;
        }
      }   
      left = middle + 40;
      topMargin += baseFontSize +baseFontSize/3; 
  }
  display() {}
}

class Word{
  constructor(word, left, topMargin, wWidth, sentVal, timer, syll, lex){
    this.left=left;
    this.topMargin=topMargin;
    this.wWidth=wWidth;
    this.sentVal = sentVal;
    this.word=word;
    this.timer=timer;
    this.played=false;
    this.syll=syll;
  }
  showWord(){
    if (this.timer<frameCount){
    fill(255);
    noStroke();
    rect (this.left, this.topMargin+baseFontSize/8, this.wWidth, baseFontSize+baseFontSize/4);  
    if (this.sentVal>0){
    for (var r=0; r<100*this.sentVal; r++){
            fill(0,255,0,10);
            if (this.played!==true){
            playSynth(2, abs(this.sentVal), 1);}
            this.played=true;
            ellipse(this.left+this.wWidth/2,this.topMargin+baseFontSize*5/8,r, r);
           }
    }
    else if (this.sentVal<0){
    for (var r=0; r<100*abs(this.sentVal); r++){
            fill(255,0,0,10);
            if (this.played!==true){
            playSynth(1, abs(this.sentVal), 1);}
            this.played=true;
            rect(this.left,this.topMargin,r, r);
           }}
    else if (this.played!==true){
            playSynth(3, 1, this.syll);
          }
            this.played=true;
    
    if (go==true){
      fill(0);
      //myVoice.speak(this.word);
      fill(0,0,255);
      text(this.syll, this.left, this.topMargin-6);
      text (this.word, this.left, this.topMargin);}
  } 
  }
}
