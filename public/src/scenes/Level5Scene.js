import BaseLevelScene from './BaseLevelScene.js';

export default class Level5Scene extends BaseLevelScene {
    constructor() {
        super('Level5Scene');
    }

    create() {
        super.create('level5','Nivel 5');
    }
}