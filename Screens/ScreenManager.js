var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');
var spacefield;
var background;
var player;
var cursors;
var velocity;
var bulletTime = 0;
var bullet;

var enemies;

var score=0;
var scoreText;
var winText;



var mainState=
    {
        preload: function () {
            game.load.image('bg', "Pictures/bg.jpg");
            game.load.image('phaser', 'Pictures/ship.png');//big ship
            game.load.image('bullet', 'Pictures/bullet.png'); //döndürülmüş kırmızı bullet
            game.load.image('enemy', 'Pictures/enemy3.png');
        },
        create: function () {
            spacefield = game.add.tileSprite(0, 0, 800, 600, 'bg');
            background = 5; //can change background speed there!
            player = game.add.sprite(300, 450, 'phaser');
            game.physics.enable(player, Phaser.Physics.ARCADE);
            //big ship physics enabled 
            cursors = game.input.keyboard.createCursorKeys();

            bullets = game.add.group();
            bullets.enableBody = true;
            bullets.physicsBodyType = Phaser.Physics.ARCADE;

            enemies = game.add.group();
            enemies.enableBody = true;
            enemies.physicsBodyType = Phaser.Physics.ARCADE;

            createEnemies();
           
            scoreString = 'Score : ';
            scoreText = game.add.text(10, 10, 'Puan: ', { font: '14px Courier New', fill: '#fff' });
            winText = game.add.text(game.world.centerX, game.world.centerY, 'You won!!!', { font: '14px Courier New', fill: '#fff' });
            winText.visible = false;

            for (var i = 0; i < 20; i++) {
                var b = bullets.create(0, 0, 'bullet');
                b.name = 'bullet' + i;
                b.exists = false;
                b.visible = false;
                b.checkWorldBounds = true;
                b.events.onOutOfBounds.add(resetBullet, this);
            }
            game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        },
        update: function ()
           
        {
            game.physics.arcade.overlap(bullets, enemies, collisionHandler,null,this);
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
                    player.body.velocity.y = -300;
                }
            }
            else
            {
                   
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
            bullet.body.velocity.y = -300;
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

function collisionHandler(bullet,enemy)
{
    bullet.kill();
    enemy.kill();
    score += 1;
}


game.state.add('mainState', mainState);
game.state.start('mainState');