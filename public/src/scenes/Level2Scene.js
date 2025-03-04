import BaseLevelScene from './BaseLevelScene.js';

export default class Level2Scene extends BaseLevelScene {
    constructor() {
        super('Level2Scene');
    }

    create() {
        super.create('level2','Nivel 2');
    }
}