/**************************************************
* Learn Words // local.js
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
* Placed in public domain.
**************************************************/
if(typeof(local) == 'undefined' || local == null || !local){
console.log("define local");
	local = {
	
		en_GB: {
			summary: 'Summary',
			learn: 'Learn',
			repeat: 'Repeat',
			vocabulary: 'Vocabulary',
			settings: 'Settings',
			editWords: 'Edit words',
			first: 'First',
			second: 'Second',
			third: 'Third',
			saveBtn: 'Save',
			cancelBtn: 'Cancel',
			language: 'Language',
			en_GB: 'english',
			de_DE: 'deutsch',
			ru_RU: 'русский',
			errorEmpty: 'All fields are required.',
			errorValid: 'Entered values are incorrect.',
			errorNo: 'New settings was saved.',
			errorNoW: 'New word was added.',
			totalWords: 'Total words',
			learnWordsNum: 'Words to learn',
			repeatWords: 'Words to repeat',
			rememberBtn: 'Remember',
			repeatBtn: 'Repeat',
			knownBtn: 'Know',
			allWordsOk: 'No more words for learning.',
			inputWordLbl: 'Word',
			inputTranslateLbl: 'Translate',
			enterBtn: 'Check',
			allWordsDone: 'No more words for repeat.'
		},
		
		ru_RU: {
			summary: 'Сводка',
			learn: 'Учить',
			repeat: 'Повторять',
			vocabulary: 'Словарь',
			settings: 'Настройки',
			editWords: 'Редактировать слова',
			first: 'Первый',
			second: 'Второй',
			third: 'Третий',
			saveBtn: 'Сохранить',
			cancelBtn: 'Отменить',
			language: 'Язык',
			en_GB: 'english',
			de_DE: 'deutsch',
			ru_RU: 'русский',
			errorEmpty: 'Все поля обязательны.',
			errorValid: 'Введенные значения невалидны.',
			errorNo: 'Новые значение были записаны.',
			errorNoW: 'Новое слово добавлено.',
			totalWords: 'Всего слов',
			learnWordsNum: 'Слов учить',
			repeatWords: 'Сегодня поторить слов',
			rememberBtn: 'Запомнил',
			repeatBtn: 'Повторить',
			knownBtn: 'Знаю',
			allWordsOk: 'Нет больше слов для изучения.',
			inputWordLbl: 'Слово',
			inputTranslateLbl: 'Перевод',
			enterBtn: 'Проверить',
			allWordsDone: 'Нет больше слов для повторения.'
		},
		
		de_DE: {
			summary: 'Summe',
			learn: 'Lernen',
			repeat: 'Wiederholen',
			vocabulary: 'Vokabular',
			settings: 'Rahmen',
			editWords: 'Wörter ändern',
			first: 'Erste',
			second: 'Zweite',
			third: 'Dritte',
			saveBtn: 'Speichern',
			cancelBtn: 'Stornieren',
			language: 'Sprache',
			en_GB: 'english',
			de_DE: 'deutsch',
			ru_RU: 'русский',
			errorEmpty: 'Alle Felder sind erforderlich.',
			errorValid: 'Eingegebene Werte sind falsch.',
			errorNo: 'Neue Einstellungen gespeichert wurde.',
			errorNoW: 'Neues Wort hinzugefügt.',
			totalWords: 'Insgesamt Worte',
			learnWordsNum: 'Wörter zu lernen',
			repeatWords: 'Worte zu wiederholen',
			rememberBtn: 'Merken',
			repeatBtn: 'Wiederholen',
			knownBtn: 'Wissen',
			allWordsOk: 'Keine Worte mehr für das Lernen.',
			inputWordLbl: 'Wort',
			inputTranslateLbl: 'Übersetzen',
			enterBtn: 'Prüfen',
			allWordsDone: 'Keine Worte mehr für wiederholen.'
		},
		changeLocalContent: function(){ // change inner content
			var langNode = $('[data-toggle=lang]'),
				langSelect = $('[data-type=lang-select]');
			
			$(langNode).each(function(i, node){
				$(node).text(local[local.currentLocal][$(node).data('lang')]);
			});
			$(langSelect).each(function(i, node){
				$(node).removeClass('selected');
			});
		},
		
		langSelect: function(){ //change localization
			local.currentLocal = $(this).data('lang');
			$('#langSelect').click();
			$('.navbar-toggle:visible').click();
			local.changeLocalContent();
			LW.db.storeItem(LW.db.name+'-language', local.currentLocal);
			$(this).addClass('selected');
			return false;
		},
		
		init: function(){
                        var settings = LW.db.getSettings(); // to force initialisation.
			local.currentLocal = LW.db.readItem(LW.db.name+'-language');
			$(document).on('click touchstart', '[data-type=lang-select]', local.langSelect);
		}
	}
	
	local.init();
}
