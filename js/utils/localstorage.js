/**************************************************
* Learn Words // localdtorage.js
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
* Placed in public domain.
**************************************************/
if(typeof(localStorageAPI) == 'undefined' || localStorageAPI == null || !localStorageAPI){
	
	localStorageAPI = {
	
		isLocalStorageAvailable: function() {
				try {
					return 'localStorage' in window && window['localStorage'] !== null;
				} catch (e) {
					return false;
				}
			},
		
		readItem: function(key){
			if (localStorageAPI.isOK) {
				return JSON.parse(localStorage.getItem( key ));
			}
		},
		
		removeItem: function(key){
			if (localStorageAPI.isOK) {
				localStorage.removeItem( key );
			}
		},
		
		storeItem: function(key, value){
			if (localStorageAPI.isOK) {
				try {
					localStorage.setItem(key, JSON.stringify(value));
				} catch (e) {
					if (e == QUOTA_EXCEEDED_ERR) {
						alert('Local Storage is full');
					}
					return false;
				}
			}
		},


                removeWords: function(){
			if (localStorageAPI.isOK) {
                        "use strict";
                        var key;
                        var st; 
                        var keysToDelete = [];

                        var prefixForNumber = 'learnWords-index';  

                        // go through all keys starting with the name
                        // of the database, i.e 'learnWords-index14'
                        for (var i = 0; i < localStorage.length; i++){
                            key = localStorage.key(i);
                            st = localStorage.getItem(key);                            
    
                            if (key.lastIndexOf(prefixForNumber,0) === 0) {
                                keysToDelete.push(key);
                            };
			};
                        // now we have all the keys which should be deleted
                        // in the array keysToDelete.
                        console.log(keysToDelete);
                        keysToDelete.forEach(function(aKey){
                             localStorage.removeItem(aKey);
			});

                        // reset index
                        localStorage.setItem('learnWords-words', '');

                        // this one triggers that memorystore is executed
                        localStorage.removeItem('learnWords-settings');
                        }

		},

		
		init: function(){
			localStorageAPI.isOK = false;
			if (!localStorageAPI.isLocalStorageAvailable()) {
				alert('Local Storage is not available.');
				return false;
			}
			localStorageAPI.isOK = true;
		}
	};
	
	localStorageAPI.init();
}

