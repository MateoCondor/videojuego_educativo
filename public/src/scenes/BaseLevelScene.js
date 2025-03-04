export default class BaseLevelScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.gridSize = 70; // Tamaño de cada celda en píxeles
        this.gameMatrix = []; // Matriz del juego
        this.playerPos = { x: 0, y: 0 }; // Posición del jugador en la matriz
        this.history = []; // Historial de movimientos
    }

    create(mapKey, title) {
        // Cargar el mapa
        const map = this.make.tilemap({ key: mapKey });
        const tileset = map.addTilesetImage('basepack', 'basepack');
        const tileset2 = map.addTilesetImage('buildings', 'buildings');
        const tileset3 = map.addTilesetImage('candy', 'candy');
        const tileset4 = map.addTilesetImage('ice', 'ice');
        const tileset5 = map.addTilesetImage('items', 'items');
        const tileset6 = map.addTilesetImage('request', 'request');

        this.fondo = map.createLayer('fondo', [tileset, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);
        this.colisiones = map.createLayer('colisiones', [tileset, tileset2, tileset3, tileset4, tileset5, tileset6], 0, 0);

        // Inicializar la matriz del juego
        this.initializeGameMatrix(map);

        // Crear sprites para cajas y diamantes
        this.cajas = [];
        this.diamantes = [];

        const cajaObjects = map.getObjectLayer('cajas').objects;
        const diamanteObjects = map.getObjectLayer('diamantes').objects;

        cajaObjects.forEach(caja => {
            const matrixX = Math.floor(caja.x / this.gridSize);
            const matrixY = Math.floor(caja.y / this.gridSize);
            const boxSprite = this.add.sprite(caja.x + this.gridSize / 2, caja.y + this.gridSize / 2, 'box');
            this.cajas.push({
                sprite: boxSprite,
                matrixPos: { x: matrixX, y: matrixY },
                isMarked: false // Para rastrear si la caja está marcada
            });
            this.gameMatrix[matrixY][matrixX] = 'B'; // B para Box
        });

        diamanteObjects.forEach(diamante => {
            const matrixX = Math.floor(diamante.x / this.gridSize);
            const matrixY = Math.floor(diamante.y / this.gridSize);
            const diamondSprite = this.add.sprite(diamante.x + this.gridSize / 2, diamante.y + this.gridSize / 2, 'diamond');
            this.diamantes.push({
                sprite: diamondSprite,
                matrixPos: { x: matrixX, y: matrixY },
                isHidden: false // Para rastrear si el diamante está oculto
            });
            this.gameMatrix[matrixY][matrixX] = 'D'; // D para Diamond
        });

        // Comprobar si alguna caja está sobre un diamante al inicio
        this.checkInitialBoxPositions();

        // Obtener la posición inicial del jugador desde la capa de objetos
        const jugadorObject = map.getObjectLayer('jugador').objects[0];
        const playerStartX = Math.floor(jugadorObject.x / this.gridSize);
        const playerStartY = Math.floor(jugadorObject.y / this.gridSize);

        // Actualizar la posición inicial del jugador
        this.playerPos = { x: playerStartX, y: playerStartY };
        this.player = this.add.sprite(jugadorObject.x + this.gridSize / 2, jugadorObject.y + this.gridSize / 2, 'george');
        this.player.setScale(2);

        // Configurar animaciones
        this.setupAnimations();

        // Configurar controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.movementEnabled = true;


        // Título de la escena y botones de reinicio y regreso
        this.add.text(700, 100, title, { font: '56px Arial', fill: '#000000' }).setOrigin(0.5);
        this.addBackButton();
        this.addResetButton();

        this.moves = 0;
        this.movesText = this.add.text(1000, 275, `Movimientos: ${this.moves}`, { font: '36px Arial', fill: '#000000' });

        // Mostrar el mejor puntaje
        this.showBestScore();

        this.addUndoButton();
    }

    addUndoButton() {
        const undoButton = this.add.image(200, 100, 'lvlButton').setInteractive().setScale(0.6);
        const undoText = this.add.text(200, 100, 'Deshacer', { font: '24px Arial', fill: '#000000' }).setOrigin(0.5);

        undoButton.on('pointerout', () => {
            undoButton.setTexture('lvlButton');
        });

        undoButton.on('pointerdown', () => {
            undoButton.setTexture('lvlButtonActive');
        });

        undoButton.on('pointerup', () => {
            undoButton.setTexture('lvlButton');
            this.undoLastAction();
        });
    }

    checkInitialBoxPositions() {
        this.cajas.forEach(caja => {
            const diamante = this.diamantes.find(d =>
                d.matrixPos.x === caja.matrixPos.x &&
                d.matrixPos.y === caja.matrixPos.y
            );

            if (diamante) {
                caja.sprite.setTexture('boxmark');
                caja.isMarked = true;
                diamante.isHidden = true;
                diamante.sprite.visible = false;
            }
        });
    }

    addBackButton() {
        const backButton = this.add.image(1000, 100, 'backButton').setInteractive().setScale(0.6);

        backButton.on('pointerout', () => {
            backButton.setTexture('backButton');
        });

        backButton.on('pointerdown', () => {
            backButton.setTexture('backButtonActive');
        });

        backButton.on('pointerup', () => {
            backButton.setTexture('backButton');
            this.history = [];
            this.scene.start('SelectionLevelScene');
        });
    }

    addResetButton() {
        const resetButton = this.add.image(400, 100, 'lvlButton').setInteractive().setScale(0.6);
        const resetText = this.add.text(400, 100, 'Reiniciar', { font: '24px Arial', fill: '#000000' }).setOrigin(0.5);

        resetButton.on('pointerout', () => {
            resetButton.setTexture('lvlButton');
        });

        resetButton.on('pointerdown', () => {
            resetButton.setTexture('lvlButtonActive');
        });

        resetButton.on('pointerup', () => {
            resetButton.setTexture('lvlButton');
            this.history = [];
            this.scene.restart();
        });
    }

    initializeGameMatrix(map) {
        const mapHeight = map.height;
        const mapWidth = map.width;

        // Inicializar matriz vacía
        this.gameMatrix = [];
        for (let y = 0; y < mapHeight; y++) {
            let row = [];
            for (let x = 0; x < mapWidth; x++) {
                row.push('0');
            }
            this.gameMatrix.push(row);
        }

        // Marcar colisiones en la matriz
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const tile = this.colisiones.getTileAt(x, y);
                if (tile && tile.properties.collides) {
                    this.gameMatrix[y][x] = 'W'; // W para Wall
                }
            }
        }
    }

    updateGameMatrix() {
        // Limpiar la matriz
        for (let y = 0; y < this.gameMatrix.length; y++) {
            for (let x = 0; x < this.gameMatrix[y].length; x++) {
                this.gameMatrix[y][x] = '0';
            }
        }

        // Marcar la posición del jugador
        this.gameMatrix[this.playerPos.y][this.playerPos.x] = 'P';

        // Marcar las cajas
        this.cajas.forEach(caja => {
            this.gameMatrix[caja.matrixPos.y][caja.matrixPos.x] = 'B';
        });

        // Marcar las paredes (si es necesario)
        // Aquí puedes agregar la lógica para marcar las paredes si es necesario
    }

    setupAnimations() {
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('george', { frames: [0, 4, 8, 12] }),
            frameRate: 10,
            repeat: -10
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('george', { frames: [1, 5, 9, 13] }),
            frameRate: 10,
            repeat: -10
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('george', { frames: [2, 6, 10, 14] }),
            frameRate: 10,
            repeat: -10
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('george', { frames: [3, 7, 11, 15] }),
            frameRate: 10,
            repeat: -10
        });
    }

    undoLastAction() {
        if (this.history.length === 0) return;
    
        const lastState = this.history.pop();
    
        // Restore player position
        this.playerPos = { ...lastState.playerPos };
        this.player.x = this.playerPos.x * this.gridSize + this.gridSize / 2;
        this.player.y = this.playerPos.y * this.gridSize + this.gridSize / 2;
    
        // Restore boxes
        this.cajas.forEach((caja, index) => {
            caja.matrixPos = { ...lastState.cajas[index].matrixPos };
            caja.sprite.x = caja.matrixPos.x * this.gridSize + this.gridSize / 2;
            caja.sprite.y = caja.matrixPos.y * this.gridSize + this.gridSize / 2;
            caja.isMarked = lastState.cajas[index].isMarked;
            caja.sprite.setTexture(caja.isMarked ? 'boxmark' : 'box');
        });
    
        // Restore diamonds
        this.diamantes.forEach((diamante, index) => {
            const previousDiamanteState = lastState.diamantes ? lastState.diamantes[index] : null;
            
            if (previousDiamanteState) {
                diamante.isHidden = previousDiamanteState.isHidden;
                diamante.sprite.visible = !diamante.isHidden;
            }
        });
    
        // Restore game matrix to previous state
        this.gameMatrix = JSON.parse(JSON.stringify(lastState.gameMatrix));
    
        // Increase moves as a penalty
        this.moves++;
        this.movesText.setText(`Movimientos: ${this.moves}`);
    }

    saveState() {
        const currentState = new GameState(
            this.playerPos, 
            this.cajas, 
            this.moves, 
            this.diamantes.map(diamante => ({
                matrixPos: diamante.matrixPos,
                isHidden: diamante.isHidden
            })),
            JSON.parse(JSON.stringify(this.gameMatrix)) // Deep copy of gameMatrix
        );
        this.history.push(currentState);
    
        if (this.history.length > 10) {
            this.history.shift();
        }
    }

    movePlayer(dx, dy) {
        if (!this.movementEnabled) return;

        this.saveState();

        const newX = this.playerPos.x + dx;
        const newY = this.playerPos.y + dy;

        // Verificar si la nueva posición está dentro de los límites
        if (newX < 0 || newY < 0 || newX >= this.gameMatrix[0].length || newY >= this.gameMatrix.length) {
            return;
        }

        // Verificar colisiones
        if (this.gameMatrix[newY][newX] === 'W') {
            return; // Hay una pared
        }

        // Verificar si hay una caja
        const caja = this.cajas.find(c => c.matrixPos.x === newX && c.matrixPos.y === newY);
        if (caja) {
            const newBoxX = newX + dx;
            const newBoxY = newY + dy;

            // Verificar si la caja puede moverse
            if (this.canMoveBox(newBoxX, newBoxY)) {
                // Mover la caja
                this.moveBox(caja, newBoxX, newBoxY);
                // Actualizar posición del jugador
                this.updatePlayerPosition(newX, newY);
            }
            return;
        }

        // Mover jugador si no hay obstáculos
        this.updatePlayerPosition(newX, newY);
    }

    canMoveBox(x, y) {
        if (x < 0 || y < 0 || x >= this.gameMatrix[0].length || y >= this.gameMatrix.length) {
            return false;
        }
        if (this.gameMatrix[y][x] === 'W') {
            return false;
        }
        const hasBox = this.cajas.some(c => c.matrixPos.x === x && c.matrixPos.y === y);
        return !hasBox;
    }

    moveBox(caja, newX, newY) {
        // Primero, si la caja estaba marcada y sobre un diamante, restaurar ese diamante
        if (caja.isMarked) {
            const currentDiamante = this.diamantes.find(d =>
                d.matrixPos.x === caja.matrixPos.x &&
                d.matrixPos.y === caja.matrixPos.y
            );
            if (currentDiamante && currentDiamante.isHidden) {
                currentDiamante.isHidden = false;
                currentDiamante.sprite.visible = true;
            }
            caja.isMarked = false;
            caja.sprite.setTexture('box');
        }

        // Actualizar matriz
        this.gameMatrix[caja.matrixPos.y][caja.matrixPos.x] = '0';
        this.gameMatrix[newY][newX] = 'B';

        // Mover sprite
        caja.sprite.x = newX * this.gridSize + this.gridSize / 2;
        caja.sprite.y = newY * this.gridSize + this.gridSize / 2;

        // Actualizar posición en matriz
        caja.matrixPos.x = newX;
        caja.matrixPos.y = newY;

        // Verificar si la caja está sobre un diamante en su nueva posición
        const diamante = this.diamantes.find(d =>
            d.matrixPos.x === newX &&
            d.matrixPos.y === newY &&
            !d.isHidden
        );

        if (diamante) {
            caja.sprite.setTexture('boxmark');
            caja.isMarked = true;
            diamante.isHidden = true;
            diamante.sprite.visible = false;
        }

        // Verificar si el nivel está completado
        this.checkLevelComplete();
    }

    updatePlayerPosition(newX, newY) {
        // Actualizar matriz
        this.gameMatrix[this.playerPos.y][this.playerPos.x] = '0';
        this.gameMatrix[newY][newX] = 'P';

        // Mover sprite
        this.player.x = newX * this.gridSize + this.gridSize / 2;
        this.player.y = newY * this.gridSize + this.gridSize / 2;

        // Actualizar posición en matriz
        this.playerPos.x = newX;
        this.playerPos.y = newY;

        // Deshabilitar movimiento temporalmente
        this.movementEnabled = false;
        this.time.delayedCall(200, () => {
            this.movementEnabled = true;
        });

        this.moves++;
        this.movesText.setText(`Movimientos: ${this.moves}`);
    }

    checkLevelComplete() {
        const allBoxesMarked = this.cajas.every(caja => caja.isMarked);
        if (allBoxesMarked) {
            this.time.delayedCall(200, () => {
                this.showLevelCompleteWindow();
                this.updateProgress();
            });
        }
    }

    showLevelCompleteWindow() {
        // Crear una ventana de felicitación
        const window = this.add.rectangle(700, 700, 600, 400, 0x000000, 0.8);
        const text = this.add.text(700, 600, '¡Felicidades por pasar este nivel!', { font: '32px Arial', fill: '#ffffff' }).setOrigin(0.5);

        // Botón para regresar a la selección de niveles
        const backButton = this.add.image(700, 700, 'button').setInteractive().setScale(0.4);
        const backText = this.add.text(700, 700, 'Regresar', { font: '24px Arial', fill: '#000000' }).setOrigin(0.5);

        backButton.on('pointerout', () => {
            backButton.setTexture('button');
        });

        backButton.on('pointerdown', () => {
            backButton.setTexture('buttonActive');
        });

        backButton.on('pointerup', () => {
            backButton.setTexture('button');
            this.history = [];
            this.scene.start('SelectionLevelScene');
        });

        // Botón para continuar al siguiente nivel
        const nextButton = this.add.image(700, 800, 'button').setInteractive().setScale(0.4);
        const nextText = this.add.text(700, 800, 'Siguiente Nivel', { font: '24px Arial', fill: '#000000' }).setOrigin(0.5);

        nextButton.on('pointerout', () => {
            nextButton.setTexture('button');
        });

        nextButton.on('pointerdown', () => {
            nextButton.setTexture('buttonActive');
        });

        nextButton.on('pointerup', () => {
            nextButton.setTexture('button');
            this.history = [];
            const nextLevelKey = `Level${parseInt(this.scene.key.replace('Level', '')) + 1}Scene`;
            this.scene.start(nextLevelKey);
        });
    }

    updateProgress() {
        const levelKey = this.scene.key;
        const userId = localStorage.getItem('userId'); // Obtener el userId del localStorage
        fetch('/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, level: levelKey }) // Enviar userId y level
        });

        // Actualizar puntaje
        fetch('/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, level: levelKey, moves: this.moves }) // Enviar userId, level y moves
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el puntaje');
                }
                return response.json();
            })
            .catch(error => console.error('Error al actualizar el puntaje:', error));
    }

    showBestScore() {
        const levelKey = this.scene.key;
        const userId = localStorage.getItem('userId'); // Obtener el userId del localStorage
        fetch(`/score?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                const bestScore = data.bestScores[levelKey] || 'N/A';
                this.add.text(75, 275, `Mejor Puntaje: ${bestScore}`, { font: '36px Arial', fill: '#000000' });
            })
            .catch(error => console.error('Error al obtener el mejor puntaje:', error));
    }

    update() {
        if (!this.movementEnabled) return;

        if (this.cursors.left.isDown) {
            this.player.anims.play('walk-left', true);
            this.movePlayer(-1, 0);
        } else if (this.cursors.right.isDown) {
            this.player.anims.play('walk-right', true);
            this.movePlayer(1, 0);
        } else if (this.cursors.up.isDown) {
            this.player.anims.play('walk-up', true);
            this.movePlayer(0, -1);
        } else if (this.cursors.down.isDown) {
            this.player.anims.play('walk-down', true);
            this.movePlayer(0, 1);
        }
    }
}

class GameState {
    constructor(playerPos, cajas, moves, diamantes = [], gameMatrix = []) {
        this.playerPos = { ...playerPos };
        this.cajas = cajas.map(caja => ({
            sprite: caja.sprite,
            matrixPos: { ...caja.matrixPos },
            isMarked: caja.isMarked
        }));
        this.moves = moves;
        this.diamantes = diamantes;
        this.gameMatrix = gameMatrix;
    }
}