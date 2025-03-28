import db from '../pg_db.js'

const trouverPokemon = (id) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon WHERE id = ?";
        const params = [id];
        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat);
        });
    }); //On gère la promesse dans la section où on fait appel à la fonction
}

const listePokemonType = (type) => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon WHERE type_primaire = ? OR type_secondaire = ?";
        const params = [type, type];
        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat);
        });
    });
}

const listePokemon = () => {
    return new Promise((resolve, reject) => {
        const requete = "SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon";
        db.query(requete, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat);
        });
    });
}

const ajouterPokemon = (_nom, _type_principal, _type_secondaire, _pv, _attaque, _defense) => {
    return new Promise((resolve, reject) => {
        if(!_type_secondaire) {
            _type_secondaire = "NULL";
        }
        const requete = "INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES (?, ?, ?, ?, ?, ?)";
        const params = [_nom, _type_principal, _type_secondaire, _pv, _attaque, _defense];
        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat);
        });
    });
}

const modifierPokemon = (_id, _nom, _type_principal, _type_secondaire, _pv, _attaque, _defense) => {
    return new Promise((resolve, reject) => {
        if(!_type_secondaire) {
            _type_secondaire = "NULL";
        }
        const requete = "UPDATE TABLE pokemon SET nom = ?, type_primaire = ?, type_secondaire = ?, pv = ?, attaque = ? defense = ? WHERE id = ?";
        const params = [_nom, _type_principal, _type_secondaire, _pv, _attaque, _defense, _id];
        db.query(requete, params, (erreur, resultat) => {
            if(erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            resolve(resultat);
        });
    });
}
export {
    trouverPokemon, listePokemonType, listePokemon, ajouterPokemon, modifierPokemon
};