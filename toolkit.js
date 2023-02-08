window.onload = function ()
{
	window.accessibilityTool = new accessibilityTool();
	
}

function accessibilityTool ()
{
	
	this.createtoolkit();
	this.initializetoolkit();  

	this.toolkit = document.getElementById('toolkit');

	//Open and Close Buttons
	var openButton = document.getElementById('toolkitOpenButton');
	var closeButton = document.getElementById('close_button');

	openButton.addEventListener('click', this.openBox.bind(this));
	closeButton.addEventListener('click', this.closeBox.bind(this));

	document.addEventListener('keyup', this.toolkitVisibility.bind(this));

	//change_language_button
	var changeLang = document.getElementById('change_language_button');
	changeLang.addEventListener('click', this.changeLanguage);

	//multimedia_block Buttons
	var keyboardSurf = document.getElementById('toolkit_media_keyboard');
	var videoBlock = document.getElementById('toolkit_media_video');
	var soundBlock = document.getElementById('toolkit_media_sound');

	keyboardSurf.addEventListener('click', this.keyboardSurf);
	videoBlock.addEventListener('click', this.blockVideo);
	soundBlock.addEventListener('click', this.blockAudio);

	//contrast_colors_block Buttons
	var greyscale = document.getElementById('toolkit_contrast_greyscale');
	var bright = document.getElementById('toolkit_contrast_bright');
	var reverse = document.getElementById('toolkit_contrast_reverse');

	greyscale.addEventListener('click', this.changeContrast);
	bright.addEventListener('click', this.changeContrast);
	reverse.addEventListener('click', this.changeContrast);

	//highlight_content_block Buttons
	var highLinks = document.getElementById('toolkit_highlight_links');
	var highHeaders = document.getElementById('toolkit_highlight_headers');
	var imageTitles = document.getElementById('toolkit_highlight_image_titles');

	highLinks.addEventListener('click', this.highlightContent);
	highHeaders.addEventListener('click', this.highlightContent);
	imageTitles.addEventListener('click', this.showTitles);

	//font_size_block Buttons
	var maxFont = document.getElementById('toolkit_max_font');
	var minFont = document.getElementById('toolkit_min_font');
	var changeFont = document.getElementById('toolkit_change_font');

	maxFont.addEventListener('click', this.changeFontSize);
	minFont.addEventListener('click', this.changeFontSize);
	changeFont.addEventListener('click', this.changeFont);

	//cursor_and_zoom_block buttons

	var whiteCursor = document.getElementById('toolkit_big_cursor_white');
	var blackCursor = document.getElementById('toolkit_big_cursor_black');
	var zoom = document.getElementById('toolkit_zoom_in');

	whiteCursor.addEventListener('click', this.changeCursor);
	blackCursor.addEventListener('click', this.changeCursor);
	zoom.addEventListener('click', this.zoomScreen);

	//reset Button
	var reset = document.getElementById('toolkit_reset');

	reset.addEventListener('click',this.resetAll.bind(this));

}

//Initialization

accessibilityTool.prototype.initializetoolkit = function (event)
{
	window.toolkitState = JSON.parse(localStorage.getItem('toolkitState')) || {
		classList: {},
		fontSize: 1,
		language: 'GR',
		imagesTitle: false,
		keyboardSurf: false
	};

	//Add checkmarks to all the selected buttons
	if (window.toolkitState.classList) {
		for (var bodyClass in window.toolkitState.classList) {
			var initBodyClassList = window.toolkitState.classList[bodyClass];

			var enabledButton = document.getElementById(initBodyClassList);
			if (enabledButton) {
				enabledButton.classList.add('enabled');
			}
			document.body.classList.add(initBodyClassList);
		}
	}

	hideCheckMarks();

	//If the button for the images titles was selected, generate the titles at the startup
	if(window.toolkitState.imagesTitle == true)
	{
		generateImageTitles();
	}

	//If there was a change at the fontSize previously, apply this change at the startup
	if(window.toolkitState.fontSize !== 1)
	{
		setFontSize(window.toolkitState.fontSize);
		accessibilityTool.prototype.initializeFonts();

	}
	initializeLanguage();
}


//toolkit creation
accessibilityTool.prototype.createtoolkit = function ()
{

	var toolkit = document.createElement('div');
	toolkit.id = 'toolkit_init';
	toolkit.innerHTML = '<meta charset="utf-8"><link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet"><button title="CTRL+F1" id="toolkitOpenButton" class="starting_button"><div><span class="material-icons" id="accessibility_icon">accessible</span></div></button><div id="toolkit" class="toolkit"><div class="toolkit_header"><span class="header_text" id="header_text">Μενού Προσβασιμότητας</span> <button title="ESC" id="close_button"><span class="material-icons" style="color:#fff">close</span></button></div><div class="buttons_with_header_block" id="multimedia_block"><div class="button_block_headerAND_flag"><span id="font_size" class="font_size"></span> <span class="button_block_header" id="multimedia_header">Πολυμέσα</span> <button title="Αλλαγή Γλώσσας" id="change_language_button"><img id="flag_icon" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAADdAAAA3QFwU6IHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAThQTFRF////+5CWpG6Y+4WMum+RlGOUQUebQkibQkicRkueRkydR02dR02eSE2eSE6eSE6fSU+fSlCfSlCgTFGgTFKhTVKgTVOhTlOhTlSiT1WiUVWhUVajUVejUkeVUkqXUk6bUlGeUlOgUlejUlikU0eUU1ikVFqkVVqlVlumV1ymWV6nXGGoXmOpX2SqYGWqYGWrYWarYmesY2isZE2TZGmsZmqtZmuuZ2uuaG2uaW2vam+va3CwbHGxbXGxbXKxbnOyb3OycHSycHWzcXWzcnazdHi0dXm1d3y2eHy3en64e3+4fIC4foK6gl2WiIy/io7Ai4/AjZDBkFaKlZjFl5rGmJvGmZzHnaDJoKLKoKPLoaTLoqTLo6bMpKfMpafNpajN9fDw9fX19uDh+Lq++MrN+5CW/Wpy/0tV1Uw64AAAAAZ0Uk5TAIqwuMzZ24+8ogAAAOpJREFUOMtjYBgKgIkVGbAwowFGBjZ+NjYeOFJJRwcMHPE8vHECXLECnFEC3DFSSeiAgU3E1VHY3V7Yy0bYx1JYMQUdMHBECwlGifJFivOEi/FFyGJawabkYqfqZqfkbq3kZaGkkIwOGDjClGVC1SRDNSSCNSRDpBPQAQO7gZW5ga25gYOZvouRPjYrArU0A7TV/XVV/fRV/eVT0QEDh7OhnrOJrrOpnpOFjpNMIjpgYPNmY/MEIw8gKZeGDhh8jZFBEKaCRAKAIZUAYEgnABgSCACGZAKAsBUpBABDEgFA2ApGZryAcUjkPABWg9YaCJi69wAAAABJRU5ErkJggg=="></button></div><div class="control_button_block"><button class="control_button" title="Πλοήγηση με Πληκτρολόγιο" id="toolkit_media_keyboard"><span class="material-icons">keyboard</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_media_keyboard_txt">Πλοήγηση με<br>Πληκτρολόγιο</span></button> <button class="control_button" title="Διακοπή Κινούμενων Εικόνων" id="toolkit_media_video"><span class="material-icons">play_disabled</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_media_video_txt">Διακοπή<br>Κινούμενων<br>Εικόνων</span></button> <button class="control_button" title="Διακοπή Ήχων" id="toolkit_media_sound"><span class="material-icons">volume_off</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_media_sound_txt">Διακοπή<br>Ήχων</span></button></div></div><div class="buttons_with_header_block" id="contrast_colors_block"><span class="button_block_header" id="contrast_header">Αντίθεση Χρωμάτων</span><div class="control_button_block"><button class="control_button" title="Αποκορεσμός" id="toolkit_contrast_greyscale"><span class="material-icons">brightness_medium</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_contrast_greyscale_txt">Αποκορεσμός</span></button> <button class="control_button" title="Ανοιχτή Αντίθεση" id="toolkit_contrast_bright"><span class="material-icons">brightness_low</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_contrast_bright_txt">Ανοιχτή<br>Αντίθεση</span></button> <button class="control_button" title="Αντιστροφή Χρωμάτων" id="toolkit_contrast_reverse"><span class="material-icons">brightness_7</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_contrast_reverse_txt">Αντιστροφή<br>Χρωμάτων</span></button></div></div><div class="buttons_with_header_block" id="font_size_block"><span class="button_block_header" id="font_size_header">Μέγεθος Κειμένου</span><div class="control_button_block"><button class="control_button" title="Μεγιστοποίηση Κειμένου" id="toolkit_max_font"><span class="material-icons">format_size </span><span class="button_text" id="toolkit_max_font_txt">Μεγιστοποίηση<br>Κειμένου</span></button> <button class="control_button" title="Σμίκρυση Κειμένου" id="toolkit_min_font"><span class="material-icons">text_fields </span><span class="button_text" id="toolkit_min_font_txt">Σμίκρυση<br>Κειμένου</span></button> <button class="control_button" title="Αλλαγή Γραματοσειράς" id="toolkit_change_font"><span class="material-icons">format_shapes</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_change_font_txt">Αλλαγή<br>Γραματοσειράς</span></button></div></div><div class="buttons_with_header_block" id="highlight_content_block"><span class="button_block_header" id="highlight_content_header">Επισήμανση Περιεχομένου</span><div class="control_button_block"><button class="control_button" title="Επισήμανση Συνδέσμων" id="toolkit_highlight_links"><span class="material-icons">link</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_highlight_links_txt">Επισήμανση<br>Συνδέσμων</span></button> <button class="control_button" title="Επισήμανση Τίτλων" id="toolkit_highlight_headers"><span class="material-icons">title</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_highlight_headers_txt">Επισήμανση<br>Τίτλων</span></button> <button class="control_button" title="Εμφάνιση Τίτλων Εικόνων" id="toolkit_highlight_image_titles"><span class="material-icons">insert_photo</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_highlight_image_titles_txt">Εμφάνιση Τίτλων<br>Εικόνων</span></button></div></div><div class="buttons_with_header_block" id="cursor_and_zoom_block"><span class="button_block_header" id="zoom_header">Μεγέθυνση</span><div class="control_button_block"><button class="control_button" title="Λευκός Κέρσορας" id="toolkit_big_cursor_white"><span class="material-icons-outlined">mouse</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_big_cursor_white_txt">Λευκός<br>Κέρσορας</span></button> <button class="control_button" title="Μαύρος Κέρσορας" id="toolkit_big_cursor_black"><span class="material-icons">mouse</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_big_cursor_black_txt">Μαύρος<br>Κέρσορας</span></button> <button class="control_button" title="Μεγένθυση Οθόνης" id="toolkit_zoom_in"><span class="material-icons">zoom_in</span><div class="checkMark"><span class="material-icons">check_circle</span></div><span class="button_text" id="toolkit_zoom_in_txt">Μεγέθυνση<br>Οθόνης</span></button></div></div><div class="reset_button_block"><button class="reset_button" title="Αφαίρεση Επιλογών" id="toolkit_reset"><span id="big_button" class="button_text">Αφαίρεση Επιλογών</span> <span class="material-icons" style="font-size:30px">delete_sweep</span></button></div><div class="toolkit_footer"><span id="footer_text">Created by: <a id="footer_link" href="https://github.com/billykonstas" style="text-decoration:none;color:#000">Vasilis Konstantaras</a></span></div></div>';
	var styleTag = document.createElement('style');

	fetch('./toolkit_files/toolkit.min.css')
	.then(response => response.text())
	.then(data => styleTag.textContent = data)
	
	document.head.appendChild(styleTag);


	document.body.insertBefore(toolkit, document.body.firstChild);
}



accessibilityTool.prototype.toolkitVisibility = function ()
{
	if (event.keyCode == 27)
	{
		this.closeBox();
	}
	if (event.ctrlKey && event.keyCode == 112)
	{
		this.openBox();
	}

}

accessibilityTool.prototype.openBox = function (event)
{
	//Makes toobox visible when the button is pressed
	document.getElementById("toolkit").style.visibility='visible';

	//Make the check marks appear when the window is open
	var checkMarks = document.querySelectorAll('.enabled .checkMark');
	for (var j = 0; j < checkMarks.length; j++)
	{
		checkMarks[j].style.removeProperty('visibility');
	}

}

accessibilityTool.prototype.closeBox = function (event)
{
	//Makes the toolkit hidden when the close button is pressed
	document.getElementById("toolkit").style.visibility='hidden';

	hideCheckMarks();
}
//Happens at the load of the page
function initializeLanguage()
{
	var flagIcon = document.getElementById('flag_icon');
	if (window.toolkitState.language == 'EN')
	{
		flagIcon.src = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAG7AAABuwE67OPiAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAE5QTFRF////QUebXWKpkpTCpafNWF2mnaDKYmirr7HSVVulsrTTxcfdQUebQUebcne0g4e8QUebTFKhdHi0hYm9uLrWycrfz9Di6urv8PDy9fX1NE2wPwAAABB0Uk5TAKHGxsbJycvLzM3a9/j6+xvHL/AAAACASURBVFjD7da5DoAgDIDhep8o3vL+L2o1sElSZDFNv43lH6AhBRCCh6RXj+FEowrUJ6Ct2aBFB/ttoCmoPIHDUHEIrNZ2n3Z3qlIqeO9O9GdkEJBB8gXKnIrvjxQQcJdRd6jNg4GJxCGgI3EIZJFkkDBQROIwSG7R/AYXTSF4uADmELufgschDAAAAABJRU5ErkJggg==';
		englify();
	}
	else
	{
		flagIcon.src = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAADdAAAA3QFwU6IHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAThQTFRF////+5CWpG6Y+4WMum+RlGOUQUebQkibQkicRkueRkydR02dR02eSE2eSE6eSE6fSU+fSlCfSlCgTFGgTFKhTVKgTVOhTlOhTlSiT1WiUVWhUVajUVejUkeVUkqXUk6bUlGeUlOgUlejUlikU0eUU1ikVFqkVVqlVlumV1ymWV6nXGGoXmOpX2SqYGWqYGWrYWarYmesY2isZE2TZGmsZmqtZmuuZ2uuaG2uaW2vam+va3CwbHGxbXGxbXKxbnOyb3OycHSycHWzcXWzcnazdHi0dXm1d3y2eHy3en64e3+4fIC4foK6gl2WiIy/io7Ai4/AjZDBkFaKlZjFl5rGmJvGmZzHnaDJoKLKoKPLoaTLoqTLo6bMpKfMpafNpajN9fDw9fX19uDh+Lq++MrN+5CW/Wpy/0tV1Uw64AAAAAZ0Uk5TAIqwuMzZ24+8ogAAAOpJREFUOMtjYBgKgIkVGbAwowFGBjZ+NjYeOFJJRwcMHPE8vHECXLECnFEC3DFSSeiAgU3E1VHY3V7Yy0bYx1JYMQUdMHBECwlGifJFivOEi/FFyGJawabkYqfqZqfkbq3kZaGkkIwOGDjClGVC1SRDNSSCNSRDpBPQAQO7gZW5ga25gYOZvouRPjYrArU0A7TV/XVV/fRV/eVT0QEDh7OhnrOJrrOpnpOFjpNMIjpgYPNmY/MEIw8gKZeGDhh8jZFBEKaCRAKAIZUAYEgnABgSCACGZAKAsBUpBABDEgFA2ApGZryAcUjkPABWg9YaCJi69wAAAABJRU5ErkJggg==';
		greekify();
	}
}

function hideCheckMarks ()
{
	var checkMarks = document.querySelectorAll('.enabled .checkMark');
	for (var j = 0; j < checkMarks.length; j++)
	{
		checkMarks[j].style.visibility='hidden';
	}
}

function updateState () {
	var jsonSting = JSON.stringify(window.toolkitState);
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem('toolkitState', jsonSting);
	} else {
		console.log('No Storage Found');
	}
}

//Buttons functionality

//Change Language
accessibilityTool.prototype.changeLanguage = function ()
{
	var flagIcon = document.getElementById('flag_icon');
	if (window.toolkitState.language == 'GR')
	{
		flagIcon.src = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAG7AAABuwE67OPiAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAE5QTFRF////QUebXWKpkpTCpafNWF2mnaDKYmirr7HSVVulsrTTxcfdQUebQUebcne0g4e8QUebTFKhdHi0hYm9uLrWycrfz9Di6urv8PDy9fX1NE2wPwAAABB0Uk5TAKHGxsbJycvLzM3a9/j6+xvHL/AAAACASURBVFjD7da5DoAgDIDhep8o3vL+L2o1sElSZDFNv43lH6AhBRCCh6RXj+FEowrUJ6Ct2aBFB/ttoCmoPIHDUHEIrNZ2n3Z3qlIqeO9O9GdkEJBB8gXKnIrvjxQQcJdRd6jNg4GJxCGgI3EIZJFkkDBQROIwSG7R/AYXTSF4uADmELufgschDAAAAABJRU5ErkJggg==';
		window.toolkitState.language = 'EN';
		englify();
	}
	else if (window.toolkitState.language == 'EN')
	{
		flagIcon.src = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAADdAAAA3QFwU6IHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAThQTFRF////+5CWpG6Y+4WMum+RlGOUQUebQkibQkicRkueRkydR02dR02eSE2eSE6eSE6fSU+fSlCfSlCgTFGgTFKhTVKgTVOhTlOhTlSiT1WiUVWhUVajUVejUkeVUkqXUk6bUlGeUlOgUlejUlikU0eUU1ikVFqkVVqlVlumV1ymWV6nXGGoXmOpX2SqYGWqYGWrYWarYmesY2isZE2TZGmsZmqtZmuuZ2uuaG2uaW2vam+va3CwbHGxbXGxbXKxbnOyb3OycHSycHWzcXWzcnazdHi0dXm1d3y2eHy3en64e3+4fIC4foK6gl2WiIy/io7Ai4/AjZDBkFaKlZjFl5rGmJvGmZzHnaDJoKLKoKPLoaTLoqTLo6bMpKfMpafNpajN9fDw9fX19uDh+Lq++MrN+5CW/Wpy/0tV1Uw64AAAAAZ0Uk5TAIqwuMzZ24+8ogAAAOpJREFUOMtjYBgKgIkVGbAwowFGBjZ+NjYeOFJJRwcMHPE8vHECXLECnFEC3DFSSeiAgU3E1VHY3V7Yy0bYx1JYMQUdMHBECwlGifJFivOEi/FFyGJawabkYqfqZqfkbq3kZaGkkIwOGDjClGVC1SRDNSSCNSRDpBPQAQO7gZW5ga25gYOZvouRPjYrArU0A7TV/XVV/fRV/eVT0QEDh7OhnrOJrrOpnpOFjpNMIjpgYPNmY/MEIw8gKZeGDhh8jZFBEKaCRAKAIZUAYEgnABgSCACGZAKAsBUpBABDEgFA2ApGZryAcUjkPABWg9YaCJi69wAAAABJRU5ErkJggg==';
		window.toolkitState.language = 'GR';
		greekify();
	}
	updateState();
}

function englify ()
{
	document.getElementById('header_text').innerHTML = 'Accessibility Menu';

	document.getElementById('multimedia_header').innerHTML = 'Multimedia';
	document.getElementById('change_language_button').title = 'Change Language';
	document.getElementById('toolkit_media_keyboard_txt').innerHTML = 'Keyboard<br>Surfing';
	document.getElementById('toolkit_media_video').title = 'Disable Animations';
	document.getElementById('toolkit_media_video_txt').innerHTML = 'Disable<br>Animations';
	document.getElementById('toolkit_media_sound').title = 'Disable Sounds';
	document.getElementById('toolkit_media_sound_txt').innerHTML = 'Disable<br>Sounds';

	document.getElementById('contrast_header').innerHTML = 'Color Contrast';
	document.getElementById('toolkit_contrast_greyscale').title = 'Greyscale';
	document.getElementById('toolkit_contrast_greyscale_txt').innerHTML='Greyscale';
	document.getElementById('toolkit_contrast_bright').title = 'Bright Contrast';
	document.getElementById('toolkit_contrast_bright_txt').innerHTML = 'Bright<br>Contrast';
	document.getElementById('toolkit_contrast_reverse').title = 'Reverse Contrast';
	document.getElementById('toolkit_contrast_reverse_txt').innerHTML = 'Reverse<br>Contrast';

	document.getElementById('font_size_header').innerHTML = 'Text Size';
	document.getElementById('toolkit_max_font').title = 'Increase Text';
	document.getElementById('toolkit_max_font_txt').innerHTML = 'Increase<br>Text';
	document.getElementById('toolkit_min_font').title = 'Decrease Text';
	document.getElementById('toolkit_min_font_txt').innerHTML = 'Decrease<br>Text';
	document.getElementById('toolkit_change_font').title = 'Change Font';
	document.getElementById('toolkit_change_font_txt').innerHTML = 'Change<br>Font';

	document.getElementById('highlight_content_header').innerHTML = 'Highlight Content';
	document.getElementById('toolkit_highlight_links').title = 'Highlight Links';
	document.getElementById('toolkit_highlight_links_txt').innerHTML = 'Highlight<br>Links';
	document.getElementById('toolkit_highlight_headers').title = 'Highlight Headers';
	document.getElementById('toolkit_highlight_headers_txt').innerHTML = 'Highlight<br>Headers';
	document.getElementById('toolkit_highlight_image_titles').title = 'Show Image Titles';
	document.getElementById('toolkit_highlight_image_titles_txt').innerHTML = 'Show<br>Image<br>Titles';

	document.getElementById('zoom_header').innerHTML = 'Zoom';
	document.getElementById('toolkit_big_cursor_white').title = 'White Cursor';
	document.getElementById('toolkit_big_cursor_white_txt').innerHTML = 'White<br>Cursor';
	document.getElementById('toolkit_big_cursor_black').title = 'Black Cursor';
	document.getElementById('toolkit_big_cursor_black_txt').innerHTML = 'Black<br>Cursor';
	document.getElementById('toolkit_zoom_in').title = 'Screen Zoom';
	document.getElementById('toolkit_zoom_in_txt').innerHTML = 'Screen<br>Zoom';

	document.getElementById('toolkit_reset').title = 'Reset Options';
	document.getElementById('big_button').innerHTML = 'Reset Options';


}

function greekify ()
{
	document.getElementById('header_text').innerHTML = 'Μενού Προσβασιμότητας';

	document.getElementById('multimedia_header').innerHTML = 'Πολυμέσα';
	document.getElementById('change_language_button').title = 'Αλλαγή Γλώσσας';
	document.getElementById('toolkit_media_keyboard_txt').innerHTML = 'Πλοήγηση με<br>Πληκτρολόγιο';
	document.getElementById('toolkit_media_video').title = 'Διακοπή Κινούμενων Εικόνων';
	document.getElementById('toolkit_media_video_txt').innerHTML = 'Διακοπή<br>Κινούμενων<br>Εικόνων';
	document.getElementById('toolkit_media_sound').title = 'Διακοπή Ήχων';
	document.getElementById('toolkit_media_sound_txt').innerHTML = 'Διακοπή<br>Ήχων';

	document.getElementById('contrast_header').innerHTML = 'Αντίθεση Χρωμάτων';
	document.getElementById('toolkit_contrast_greyscale').title = 'Αποκορεσμός';
	document.getElementById('toolkit_contrast_greyscale_txt').innerHTML='Αποκορεσμός';
	document.getElementById('toolkit_contrast_bright').title = 'Ανοιχτή Αντίθεση';
	document.getElementById('toolkit_contrast_bright_txt').innerHTML = 'Ανοιχτή<br>Αντίθεση';
	document.getElementById('toolkit_contrast_reverse').title = 'Αντιστροφή Χρωμάτων';
	document.getElementById('toolkit_contrast_reverse_txt').innerHTML = 'Αντιστροφή<br>Χρωμάτων';

	document.getElementById('font_size_header').innerHTML = 'Μέγεθος Κειμένου';
	document.getElementById('toolkit_max_font').title = 'Μεγιστοποίηση Κειμένου';
	document.getElementById('toolkit_max_font_txt').innerHTML = 'Μεγιστοποίηση<br>Κειμένου';
	document.getElementById('toolkit_min_font').title = 'Σμίκρυνση Κειμένου';
	document.getElementById('toolkit_min_font_txt').innerHTML = 'Σμίκρυνση<br>Κειμένου';
	document.getElementById('toolkit_change_font').title = 'Αλλαγή Γραμματοσειράς';
	document.getElementById('toolkit_change_font_txt').innerHTML = 'Αλλαγή<br>Γραμματοσειράς';

	document.getElementById('highlight_content_header').innerHTML = 'Επισήμανση Περιεχομένου';
	document.getElementById('toolkit_highlight_links').title = 'Επισήμανση Συνδέσμων';
	document.getElementById('toolkit_highlight_links_txt').innerHTML = 'Επισήμανση<br>Συνδέσμων';
	document.getElementById('toolkit_highlight_headers').title = 'Επισήμανση Επικεφαλίδων';
	document.getElementById('toolkit_highlight_headers_txt').innerHTML = 'Επισήμανση<br>Επικεφαλίδων';
	document.getElementById('toolkit_highlight_image_titles').title = 'Εμφάνιση Τίτλων Εικόνων';
	document.getElementById('toolkit_highlight_image_titles_txt').innerHTML = 'Εμφάνιση<br>Τίτλων<br>Εικόνων';

	document.getElementById('zoom_header').innerHTML = 'Μεγέθυνση';
	document.getElementById('toolkit_big_cursor_white').title = 'Λευκός Κέρσορας';
	document.getElementById('toolkit_big_cursor_white_txt').innerHTML = 'Λευκός<br>Κέρσορας';
	document.getElementById('toolkit_big_cursor_black').title = 'Μαύρος Κέρσορας';
	document.getElementById('toolkit_big_cursor_black_txt').innerHTML = 'Μαύρος<br>Κέρσορας';
	document.getElementById('toolkit_zoom_in').title = 'Μεγέθυνση Οθόνης';
	document.getElementById('toolkit_zoom_in_txt').innerHTML = 'Μεγέθυνση<br>Οθόνης';

	document.getElementById('toolkit_reset').title = 'Αφαίρεση Επιλογών';
	document.getElementById('big_button').innerHTML = 'Αφαίρεση Επιλογών';
}

//keyboard surfing
accessibilityTool.prototype.keyboardSurf = function ()
{
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolkitState.classList[this.id];
		window.toolkitState.keyboardSurf = false;
	}
	else
	{
		var selectors = document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,button,input,select,textarea');
		for (var i = 0; i < selectors.length; i++) {
			var currItem = selectors[i];
			currItem.tabIndex = i + 1;
		}
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolkitState.classList[this.id] = this.id;
		window.toolkitState.keyboardSurf = true;
	}
	updateState();	
}

//Blocks animations
accessibilityTool.prototype.blockVideo = function ()
{
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolkitState.classList[this.id];
	}
	else {
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolkitState.classList[this.id] = this.id;
	}

	updateState();
}

//Mute sound
accessibilityTool.prototype.blockAudio = function ()
{
	if (document.body.classList.contains(this.id)) {
		var media = document.querySelectorAll('video, audio');
		i = media.length;

		while (i--)
		{
			media[i].muted = false;

		}
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolkitState.classList[this.id];
	}
	else {
		var media = document.querySelectorAll('video, audio');
		i = media.length;

		while (i--)
		{
			media[i].muted = true;

		}
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolkitState.classList[this.id] = this.id;
	}

	updateState();
}

//Applying contrast

accessibilityTool.prototype.changeContrast = function (event)
{

	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolkitState.classList[this.id];
	}
	else{

		//When a contrast button is pressed the other contrast buttons are removed from the classList
		

		var contrastButtons = document.querySelectorAll('#contrast_colors_block button');
		for (var i = 0; i < contrastButtons.length; i++) {
			contrastButtons[i].classList.remove('enabled');
			document.body.classList.remove(contrastButtons[i].id);

			delete window.toolkitState.classList[contrastButtons[i].id];
		}
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolkitState.classList[this.id] = this.id;
	}
	updateState();
}


//Highlighting content

accessibilityTool.prototype.highlightContent = function (event)
{
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolkitState.classList[this.id];
	}
	else{
		//When a contrast button is pressed the other highlight buttons are removed from the classList

		var highButtons = [document.getElementById('toolkit_highlight_links'),document.getElementById('toolkit_highlight_headers')];
		for (var i = 0; i < highButtons.length; i++) {
			highButtons[i].classList.remove('enabled');
			document.body.classList.remove(highButtons[i].id);

			delete window.toolkitState.classList[highButtons[i].id];
		}
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolkitState.classList[this.id] = this.id;
	}
	updateState();
}


accessibilityTool.prototype.showTitles = function (event)
{
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolkitState.classList[this.id];

		var imageTitleSpans = document.querySelectorAll('span.toolkit_image_titles');
		for (i=0; i < imageTitleSpans.length; i++)
		{
			imageTitleSpans[i].remove();
		}
		window.toolkitState.imagesTitle = false;
	}
	else{
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolkitState.classList[this.id] = this.id;
		generateImageTitles();
		window.toolkitState.imagesTitle = true;
	}
	updateState();
}

function generateImageTitles()
{
	var images = document.images;
	for (var i = 0; i < images.length; i++) {
		var img = images[i];
		if(img.id == 'flag_icon')
		{
			i++;
			img = images[i];
		}
		if (img.alt) {
			var title = document.createElement('span');
			title.className = 'toolkit_image_titles';
			title.textContent = img.alt;
			img.parentNode.insertBefore(title, img);
		}
		else {
			var title = document.createElement('span');
			title.className = 'toolkit_image_titles';
			title.textContent = 'image without text';
			img.parentNode.insertBefore(title, img);
		}
	}
}

//Changes fonts
//First time initialization
accessibilityTool.prototype.initializeFonts = function ()
{
	var items = document.querySelectorAll('body,h1,h2,h3,h4,h5,h6,p,a,button:not(.control_button,.reset_button),input,textarea,li,td,th,strong,span:not(.material-icons,.material-icons-outlined,.button_text,.button_block_header,.header_text),blockquote,div');
	var initFontSize = window.toolkitState.fontSize;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var font = window.getComputedStyle(item).getPropertyValue('font-size');
		item.style.fontSize = font;
		var fs = item.style.fontSize.split('px');
	}
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var font = window.getComputedStyle(item).getPropertyValue('font-size').split('px');
		var fs = Number(font[0]);
		item.style.fontSize = (fs * initFontSize).toFixed() + 'px';
	}
	//A bug at the query selections also selects font_size and changes it size
	document.getElementById('font_size').style.fontSize='18px';
	document.getElementById('footer_link').style.fontSize='16px';
	document.getElementById('footer_text').style.fontSize='16px';

}

accessibilityTool.prototype.changeFont = function (event) {
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolkitState.classList[this.id];
	} else {
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolkitState.classList[this.id] = this.id;
	}
	updateState();
}

accessibilityTool.prototype.changeFontSize = function (event)
{

	var counter = window.toolkitState.fontSize;
	if (this.id === 'toolkit_max_font') {
		if (counter < 1.61) //Checks the value of the fontSize so text doesn't become too big
		{
			var items = document.querySelectorAll('body,h1,h2,h3,h4,h5,h6,p,a,button:not(.control_button,.reset_button),input,textarea,li,td,th,strong,span:not(.material-icons,.material-icons-outlined,.button_text,.button_block_header,.header_text),blockquote,div');
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var font = window.getComputedStyle(item).getPropertyValue('font-size').split('px');
				var fontSize = Number(font[0]);
				item.style.fontSize = (fontSize * 1.1).toFixed() + 'px';
			}
			counter = (counter * 1.1).toFixed(2);
		}
	}
	if (this.id === 'toolkit_min_font') {
		if (counter > 1) //Checks the value of the fontSize so text doesn't become too small
		{
			var items = document.querySelectorAll('body,h1,h2,h3,h4,h5,h6,p,a,button:not(.control_button,.reset_button),input,textarea,li,td,th,strong,span:not(.material-icons,.material-icons-outlined,.button_text,.button_block_header,.header_text),blockquote,div');
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var font = window.getComputedStyle(item).getPropertyValue('font-size').split('px');
				var fontSize = Number(font[0]);
				item.style.fontSize = (fontSize / 1.1).toFixed() + 'px';
			}
			counter = (counter / 1.1).toFixed(2);
		}

	}

	window.toolkitState.fontSize = counter;
	setFontSize(counter);
	updateState();
}

function setFontSize(fontSize)
{
	if (fontSize > 1) {
		var initPerc = (Number(fontSize) * 100 - 100).toFixed();
		var perc = '+' + initPerc + '%';
		document.getElementById('font_size').innerText=perc;
		
	}
	else {
		document.getElementById('font_size').innerText='';
	}
	//A bug at the query selections also selects font_size and changes it size
	document.getElementById('font_size').style.fontSize='18px';
	document.getElementById('footer_link').style.fontSize='16px';
	document.getElementById('footer_text').style.fontSize='16px';
}

//Change cursors
accessibilityTool.prototype.changeCursor = function (event)
{
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolkitState.classList[this.id];
	}
	else {
		var highButtons = [document.getElementById('toolkit_big_cursor_white'),document.getElementById('toolkit_big_cursor_black')];
		for (var i = 0; i < highButtons.length; i++) {
			highButtons[i].classList.remove('enabled');
			document.body.classList.remove(highButtons[i].id);

			delete window.toolkitState.classList[highButtons[i].id];
		}
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolkitState.classList[this.id] = this.id;
	}
	updateState();
}
//Zoom

accessibilityTool.prototype.zoomScreen = function (event)
{
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolkitState.classList[this.id];
	}
	else {
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolkitState.classList[this.id] = this.id;
	}
	updateState();

}

//Resetting

accessibilityTool.prototype.resetAll = function (event)
{
	localStorage.removeItem('toolkitState');
	window.location.reload();
}

