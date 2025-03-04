// src/scenes/MenuScene.js
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        // Fondo
        this.add.image(700, 700, 'background').setScale(3);

        // Título
        this.add.text(700, 400, 'Menú Principal', { font: '56px Arial', fill: '#000000' }).setOrigin(0.5);

        const gameButtonX = 700;
        const gameButtonY = 600;

        // Botón Nueva Partida
        const newGameButton = this.add.image(gameButtonX, gameButtonY, 'button').setInteractive().setScale(0.6);
        const newGameText = this.add.text(gameButtonX, gameButtonY, 'Jugar', { font: '24px Arial', fill: '#000000' }).setOrigin(0.5);

        newGameButton.on('pointerout', () => {
            newGameButton.setTexture('button');
        });

        newGameButton.on('pointerdown', () => {
            newGameButton.setTexture('buttonActive');
        });

        newGameButton.on('pointerup', () => {
            newGameButton.setTexture('button');
            this.scene.start('SelectionLevelScene');
        });

        // Botón Cerrar Sesión
        const logoutButton = this.add.image(gameButtonX, gameButtonY + 200, 'button').setInteractive().setScale(0.6);
        const logoutText = this.add.text(gameButtonX, gameButtonY + 200, 'Cerrar Sesión', { font: '24px Arial', fill: '#000000' }).setOrigin(0.5);

        logoutButton.on('pointerout', () => {
            logoutButton.setTexture('button');
        });

        logoutButton.on('pointerdown', () => {
            logoutButton.setTexture('buttonActive');
        });

        logoutButton.on('pointerup', () => {
            logoutButton.setTexture('button');
            localStorage.removeItem('userId'); // Eliminar el userId del localStorage
            this.scene.start('LoginScene'); // Redirigir a la escena de login
        });
    }
}