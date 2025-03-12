import express from 'express'
import {chercherPokemon, chercherPokemonSansID, listePokemonCriteres, ajoutPokemon, altererPokemon} from '../controller/pokemon.controller.js'
const router = express.Router();

router.get('/', chercherPokemonSansID);
router.get('/liste', listePokemonCriteres);
router.get('/:id', chercherPokemon);
router.put('/:id', altererPokemon);
router.post('/', ajoutPokemon);

export default router;