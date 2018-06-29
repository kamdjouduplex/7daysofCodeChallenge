
'use strict';


// This is what our customer data looks like.
const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];


function setIndexDB(db_name, db_version, data){

	if( 'indexedDB' in window){
		const request = window.indexedDB.open(db_name, db_version);

		request.onerror = function(event) {
		  	// Do something with request.errorCode!
		  	alert('Why don\'t you allow my app to use indexDB, we garanty you to not used any of your confidencial info');
		};

		request.onsuccess = function(event) {
		  	// Do something with request.result!
		  	db = event.target.result;
		};


		// This event is only implemented in recent browsers   
		request.onupgradeneeded = function(event) { 
		  // Save the IDBDatabase interface 
		  let db = event.target.result;

		  // Create an objectStore for this database
		  let objectStore = db.createObjectStore("currencies", { keyPath: "id" });

		  // Create an index to search currencies by id. We want to ensure that
		  // no two currencies have the same id, so use a unique index.
		  objectStore.createIndex("id", "id", { unique: true });

		  // Use transaction oncomplete to make sure the objectStore creation is 
		    // finished before adding data into it.
		    objectStore.transaction.oncomplete = function(event) {
		      // Store values in the newly created objectStore.
		      let customerObjectStore = db.transaction("currencies", "readwrite").objectStore("currencies");
		      const curs = data.results;
		      for (const key in curs) {
				const objs =curs[key];
				console.log(objs);
		      	customerObjectStore.add(objs);
		      }
		      /*data.forEach(function(customer) {
		        
		      });*/
		    };
		};

	}else{
		alert('Your browser doesn\'t support indexDB');
	}
}

