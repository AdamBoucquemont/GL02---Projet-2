//une UniteEnseignement réfenrence toutes les réservations de salles faites pour cette UE

const Reservation = require('./Reservation.js');

var UniteEnseignement = function(name) {
    this.name = name;
    this.allReservations = [];
}

//définition d'une méthode toString afin de visualiser le contenu de l'objet instancié
UniteEnseignement.prototype.toString = function() {
    return `\t# name : ${this.name} | allReservations : ${this.allReservations}\n`;
}

/**
 * Methode permettant de remplir tous les créneaux réservés pour cette UE
 * @author Thibault Pavée
 * @param allCreneaux liste de tous les Creneaux récupéré par le parseur
 **/
 UniteEnseignement.prototype.findReservations = function(allCreneaux) {
    for (const creneau of allCreneaux) {
        if (creneau.UE === this.name) {
            this.allReservations.push(new Reservation(creneau.salle, creneau.jour, creneau.horaire));
        }
    }
}

/**
 * Methode permettant de connaitre la salle pour une UE à un horraire precis
 * @author Thibault Pavée
 * @param jour le jour souhaité
 * @param horraire l'horraire souhaitée
 **/
 UniteEnseignement.prototype.findRoomForASchedule = function(jour, horraire) {
    for (const reservation of this.allReservations) {
        if (reservation.day === jour && reservation.schedule === horraire) {
            return reservation.name;
        }
    }
}

module.exports = UniteEnseignement;