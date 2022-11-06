const CruParser = require('../CRUparser.js');
const parser = new CruParser();

parser.organizeParsing("./SujetA_data");


describe("Program Semantic testing of POI", function(){


	beforeAll(function() {
		const Calendar = require('../Calendar');
		this.calendar = new Calendar();
		const Creneau = require('../Classes/Creneau');
		this.crenau = new Creneau("AP03", "24", "Mardi", "16:00-19:00", "1", "M104");
		const Cours = require('../Classes/Cours');
		this.cours = new Cours("AP03",[this.crenaux]);
		const Reservation = require('../Classes/Reservation');
		this.reservation = new Reservation("UEXX","Mardi","8:00-12:00");
		const Salle = require('../Classes/Salle');
		this.salle = new Salle("M104");



	});
	it("can change a date to a list", function(){
		expect(this.calendar.dateToList("07/09/2021")).toEqual([7,9,2021]);
		
	});

	it("can change courses to a list", function(){
		
		expect(this.calendar.courseToList("AP03-D1,SY01")).toEqual([["AP03","D1"],["SY01","*"]]);
		
	});

	it("can create a new crenau", function(){
		
		expect(this.crenau).toBeDefined();
		expect(this.crenau.salle).toEqual("M104");
		
	});	

	it("can create a new cours", function(){
		
		expect(this.cours).toBeDefined();
		expect(this.cours.creneaux[0]).toBe(this.creneaux);
		
	});	

	it("can create a new reservation", function(){
		
		expect(this.reservation).toBeDefined();
		expect(this.reservation.name).toEqual("UEXX");
		
	});	

	it("can create a new salle", function(){
		
		expect(this.salle).toBeDefined();
		expect(this.salle.name).toEqual("M104");
		
	});	



});