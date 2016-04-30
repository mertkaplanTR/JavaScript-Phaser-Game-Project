
var gameWidth = 800;
var gameHeight = 450;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'KulturGameDev');
var mainState={
    preload: function () {

    },
    
    create: function () {
    },

    update: function () {

    }

}

game.state.add('mainState', mainState);
game.state.start('mainState');
