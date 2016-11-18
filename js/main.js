/******************************************************************
* Learn Words // main.js
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
* 
* Updated by hhzl and phil4literacy, November 2016
*
* Global LW object with
*
* LW.Utils  (helper functions)
* LW.local  (localisation information)
* LW.wdsDB  (database of words)
* LW.navig  (supports Navigation)
*
* There are four actions screens with correspondig objects.
* They are
* - Settings (edit settings)
* - Vocabulary (edit vocabulary)
* - Learn (manage Learn phase, step 0)
* - Repeat (manage Repeat phase, steps 1 to 3)
*
*
* License:
* Placed in public domain.
***************************************************************/



// Read the settings
//
// This is the number of days after which a word 
// which has been answered correctly 
// will be asked again.

Settings.getSettings();


// Set the user saved local information
// This is the user interface language

if (LW.local.current != $('[data-type=lang-select].selected').data('lang')) {
	$('[data-lang='+LW.local.current+']').click();
};



// ----------------------------------------------------------
// Actions
// ----------------------------------------------------------

Vocabulary.viewWord();

Learn.recountIndexLearn();
Learn.showWord();

Repeat.recountIndexRepeat();
Repeat.showWord();


// ----------------------------------------------------------

LW.Utils.closeMobMenu();
