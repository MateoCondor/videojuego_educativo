const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb+srv://mateo:mj241726@videojuego.e2kop.mongodb.net/?retryWrites=true&w=majority&appName=videojuego';
const DB_NAME = 'videojuego';
const PROGRESS_COLLECTION = 'progreso';
const USERS_COLLECTION = 'usuarios';
const SCORE_COLLECTION = 'puntajes';

let db, progressCollection, usersCollection, scoreCollection;

// Conectar a MongoDB
MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db(DB_NAME);
        progressCollection = db.collection(PROGRESS_COLLECTION);
        usersCollection = db.collection(USERS_COLLECTION);
        scoreCollection = db.collection(SCORE_COLLECTION);
        console.log('Conectado a MongoDB');
    })
    .catch(error => console.error(error));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener el progreso del jugador
app.get('/progress', (req, res) => {
    const { userId } = req.query;
    progressCollection.findOne({ userId })
        .then(progress => {
            if (!progress) {
                return res.json({ levelsCompleted: [] });
            }
            res.json(progress);
        })
        .catch(error => res.status(500).json({ error: 'Error al obtener el progreso' }));
});

// Ruta para actualizar el progreso del jugador
app.post('/progress', express.json(), (req, res) => {
    const { userId, level } = req.body;
    progressCollection.updateOne(
        { userId },
        { $addToSet: { levelsCompleted: level } },
        { upsert: true }
    )
        .then(result => res.json(result))
        .catch(error => res.status(500).json({ error: 'Error al actualizar el progreso' }));
});

// Ruta para registrar un nuevo usuario - CORREGIDA
app.post('/register', express.json(), async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        
        // Verificar si el usuario existe
        const existingUser = await usersCollection.findOne({ firstName, lastName });
        
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario ya existe' });
        }

        // Si no existe, crear nuevo usuario
        const result = await usersCollection.insertOne({ firstName, lastName });
        res.json(result);
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Ruta para login de usuario - MEJORADA
app.post('/login', express.json(), async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const user = await usersCollection.findOne({ firstName, lastName });
        
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para obtener el puntaje del jugador
app.get('/score', (req, res) => {
    const { userId } = req.query;
    scoreCollection.findOne({ userId })
        .then(score => {
            if (!score) {
                return res.json({ totalMoves: 0, bestScores: {} });
            }
            res.json(score);
        })
        .catch(error => res.status(500).json({ error: 'Error al obtener el puntaje' }));
});

// Ruta para actualizar el puntaje del jugador
app.post('/score', express.json(), async (req, res) => {
    const { userId, level, moves } = req.body;

    try {
        // Obtener el documento del jugador
        const player = await scoreCollection.findOne({ userId });

        if (!player) {
            // Si el jugador no existe, crear un nuevo documento
            const newPlayer = {
                userId,
                totalBestScores: moves, // Cambiado de totalMoves a totalBestScores
                bestScores: { [level]: moves }
            };
            await scoreCollection.insertOne(newPlayer);
            return res.json(newPlayer);
        }

        // Actualizar el puntaje del nivel específico
        const currentBestScore = player.bestScores[level] || Infinity;
        const newBestScore = Math.min(currentBestScore, moves);

        // Calcular la nueva suma de los mejores puntajes
        const newBestScores = { ...player.bestScores, [level]: newBestScore };
        const totalBestScores = Object.values(newBestScores).reduce((sum, score) => sum + score, 0);

        // Actualizar el documento del jugador
        await scoreCollection.updateOne(
            { userId },
            {
                $set: { bestScores: newBestScores, totalBestScores }
            }
        );

        res.json({ bestScores: newBestScores, totalBestScores });
    } catch (error) {
        console.error('Error al actualizar el puntaje:', error);
        res.status(500).json({ error: 'Error al actualizar el puntaje' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});