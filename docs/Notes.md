# Notes about LearnWords


Draft of a loadWords function to be used in  ``memorystore.js`` .



````JavaScript
"use strict;"
var LW = {};

LW.loadWords = (function(){  // IIFE
                
               var prefix = 'index';
               var wordNo = 0; // words have numbered keys like index1, index2, ... index18
               var words = []; // what is called 'words' here 
                               // is actually an index of the keys or the word objects. 
  

               // constructor for a word object to be stored (sample)

               var LWword = function(key, aWord) {
                   this.index = key;
                   this.word = aWord.word;
                   this.translate = aWord.translate;
                   this.date = new Date();
                   this.step = 0;
               };               
  

               // anArrayOfWords - aWord object just needs to have two attributes
               // 1. word
               // 2. translate
 
               return function(anArrayOfWords){

                   anArrayOfWords.forEach(function(aWord){
                       wordNo = wordNo + 1;  
                       var key = prefix + wordNo;
                       localStorageAPI.storeItem('learnWords-'+key, new LWword(aWord));
                       words.push(key);
                   }); 

                      
                   localStorageAPI.storeItem('learnWords-words', words.join());
                 
                   console.log(words.length + ' words have been loaded!');
               };
               
               
               
               }
               
               )();

````


Then add the following function property definition for the LW object below. 
You may replace the method name with your own method name.

````JavaScript

LW.loadWordsGermanEnglish = function(){

LW.loadWords(
....
[
  }
]

);
````


## Step 3

Replace the existing file 'memorystore.js' with what you created under step 2.

TODO: Add function here to clear out existing entries.

````JavaScript
LW.resetDatabase();
````

## Step 4

Start the app; 
Open web console (under developer tools).
Paste the following code into the console area and hit 'Return');

````JavaScript
LW.resetDatabase(); LW.loadWordsGermanEnglish();
````


