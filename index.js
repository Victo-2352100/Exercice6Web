import express from 'express';
import pokemonsRouter from './src/route/pokemon.route.js'

// Créer une application express
const app = express();

// Importer les middlewares
app.use(express.json());

app.use('/api/pokemons', pokemonsRouter)

app.use((req, res) => {
    res.status(404).send({
        "erreur": `La route ${res.url} n'existe pas!`
    })
})


// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
