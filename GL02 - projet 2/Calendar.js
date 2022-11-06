const Cours = require('./Classes/Cours.js');
const Creneau = require("./Classes/creneau");


const Calendar = function () {

};


Calendar.prototype.dateToList = function(date){
	var dateList = date.split('/').map(Number);
	var isValid = false;
	if (dateList[2]>1900 && dateList[2]<2100){
		if (dateList[1]<13 && dateList[1]>0){
			if (dateList[0]>0 && ( ([1,3,5,7,8,10,12].includes(dateList[1]) && dateList[0]<32) || ([4,6,11,9].includes(dateList[1]) && dateList[0]<31) )){
				isValid=true;
			}else if(dateList[1]===2 && dateList[0]>0){
				if ((dateList[2]%4===0 && dateList[0]<30)||dateList[0]<29){
					isValid=true;
				}
			}
		}
	}
	if (!isValid){
		console.log("La date entrée n'est pas valide");
		return (null);
	}
	else{
		return(dateList)
	}
}


Calendar.prototype.courseToList = function(courses){
	var coursesNonSplit = courses.split(',');
	var coursesSplit = [];
	for (const cour of coursesNonSplit){
		if (cour.includes("-")){
			coursesSplit.push(cour.split('-'));
		}else{
			coursesSplit.push([cour,"*"]);
		}
	}	
	return(coursesSplit);
}




Calendar.prototype.createCalendar = function(courses,startDate,endDate,allCreneaux){

	const dayName = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
	var creneauDay=[[]]
	for (let i=0;i<6;i++){
		creneauDay.push([]);
		for (const cour of courses){
			for (const crenau of allCreneaux){
				//console.log(crenau.type,crenau.jour,dayName[i+1],crenau.UE,cour[0])
				if (crenau.jour==dayName[i+1] && crenau.UE == cour[0]){
					if (cour[1]=="*"){
						creneauDay[i].push(crenau)
					}else if(cour.includes(crenau.type)){
						creneauDay[i].push(crenau)
					}
				}
			}
		}
	}




	var date1 = new Date(startDate[2],startDate[1],startDate[0]);
	var date2 = new Date(endDate[2],endDate[1],endDate[0]);

	var Difference_In_Time = date2.getTime() - date1.getTime();
	var Difference_In_Days = parseInt(Difference_In_Time / (1000 * 3600 * 24));

	const ZellzeCalendar=[3,4,5,6,7,8,9,10,11,12,1,2]

	let k = startDate[0];
	let m = ZellzeCalendar.indexOf(startDate[1])+1;
	let C = parseInt(startDate[2]/100);
	let D = startDate[2]-C*100;

	let F=k+parseInt((13*m-1)/5) + D + parseInt(D/4)+parseInt(C/4)-2*C;
	F=F%7

	var calendarContent="BEGIN:VCALENDAR\nPRODID:-//Groupe a//EN\nVERSION:2.0\nCALSCALE:GREGORIAN"


	for (let i=0; i<Difference_In_Days;i++){

		for (const event of creneauDay[F]){;
			const debutMs=new Date(date1.getTime()+i*86400000+event.horaire.split("-")[0].split(":")[0]*3600000+event.horaire.split("-")[0].split(":")[1]*60000)
			const finMs=new Date(date1.getTime()+i*86400000+event.horaire.split("-")[1].split(":")[0]*3600000+event.horaire.split("-")[1].split(":")[1]*60000)

			calendarContent+="\nBEGIN:VEVENT";
			calendarContent+="\nDTSTART:"+debutMs.toISOString().replace(/-|:|\./g,'');
			calendarContent+="\nDTEND:"+finMs.toISOString().replace(/-|:|\./g,'');
			calendarContent+="\nSUMMARY:Cour de "+event.UE;
			calendarContent+="\nEND:VEVENT";
			
		}
		F+=1
		if (F==7){
			F=1;
			i++;
		}
	}
	calendarContent+="\nEND:VCALENDAR";



	return (calendarContent);
}

module.exports = Calendar;
