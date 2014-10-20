var game = new Phaser.Game(500,500, Phaser.CANVAS, 'game',{preload: preload, create: create, update: update});

var text = "";
var counter = 0;
var notes;
var currChord;

var frets = [100,150,200,250,300,350,400,450,500];


var questions = {
  easy: [
    {name: "G", notes: [3,2,0,0,3,3]},
    {name: "D", notes: [-1,-1,0,2,3,2]},
    {name: "C", notes: [-1,3,2,0,1,0]}
  ],
  medium: ["Gadd9","Csus","D7"],
  hard: ["G11","C9","Dmin7b5"]
  
} // end questions

function preload(){
  game.load.image('note', 'images/bullet.png');
}

function create(){
  text = game.add.text(32, 380, '', { font: "30pt Courier", fill: "#19cb65", stroke: "#119f4e", strokeThickness: 2 });
  
  

    
}

function update(){
  
  game.input.onDown.addOnce(updateText, this);
  
  

}// end update


function updateText(){
  counter = 0;
  
  if(notes){
    notes.destroy();
  }
  
  notes = game.add.group();

  var rand = game.rnd.integerInRange(0, questions.easy.length);
  currChord = questions.easy[rand];
  
  game.time.events.repeat(300, 6, setNotes, this);
  
  text.setText(currChord.name);
}

function setNotes(){
    var currNote = currChord.notes[counter];
    if (currNote < 0 ){
      var note = notes.create(counter*70 + 10, 50, 'note', 0);
    }else{
      var note = notes.create(counter*70 + 10, frets[currChord.notes[counter]], 'note', 0);
    }
    
    counter++;
}