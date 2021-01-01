class Paras {
  constructor(id, sentence, info) {
    this.id = id;
    this.sentence = sentence;
    this.words = sentence.split(' ');
    this.newstatus = 0;
    this.scorepos=0;
    this.scoreneg=0;
    this.info=info;
  }
  setval(columns, pages){
    if (pages==1){left=40;}
    else if (pages==2){left=middle +40;}
    if (pageNum>0){timer=1; baseFontSize*=3; left*=3; topMargin*=3;}
    else {timer=allWords.length*16;}
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
           //timer = 1;
           syll=RiTa.getSyllables(RiTa.stripPunctuation(word)).length;
           allWords.push(new Word(word, left, topMargin, textWidth(word), sentVal, timer, syll));
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
  constructor(word, left, topMargin, wWidth, sentVal, timer, syll){
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
    if (this.played==true || this.timer<frameCount){
      fill(255);
      noStroke();
      rect (this.left, this.topMargin+baseFontSize/6, this.wWidth, baseFontSize);  
      if (this.sentVal>0){
        fill(0,0,255,35);
        ellipse(this.left+this.wWidth/2,this.topMargin+baseFontSize*5/8,75*this.sentVal, 75*this.sentVal);
        for (r=75*this.sentVal; r<100*this.sentVal; r++){
            fill(0,0,255,8);
            if (this.played!==true){
            playSynth(2, abs(this.sentVal), 1);}
            this.played=true;
            ellipse(this.left+this.wWidth/2,this.topMargin+baseFontSize*5/8,r, r);
           }
      }
    else if (this.sentVal<0){
      fill(255,0,0,25);
      let min=75*abs(this.sentVal);
      rect(this.left,this.topMargin+baseFontSize/6, min, min);
      for (r=min; r<100*abs(this.sentVal); r++){
            fill(255, 0, 0, 8);
            rect(this.left, this.topMargin+baseFontSize/6, r, r);
      }
      if (this.played!==true){
            playSynth(1, abs(this.sentVal), 1);
          }
            this.played=true;
       }
     else if (this.played!==true){
            playSynth(3, 1, this.syll);
          }
      this.played=true;   
    if (toggle==true){
      fill(0);
      text (this.word, this.left, this.topMargin);
    }
    fill(0);
   } 
  }
}
