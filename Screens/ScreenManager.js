var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');
var spacefield;
var background;
var player;
var cursors;
var velocity;
var bulletTime = 0;
var bullet;

var mainState=
    {
        preload: function () {
            game.load.image('bg', "Pictures/bg.jpg");
            game.load.image('phaser', 'Pictures/ship.png');//big ship
            game.load.image('bullet', 'Pictures/bullet.png') //döndürülmüş kırmızı bullet
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
            game.physics.arcade.overlap(bullets, null, this);
            player.body.velocity.x = 0;
            spacefield.tilePosition.y += background;
            if(cursors.left.isDown)
            {
                player.body.velocity.x = -300;
            }
            if (cursors.right.isDown) {
                player.body.velocity.x = 300;
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

}
function resetBullet(bullet) {

    bullet.kill();

}

game.state.add('mainState', mainState);
game.state.start('mainState');