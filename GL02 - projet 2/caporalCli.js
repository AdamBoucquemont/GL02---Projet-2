const fs = require('fs');
const colors = require('colors');

////const vg = require('vega');
////const vegalite = require('vega-lite');

const cli = require("@caporal/core").default;

// Code appellant le parser et permettant l'utilisation des commandes
// On pourrait faire tout cela dans les commandes et laisser l'utisateur choisir le dossier
const CruParser = require('./CRUparser.js');
const parser = new CruParser();
parser.organizeParsing("./SujetA_data");

//Les différentes classes dont nous avons besoins
const Salle = require('./Classes/Salle.js');
const Reservation = require('./Classes/Reservation.js');
const UniteEnseignement = require('./Classes/UniteEnseignement.js');

const Calendar = require('./Calendar.js');
const { parse } = require('path');

cli
	.version('vpf-parser-cli')
	.version('0.07')
	
	//////--------------------------------------------//////
	//                 command : readme                   //
	//////--------------------------------------------//////

	//je propose qu'on mette la liste des commandes et leurs fonctions sur le README.md

	/**
	 * @author Thibault Pavée
	 **/
	.command('readme',"Display the informations in the README file")
	.argument('<file>','The file README.md')
	.action(({logger, args}) => {
		fs.readFile(args.file, "utf-8", function (err,data){
			if(err){
				return logger.warn(err);
			}
			logger.info(data);
		})
	})

	//////--------------------------------------------//////
	//     SPEC_01 => command : createCalendar    //
	//////--------------------------------------------//////

	//commande de test pour un exemple : node CaporalCli.js cc AP03-D1,GL02 07/09/2021 24/12/2021 MonCalendrier

	/**
	 * @author Tristan Coldefy
	 **/
	.command('createCalendar', 'Create a iCalendar')
	.alias('cc')
	.argument('<cours>', 'A list of all the courses used in the calendar | exemple: AP03-D1,GL02')
	.argument('<startDate>', 'The day we start the calendar on | exemple: 07/09/2021')
	.argument('<endDate>', 'The day we start the calendar on | exemple: 24/12/2021')
	.argument('<fileName>', 'The name of the saved file | exemple: MonCalendrier')
	.action(({logger, args}) => {
		
		
		const calendar = new Calendar();
		const courseList = calendar.courseToList(args.cours);
		const startDate=calendar.dateToList(args.startDate);
		const endDate=calendar.dateToList(args.endDate);
		if (startDate==null || endDate==null){
			return logger.warn("Les dates entrées ne sont pas valides");
		}
		const calendarContent=calendar.createCalendar(courseList,startDate,endDate,parser.allCreneaux);
		fs.writeFile(args.fileName+".ics",calendarContent,function(err){
			if (err){
				console.log(err);
			}
		});
		
 		
	})

	//////--------------------------------------------//////
	//     SPEC_02 => command : checkRoomDisponibility    //
	//////--------------------------------------------//////

	//commande de test pour un exemple de non disponibilité : node CaporalCli.js crd S103 Jeudi 8:00-10:00 (cet horaire est pris par TPC01)

	//On aurait pu faire une vérification de la base de Donnée mais le CDC spécifie la fonctionnalité autrement

	/**
	 * @author Thibault Pavée
	 **/
	.command('checkRoomDisponibility', 'Show the rooms used for a class for a schedule')
	.alias('crd')
	.argument('<room>', 'The classroom for which it is necessary to know the availability | exemple: S103')
	.argument('<day>', 'The day of the disponibility checking | exemple: Jeudi')
	.argument('<schedule>', 'The requested schedule | exemple: 8:00-12:00')
	.action(({logger, args}) => {
		selectedRoom = new Salle(args.room);
		selectedRoom.findReservations(parser.allCreneaux);
		let isDisponible = selectedRoom.checkDisponibility(new Reservation('UEXX', args.day, args.schedule));
		console.log("\n");
		if (isDisponible==0) {
			//utiliser une methode de caporal pour l'affichage ?
			console.log("Le créneau "+args.schedule+" pour la salle "+args.room+" est libre le "+args.day+".");
		} 
		else if (isDisponible==1){
			//utiliser une methode de caporal pour l'affichage ?
			console.log("Le créneau "+args.schedule+" pour la salle "+args.room+" est utilisé une seule fois le "+args.day+".");
		}
		else {
			//utiliser une methode de caporal pour l'affichage ?
			console.log("Le créneau "+args.schedule+" pour la salle "+args.room+" est utilisé "+isDisponible+" fois le "+args.day+".");
			console.log("Il faut trouver une autre salle libre pour "+(isDisponible-1)+" des "+isDisponible+" cours.");
		}
 		
	})


	


	//////--------------------------------------------//////
	//    SPEC_03 => command : roomForClassAndSchedule    //
	//////--------------------------------------------//////

	//commande de test : node CaporalCli.js rfcas TPC01 Jeudi 8:00-10:00

	//On aurait pu lister toutes les salles d'un cours mais le CDC précise qu'il faut uniquement la salle pour un horaire précis

	/**
	 * @author Thibault Pavée
	 **/
	 .command('roomForClassAndSchedule', 'Say the rooms used for a class for a schedule')
	 .alias('rfcas')
	 .argument('<class>', 'The class for which it is necessary to know what are the rooms associated')
	 .argument('<day>', 'The day of the disponibility checking | exemple: Jeudi')
	 .argument('<schedule>', 'The requested schedule | exemple: 8:00-12:00')
	 .action(({logger, args}) => {
		selectedClass = new UniteEnseignement(args.class);
		selectedClass.findReservations(parser.allCreneaux);
		const room = selectedClass.findRoomForASchedule(args.day, args.schedule);
		if (room !== undefined) {
			//utiliser une methode de caporal pour l'affichage ?
			console.log("Le cours de "+args.class+" à l'horaire : "+args.schedule+" se trouve en salle "+room+".");
		} else {
			console.log("Le cours de "+args.class+" à l'horaire : "+args.schedule+" n'existe pas");
		}
	 })


	//////--------------------------------------------//////
	//       SPEC_04 => command : findRoomAvailable       //
	//////--------------------------------------------//////

	//commande de test : node CaporalCli.js fra Jeudi 8:00-10:00

	//Problème : une des salles est vide et crertaines les salles ont toutes les infos du créneau dans leur nom  => problème de parser ?

	/**
	 * @author Thibault Pavée
	 **/
	 .command('findRoomAvailable', 'Say wich room is available for a schedule')
	 .alias('fra')
	 .argument('<day>', 'The requested day | exemple: Jeudi')
	 .argument('<schedule>', 'The requested schedule | exemple: 8:00-10:00')
	 .action(({logger, args}) => {
		let allRooms = Salle.prototype.generateAllRooms(parser.allCreneaux);
		for (const room of allRooms) {
			let isFree = room.checkDisponibility(new Reservation('FREE', args.day, args.schedule));
			if (isFree==0) {
				console.log("La salle "+room.name+" est libre sur le creneau "+args.schedule+" le "+args.day+".")
			} else {
				console.log("Invalid Time");
			}
		}
	 })


	//////--------------------------------------------//////
	//       SPEC_05 => command : whenRoomAvailable       //
	//////--------------------------------------------//////

	//commande de test : node CaporalCli.js wra S103

	//Problème : des créneaux libre de type 12:0 à 10:0 => mauvais CRU ou mauvaise SPEC_05 ? exemple salle B101

	/**
	 * @author Thibault Pavée
	 **/
	 .command('whenRoomAvailable', 'Say when a room is available')
	 .alias('wra')
	 .argument('<room>', 'The classroom for which it is necessary to know when it is available')
	 .action(({logger, args}) => {
		selectedRoom = new Salle(args.room);
		selectedRoom.findReservations(parser.allCreneaux);
		selectedRoom.showDailyAvailability('Lundi');
		selectedRoom.showDailyAvailability('Mardi');
		selectedRoom.showDailyAvailability('Mercredi');
		selectedRoom.showDailyAvailability('Jeudi');
		selectedRoom.showDailyAvailability('Vendredi');
		selectedRoom.showDailyAvailability('Samedi');
	 })

	//////--------------------------------------------//////
	//     SPEC_06 => command : checkRoomOccupation    //
	//////--------------------------------------------//////

	//commande de test pour un exemple : node caporalCli.js cro C104,S103 Lundi-Mardi (la C104 est utilisée 12h et la S103 17.5h)

	/**
	 * @author Tristan Coldefy
	 **/
	.command('OccupationMax', 'Show the occupancy rate of one or multiple rooms')
	.alias('om')
	.argument('<rooms>', 'A list of all the classroom we want to know the occupancy rate or "all" for all rooms | exemples: S103 / S103,S104 / all')
	.argument('<days>', 'The days of the disponibility checking | exemples: Lundi-Jeudi / Mardi-Mardi')
	.action(({logger, args}) => {
		//selectedRoom = new Salle(args.room);
		const dayName = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
		if (args.rooms=='all'){
			var listeRoom=Salle.prototype.generateAllRooms(parser.allCreneaux);
		}else{
			var listeRoom=[]
			roomArray=args.rooms.split(',')
			for(var i = 0; i < roomArray.length; i++){
			   listeRoom.push(new Salle(roomArray[i]));
			}	
		}

		console.log(listeRoom)
		for (const salle of listeRoom){
			salle.findReservations(parser.allCreneaux)
		}
		const j1 = args.days.split('-')[0];
		const j2 = args.days.split('-')[1];

		
		if (dayName.indexOf(j1)==-1 || dayName.indexOf(j2)==-1){
			return logger.warn("Ce n'est pas un vrai jour");
		}
		if (dayName.indexOf(j1)>dayName.indexOf(j2)){
			return logger.warn("L'interval de jour n'est pas correcte");
		}
 		
	})

	//////--------------------------------------------//////
	//     SPEC_07 => command : findRoomPlace    //
	//////--------------------------------------------//////

	//commande de test pour un exemple : node CaporalCli.js frp 24 

	/**
	 * @author Tristan Coldefy
	 **/
	.command('findRoomPlace', 'Show all the rooms with the specified nomber of place')
	.alias('frp')
	.argument('<place>', 'Number of places wanted | exemple: 32')
	.action(({logger, args}) => {
		const numberOfPlace = parseInt(args.place);
		console.log(numberOfPlace)
		if (isNaN(numberOfPlace)){
			return logger.warn("The number of places must be an int");
		}

		var allRoom=Salle.prototype.generateAllRooms(parser.allCreneaux);
		var validRoom=[];
		for (const salle of allRoom){
			if (salle.maximumCapacity==numberOfPlace){
				if (!validRoom.includes(salle.name)){
					validRoom.push(salle.name);
				}
				
			}
		}
		if (validRoom.length>0){
			console.log("Toutes les salles contenant "+numberOfPlace+" places sont :")
			for (const salleName of validRoom){
				console.log(salleName)
			} 
		}else{
			console.log("TIl n'y a aucune salle contenant "+numberOfPlace+" places.")
		}
	
	})


	//////--------------------------------------------//////
	//        SPEC_08 => command : maximumCapacity        //
	//////--------------------------------------------//////

	//commande de test : node CaporalCli.js mc S103

	/**
	 * @author Thibault Pavée
	 **/
	.command('maximumCapacity', 'Say the maximum capacity of a classroom')
	.alias('mc')
	.argument('<room>', 'The classroom for which it is necessary to know the maximum capacity | exemple: S103')
	.action(({logger, args}) => {
		selectedRoom = new Salle(args.room);
		selectedRoom.findMaximumCapacity(parser.allCreneaux);
		//utiliser une methode de caporal pour l'affichage ?
		//la situation que la salle n'existe pas
		if(selectedRoom.maximumCapacity === 0){
			console.log("La salle n'existe pas\n")
		}else{
			console.log("Le nombre de personnes maximal pour la salle "+args.room+" est "+selectedRoom.maximumCapacity+" personnes.");
		}
	})


	//////--------------------------------------------//////
	//     SPEC_BONUS_1 => command : PlaceSup    //
	//////--------------------------------------------//////

	//commande de test pour un exemple : node CaporalCli.js psp 30 

	/**
	 * @author Adam BOUCQUEMONT
	 **/
	 .command('PlaceSup', 'Montre toutes les salles avec un nombre de places supérieur à un certain entier')
	 .alias('psp')
	 .argument('<place>', 'Nombre de places voulu | exemple: 30')
	 .action(({logger, args}) => {
		 const numberOfPlace = parseInt(args.place);
		 console.log(numberOfPlace)
		 if (isNaN(numberOfPlace)){
			 return logger.warn("Veuillez rentrer un entier");
		 }
 
		 var allRoom=Salle.prototype.generateAllRooms(parser.allCreneaux);
		 var validRoom=[];
		 var validRoomPlace=[];
		 for (const salle of allRoom){
			 if (salle.maximumCapacity>=numberOfPlace){
				 if (!validRoom.includes(salle.name)){
					validRoom.push(salle.name);
				 }
				validRoomPlace.push(salle.maximumCapacity);
			 }
		 }


		 if (validRoom.length>0){
			 console.log("Toutes les salles contenant plus de "+numberOfPlace+" places sont :")
			 for (const salleName of validRoom){
				 console.log(salleName)
			 } 
			 console.log("\n");
			 console.log("Ces salles contiennent respectivement : ");
			 console.log("\n");
			 for (const salleNamePlace of validRoomPlace){
				console.log(salleNamePlace+ " places.")
			} 
		 }else{
			 console.log("TIl n'y a aucune salle contenant plus de "+numberOfPlace+" places.")
		 }
	 
	 })

	 //////--------------------------------------------//////
	//     SPEC_BONUS_2 => command : PlaceInf    //
	//////--------------------------------------------//////

	//commande de test pour un exemple : node CaporalCli.js psp 30 

	/**
	 * @author Adam BOUCQUEMONT
	 **/
	 .command('PlaceInf', 'Montre toutes les salles avec un nombre de places inférieur à un certain entier')
	 .alias('pif')
	 .argument('<place>', 'Nombre de places demandées | exemple: 10')
	 .action(({logger, args}) => {
		 const numberOfPlace = parseInt(args.place);
		 console.log(numberOfPlace)
		 if (isNaN(numberOfPlace)){
			 return logger.warn("Veuillez rentrer un entier.");
		 }
 
		 console.log("\n");
		 var allRoom=Salle.prototype.generateAllRooms(parser.allCreneaux);
		 var validRoom=[];
		 var validRoomPlace=[];
		 for (const salle of allRoom){
			if (salle.maximumCapacity<=numberOfPlace){
				if (!validRoom.includes(salle.name)){
				   validRoom.push(salle.name);
				}
			   validRoomPlace.push(salle.maximumCapacity);
			}
		 }
		 if (validRoom.length>0){
			 console.log("Toutes les salles contenant moins de "+numberOfPlace+" places sont :")
			 console.log("\n");
			 for (const salleName of validRoom){
				 console.log(salleName)
			 } 
			 console.log("\n");
			 console.log("Ces salles contiennent respectivement : ");
			 console.log("\n");
			 for (const salleNamePlace of validRoomPlace){
				console.log(salleNamePlace+ " places.")
			} 
		 }else{
			 console.log("TIl n'y a aucune salle contenant moins de "+numberOfPlace+" places.")
		 }
	 
	 })


	 //////--------------------------------------------//////
	//     SPEC_BONUS_03 => command : checkRoomOccupation    //
	//////--------------------------------------------//////

	//commande de test pour un exemple : node caporalCli.js cro C104,S103 Lundi-Mardi (la C104 est utilisée 12h et la S103 17.5h)

	/**
	 * @author Tristan Coldefy
	 **/
	.command('checkRoomOccupation', 'Dis combien de temps est utilisé une ou plusieurs salles')
	.alias('cro')
	.argument('<rooms>', 'Toutes les salles dont nous avons besoin | exemples: S103 / S103,S104 / all')
	.argument('<days>', 'Les jours sur lesquels nous voulons calculer cela | exemples: Lundi-Jeudi / Mardi-Mardi')
	.action(({logger, args}) => {

		//selectedRoom = new Salle(args.room);
		const dayName = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
		if (args.rooms=='all'){
			var listeRoom=Salle.prototype.generateAllRooms(parser.allCreneaux);
		}else{
			var listeRoom=[]
			roomArray=args.rooms.split(',')
			for(var i = 0; i < roomArray.length; i++){
			   listeRoom.push(new Salle(roomArray[i]));
			}	
		}

		for (const salle of listeRoom){
			salle.findReservations(parser.allCreneaux)
		}
		const j1 = args.days.split('-')[0];
		const j2 = args.days.split('-')[1];

		
		if (dayName.indexOf(j1)==-1 || dayName.indexOf(j2)==-1){
			return logger.warn("Veuillez bien réécrire les arguments rentrées.");
		}
		if (dayName.indexOf(j1)>dayName.indexOf(j2)){
			return logger.warn("Days interval is not valid");
		}

		var timeList=[]
		var j=0
		for (let room of listeRoom){
			timeList.push(0)
			for (let i=dayName.indexOf(j1); i<=dayName.indexOf(j2);i++){
				for (let reservation of room.allReservations){

					if (reservation.day==dayName[i]){
						
						timeList[j]+=reservation.endingTime-reservation.startingTime;
					}
				}
			}
			
			console.log("\n");
			if (j1==j2) {
				console.log("Le "+j2+" la salle "+room.name+" est utilisée "+timeList[j]+" heures");
			}
			else {
				console.log("Entre "+j1+" et "+j2+" la salle "+room.name+" est utilisée "+timeList[j]+" heures");
			}
			
			j++;
		}
 		
	})

		//////--------------------------------------------//////
	//     SPEC_06 => command : checkRoomOccupation    //
	//////--------------------------------------------//////

	//commande de test pour un exemple : node caporalCli.js cro C104,S103 Lundi-Mardi (la C104 est utilisée 12h et la S103 17.5h)

	/**
	 * @author Tristan Coldefy
	 **/
	.command('checkRoomOccupation2', 'Show the occupancy rate of one or multiple rooms')
	.alias('cro2')
	.argument('<rooms>', 'A list of all the classroom we want to know the occupancy rate or "all" for all rooms | exemples: S103 / S103,S104 / all')
	.argument('<days>', 'The days of the disponibility checking | exemples: Lundi-Jeudi / Mardi-Mardi')
	.action(({logger, args}) => {
		//selectedRoom = new Salle(args.room);
		const dayName = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
		if (args.rooms=='all'){
			var listeRoom=Salle.prototype.generateAllRooms(parser.allCreneaux);
		}else{
			var listeRoom=[]
			roomArray=args.rooms.split(',')
			for(var i = 0; i < roomArray.length; i++){
			   listeRoom.push(new Salle(roomArray[i]));
			}	
		}

		console.log(listeRoom)
		for (const salle of listeRoom){
			salle.findReservations(parser.allCreneaux)
		}
		const j1 = args.days.split('-')[0];
		const j2 = args.days.split('-')[1];

		
		if (dayName.indexOf(j1)==-1 || dayName.indexOf(j2)==-1){
			return logger.warn("argument isn't a valid day");
		}
		if (dayName.indexOf(j1)>dayName.indexOf(j2)){
			return logger.warn("Days interval is not valid");
		}

		var timeList=[]
		var j=0
		for (let room of listeRoom){
			timeList.push(0)
			for (let i=dayName.indexOf(j1); i<=dayName.indexOf(j2);i++){
				for (let reservation of room.allReservations){

					if (reservation.day==dayName[i]){
						
						timeList[j]+=reservation.endingTime-reservation.startingTime;
					}
				}
			}
			
			console.log("Entre "+j1+" et "+j2+" la salle "+room.name+" est utilisée "+timeList[j]+" heures");
			j++;
		}
 		
	})


		//////--------------------------------------------//////
	//     SPEC_BONUS_04 => command : checkRoomDisponibilityAll    //
	//////--------------------------------------------//////

	//commande de test pour un exemple de non disponibilité : node CaporalCli.js crd S103 Jeudi 8:00-10:00 (cet horaire est pris par TPC01)

	//On aurait pu faire une vérification de la base de Donnée mais le CDC spécifie la fonctionnalité autrement

	/**
	 * @author Adam Boucquemont
	 **/
	 .command('checkRoomDisponibilityAll', 'Montre toutes les salles utilisées en même temps à un certain moment.')
	 .alias('crda')
	 .argument('<day>', 'The day of the disponibility checking | exemple: Jeudi')
	 .argument('<schedule>', 'The requested schedule | exemple: 8:00-12:00')
	 .action(({logger, args}) => {


		console.log("\n");
		var allRoom=Salle.prototype.generateAllRooms(parser.allCreneaux);
		var invalidRoom=[];
		for (const salle of allRoom){
			salle.findReservations(parser.allCreneaux);
			let isDisponible = salle.checkDisponibility(new Reservation('UEXX', args.day, args.schedule));
			if (isDisponible>=2) {
				invalidRoom.push(salle.name);
				console.log("La salle " +salle.name+ " est utilisé "+isDisponible+" fois en même temps.");
			} 
		}
		console.log("\n");
		if (invalidRoom.length>0){
			console.log("Voici la liste des salles utilisées plusieurs fois en même temps")
			console.log("\n");
			for (const salleName of invalidRoom){
				console.log(salleName)
			}  
		}else{
			console.log("Toutes les salles sont utilisées une seule fois.")
		}

	 })



	
cli.run(process.argv.slice(2));
	