//dans les fichiers CRU, sont stockés les différents créneaux de cours, la classe cours permet de stocker les différentes caractéristiques de ces cours

var Cours = require('./creneau.js')

var Cours = function(nomMatiere, creneaux) {
    this.nomMatiere = nomMatiere;
    this.creneaux = creneaux;
}


//définition d'une méthode toString afin de visualiser le contenu de l'objet instancié
Cours.prototype.toString = function() {
    return `-Code UE : ${this.nomMatiere}\n-Creneaux : \n${this.creneaux}`;
}

module.exports = Cours;