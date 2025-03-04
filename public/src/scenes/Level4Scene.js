import BaseLevelScene from './BaseLevelScene.js';

export default class Level4Scene extends BaseLevelScene {
    constructor() {
        super('Level4Scene');
    }

    create() {
        super.create('level4','Nivel 4');
    }
}