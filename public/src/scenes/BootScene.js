// src/scenes/BootScene.js
export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Cargar mapas
        this.load.tilemapTiledJSON('level1', 'assets/maps/level1.tmj');
        this.load.tilemapTiledJSON('level2', 'assets/maps/level2.tmj');
        this.load.tilemapTiledJSON('level3', 'assets/maps/level3.tmj');
        this.load.tilemapTiledJSON('level4', 'assets/maps/level4.tmj');
        this.load.tilemapTiledJSON('level5', 'assets/maps/level5.tmj');
        this.load.tilemapTiledJSON('level6', 'assets/maps/level6.tmj');
        this.load.tilemapTiledJSON('level7', 'assets/maps/level7.tmj');
        this.load.tilemapTiledJSON('level8', 'assets/maps/level8.tmj');
        this.load.tilemapTiledJSON('level9', 'assets/maps/level9.tmj');
        this.load.tilemapTiledJSON('level10', 'assets/maps/level10.tmj');

        // Cargar imágenes
        this.load.image('background', 'assets/images/background.png'); // Imagen de fondo
        this.load.image('button', 'assets/images/button.png'); // Imagen de botón
        this.load.image('buttonActive', 'assets/images/buttonActive.png'); // Imagen de botón al hacer clic
        this.load.image('lvlButton', 'assets/images/lvlButton.png'); // Imagen de caja
        this.load.image('lvlButtonActive', 'assets/images/lvlButtonActive.png'); // Imagen de caja al hacer clic
        this.load.image('backButton', 'assets/images/backButton.png'); // Imagen de botón de regreso
        this.load.image('backButtonActive', 'assets/images/backButtonActive.png'); // Imagen de botón de regreso al pasar el mouse
        this.load.image('box', 'assets/images/box.png');
        this.load.image('diamond', 'assets/images/diamond.png');
        this.load.image('boxmark', 'assets/images/boxmark.png');
        this.load.image('basepack', 'assets/tilesets/basepack.png');
        this.load.image('buildings', 'assets/tilesets/buildings.png');
        this.load.image('candy', 'assets/tilesets/candy.png');
        this.load.image('ice', 'assets/tilesets/ice.png');
        this.load.image('items', 'assets/tilesets/items.png');
        this.load.image('request', 'assets/tilesets/request.png');

        this.load.spritesheet('george', 'assets/sprites/george.png', {
            frameWidth: 48,
            frameHeight: 48
        });
    }

    create() {
        this.scene.start('LoginScene');
    }
}