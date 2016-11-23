/**************************************************
* Learn Words // localstorage.js
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
*
* Updated by Hannes Hirzel, November 2016
*
* Placed in public domain.
**************************************************/


// Define global LearnWords object
var LW = {}; 


// Define database sub-object
LW.db = {
	
		isLocalStorageAvailable: function() {
				try {
					return 'localStorage' in window && window['localStorage'] !== null;
				} catch (e) {
					return false;
				}
			},
		
		readItem: function(key){
			if (LW.db.isOK) {
				return JSON.parse(localStorage.getItem( key ));
			}
		},
		
		removeItem: function(key){
			if (LW.db.isOK) {
				localStorage.removeItem( key );
			}
		},
		
		storeItem: function(key, value){
			if (LW.db.isOK) {
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

	
	
	        putSettings: function(theSettingsObj){
                    	LW.db.storeItem(LW.db.name+'-words-settings', theSettingsObj);
		},


		getSettings: function(){
			
			var settings = LW.db.readItem(LW.db.name+'-words-settings');
                        if (!settings) {
                            // the app runs for the first time, thus
			    // initialize the setting object neeeds to be initialized
			    // with default values.

                            // first is for box (or step) 1 in the Leitner box; 
                            //       ask the word again after 1 day
                            // second is for box 2 ; ask the word again after 3 days
                            // third is for box 3 ; ask the word again after 7 days

                            // Note: box 0 is for the Learn mode and it not set 
                            // as the words are accessible all the time
                            console.log('initialize settings');
			    settings = {
        				first : 1,
        				second: 3,
        				third: 7
    			     };
    			     LW.db.storeItem(LW.db.name+'-settings', settings);
    			     LW.db.storeItem(LW.db.name+'-language', 'en_GB');

                        };

	                return settings
		},


	
	

		loadWords: function(theWords) {
				var i= 0;
				var arrayOfKeys = [];

				theWords.forEach(function(element){
  					 i = i + 1;
  					 element.index = "index"+i;
  					 element.step = 0;
  					 element.date = 0;
  					 LW.db.storeItem(LW.db.name+'-'+element.index, element);
  					 arrayOfKeys.push(element.index);
					}
				);

                                LW.db.storeItem(LW.db.name+'-words', arrayOfKeys.join());
                                LW.db.index = arrayOfKeys; 

                                console.log(arrayOfKeys.length + " words loaded");

		},



		isEmpty: function(key){
			if (LW.db.isOK) {
				if (LW.db.index.length == 0) {return true} else {return false};
			}
		},


                dumpWords: function(aKeyPrefix) {
		           if (LW.db.isOK) {
                            "use strict";
                            var key;
                            var strValue; 
                            var result = [];

                            var prefixForNumber = LW.db.name+'-index';  

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




		removeObjects: function(aKeyPrefix){
			if (LW.db.isOK) {
                         var key;
                         var st; 
                         var keysToDelete = [];

                         // go through all keys starting with the name
                         // of the database, i.e 'learnWords-index14'
                         for (var i = 0; i < localStorage.length; i++){
                            key = localStorage.key(i);
                            st = localStorage.getItem(key);                             
    
                            if (key.lastIndexOf(aKeyPrefix,0) === 0) {
                                keysToDelete.push(key);
                            };
			 };
                         // now we have all the keys which should be deleted
                         // in the array keysToDelete.
                         console.log(keysToDelete);
                         keysToDelete.forEach(function(aKey){
                              localStorage.removeItem(aKey);
			 });
                       }
		},


		removeWords: function(){

                        var aKeyPrefix = LW.db.name+'-index';  
                        LW.db.removeObjects(aKeyPrefix);

                        // reset index
                        localStorage.setItem(LW.db.name+'-words', '');

                        // this one triggers that memorystore is executed
                        localStorage.removeItem(LW.db.name+'-settings');

		},



		destroy: function(){

                        var aKeyPrefix = LW.db.name;  

                        LW.db.removeObjects(aKeyPrefix);

		},


		
		init: function(dbName){
			LW.db.isOK = false;
			if (!LW.db.isLocalStorageAvailable()) {
				alert('Local Storage is not available.');
				return false;
			};
			LW.db.name = dbName;
                        // get index
                        LW.db.index = [];
                        var strIndex = localStorage.getItem(LW.db.name+'-words');
                        if (strIndex) {LW.db.index = strIndex.split(',')};
			LW.db.isOK = true;
		}
	};
	

// initialize database sub-object
LW.db.init("LWdb");


