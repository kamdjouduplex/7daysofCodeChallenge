
'use strict';
var CACHE_VERSION = 8;
var CURRENT_CACHES = 'currency-cache-'+ CACHE_VERSION;

const STATIC_FILES =[
	'/',
	'/index.html',
	'/assets/css/style.css',
	'/assets/css/vendor/bootstrap.min.css',
	'/assets/js/script.js',
	'/assets/js/vendor/bootstrap.min.js',
	'/assets/js/vendor/jquery-slim.min.js',
	'/assets/js/vendor/popper.min.js',
	'/assets/images/header.png',
	'/favicon.ico'
];


self.addEventListener('install', event => {
	//perform install steps
	event.waitUntil(
		caches.open(CURRENT_CACHES)
		.then( cache => {
			return cache.addAll(STATIC_FILES);
		})
		.then( () => {
			console.log('WORKER: install completed');
		})
	)
});



self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then( response => {
        // Cache hit - return response
        if (response) {
          	return response;
        }
        return fetch(event.request);
      })
      .catch( (error) => {
      	console.log(error);
      })
  );
});

/*self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' ||
      (event.request.method === 'GET' &&
       event.request.headers.get('accept').includes('text/html'))) {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(event.request).catch(error => {
        console.log('Fetch failed; returning offline page instead.', error);
        return caches.match(STATIC_FILES);
      })
    );
  }
});*/


self.addEventListener('activate', event => {
	console.log('WORKER: activate event in progress.');
	event.waitUntil(
	    caches
	      .keys()
	      .then( (keys) => {
	        return Promise.all(
	          keys
	            .filter( (key) => {
	              return !key.startsWith(CURRENT_CACHES);
	            })
	            .map( (key) => {
	              return caches.delete(key);
	            })
	        );
	      })
	      .then( () => {
	        console.log('WORKER: activate completed.');
	      })
	 );
});
/*
const cache_jon_data = (url) => {
	fetch(url)
	.then(res => res.json())
	.then(json => {
		currencies = json;
		console.log(currencies);
		setIndexDB(db_name, db_version, currencies);
	});
};



const setIndexDB = (db_name, db_version, data) => {

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
		  // Save the appDatabase interface 
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
		      data.forEach(function(customer) {
		        
		      });
		    };
		};

	}else{
		alert('Your browser doesn\'t support indexedDB');
	}
};*/