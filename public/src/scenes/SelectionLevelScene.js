export default class SelectionLevelScene extends Phaser.Scene {
    constructor() {
        super('SelectionLevelScene');
    }

    create() {
        // Fondo
        this.add.image(700, 700, 'background').setScale(3);

        // Título
        this.add.text(700, 150, 'Seleccionar Nivel', { font: '56px Arial', fill: '#000000' }).setOrigin(0.5);

        // Configuración de la cuadrícula
        const levels = [];
        const totalLevels = 10;

        for (let i = 1; i <= totalLevels; i++) {
            levels.push({ key: `Level${i}Scene`, text: `Nivel ${i}` });
        }

        const columns = 5;
        const rows = 4;
        const buttonSpacingX = 150;
        const buttonSpacingY = 150;
        const totalWidth = (columns - 1) * buttonSpacingX;
        const totalHeight = (rows - 1) * buttonSpacingY;
        const startX = (this.cameras.main.width - totalWidth) / 2;
        const startY = (this.cameras.main.height - totalHeight) / 2;

        // Obtener el progreso del usuario
        const userId = localStorage.getItem('userId');
        fetch(`/progress?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                const levelsCompleted = data.levelsCompleted || [];

                levels.forEach((level, index) => {
                    const row = Math.floor(index / columns);
                    const col = index % columns;
                    const x = startX + col * buttonSpacingX;
                    const y = startY + row * buttonSpacingY;

                    const levelButton = this.add.image(x, y, 'lvlButton').setInteractive().setScale(0.6);
                    const levelText = this.add.text(x, y, level.text, { font: '24px Arial', fill: '#000000' }).setOrigin(0.5);

                    if (index > 0 && !levelsCompleted.includes(`Level${index}Scene`)) {
                        levelButton.setTint(0x999999); // Bloquear nivel
                        levelButton.disableInteractive();
                    } else {
                        levelButton.on('pointerout', () => {
                            levelButton.setTexture('lvlButton');
                        });

                        levelButton.on('pointerdown', () => {
                            levelButton.setTexture('lvlButtonActive');
                        });

                        levelButton.on('pointerup', () => {
                            levelButton.setTexture('lvlButton');
                            this.scene.start(level.key);
                        });
                    }
                });
            });

        // Botón Volver al Menú
        const backButton = this.add.image(700, 1200, 'backButton').setInteractive().setScale(0.6);

        backButton.on('pointerout', () => {
            backButton.setTexture('backButton');
        });

        backButton.on('pointerdown', () => {
            backButton.setTexture('backButtonActive');
        });

        backButton.on('pointerup', () => {
            backButton.setTexture('backButton');
            this.scene.start('MenuScene');
        });
    }
}