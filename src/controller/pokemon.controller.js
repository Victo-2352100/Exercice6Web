import {trouverPokemon, listePokemon, listePokemonType, modifierPokemon} from '../model/pokemon.model.js'

const chercherPokemonSansID = async (req, res) => {
    await listePokemon()
    .then((pokemon) => {
        if(!pokemon[0]) {
            res.status(404);
            res.send({
                message: "Aucun pokémon n'a été trouvé!"
            });
            return;
        }
        let listePokemons = {
            "pokemons" : pokemon.slice(0, 25),
            "nombrePokemonTotal" : pokemon.length,
            "page" : 1,
            "totalPage" : (pokemon.length/25) +1
        }
        res.send(listePokemons);
    })
    .catch((erreur) => {
        console.log('Erreur: ', erreur);
        res.status(500);
        res.send({
            message: "Erreur lors de la récupération des pokémons"
        });
    })
}

const chercherPokemon = async (req, res) => {
    if(!req.params.id || parseInt(req.params.id) <= 0){
        res.status(400);
        res.send({
            message: "L'id du pokémon est obligatoire et doit être supérieur à 0"
        });
        return;
    }
    await trouverPokemon(req.params.id)
    .then((pokemon) => {
        if(!pokemon[0]) {
            res.status(404);
            res.send({
                message: "Aucun pokémon n'a été trouvé!"
            });
            return;
        }
        res.send(pokemon[0]);
    })
    .catch((erreur) => {
        console.log('Erreur: ', erreur);
        res.status(500);
        res.send({
            message: "Erreur lors de la récupération du pokémon avec l'id " + req.params.id
        });
    })
}

const listePokemonCriteres = async (req, res) => {
    if (!req.query.type) {
        await listePokemon()
        .then((pokemons) => {
            if(!pokemons[0]) {
                res.status(404);
                res.send({
                    message: "Aucun pokémon n'a été trouvé!"
                });
                return;
            }
            if(!req.query.page || parseInt(req.query.page) <= 0) {
                let listePokemons = {
                    "pokemons" : pokemons.slice(0, 15),
                    "nombrePokemonTotal" : pokemons.length,
                    "page" : 1,
                    "totalPage" : (pokemons.length/25) +1
                }
                res.send(listePokemons);
                return;
            }
            else {
                let limiteSuperieure = req.query.page * 25;
                let listePokemons;
                listePokemons = {
                    "pokemons" : pokemons.slice(limiteSuperieure-25, limiteSuperieure),
                    "nombrePokemonTotal" : pokemons.length,
                    "page" : req.params.page,
                    "totalPage" : (pokemons.length/25) +1
                }
                res.send(listePokemons);
                return;
            }
        })
        .catch((erreur) => {
            console.log('Erreur: ', erreur);
            res.status(500);
            res.send({
                message: "Echec lors de la récupération de la liste des pokemons"
            });
            return;
        })
    }
    else {
        await listePokemonType(req.query.type)
        .then((pokemons) => {
            if(!pokemons[0]) {
                res.status(404);
                res.send({
                    message: "Aucun pokémon n'a été trouvé!"
                });
                return;
            }
            if(!req.query.page || parseInt(req.query.page <=0)) {
                let listePokemons = {
                        "pokemons" : pokemons.slice(0, 25),
                        "nombrePokemonTotal" : pokemons.length,
                        "page" : 1,
                        "totalPage" : (pokemons.length/25) +1
                    }
                    res.send(listePokemons);
                    return;
            }
            let limiteSuperieure = req.query.page * 25;
            let listePokemon = {
                    "pokemons" : pokemons.slice(limiteSuperieure-25, limiteSuperieure),
                    "nombrePokemonTotal" : pokemons.length,
                    "page" : req.params.page,
                    "totalPage" : (pokemons.length/25) +1
                }
                res.send(listePokemon);
                return;
        })
        .catch((erreur) => {
            console.log('Erreur: ', erreur);
            res.status(500);
            res.send({
                message: "Erreur lors de la récupération de la liste de pokémons avec le type " + req.query.type
            });
        });
    }
}

const ajoutPokemon = async (req, res) => {
    //Prendre les variables du corps de la requête (params semble pas fonctionner avec POST)
    const {nom, type_principal, type_secondaire, pv, attaque, defense} = req.body;
    if(!nom || 
    !type_principal ||
    !pv ||
    !attaque ||
    !defense) 
    {
        res.status(400);
        res.send({
            message: "Les paramètres entrés ne sont pas valides! Le type secondaire peut rester vide au besoin.",
            variables_necessaires: {
                nom : "Le nom du pokémon",
                type_principal: "Le type principal du pokémon",
                type_secondaire: "Type secondaire du pokémon (peut être laissé vide, mais la variable dois être présente)",
                pv: "Les points de vies du pokémon",
                attaque: "Les points d'ATK du pokémon",
                defense: "Les points de DEF du pokémon"
            }
        });
    }
    await ajouterPokemon(nom, type_principal, type_secondaire, attaque, defense)
    .then((pokemon) => {
        if(type_secondaire == "NULL" || !type_secondaire) {
            type_secondaire = "Aucun";
        }
        let ajout = {
            "message" : "Le pokemon " + nom + " a été ajouté avec succès",
            "pokemon" : {
            "id": pokemon.insertId,
            "nom": nom,
            "type_primaire": type_principal,
            "type_secondaire": type_secondaire,
            "pv": pv,
            "attaque": attaque,
            "defense": defense
            }
        }
        res.status(201);
        res.send(ajout);
    })
    .catch((erreur) => {
        console.log("Erreur : ", erreur);
        res.status(500);
        res.send({
            "message" : "Erreur lors de la création du Pokémon" + nom
        });
    });

}

const altererPokemon = async (req, res) => {
    const {id} = req.params;
    const {nom, type_principal, type_secondaire, pv, attaque, defense} = req.body;
    if(!nom || 
        !type_principal ||
        !pv ||
        !attaque ||
        !defense) 
        {
            res.status(400);
            res.send({
                message: "Les paramètres entrés ne sont pas valides! Le type secondaire peut rester vide au besoin.",
                variables_necessaires: {
                    nom : "Le nom du pokémon",
                    type_principal: "Le type principal du pokémon",
                    type_secondaire: "Type secondaire du pokémon (peut être laissé vide, mais la variable dois être présente)",
                    pv: "Les points de vies du pokémon",
                    attaque: "Les points d'ATK du pokémon",
                    defense: "Les points de DEF du pokémon"
                }
            });
        }
        await modifierPokemon(id, nom, type_principal, type_secondaire, pv, attaque, defense)
        .then((pokemon) => {
            let modification = {
                "message" : `Le pokemon id ${id} a été modifié avec succès`,
                "pokemon" : {
                    "id": id,
                    "nom": nom,
                    "type_primaire": type_principal,
                    "type_secondaire": type_secondaire,
                    "pv": pv,
                    "attaque": attaque,
                    "defense": defense
                }
            };
            res.status(500);
            res.send(modification);
        })
        .catch((erreur) => {
            console.log("Erreur : ", erreur);
            res.status(500);
            res.send({
            "message" : "Échec de la modification du pokémon" + nom
        });
        });
}
export {
    chercherPokemon, chercherPokemonSansID, listePokemonCriteres, ajoutPokemon, altererPokemon
}