import BaseLevelScene from './BaseLevelScene.js';

export default class Level0Scene extends BaseLevelScene {
    constructor() {
        super('Level10Scene');
    }

    create() {
        super.create('level10','Nivel 10');
    }
}