//une réservation représente 

var Reservation = function(name, day, schedule) {
    //name est le nom de l'UE qui reserve
    this.name = name;
    //day est le jour de la reservation
    this.day = day;
    //schedule est la chaine de charactère de l'horraire
    this.schedule = schedule;

    //mise en forme de l'horraire sous forme de nombre
    var re = /-|:/;
    var split = schedule.split(re);

    this.startingTime = parseFloat(split[0]) + (parseFloat(split[1]) / 60);
    this.endingTime = parseFloat(split[2]) + (parseFloat(split[3]) / 60);

}

//définition d'une méthode toString afin de visualiser le contenu de l'objet instancié
Reservation.prototype.toString = function() {
    return `\t# name : ${this.name} | day : ${this.day} | schedule : ${this.schedule}\n`;
}

/**
 * Methode permettant de savoir si deux reservations se superposent
 * @author Thibault Pavée
 * @param reservation rservation avec laquelle on va comparer la reservation dont provient la methode
 **/
 Reservation.prototype.isOverlapping = function(reservation) {
    if (reservation.startingTime < reservation.endingTime){
        if (this.day === reservation.day) {
            if (this.startingTime < reservation.endingTime && this.endingTime > reservation.startingTime) {
                return true;
            } else if (this.startingTime === reservation.startingTime) {
                return true;
            } else if (this.endingTime === reservation.endingTime) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
}

module.exports = Reservation;