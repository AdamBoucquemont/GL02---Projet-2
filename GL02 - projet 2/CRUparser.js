//le CRUparser permet de parser un fichier de type CRU, ici sont déclarés ses attributs et ses méthodes

const Cours = require('./Classes/Cours.js');
const Creneau = require("./Classes/Creneau.js");
const {isNullOrFalse} = require("vega-lite");


const CruParser = function () {
};
/**
 * Cette méthode permet de tokenizer les données contenus dans un fichier. Le contenu du fichier se retrouve en entrée de la méthode.
 * La méthode retourne ainsi toutes les lignes du fichier dans une liste correspodant au nom d'une matière, ou à un créneau
 *
 * @param data données brutes du fichier 
 *
 * @return find 
 *
 * @author Dorian Boucher
 * */
CruParser.prototype.tokenize = function(data) {
    const fs = require('fs');

    const toFindMod = /\+(?!UVUV).*/; //regex pour trouver le nom d'un module
    const toFindSchedule = /^.*?1.*\/\//; //regex pour trouver une ligne correspondant au créneau d'un module
    let find = [];
    data = String(data)
    data = data.split('\n')

    // ici on parcours data pour en extraire seulement les noms des modules ainsi que les créneaux correspondants en les mettant dans un tableau nommé 'find'
    for (const i of data) {
        if (i.match(toFindMod)) {
            find.push(i)
        } else if (i.match(toFindSchedule)) {
            find.push(i)
        }
    }

    // si le fichier n'est pas au bon format, alors on va écrire à l'utilisateur que le fichier n'est pas bon

    if (find.length === 0) {
        console.log("Le fichier n'est pas au bon format");
    }

    find.push('+endData') // On ajoute une dernière ligne à notre set de données, pour signifier que l'on en a atteint la fin
    return find;
}

/**
 * Methode pour parser un fichier au format .cru qui permet lire grâce à des expressions régulières, les bonnes données du fichier. Ces données sont stockées dans un objet de type creneau puis l'objet est ajouté à une liste.
 *
 * La liste prendra en entrée les données non traitées d'un fichier au format CRU et retournera une liste comprenant tous les objets de type Cours contenus dans le fichier
 *
 * @author Dorian Boucher
 * */
CruParser.prototype.parse = function(data) {
    data = this.tokenize(data);
    let courses = []
    //definition des regex des différents attributs à chercher au sein des différentes lignes de créneaux
    const codeMatiere = /\+.*/;
    const regType = /[D,C,T]\d\d?/;
    const regPop = /P=\d*/;
    const regHoraire = /H=.{1,2}\s\d{1,2}:\d\d-\d{1,2}:\d\d/;
    const regIndex = /F\d/;
    const regSalle = /S=.{4}\/*/;
    let i = 0;
    while (data[i] !== '+endData') {
        if (data[i].match(codeMatiere)) { // Si la ligne correspond au code d'une matière
            const creneaux = [];
            let j = i;
            while (!data[j + 1].match(codeMatiere)) { // On lit jusqu'a ce qu'on trouve une autre matière

                // ajout des différentes données du cours dans les attributs du créneau
                const type = String(data[j + 1].match(regType));
                const pop = String(data[j + 1].match(regPop)).replace('P=', '');
                const jourEtHoraire = String(data[j + 1].match(regHoraire)).replace('H=', '').split(' ');
                const index = String(data[j + 1].match(regIndex));
                const salle = String(data[j + 1].match(regSalle)).replace('S=', '').replaceAll('/', '');

                //Separation de la journée et de l'horaire du cours dans deux variables différentes
                let jour = jourEtHoraire[0];
                const horaire = jourEtHoraire[1];

                //Remplacement de la notation des jours
                switch (jour){
                    case 'L':
                        jour = 'Lundi';
                        break;
                    case 'MA':
                        jour = 'Mardi';
                        break;
                    case 'ME':
                        jour = 'Mercredi';
                        break;
                    case 'J':
                        jour = 'Jeudi';
                        break;
                    case 'V':
                        jour = 'Vendredi';
                        break;
                    case 'S':
                        jour = 'Samedi';
                        break;
                }


                if (type !== 'null' && pop !== '' && jour !== '' && horaire !== undefined && index !== 'null' && salle !== 'null') {
                    // Création d'un objet de type Créneau permettant de stocker les données de la ligne dans les attributs de l'objet
                    const creneau = new Creneau(type, pop, jour,horaire, index, salle);
                    //Ajout du nouveau créneau dans le tableau contenant tous les créneaux de la matière contenu dans ce fichier
                    creneaux.push(creneau);
                }
                j++;
            }
            const cours = new Cours(String(data[i].match(codeMatiere)), creneaux); // Création d'un objet de type cours dont les attributs correspondent au code de la matière, ainsi que tous ses créneaux correspondants
            courses.push(cours);
        }
        i++;
    }
    return courses;
}


/**
 * Méthode du parser pour pouvoir parcourir tout le dossier dans lequel sont stockés les fichiers de données des cours nommés "edt.cru"
 *
 * Cette fonction parcours tous les fichiers puis une fois dans le fichier, appelle la méthode parse() pour parser le fichier en question et le stocker dans la liste parsedCourses qui est un attribut de l'objet CRUparser
 *  
 * @param dir Le directory global des fichiers .cru stockés
 *  
 * @author Dorian Boucher
 * */
CruParser.prototype.parseAllDirectory = function(dir) {
    const fs = require('fs');
    const directories = fs.readdirSync(dir);
    this.files = []; //création d'un attribut stockant les directory des fichiers
    this.parsedCourses = []; //création d'un attribut stockant tous les objets de type Cours
    
    // Ici on parcourt tous les fichiers
    
    directories.forEach((directory) => {
        this.files.push("./SujetA_data/" + directory + "/edt.cru");
    }, this);
    
    // On parse tous les fichiers
    
    this.files.forEach((file) => {
        let data = fs.readFileSync(file, 'utf-8');
        this.parsedCourses.push(this.parse(data));
    })
}

/**
 * Méthode pour organiser le parsing de tous les fichiers, en enlevant tous les doublons possibles, et en stockant tout dans un tableau de dimension 1.
 * @param dir Le directory global des fichiers .cru stockés
 *  
 * @author Dorian Boucher
 * */
CruParser.prototype.organizeParsing = function(dir) {
    this.parseAllDirectory(dir);
    this.allCreneaux = [];
    for (const coursFromFile of this.parsedCourses) {
        for (const cours of coursFromFile) {
            for (const creneau of cours.creneaux) {
                creneau.UE = cours.nomMatiere.toString().replace('+','');
                if (!this.allCreneaux.includes(creneau)) {
                    this.allCreneaux.push(creneau);
                }
            }
        }
    }
}

// export du module
module.exports = CruParser;