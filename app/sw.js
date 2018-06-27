
'use strict';

const cache_name   = 'app-cache-v1';
const static_files =[
	'/',
	'/assets/css/style.css',
	'/assets/css/vendor/bootstrap.min.css',

	'assets/js/script.js',
	'assets/js/vendor/bootstrap.min.js',
	'assets/js/vendor/jquery-slim.min.js',
	'assets/js/vendor/popper.min.js',

	'assets/images/header.png'
]

self.addEventListener('install', function(event){
	//perform install steps
	event.waitUntil(
		caches.open(cache_name)
		.then(function(cache){
			console.log('Opened cache');
			return cache.addAll(static_files);
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
      }
    )
  );
});