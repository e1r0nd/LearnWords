/**************************************************
* Learn Words // memorystore.js
* The in-memory Store. Encapsulates logic to access data.
* All fields are required.
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
* Placed in public domain.
* 
* This file needs to be replaced with a newer version.
* see: https://github.com/e1r0nd/LearnWords/issues/6
*******************************************************/

if (LW.wdsDB.isOK && (LW.wdsDB.get('learnWords-settings') == 'undefined' || LW.wdsDB.get('learnWords-settings') == null)) {
	settings = {
		first : 1,
		second: 3,
		third: 7
	};
	LW.wdsDB.put('learnWords-settings', settings);
	
	LW.wdsDB.put('learnWords-language', 'en_GB');
	
	var words = ['index1', 'index2', 'index3', 'index4', 'index5', 'index6', 'index7', 'index8', 'index9', 'index10', 'index11', 'index12', 'index13', 'index14'];
	LW.wdsDB.put('learnWords-words', words.join());
	
	index1 = {
		index: 'index1',
		word: 'das Auto',
		translate: 'car',
		step: 0,
		date: 0
	};
	LW.wdsDB.put('learnWords-index1', index1);
	
	index2 = {
		index: 'index2',
		word: 'laufen',
		translate: 'run',
		step: 0,
		date: 0
	};
	LW.wdsDB.put('learnWords-index2', index2);

	index3 = {	
		index: 'index3',
		word: 'alt',
		translate: 'old',
		step: 0,
		date: 0
	};
	LW.wdsDB.put('learnWords-index3', index3);
	
	index4 = {	
		index: 'index4',
		word: 'krank',
		translate: 'sick',
		step: 0,
		date: 0
	};
	LW.wdsDB.put('learnWords-index4', index4);
	
	index5 = {
		index: 'index5',
		word: 'heute',
		translate: 'today',
		step: 0,
		date: 0
	};
	LW.wdsDB.put('learnWords-index5', index5);
	
	index6 = {
		index: 'index6',
		word: 'schreiben',
		translate: 'write',
		step: 0,
		date: 0
	};
	LW.wdsDB.put('learnWords-index6', index6);
	
	index7 = {
		index: 'index7',
		word: 'hell',
		translate: 'light',
		step: 0,
		date: 0
	};
	LW.wdsDB.put('learnWords-index7', index7);
	
	index8 = {
		index: 'index8',
		word: 'reich',
		translate: 'rich',
		step: 0,
		date: 0
	};
	LW.wdsDB.put('learnWords-index8', index8);
	
	index9 = {
		index: 'index9',
		word: 'süß',
		translate: 'sweet',
		step: 1,
		date: 0
	};
	LW.wdsDB.put('learnWords-index9', index9);
	
	index10 = {
		index: 'index10',
		word: 'weiblich',
		translate: 'female',
		step: 1,
		date: 0
	};
	LW.wdsDB.put('learnWords-index10', index10);
	
	index11 = {
		index: 'index11',
		word: 'bestellen',
		translate: 'order',
		step: 1,
		date: 0
	};
	LW.wdsDB.put('learnWords-index11', index11);
	
	index12 = {
		index: 'index12',
		word: 'kalt',
		translate: 'cold',
		step: 2,
		date: 0
	};
	LW.wdsDB.put('learnWords-index12', index12);
	
	index13 = {
		index: 'index13',
		word: 'sauer',
		translate: 'sour',
		step: 2,
		date: 0
	};
	LW.wdsDB.put('learnWords-index13', index13);
	
	index14 = {
		index: 'index14',
		word: 'fliegen',
		translate: 'fly',
		step: 3,
		date: 0
	};
	LW.wdsDB.put('learnWords-index14', index14);
	
	console.log(localStorage);

}

