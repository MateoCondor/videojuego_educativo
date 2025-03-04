import BaseLevelScene from './BaseLevelScene.js';

export default class Level9Scene extends BaseLevelScene {
    constructor() {
        super('Level9Scene');
    }

    create() {
        super.create('level9','Nivel 9');
    }
}