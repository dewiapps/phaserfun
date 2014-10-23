var game = new Phaser.Game(500,500, Phaser.CANVAS, 'game',{preload: preload, create: create, update: update});

var text = "";
var counter = 0;
var notes;
var currChord;
var fx;
var guitarNeck;
var fretsHeight = [0,60,120,180,250,300,350,400,450];
var fretsWidth = [10,76,156,230,308,384];
var fretWidth = 78;

var tone10;

var questions = {
  easy: [
    {name: "G Major", notes: [{fret: 3, finger: 2},{fret: 2, finger: 1},{fret: 0,finger: 0},{fret: 0, finger: 0},{fret: 3, finger: 3},{fret: 3, finger: 4}]},
    {name: "D Major", notes: [{fret: -1, finger: "x"},{fret: -1, finger: "x"},{fret: 0,finger: 0},{fret: 2, finger: 1},{fret: 3, finger: 3},{fret: 2, finger: 2}]},
    {name: "C Major", notes: [{fret: -1, finger: "x"},{fret: 3, finger: 3},{fret: 2,finger: 2},{fret: 0, finger: 0},{fret: 1, finger: 1},{fret: 0, finger: 0}]},
    {name: "F Major", notes: [{fret: -1, finger: "x"},{fret: -1, finger: "x"},{fret: 3,finger: 3},{fret: 2, finger: 2},{fret: 1, finger: 1},{fret: 1, finger: 1}]},
    {name: "E Major", notes: [{fret: 0, finger: 0},{fret: 2, finger: 2},{fret: 2,finger: 2},{fret: 1, finger: 1},{fret: 0, finger: 0},{fret: 0, finger: 0}]},
    {name: "A Major", notes: [{fret: -1, finger: "x"},{fret: 0, finger: 0},{fret: 2,finger: 1},{fret: 2, finger: 2},{fret: 2, finger: 3},{fret: 0, finger: 0}]}
  ],
  medium: [
    {name: "A2", notes: [{fret: -1, finger: "x"},{fret: 0, finger: 0},{fret: 2,finger: 1},{fret: 2, finger: 2},{fret: 0, finger: 0},{fret: 0, finger: 0}]},
    {name: "A7", notes: [{fret: -1, finger: "x"},{fret: 0, finger: 0},{fret: 2,finger: 2},{fret: 0, finger: 0},{fret: 2, finger: 3},{fret: 0, finger: 0}]},
    {name: "Asus", notes: [{fret: -1, finger: "x"},{fret: 0, finger: 0},{fret: 2,finger: 1},{fret: 2, finger: 2},{fret: 3, finger: 3},{fret: 0, finger: 0}]},
    {name: "D2", notes: [{fret: -1, finger: "x"},{fret: -1, finger: "x"},{fret: 0,finger: 0},{fret: 2, finger: 1},{fret: 3, finger: 3},{fret: 0, finger: 0}]},
    {name: "D7", notes: [{fret: -1, finger: "x"},{fret: -1, finger: "x"},{fret: 0,finger: 0},{fret: 2, finger: 2},{fret: 1, finger: 1},{fret: 2, finger: 3}]},
    {name: "Dsus", notes: [{fret: -1, finger: "x"},{fret: -1, finger: "x"},{fret: 0,finger: 0},{fret: 2, finger: 1},{fret: 3, finger: 3},{fret: 3, finger: 4}]},
    {name: "E7", notes: [{fret: 0, finger: 0},{fret: 2, finger: 2},{fret: 0,finger: 0},{fret: 1, finger: 1},{fret: 0, finger: 0},{fret: 0, finger: 0}]},
  ],
  hard: ["G11","C9","Dmin7b5"]
  
} // end questions

function preload(){
  //images
  game.load.image('1', 'images/1.png');
  game.load.image('2', 'images/2.png');
  game.load.image('3', 'images/3.png');
  game.load.image('4', 'images/4.png');
  game.load.image('bullet', 'images/bullet.png');
  game.load.image('guitarNeck', 'images/GuitarNeck.png');

  //tones
  game.load.audio('sfx', [ 'audio/fx_mixdown.mp3','audio/fx_mixdown.ogg' ]);
  
  for (var i=1; i < 7; i++){
    for (var j=0; j < 8; j++){
      var toneString = i.toString() + j.toString();
      game.load.audio(toneString, [ 'audio/guitar_tones/' + toneString + '.mp3','audio/guitar_tones/' + toneString + '.ogg' ]);
    }
  }

}// end preload

function create(){
  game.stage.backgroundColor = '#ffffff';
  guitarNeck = game.add.sprite(0, 50, 'guitarNeck');
  guitarNeck.scale.set(.3);

  text = game.add.text(150, 0, '', { font: "30pt Courier", fill: "#19cb65", stroke: "#119f4e", strokeThickness: 2 });
    
    fx = game.add.audio('sfx');
    fx.allowMultiple = true;
	fx.addMarker('alien death', 1, 1.0);
	fx.addMarker('boss hit', 3, 0.5);
	fx.addMarker('escape', 4, 3.2);
	fx.addMarker('meow', 8, 0.5);
	fx.addMarker('numkey', 9, 0.1);
	fx.addMarker('ping', 10, 1.0);
	fx.addMarker('death', 12, 4.2);
	fx.addMarker('shot', 17, 1.0);
	fx.addMarker('squit', 19, 0.3);
  
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

  var rand = game.rnd.integerInRange(0, questions.easy.length-1);
  currChord = questions.medium[rand];
  game.time.events.repeat(300, 6, setNotes, this);
  
//  text.setText(currChord.name); DEBUG
}

function setNotes(){
    var currFret = currChord.notes[counter].fret;
    var currFinger = (currChord.notes[counter].finger).toString();
    var toneString = (6 - counter).toString() + currFret;
    var currTone = game.add.audio(toneString);
    console.log('toneString = ' + toneString);
    if (currFret < 0 ){
      // this is an X
      fx.play('squit');
      var note = notes.create(fretsWidth[counter], fretsHeight[0], 'bullet', 0);
    }else{ 
      // not an X
      currTone.play();
      var note = notes.create(fretsWidth[counter], fretsHeight[currFret], currFinger, 0);
      note.scale.set(.4);
    }
    
    counter++;
}