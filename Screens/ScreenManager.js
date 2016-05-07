var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');
var spacefield;
var background;
var player;
var cursors;
var velocity;
var bulletTime = 0;
var bullet;

var enemies;
var testYazi;
var score=0;
var scoreText;
var winText;
var lives;
var enemyBullet;
var firingTimer = 0;
var livingEnemies = [];
var mainState=
    {
        preload: function () {
            game.load.image('bg', "Pictures/bg.jpg");
            game.load.image('ship', 'Pictures/ship.png');//big ship
            game.load.image('bullet', 'Pictures/bullet.png'); //döndürülmüş kırmızı bullet
            game.load.image('enemy', 'Pictures/enemy3.png');
            game.load.image('enemyBullet', 'Pictures/enemy-bullet.png');
           game.load.spritesheet('kaboom', 'Pictures/explode.png', 128, 128);
        },
        create: function () {
            spacefield = game.add.tileSprite(0, 0, 800, 600, 'bg');
            background = 5; //can change background speed there!
            player = game.add.sprite(300, 450, 'ship');
            game.physics.enable(player, Phaser.Physics.ARCADE);
            //big ship physics enabled 
            cursors = game.input.keyboard.createCursorKeys();

            bullets = game.add.group();
            bullets.enableBody = true;
            bullets.physicsBodyType = Phaser.Physics.ARCADE;

            ///enemy ile aynı tanımlandı
            enemyBullet = game.add.group();
            enemyBullet.enableBody = true;
            enemyBullet.physicsBodyType = Phaser.Physics.ARCADE;

            enemies = game.add.group();
            enemies.enableBody = true;
            enemies.physicsBodyType = Phaser.Physics.ARCADE;

            createEnemies();
            yaratEnemiesBomb();//enemy-bullet yaratıldı

            scoreString = 'Score : ';
            scoreText = game.add.text(10, 10, 'Puan: ', { font: '14px Courier New', fill: '#fff' });
            winText = game.add.text(game.world.centerX, game.world.centerY, 'You won!!!', { font: '14px Courier New', fill: '#fff' });
            winText.visible = false;


            for (var i = 0; i < 200; i++) {
                var b = bullets.create(0, 0, 'bullet');
                b.name = 'bullet' + i;
                b.exists = false;
                b.visible = false;
                b.checkWorldBounds = true;
                b.events.onOutOfBounds.add(resetBullet, this);
            }


            for (var i = 0; i < 200; i++) {
                var b = enemyBullet.create(0, 0, 'enemyBullet');
                b.name = 'enemyBullet' + i;
                b.exists = false;
                b.visible = false;
                b.checkWorldBounds = true;
                b.events.onOutOfBounds.add(enemyBullet, this);
            }

            game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        },

        update: function ()
           
        {
            //gönderdiğim bullet eğer enemyBullet'e çarparsa oyuncu kaybetsin istiyorum
            game.physics.arcade.overlap(bullets, enemyBullet, enemyHitsPlayer, null, this); //buraya düşmüyor 
            game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this); //collisionHandler'e dusuyor yani hepsini enemies olarak algılıyor
           
            player.body.velocity.x = 0;
            spacefield.tilePosition.y += background;
            if(cursors.left.isDown)
            {
                if (player.position.x > 0)
                {
                    player.body.velocity.x = -300;
                }
                
            }
            if (cursors.right.isDown)
            { 
                if (player.position.x < 700)
                {
                    player.body.velocity.x = 300;
                }
                
            }
            if (cursors.down.isDown)
            {

                if (player.position.y < 500)
                {
                    player.body.velocity.y = 300;
                }
            }
            else
            {
                player.body.velocity.y = 0;        
            }

            if (cursors.up.isDown)
            {
                if (player.position.y > 0)
                {
                    player.body.velocity.y = -500;
                }
            }
            

            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                fireBullet();
                
            }
        }
    }

function fireBullet() {

    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(player.x + 6, player.y - 8);
            bullet.body.velocity.y = -500; //speed'i
            bulletTime = game.time.now + 150;
        }
    }
    scoreText.text = 'Vurdun!';
    scoreText.text = 'Puan: ' + score;
    if(score==44)
    {
        winText.visible = true;
        score.visible = false;
        createEnemies();
        
    }
}




function resetBullet(bullet) {

    bullet.kill();
}

function createEnemies() {
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 11; x++) {
            var enemy = enemies.create(x * 50, y * 50, 'enemy');  //enemyler arasındaki boşluklar
            enemy.anchor.setTo(0.5, 0.5);
        }
    }
    enemies.x = 100;
    enemies.y = 50;

    var tween = game.add.tween(enemies).to({ x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    tween.onLoop.add(descend, this);
}//function createEnemies finish there

function descend() {
    enemies.y += 10;
}


///BU FONKSIYONDA SORUN?
function yaratEnemiesBomb() {
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 11; x++) {
            var enemy = enemies.create(x * 50, y * 50, 'enemyBullet');  //enemylerBulletler  arasındaki boşluklar
            enemy.anchor.setTo(0.5, 0.5);
        }
    }
    enemies.x = 100;
    enemies.y = 50;

    var tween = game.add.tween(enemies).to({ x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    tween.onLoop.add(descend, this);
}//function createEnemies finish there


function collisionHandler(bullet,enemy)
{
    bullet.kill();
    enemy.kill();
    score += 1;
    console.log("handler");
}

//HOCAM BU FONKSIYONA BIR DUSURTEMEDIM
function enemyHitsPlayer(bullet,enemyBullet) {
    console.log("handler2");
    enemyBullet.kill();
    player.kill(); //PLAYER OLSUN ISTIYORUM


}

game.state.add('mainState', mainState);
game.state.start('mainState');