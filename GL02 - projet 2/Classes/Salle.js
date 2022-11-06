//une salle réfenrence le nombres de places disponibles et toutes ses réservations faites pour des UEs

const Reservation = require('./Reservation.js');

var Salle = function(name) {
    this.name = name;
    this.maximumCapacity = 0;
    this.allReservations = [];
}

//définition d'une méthode toString afin de visualiser le contenu de l'objet instancié
Salle.prototype.toString = function() {
    return `\t# name : ${this.name} | maximumCapacity : ${this.maximumCapacity} | allReservations : ${this.allReservations}\n`;
}

/**
 * Methode permettant de remplir tous les créneaux réservés pour cette salle
 * @author Thibault Pavée
 * @param allCreneaux liste de tous les Creneaux récupéré par le parseur
 **/
Salle.prototype.findReservations = function(allCreneaux) {
    for (const creneau of allCreneaux) {
        if (creneau.salle === this.name) {
            this.allReservations.push(new Reservation(creneau.UE, creneau.jour, creneau.horaire));
        }
    }
}

/**
 * Methode permettant de savoir si une reservation est possible sans chavanchement avec une autre
 * @author Thibault Pavée
 * @param reservation le créneau dont on veut connaitre la diponibilité
 **/
 Salle.prototype.checkDisponibility = function(newReservation) {
    let i = 0;
    for (const reservation of this.allReservations) {
        if (reservation.isOverlapping(newReservation)) {
            i=i+1;
        }
    }
    return i;
}

/**
 * Methode permettant de connaitre la capacité maximal d'une salle
 * @author Thibault Pavée
 * @param allCreneaux liste de tous les Creneaux récupéré par le parseur
 **/
 Salle.prototype.findMaximumCapacity = function(allCreneaux) {
    for (const creneau of allCreneaux) {
        if (creneau.salle === this.name) {
            if (creneau.population > this.maximumCapacity) {
                this.maximumCapacity = creneau.population;
            }
        }
    }
}

/**
 * Methode permettant de connaitre les disponibilités d'une salle pour un jour précis
 * @author Thibault Pavée
 * @param dDay jour dont les disponibilités de la salle vont être affiché
 **/
 Salle.prototype.showDailyAvailability = function(dDay) {
    //recuperation des reservations pour un jour
    let allDailyReservations = [];
    for (const reservation of this.allReservations) {
        if (reservation.day === dDay) {
            allDailyReservations.push([reservation.startingTime, reservation.endingTime]);
        }
    }
    //Transformation en chaine Ne sert plus à rien pour l'instant
    let allDailyReservationsString = [];
    for (const reserv of allDailyReservations) {
        let h1 = Math.floor(reserv[0]);
        let m1 = (reserv[0]-h1)*60;
        let h2 = Math.floor(reserv[1]);
        let m2 = (reserv[1]-h2)*60;
        reserv.push(h1+":"+m1+"-"+h2+":"+m2)
    }
    //tri
    for(var i = 0; i < allDailyReservations.length; i++){
        //stocker l'index de l'élément minimum
        var min = i; 
        for(var j = i+1; j < allDailyReservations.length; j++){
          if(allDailyReservations[j][0] < allDailyReservations[min][0]){
           // mettre à jour l'index de l'élément minimum
           min = j; 
          }
        }
        var tmp = allDailyReservations[i];
        allDailyReservations[i] = allDailyReservations[min];
        allDailyReservations[min] = tmp;
      }
    //affichage
    console.log(dDay+" :");
    let previousEnd = 8;
    let previousEndStr = "8:0"
    for (const reserv of allDailyReservations) {
        if (previousEnd < reserv[0]) {
            let h1 = Math.floor(reserv[0]);
            let m1 = (reserv[0]-h1)*60;
            let str = h1+":"+m1;
            console.log("La salle est libre de "+previousEndStr+" à "+str+".");
        }
        previousEnd = reserv[1];
        let h1 = Math.floor(reserv[1]);
        let m1 = (reserv[1]-h1)*60;
        previousEndStr = h1+":"+m1;
    }
    if (previousEnd < 20) {
        console.log("La salle est libre de "+previousEndStr+" à 20:0.");
    }
}

/**
 * Methode renvoyant un tableau de toutes les salles existantes
 * @author Thibault Pavée
 * @param allCreneaux liste de tous les Creneaux récupéré par le parseur
 **/
 Salle.prototype.generateAllRooms = function(allCreneaux) {
    let allRooms = [];
    let allRoomsNames = [];
    //pas optimisé du tout
    for (const creneau of allCreneaux) {
        if (!allRoomsNames.includes(creneau.salle)) {
            room = new Salle(creneau.salle);
            room.findMaximumCapacity(allCreneaux);
            room.findReservations(allCreneaux);
            allRooms.push(room);
            allRoomsNames.push(creneau.salle);
        }
    }
    return allRooms;
}



module.exports = Salle;