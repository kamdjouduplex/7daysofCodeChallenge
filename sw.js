
'use strict';

const CACHE_VERSION = 3
const CACHEA_NAME   = 'app-cache-v'+CACHE_VERSION;
const STATIC_FILES =[

	'/index.html',
	'css/style.min.css',
	'js/script.min.js',
	'images/header.png'
]

self.addEventListener('install', function(event){
	//perform install steps
	event.waitUntil(
		caches.open(CACHEA_NAME)
		.then(function(cache){
			console.log('Opened cache');
			return cache.addAll(STATIC_FILES);
		})
	)
});

self.addEventListener('activate', function(event){
	event.waitUntil(
		caches.keys().then(function(keys){
			return Promise.all(keys.map(function(key, i){
				if(key !== CACHEA_NAME){
					return caches.delete(keys[i]);
				}
			}));
		})
	)
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
        	console.log(response);
          	return response;
        }
        return fetch(event.request);
      })
      .catch(function(){
      	return event.default();
      })
  );
});