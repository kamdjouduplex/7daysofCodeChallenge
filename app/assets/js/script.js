

'use strict';

const fetch       = window.fetch;
const BASE_URL    = 'https://free.currencyconverterapi.com';

const DB_VERSION  = 1;
const DB_NAME     = 'currency_db';
const QUERY_DB_NAME    = 'query_db';
const STORE_NAME       = 'currencies'+DB_VERSION;
const STORE_QUERY_NAME = 'queries'+DB_VERSION
let currencies         = {};

if('serviceWorker' in navigator) {
	window.addEventListener('load', function(){
		navigator.serviceWorker.register('./sw.js')
		.then(function(reg){
			console.log('serviceWorker registered successfully');
		})
		.catch(function(error){
			console.log('serviceWorker Error: '+error);
		})
	})
} else {
	alert('service worker not supported on this browser');
}


// all related database code goes here indexedDB

if (!window.indexedDB) {
    window.alert("Your browser doesn't support IndexedDB. Consequently you will not enjoy offline functionality");
}


/*function handledb(DB_NAME, DB_VERSION, STORE_NAME, JSON){*/
	// Let us open our database
	let request = window.indexedDB.open(DB_NAME, DB_VERSION);

	request.onerror = function(event) {
	  // Do something with request.errorCode!
	  alert("Database Error: " + event.target.errorCode);
	};
	let db;
	request.onsuccess = function(event) {
	  // Do something with request.result!
	  db = event.target.result;
	  const curStore = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME);
	  const exchangeStore = db.transaction(STORE_QUERY_NAME, "readonly").objectStore(STORE_QUERY_NAME);
	  let curRequest = curStore.getAll();
	  let exRequest = exchangeStore.get('USD_XAF');
	  //handle curStore event
	  curRequest.onerror = function(event) {
	    console.log('error getting data from indexedDB');
	  };
	  curRequest.onsuccess = function(event) {
	    var currencies = curRequest.result;
	    display_currency_list(currencies);
	  };
	  //handle exStore event
	  exRequest.onerror = function(event) {
	    console.log('error getting data from indexedDB');
	  };
	  exRequest.onsuccess = function(event) {
	    var exchangeRate = exRequest.result;
	    display_output(1, 'USD', exchangeRate, 'XAF');
	  };
	};

	// This event is only implemented in recent browsers   
	request.onupgradeneeded = function(event) { 
			
		  	// Save the IDBDatabase interface 
		  	db = event.target.result;
		  	// Create an objectStore for this database
		  	var objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
		  	var queryStore = db.createObjectStore(STORE_QUERY_NAME);	
		  	
		  	fetch(BASE_URL+'/api/v5/countries')
		  	.then(res => res.json()).then(json => {
		  		currencies = json;
		  		let currenciesObjectStore = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME);
		  		//store data to indexedDB
		  		console.log(currencies);
		  		const curs = currencies.results;
		  		for (const key in curs) {
		  			const objs =curs[key];
		  			currenciesObjectStore.add(objs);
		  		}
		  		localStorage.setItem("local_data_succed", 'Yes');
		  		location.reload(); //reload the page to take full control
		  	});


		  	fetch(BASE_URL+'/api/v5/convert?q=USD_XAF&compact=ultra')
		  	.then(res => res.json()).then(json => {
		  		let exchaneObjectStore = db.transaction(STORE_QUERY_NAME, "readwrite").objectStore(STORE_QUERY_NAME);
		  		//store data to indexedDB	
		  		const converted_val     = json['USD_XAF'];
				const converted_amount  = converted_val.toFixed(2);
		  		exchaneObjectStore.add(converted_amount, 'USD_XAF');
		  		localStorage.setItem("local_data_succed", 'Yes');
		  		location.reload(); //reload the page to take full control
		  	});
		  	
	};




//get the entered amound from the user
const amount_change = (val) => {
	if( 'localStorage' in window){
		if('amount' in localStorage)
			localStorage.removeItem('amount');
		localStorage.setItem('amount', val);
	}else{
		alert('this application need localStorage to perform properly');
	}
}

//get the entered currency to convert form
const from_cu_change = (val) => {
	if( 'localStorage' in window){
		if('from_cu' in localStorage)
			localStorage.removeItem('from_cu');
		localStorage.setItem('from_cu', val);
	}else{
		alert('this application need localStorage to perform properly');
	}
}  

//get the entered currency to convert to
const to_cu_change = (val) => {
	if( 'localStorage' in window){
		if('to_cu' in localStorage)
			localStorage.removeItem('to_cu');
		localStorage.setItem('to_cu', val);
	}else{
		alert('this application need localStorage to perform properly');
	}
}


//conert from one currency to another
const converter = () => {
	$('#loader').show();
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
	let request = window.indexedDB.open(DB_NAME, DB_VERSION);

	request.onerror = function(event) {
	  // Do something with request.errorCode!
	  alert("Database Error: " + event.target.errorCode);
	};
	let db;

	request.onsuccess = function(event) {
	  // Do something with request.result!
	  db = event.target.result;
	  const exStore = db.transaction(STORE_QUERY_NAME, "readonly").objectStore(STORE_QUERY_NAME);
	  let exReq = exStore.get(query_param);
	  //handle exStore event
	  exReq.onerror = function(event) {
	    console.log('error getting data from indexedDB');
	  };
	  exReq.onsuccess = function(event) {
	  	if(exReq.result != undefined){
	  		const exRate = ((exReq.result)*entered_amount).toFixed(2);
	    	display_output(entered_amount, currency_from, exRate, currency_to);
	    	$('#loader').hide();
	  	}else{
	  		fetch(BASE_URL+'/api/v5/convert?q='+query_param+'&compact=ultra')
	  		.then(res => res.json())
	  		.then(json => {
	  			$('#loader').hide();
	  			const converted_val     = json[query_param];
	  			const rate  = converted_val.toFixed(2);
	  			const converted_amount  = (entered_amount*converted_val).toFixed(2);
	  			let NewExStore = db.transaction(STORE_QUERY_NAME, "readwrite").objectStore(STORE_QUERY_NAME);
	  			//store data to indexedDB	
				NewExStore.add(rate, query_param);
	  			display_output(entered_amount, currency_from, converted_amount, currency_to);
	  			$('#loader').hide();
	  		}).catch( (error) => {
	  			alert('No internet Connection. You must carry this operation at least once when connected before it works offline');
	  		});
	  	}
	  };
	};

	// This event is only implemented in recent browsers   
	request.onupgradeneeded = (event) => { 
		// Save the IDBDatabase interface 
		db = event.target.result;
	};
	
}



//display currency list to the select input
const display_currency_list = (currencies) => {
	const currency_from_dom = document.getElementById('from_corrency');
	const currency_to_dom   = document.getElementById('to_currency');
	currencies.forEach( function(objs){
		//console.log(objs);
		let option =  `<option value="${ objs.currencyId }"> ${ objs.currencyId } - ${ objs.name } </option>`;

		//set the default from currency
		if(objs.currencyId === 'USD' && objs.name === 'United States of America'){
			let option =  `<option value="${ objs.currencyId }" selected> ${ objs.currencyId } - ${ objs.name } </option>`;
			currency_from_dom.innerHTML += option;
			return;
		}

		//set the default to currency
		if(objs.currencyId === 'XAF' && objs.name === 'Cameroon'){
			let option =  `<option value="${ objs.currencyId }" selected> ${ objs.currencyId } - ${ objs.name } </option>`;
			currency_to_dom.innerHTML   += option;
			return;
		}

		//update the views
		currency_from_dom.innerHTML += option;
		currency_to_dom.innerHTML   += option;
	})
}

//display the output
const display_output = (amount, from_currency, converted_amount, to_currency) => {

	document.getElementById('entered_amount_output').innerHTML    = amount;
	document.getElementById('currency_from_output').innerHTML     = from_currency;
  
	document.getElementById('converted_amount_output').innerHTML  = converted_amount;
	document.getElementById('currency_to_output').innerHTML       = to_currency;
}