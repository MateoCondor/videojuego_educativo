// Importar las escenas
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import SelectionLevelScene from './scenes/SelectionLevelScene.js';
import LoginScene from './scenes/LoginScene.js';
import Level1Scene from './scenes/Level1Scene.js';
import Level2Scene from './scenes/Level2Scene.js';
import Level3Scene from './scenes/Level3Scene.js';
import Level4Scene from './scenes/Level4Scene.js';
import Level5Scene from './scenes/Level5Scene.js';
import Level6Scene from './scenes/Level6Scene.js';
import Level7Scene from './scenes/Level7Scene.js';
import Level8Scene from './scenes/Level8Scene.js';
import Level9Scene from './scenes/Level9Scene.js';
import Level10Scene from './scenes/Level10Scene.js';

// Configuración de Phaser
const config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 1400,
    parent: 'game-container',
    backgroundColor: '#e0d1af',
    autoRezise: true,
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    scene: [BootScene, LoginScene, MenuScene, SelectionLevelScene, Level1Scene, Level2Scene, Level3Scene, Level4Scene, Level5Scene, Level6Scene, Level7Scene, Level8Scene, Level9Scene, Level10Scene],
    dom: {
        createContainer: true
    }
};

const game = new Phaser.Game(config);