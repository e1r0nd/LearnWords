/**************************************************
* Learn Words // settings.js
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
* Placed in public domain.
**************************************************/
if(typeof(Settings) == 'undefined' || Settings == null || !Settings){
	
	Settings = {
	
		inputFirstCheck: $('#inputFirstCheck'),
		inputSecondCheck: $('#inputSecondCheck'),
		inputThirdCheck: $('#inputThirdCheck'),
		settingFrom: $('#settingFrom'),
		errorSettings: $('#errorSettings'),
		
		params: {},
	
		getSettings: function(){ //read setting's values
			var settings = LW.db.getSettings();
			
			$(Settings.inputFirstCheck).val(settings.first);
			$(Settings.inputSecondCheck).val(settings.second);
			$(Settings.inputThirdCheck).val(settings.third);
			
			Settings.params = settings; //store local
		},
		
		saveSetting: function(){ //save setting's values to DB
			var first = $(Settings.inputFirstCheck).val().trim(),
				second = $(Settings.inputSecondCheck).val().trim(),
				third = $(Settings.inputThirdCheck).val().trim(),
				form = $(Settings.settingFrom),
				errorName = '',
				error = false;
			
			Utils.clearFields();
			//check for empty fields
			if (!first) {
				error = Utils.setFieldError(form.children(':nth-child(1)'));
				errorName = 'empty';
			} else if (!second) {
				error = Utils.setFieldError(form.children(':nth-child(2)'));
				errorName = 'empty';
			} else if (!third) {
				error = Utils.setFieldError(form.children(':nth-child(3)'));
				errorName = 'empty';
			} else { //only digits is valid
				if (!Utils.isNumber(first)) {
					error = Utils.setFieldError(form.children(':nth-child(1)'));
					errorName = 'number';
				};
				if (!Utils.isNumber(second)) {
					error = Utils.setFieldError(form.children(':nth-child(2)'));
					errorName = 'number';
				};
				if (!Utils.isNumber(third)) {
					error = Utils.setFieldError(form.children(':nth-child(3)'));
					errorName = 'number';
				};
			}
			if (error) { //show error if any
				var errorTxt = (errorName == 'empty') ? local[local.currentLocal].errorEmpty : local[local.currentLocal].errorValid;
				$(Settings.errorSettings).removeClass('nodisplay').text(errorTxt);
			} else { //otherwise save new settings
				settings = {
					first : first,
					second: second,
					third: third
				};
				LW.db.putSettings(settings);
				$(Settings.errorSettings).removeClass('nodisplay').text(local[local.currentLocal].errorNo);
				
				Settings.params = settings; //store local
			};
		},
		
		cancelSetting: function(){
			Utils.clearFields();
			Settings.getSettings();
		},
		
		init: function(){
			$(document).on('click touchstart', '#saveSettings', Settings.saveSetting);
			$(document).on('click touchstart', '#cancelSettings', Settings.cancelSetting);
		}
	};
	
	Settings.init();
}

