/**************************************************
* Learn Words // utils.js
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
* Placed in public domain.
**************************************************/
if(typeof(Utils) == 'undefined' || Utils == null || !Utils){
	
	Utils = {
	
		isNumber: function(str, withDot){ //validate filed for number value
			var NumberReg = /^\d+$/,
				NumberWithDotReg = /^[-+]?[0-9]*\.?[0-9]+$/;
			
            return withDot ? NumberWithDotReg.test(str) : NumberReg.test(str);
		},
		
		clearFields: function(){
			$('.form-group').each(function(i, node){ //clear all error styles
				$(node).removeClass('has-error');
			});
			$('#errorSettings').addClass('nodisplay');
		},
		
		setFieldError: function(self){ //set the error style for the current input field
			$(self).addClass('has-error');
			return true;
		},
		
		getRandomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		
		getToday: function(fullDate){
			var now = new Date();
			
			if (fullDate) {
				return new Date().valueOf();
			} else {
				return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
			}
		},
		
		closeMobMenu: function(){
			if ($('#bs-example-navbar-collapse-1').hasClass('in')) {
				$('#navbarToggle').click();
			}
		},
		shuffle: function(a) {
			 var j, x, i;
		    for (i = a.length; i; i--) {
		        j = Math.floor(Math.random() * i);
		        x = a[i - 1];
		        a[i - 1] = a[j];
		        a[j] = x;
		    }		   
		}	
	};
}

