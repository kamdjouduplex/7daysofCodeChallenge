
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
//prefixes of window.IDB objects
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
 
if (!indexedDB) {
    alert("Your browser doesn't support a stable version of IndexedDB.")
} 

var db;
const setIndexDB = (data) => {

 
  var request = indexedDB.open(DB_NAME, DB_VERSION);
   
  request.onerror = function(e) {
    console.log("error: ", e);
  };
   
  request.onsuccess = function(e) {
    db = request.result;
    console.log("success: "+ db);
  };

  //console.log(db);

  request.onupgradeneeded = function(event) {
    var objectStore = event.target.result.createObjectStore(STORE_NAME, {keyPath: "id"});
    objectStore.createIndex("id", "id", { unique: true });
    objectStore.transaction.oncomplete = (event) => {
      // Store values in the newly created objectStore.
      let customerObjectStore = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME);
      const curs = data.results;
      for (const key in curs) {
        const objs =curs[key];
        customerObjectStore.add(objs);
      }
    };
  }
}


function Add() {
        var request = db.transaction(["users"], "readwrite").objectStore("users")
                .add({ id: "3", name: "Gautam", age: 30, email: "gautam@store.org" });
                                 
        request.onsuccess = function(e) {
                alert("Gautam has been added to the database.");
        };
         
        request.onerror = function(e) {
                alert("Unable to add the information.");       
        }
         
}


function Read() {
        var objectStore = db.transaction(["users"]).objectStore("users");
        var request = objectStore.get("2");
        request.onerror = function(event) {
          alert("Unable to retrieve data from database!");
        };
        request.onsuccess = function(event) {          
          if(request.result) {
                alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
          } else {
                alert("Bidulata couldn't be found in your database!"); 
          }
        };
}

function ReadAll() {
        var objectStore = db.transaction("users").objectStore("users");  
        var req = objectStore.openCursor();

        req.onsuccess = function(event) {
      db.close();
          var res = event.target.result;
          if (res) {
                alert("Key " + res.key + " is " + res.value.name + ", Age: " + res.value.age + ", Email: " + res.value.email);
                res.continue();
          }
        }; 

        req.onerror = function (e) {
            console.log("Error Getting: ", e);
        };    
}

/*
const setIndexDB = (db_name, db_version, data) => {
  var db;
  if( 'indexedDB' in window){
    var request = window.indexedDB.open(db_name, db_version);

    request.onerror = (event) => {
        console.log("indexedDB Error: " + JSON.stringify(event));
    };

    request.onsuccess = function(event) {
      db = event.target.result;
      console.log("success: "+ db);
    };
  
    request.onupgradeneeded = (event) => { 
      let objectStore = db.createObjectStore(STORE_NAME, { keyPath: "by_id" });
      objectStore.createIndex("id", "id", { unique: true });
      objectStore.transaction.oncomplete = (event) => {
      
      // Store values in the newly created objectStore.
      let customerObjectStore = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME);
      const curs = data.results;
      for (const key in curs) {
          const objs =curs[key];
          customerObjectStore.add(objs);
        }
      };

    };

  }else{
    alert('Your browser doesn\'t support indexDB');
  }
}
*/