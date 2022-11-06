//un creneau correspond à la ligne d'un créneau de cours composant un fichier CRU

var Creneau = function(type, population, jour, horaire, index, salle) {
    this.type = type
    this.population = population;
    this.jour = jour
    this.horaire = horaire;
    this.index = index;
    this.salle = salle;
    this.UE = null;
}

//définition d'une méthode toString afin de visualiser le contenu de l'objet instancié
Creneau.prototype.toString = function() {
    return `\t# type : ${this.type}| pop : ${this.population}| horaire : ${this.horaire}| index : ${this.index}| salle : ${this.salle}| UE : ${this.UE}\n`;
}

module.exports = Creneau;