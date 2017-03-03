//materialize Initialization
$(".button-collapse").sideNav();
$(".collapsible").collapsible();


///////////
//ON LOAD//
///////////
$(document).ready(function(){
	if ($('#serverClock').length > 0){
		pullRequest("/time.aspx");
		if ($('#delivery11amClock').length > 0) {
			delivery11am();
		}
		if ($('#delivery1dayClock').length > 0) {
			delivery1day();
		}
	}
	console.log(serverTime);
});


/////////////////////
//DECLARE VARIABLES//
/////////////////////
var serverTime = 0;
var offset = 0;
const DAYARRAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHARRAY = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONDAYBH = ['2017/04/17','2017/05/01','2017/05/29','2017/08/28','2018/04/02','2018/05/07','2018/05/28','2018/08/27'];
const FRIDAYBH = ['2017/04/14', '2018/03/30'];
const CHRISTMAS = {
	start: '2017/12/23',
	finish: '2018/01/01'
}


///////////////////
//GET SERVER TIME//
///////////////////
function pullRequest(url){
/*	var timestamp = new XMLHttpRequest();
		timestamp.open("GET",url,true);
		timestamp.send();
		timestamp.onreadystatechange = function(){
			if (timestamp.readyState == 4 && timestamp.status == 200){
				var getTime = JSON.parse(timestamp.responseText);
				serverTime = new Date(getTime.datetime);
			}
		};
*/
	serverTime = new Date();
}

//THIS IS FOR TEST ONLY - SETTING DATES
$('#dateInput').change(function(){
	var theDate = new Date($('#dateInput').val());
	var theTime = $('#timeInput').val().split(':');
	theDate.setHours(theTime[0]);
	theDate.setMinutes(theTime[1]);
	serverTime = theDate;
});

///////////////////////////
//INCREMENT AND SHOW TIME//
///////////////////////////
function addTime(){
	var newTime = new Date(serverTime);
	newTime.setTime(newTime.getTime() + offset*1000);
	var hour = newTime.getHours();
	var minute = newTime.getMinutes();
	var seconds = newTime.getSeconds();
	var day = newTime.getDay();
	var date = newTime.getDate();
	var month = newTime.getMonth();
	var year = newTime.getFullYear();
	//HOUR//
	if (hour < 10){
		$('#clockHour').text('0' + hour);
	} else {
		$('#clockHour').text(hour);
	}
	//MINUTES//
	if (minute < 10){
		$('#clockMins').text('0' + minute);
	} else {
		$('#clockMins').text(minute);
	}
	//SECONDS//
	if (seconds < 10){
		$('#clockSeconds').text('0' + seconds);
	} else {
		$('#clockSeconds').text(seconds);
	}
	//DAY//
	$('#clockDay').text(DAYARRAY[day]);
	//DATE//
	$('#clockDate').text(date);
	//DATE SUFFIX//
	if (date%10 == 1 && date != 11){
		$('#clockDateSuffix').text('st');
	} else if (date%10 == 2 && date != 12){
		$('#clockDateSuffix').text('nd');
	} else if (date%10 == 3 && date != 13){
		$('#clockDateSuffix').text('rd');
	} else {
		$('#clockDateSuffix').text('th');
	}
	//MONTH//
	$('#clockMonth').text(MONTHARRAY[month]);
	//YEAR//
	$('#clockYear').text(year);
}


//////////////
//UPDATE DOM//
//////////////
function updateDelivery(passedTime, deliveryType){
	$('#delivery' + deliveryType + 'Day').text(DAYARRAY[passedTime.getDay()]);
	$('#delivery' + deliveryType + 'Date').text(passedTime.getDate());
	$('#delivery' + deliveryType + 'Month').text(MONTHARRAY[passedTime.getMonth()]);
	$('#delivery' + deliveryType + 'Year').text(passedTime.getFullYear());
	if (passedTime.getDate() % 10 == 1 && passedTime.getDate() != 11){
		$('#delivery' + deliveryType + 'DateSuffix').text('st');
	} else if (passedTime.getDate() % 10 == 2 && passedTime.getDate() != 12){
		$('#delivery' + deliveryType + 'DateSuffix').text('nd');
	} else if (passedTime.getDate() % 10 == 3 && passedTime.getDate() != 13){
		$('#delivery' + deliveryType + 'DateSuffix').text('rd');
	} else {
		$('#delivery' + deliveryType + 'DateSuffix').text('th');
	}
}

///////////////////
//LOOP THROUGH BH//
///////////////////
function testForBankHoliday(timeNow, whichBH, daysBefore){
	let output = false;
	var bh;
	if(whichBH === 'monday'){
		bh = MONDAYBH;
	}else if(whichBH === 'friday'){
		bh = FRIDAYBH;
	}else{
		return false;
	}
	for(let i = 0; i < bh.length; i++){
		let currentBH = bh[i];
		let currentBHobj = new Date(currentBH);
		let testDate = currentBHobj.setDate(currentBHobj.getDate() - daysBefore);
		let testDateObj = new Date(testDate);
		
		if(timeNow.getDate() == testDateObj.getDate() && timeNow.getMonth() == testDateObj.getMonth() && timeNow.getFullYear() == testDateObj.getFullYear()){
			output = true;
		}
	}
	return output;
}


/////////////////
//11am DELIVERY//
/////////////////
function delivery11am(){
	var newTime = new Date(serverTime);
	newTime.setTime(newTime.getTime() + offset*1000);
	
	//IF DAY IS SATURDAY
	if(newTime.getDay() === 6){
		
		if(testForBankHoliday(newTime, 'monday', 2) === true){
			newTime.setDate(newTime.getDate() + 3);
			updateDelivery(newTime, "11am");
		}else{
			newTime.setDate(newTime.getDate() + 2);
			updateDelivery(newTime, "11am");
		}
	}
	
	//IF DAY IS SUNDAY
	else if(newTime.getDay() === 0){
		
		if(testForBankHoliday(newTime, 'monday', 1) === true){
			newTime.setDate(newTime.getDate() + 2);
			updateDelivery(newTime, "11am");
		}else{
			newTime.setDate(newTime.getDate() + 1);
			updateDelivery(newTime, "11am");
		}
	}
	
	//IF DAY IS MONDAY
	else if(newTime.getDay() === 1){
		
		if(testForBankHoliday(newTime, 'monday', 0) === true){
			newTime.setDate(newTime.getDate() + 1);
			updateDelivery(newTime, "11am");
		}else{
			if(newTime.getHours() < 5){
				newTime.setDate(newTime.getDate() + 0);
				updateDelivery(newTime, "11am");
			}else{
				newTime.setDate(newTime.getDate() + 1);
				updateDelivery(newTime, "11am");
			}
		}
	}
	
	//IF DAY IS FRIDAY
	else if(newTime.getDay() === 5){
		
		if(testForBankHoliday(newTime, 'friday', 0) === true){
			newTime.setDate(newTime.getDate() + 4);
			updateDelivery(newTime, "11am");
		
		}else if(testForBankHoliday(newTime, 'monday', 3) === true){
			if(newTime.getHours() < 5){
				newTime.setDate(newTime.getDate() + 0);
				updateDelivery(newTime, "11am");
			}else{
				newTime.setDate(newTime.getDate() + 4);
				updateDelivery(newTime, "11am");
			}
		}else{
			if(newTime.getHours() < 5){
				newTime.setDate(newTime.getDate() + 0);
				updateDelivery(newTime, "11am");
			}else{
				newTime.setDate(newTime.getDate() + 3);
				updateDelivery(newTime, "11am");
			}
		}
	}
	
	//IF DAY IS THURSDAY
	else if(newTime.getDay()=== 4){

		if(testForBankHoliday(newTime, 'friday', 1) === true){
			if(newTime.getHours() < 5){
				newTime.setDate(newTime.getDate() + 0);
				updateDelivery(newTime, "11am");
			}else{
				newTime.setDate(newTime.getDate() + 5);
				updateDelivery(newTime, "11am");
			}
		}else{
			if(newTime.getHours() < 5){
				newTime.setDate(newTime.getDate() + 0);
				updateDelivery(newTime, "11am");
			}else{
				newTime.setDate(newTime.getDate() + 1);
				updateDelivery(newTime, "11am");
			}
		}
	}
	
	//IF ANY OTHER DAY (IE TUESDAY OR WEDNESDAY!)
	else{
		if(newTime.getHours() < 5){
			newTime.setDate(newTime.getDate() + 0);
			updateDelivery(newTime, "11am");
		}else{
			newTime.setDate(newTime.getDate() + 1);
			updateDelivery(newTime, "11am");
		}
	}
}
	

//////////////////
//1 DAY DELIVERY//
//////////////////	
function delivery1day(){
	var newTime = new Date(serverTime);
	newTime.setTime(newTime.getTime() + offset*1000);
	
	//IF DAY IS SATURDAY
	if(newTime.getDay() === 6){

		if(testForBankHoliday(newTime, 'monday', 2) === true){
			newTime.setDate(newTime.getDate() + 4);
			updateDelivery(newTime, "1day");
		}else{
			newTime.setDate(newTime.getDate() + 3);
			updateDelivery(newTime, "1day");
		}
	}
	
	//IF DAY IS SUNDAY
	else if(newTime.getDay() === 0){

		if(testForBankHoliday(newTime, 'monday', 1) === true){
			newTime.setDate(newTime.getDate() + 3);
			updateDelivery(newTime, "1day");
		}else{
			newTime.setDate(newTime.getDate() + 2);
			updateDelivery(newTime, "1day");
		}
	}
	
	//IF DAY IS MONDAY
	else if(newTime.getDay() === 1){
		
		if(testForBankHoliday(newTime, 'monday', 0) === true){
			newTime.setDate(newTime.getDate() + 2);
			updateDelivery(newTime, "1day");
		}else{
			if(newTime.getHours() < 16){
				newTime.setDate(newTime.getDate() + 1);
				updateDelivery(newTime, "1day");
			}else{
				newTime.setDate(newTime.getDate() + 2);
				updateDelivery(newTime, "1day");
			}
		}
	}
	
	//IF DAY IS FRIDAY
	else if(newTime.getDay() === 5){
		
		if(testForBankHoliday(newTime, 'friday', 0) === true){
			newTime.setDate(newTime.getDate() + 5);
			updateDelivery(newTime, "1day");
		
		}else if(testForBankHoliday(newTime, 'monday', 3) === true){
			if(newTime.getHours() < 16){
				newTime.setDate(newTime.getDate() + 4);
				updateDelivery(newTime, "1day");
			}else{
				newTime.setDate(newTime.getDate() + 5);
				updateDelivery(newTime, "1day");
			}
			
		}else{
			if(newTime.getHours() < 16){
				newTime.setDate(newTime.getDate() + 3);
				updateDelivery(newTime, "1day");
			}else{
				newTime.setDate(newTime.getDate() + 4);
				updateDelivery(newTime, "1day");
			}
		}
	}
	
	//IF DAY IS THURSDAY
	else if(newTime.getDay() === 4){

		if(testForBankHoliday(newTime, 'friday', 1) === true){
			if(newTime.getHours() < 16){
				newTime.setDate(newTime.getDate() + 5);
				updateDelivery(newTime, "1day");
			}else{
				newTime.setDate(newTime.getDate() + 6);
				updateDelivery(newTime, "1day");
			}
		}else if(testForBankHoliday(newTime, 'monday', 4)){
			if(newTime.getHours() < 16){
				newTime.setDate(newTime.getDate() + 1);
				updateDelivery(newTime, "1day");
			}else{
				newTime.setDate(newTime.getDate() + 5);
				updateDelivery(newTime, "1day");
			}
		}else{
			if(newTime.getHours() < 16){
				newTime.setDate(newTime.getDate() + 1);
				updateDelivery(newTime, "1day");
			}else{
				newTime.setDate(newTime.getDate() + 4);
				updateDelivery(newTime, "1day");
			}
		}
	}
	
	//IF DAY IS WEDNESDAY
	else if(newTime.getDay === 3){
		
		if(testForBankHoliday(newTime, 'friday', 2) === true){
			if(newTime.getHours() < 16){
				newTime.setDate(newTime.getDate() + 1);
				updateDelivery(newTime, "1day");
			}else{
				newTime.setDate(newTime.getDate() + 6);
				updateDelivery(newTime, "1day");
			}
		}else{
			if(newTime.getHours() < 16){
				newTime.setDate(newTime.getDate() + 1);
				updateDelivery(newTime, "1day");
			}else{
				newTime.setDate(newTime.getDate() + 2);
				updateDelivery(newTime, "1day");
			}
		}
	}
	
	//IF ANY OTHER DAY (IE TUESDAY!!)
	else{
		if(newTime.getHours() < 5){
			newTime.setDate(newTime.getDate() + 0);
			updateDelivery(newTime, "1day");
		}else{
			newTime.setDate(newTime.getDate() + 1);
			updateDelivery(newTime, "1day");
		}
	}
}


//////////////////
//INTERVAL CLOCK//
//////////////////
window.setInterval(function(){
	if ($('#serverClock').length > 0){
		offset += 1;
		addTime();
		if ($('#delivery11amClock').length > 0) {
			delivery11am();
		}
		if ($('#delivery1dayClock').length > 0) {
			delivery1day();
		}
	}
}, 1000);