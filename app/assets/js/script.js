

'use strict';

const fetch   = window.fetch;
const base    = 'https://free.currencyconverterapi.com';
var currencies = {};

const db_name = 'currency_db';
const db_version = 2;
let db;

if('serviceWorker' in navigator) {
	window.addEventListener('load', function(){
		navigator.serviceWorker.register('./sw.js')
		.then(function(reg){
			console.log('sw registered');
		})
		.catch(function(error){
			console.log(error);
		})
	})
} else {
	alert('service worker not supported on this browser');
}




//standart version without service worker
fetch(base+'/api/v5/countries')
//fetch('/assets/js/countries.json')
.then(res => res.json())
.then(json => {
	currencies = json;
	display_currency_list(currencies);
	setIndexDB(db_name, db_version, currencies);
});


fetch(base+'/api/v5/convert?q=USD_XAF&compact=ultra')
	.then(res => res.json())
	.then(json => {

		const converted_val     = json['USD_XAF'];
		const converted_amount  = (1*converted_val).toFixed(2);
		display_output(1, 'USD', converted_amount, 'XAF');
	});



const amount_change = (val) => {
	if( 'localStorage' in window){
		if('amount' in localStorage)
			localStorage.removeItem('amount');
		localStorage.setItem('amount', val);
	}else{
		alert('this application need localStorage to perform properly');
	}
}

const from_cu_change = (val) => {
	if( 'localStorage' in window){
		if('from_cu' in localStorage)
			localStorage.removeItem('from_cu');
		localStorage.setItem('from_cu', val);
	}else{
		alert('this application need localStorage to perform properly');
	}
}  

const to_cu_change = (val) => {
	if( 'localStorage' in window){
		if('to_cu' in localStorage)
			localStorage.removeItem('to_cu');
		localStorage.setItem('to_cu', val);
	}else{
		alert('this application need localStorage to perform properly');
	}
}

const converter = () => {

	if( 'localStorage' in window){
		if('amount' in localStorage)
			var ea = localStorage.getItem('amount');
		if('from_cu' in localStorage)
			var cf = localStorage.getItem('from_cu');
		if('to_cu' in localStorage)
			var ct = localStorage.getItem('to_cu');
	}else{
		alert('this application need localStorage to perform properly');
	}
	let entered_amount  = ea || 1;
	let currency_from   = cf || 'USD';
	let currency_to     = ct || 'XAF';

	const query_param = currency_from + '_' + currency_to;
	 
	//converter
	fetch(base+'/api/v5/convert?q='+query_param+'&compact=ultra')
	.then(res => res.json())
	.then(json => {
		const converted_val     = json[query_param];
		const converted_amount  = (entered_amount*converted_val).toFixed(2);
		display_output(entered_amount, currency_from, converted_amount, currency_to);
	});
}


const display_currency_list = (currencies) => {
	const currency_from_dom = document.getElementById('from_corrency');
	const currency_to_dom   = document.getElementById('to_currency');
	const curs = currencies.results;
	for (const key in curs) {
		
		const objs =curs[key];
		let option =  `<option value="${ objs.currencyId }"> ${ objs.currencyId } - ${ objs.name } </option>`;

		//set the default from currency
		if(objs.currencyId === 'USD' && objs.name === 'United States of America'){
			let option =  `<option value="${ objs.currencyId }" selected> ${ objs.currencyId } - ${ objs.name } </option>`;
			currency_from_dom.innerHTML += option;
			continue;
		}

		//set the default to currency
		if(objs.currencyId === 'XAF' && objs.name === 'Cameroon'){
			let option =  `<option value="${ objs.currencyId }" selected> ${ objs.currencyId } - ${ objs.name } </option>`;
			currency_to_dom.innerHTML   += option;
			continue;
		}


		currency_from_dom.innerHTML += option;
		currency_to_dom.innerHTML   += option;

	}
}


const display_output = (amount, from_currency, converted_amount, to_currency) => {

	document.getElementById('entered_amount_output').innerHTML    = amount;
	document.getElementById('currency_from_output').innerHTML     = from_currency;
  
	document.getElementById('converted_amount_output').innerHTML  = converted_amount;
	document.getElementById('currency_to_output').innerHTML       = to_currency;

}