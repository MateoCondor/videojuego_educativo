import BaseLevelScene from './BaseLevelScene.js';

export default class Level1Scene extends BaseLevelScene {
    constructor() {
        super('Level1Scene');
    }

    create() {
        super.create('level1','Nivel 1');
    }
}