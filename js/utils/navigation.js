/**************************************************
* Learn Words // navigation.js
* Coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* 
* Placed in public domain.
**************************************************/
if(typeof(LW.Navig) == 'undefined' || LW.Navig == null || !LW.Navig){
	
	LW.Navig = {
	
		hashguard: function(init){ //onHashChange
			if (init) this.hash = window.location.hash;
			if (this.hash != window.location.hash){
				$(window).trigger('hashbreak', {"prevhash":this.hash});
				this.hash = window.location.hash;
			}
			setTimeout('LW.Navig.hashguard(false)', 50);
		},
		
		hashbreak: function(){ //hashchange event
			var hashUrl = window.location.hash.slice(3);
			
			if (hashUrl) {
				$('[data-target=' + window.location.hash.slice(3) + ']').click();
			} else {
				$('[data-target=summary]').click();
			}
		},
		
		navSelect: function(){
			$('[data-toggle=nav]').each(function(){
				$(this).addClass('nodisplay');
			});
			$('[data-type=nav-select-li]').each(function(){
				$(this).removeClass('active');
			});
			$(this).parent().addClass('active');
			$('#'+$(this).data('target')).removeClass('nodisplay');
			LW.Utils.closeMobMenu();
		},
		
		init: function(){
			$(document).on('click touchstart', '[data-type=nav-select]', LW.Navig.navSelect);
			$(window).bind('hashbreak', LW.Navig.hashbreak);
			LW.Navig.hashguard(false);
		}
	};
	
	LW.Navig.init();
}

