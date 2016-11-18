/**************************************************
* Learn Words // localstorage.js
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
* Placed in public domain.
*
* Update November 2016 by Hannes Hirzel
*
**************************************************/

	// Define global LearnWords object
	var LW = {}; 


	// Define database sub-object

	LW.wdsDB = {
	
		isLocalStorageAvailable: function() {
                                "use strict";
				try {
					return 'localStorage' in window && window['localStorage'] !== null;
				} catch (e) {
					return false;
				}
			},
		
		get: function(key){
			if (LW.wdsDB.isOK) {
				return JSON.parse(localStorage.getItem(key));
			}
		},
		
		remove: function(key){
			if (LW.wdsDB.isOK) {
				localStorage.removeItem( key );
			}
		},
		
		put: function(key, value){
                        "use strict";
			if (LW.wdsDB.isOK) {
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
			if (LW.wdsDB.isOK) {
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


                dumpWords: function(aKeyPrefix) {
		           if (LW.wdsDB.isOK) {
                            "use strict";
                            var key;
                            var strValue; 
                            var result = [];

                            var prefixForNumber = 'learnWords-index';  

                            // go through all keys starting with the name
                            // of the database, i.e 'learnWords-index14'
                            // collect the matching objects into arr
                            for (var i = 0; i < localStorage.length; i++){
                                key = localStorage.key(i);
                                strValue = localStorage.getItem(key);                            
    
                                if (key.lastIndexOf(prefixForNumber,0) === 0) {
                                    result.push(JSON.parse(strValue));
                                };
			    };

                            // Dump the array as JSON code (for select all / copy)
                            console.log(JSON.stringify(result));
                           }
                },	


		
		init: function(){
                        "use strict";
			LW.wdsDB.isOK = false;

			if (!LW.wdsDB.isLocalStorageAvailable()) {
				alert('Local Storage is not available.');
				return false;
			}
			LW.wdsDB.isOK = true;

                        // Initialize index array object 
                        // index is an array with the keys for all words.

			LW.wdsDB.index = LW.wdsDB.get('learnWords-words').split(',');

		}
	};
	
	LW.wdsDB.init();

