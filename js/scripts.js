var game = new Phaser.Game(500,500, Phaser.AUTO, 'game',{preload: preload, create: create, update: update});

var background;

var land;

var shadow;
var tank;
var turret;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

var logo;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;

function preload(){
  game.load.image('starfield', 'images/starfield.jpg');
  game.load.atlas('tank', 'images/tanks.png', 'images/tanks.json');
  game.load.image('bullet', 'images/bullet.png');
  game.load.spritesheet('kaboom', 'images/explosion.png', 64, 64, 23);
}

function create(){
  background = game.add.sprite(0, 0, 'starfield');
  
  tank = game.add.sprite(0, 0, 'tank', 'tank1');
  tank.anchor.setTo(0.5, 0.5);
  tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
  //  This will force it to decelerate and limit its speed
  game.physics.enable(tank, Phaser.Physics.ARCADE);
  tank.body.drag.set(0.2);
  tank.body.maxVelocity.setTo(400, 400);
  tank.body.collideWorldBounds = true;
  
  //  Finally the turret that we place on-top of the tank body
  turret = game.add.sprite(0, 0, 'tank', 'turret');
  turret.anchor.setTo(0.3, 0.5);
  
  //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    tank.bringToTop();
    turret.bringToTop();

    cursors = game.input.keyboard.createCursorKeys();
}

function update(){
  
  if (cursors.left.isDown)
    {
        tank.angle -= 4;
    }
    else if (cursors.right.isDown)
    {
        tank.angle += 4;
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        currentSpeed = 300;
    }
    else
    {
        if (currentSpeed > 0)
        {
            currentSpeed -= 4;
        }
    }

    if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
    }


    turret.x = tank.x;
    turret.y = tank.y;

    turret.rotation = game.physics.arcade.angleToPointer(turret);

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();
    }

}// end update

function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);

        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }

}
  
