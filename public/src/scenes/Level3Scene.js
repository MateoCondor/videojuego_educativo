import BaseLevelScene from './BaseLevelScene.js';

export default class Level3Scene extends BaseLevelScene {
    constructor() {
        super('Level3Scene');
    }

    create() {
        super.create('level3','Nivel 3');
    }
}