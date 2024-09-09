window.onload = function ()
{
	window.accessibilityTool = new accessibilityTool();
	
}

function accessibilityTool ()
{
	
	this.createtoolkit();

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
		setFontProgress(window.toolkitState.fontSize);
		initializeFonts();

	}
	initializeLanguage();
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
		var changeFont = document.getElementById('toolkit_change_font');

		maxFont.addEventListener('click', this.changeFontSize);
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


//toolkit creation
accessibilityTool.prototype.createtoolkit = function ()
{
	const htmlURL = 'https://cdn.jsdelivr.net/gh/billykonstas/AccessibilityToolkit@main/toolkit_files/toolkit.html';
	const cssURL = 'https://cdn.jsdelivr.net/gh/billykonstas/AccessibilityToolkit@main/toolkit_files/toolkit.css';

	var toolkit = document.createElement('div');
	toolkit.id = 'toolkit_init';
	// when developing fetch locally 'toolkit_files/toolkit.html'
	fetch(htmlURL)
		.then(response => response.text())
		.then(htmlContent => {
			const minifiedHTML = minifyHTML(htmlContent);
			toolkit.innerHTML = minifiedHTML;
		})
		.catch(error => console.error(error));

	fetch(cssURL)
		.then(response => response.text())
		.then(cssContent => {
		
			const minifiedCss = minifyCSS(cssContent);

			var styleTag = document.createElement('style');
			styleTag.textContent = minifiedCss;
			document.head.appendChild(styleTag);
			this.initializetoolkit();
		})
		.catch(error => console.error('Error fetching CSS:', error));
	document.body.insertBefore(toolkit, document.body.firstChild);
}


minifyHTML = function (html) {
	return html
	.replace(/>\s+</g, '><')
	.replace(/\s{2,}/g, ' ')
	.replace(/<!--.*?-->/g, '')
	.trim();
}

minifyCSS = function (css) {
	return css
		.replace(/\s+/g, ' ') 
		.replace(/\/\*.*?\*\//g, '') 
		.replace(/\s*([{}:;,])\s*/g, '$1')
		.trim();
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
	document.getElementById("toolkit").classList.add('show');

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
	document.getElementById("toolkit").classList.remove('show');

	hideCheckMarks();
}
//Happens at the load of the page
function initializeLanguage()
{
	if (window.toolkitState.language == 'EN')
	{
		englify();
	}
	else
	{
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
	if (window.toolkitState.language == 'GR')
	{
		window.toolkitState.language = 'EN';
		englify();
	}
	else if (window.toolkitState.language == 'EN')
	{
		window.toolkitState.language = 'GR';
		greekify();
	}
	updateState();
}

function englify ()
{
	document.getElementById('change_language_button').title = 'Change Language';
	document.getElementById('change_language_button').innerHTML = 'ΕΛ';

	document.getElementById('header_text').innerHTML = 'Accessibility Menu';

	document.getElementById('toolkit_media_keyboard_txt').innerHTML = 'Keyboard<br>Surfing';
	document.getElementById('toolkit_media_video').title = 'Disable Animations';
	document.getElementById('toolkit_media_video_txt').innerHTML = 'Disable<br>Animations';
	document.getElementById('toolkit_media_sound').title = 'Disable Sounds';
	document.getElementById('toolkit_media_sound_txt').innerHTML = 'Disable<br>Sounds';

	document.getElementById('toolkit_contrast_greyscale').title = 'Greyscale';
	document.getElementById('toolkit_contrast_greyscale_txt').innerHTML='Greyscale';
	document.getElementById('toolkit_contrast_bright').title = 'Bright Contrast';
	document.getElementById('toolkit_contrast_bright_txt').innerHTML = 'Bright<br>Contrast';
	document.getElementById('toolkit_contrast_reverse').title = 'Reverse Contrast';
	document.getElementById('toolkit_contrast_reverse_txt').innerHTML = 'Reverse<br>Contrast';

	document.getElementById('toolkit_max_font').title = 'Increase Text';
	document.getElementById('toolkit_max_font_txt').innerHTML = 'Increase<br>Text';
	document.getElementById('toolkit_change_font').title = 'Change Font';
	document.getElementById('toolkit_change_font_txt').innerHTML = 'Change<br>Font';

	document.getElementById('toolkit_highlight_links').title = 'Highlight Links';
	document.getElementById('toolkit_highlight_links_txt').innerHTML = 'Highlight<br>Links';
	document.getElementById('toolkit_highlight_headers').title = 'Highlight Headers';
	document.getElementById('toolkit_highlight_headers_txt').innerHTML = 'Highlight<br>Headers';
	document.getElementById('toolkit_highlight_image_titles').title = 'Show Image Titles';
	document.getElementById('toolkit_highlight_image_titles_txt').innerHTML = 'Show<br>Image<br>Titles';

	document.getElementById('toolkit_big_cursor_white').title = 'White Cursor';
	document.getElementById('toolkit_big_cursor_white_txt').innerHTML = 'White<br>Cursor';
	document.getElementById('toolkit_big_cursor_black').title = 'Black Cursor';
	document.getElementById('toolkit_big_cursor_black_txt').innerHTML = 'Black<br>Cursor';
	document.getElementById('toolkit_zoom_in').title = 'Screen Zoom';
	document.getElementById('toolkit_zoom_in_txt').innerHTML = 'Screen<br>Zoom';

	document.getElementById('toolkit_reset').title = 'Reset';
	document.getElementById('big_button').innerHTML = 'Reset';
}

function greekify ()
{
	document.getElementById('change_language_button').title = 'Αλλαγή Γλώσσας';
	document.getElementById('change_language_button').innerHTML = 'EN';

	document.getElementById('header_text').innerHTML = 'Μενού Προσβασιμότητας';

	document.getElementById('toolkit_media_keyboard_txt').innerHTML = 'Πλοήγηση με<br>Πληκτρολόγιο';
	document.getElementById('toolkit_media_video').title = 'Διακοπή Κινούμενων Εικόνων';
	document.getElementById('toolkit_media_video_txt').innerHTML = 'Διακοπή<br>Κινούμενων<br>Εικόνων';
	document.getElementById('toolkit_media_sound').title = 'Διακοπή Ήχων';
	document.getElementById('toolkit_media_sound_txt').innerHTML = 'Διακοπή<br>Ήχων';

	document.getElementById('toolkit_contrast_greyscale').title = 'Αποκορεσμός';
	document.getElementById('toolkit_contrast_greyscale_txt').innerHTML='Αποκορεσμός';
	document.getElementById('toolkit_contrast_bright').title = 'Ανοιχτή Αντίθεση';
	document.getElementById('toolkit_contrast_bright_txt').innerHTML = 'Ανοιχτή<br>Αντίθεση';
	document.getElementById('toolkit_contrast_reverse').title = 'Αντιστροφή Χρωμάτων';
	document.getElementById('toolkit_contrast_reverse_txt').innerHTML = 'Αντιστροφή<br>Χρωμάτων';

	document.getElementById('toolkit_max_font').title = 'Μεγέθυνση Κειμένου';
	document.getElementById('toolkit_max_font_txt').innerHTML = 'Μεγέθυνση<br>Κειμένου';
	document.getElementById('toolkit_change_font').title = 'Αλλαγή Γραμματοσειράς';
	document.getElementById('toolkit_change_font_txt').innerHTML = 'Αλλαγή<br>Γραμματοσειράς';

	document.getElementById('toolkit_highlight_links').title = 'Επισήμανση Συνδέσμων';
	document.getElementById('toolkit_highlight_links_txt').innerHTML = 'Επισήμανση<br>Συνδέσμων';
	document.getElementById('toolkit_highlight_headers').title = 'Επισήμανση Επικεφαλίδων';
	document.getElementById('toolkit_highlight_headers_txt').innerHTML = 'Επισήμανση<br>Επικεφαλίδων';
	document.getElementById('toolkit_highlight_image_titles').title = 'Εμφάνιση Τίτλων Εικόνων';
	document.getElementById('toolkit_highlight_image_titles_txt').innerHTML = 'Εμφάνιση<br>Τίτλων<br>Εικόνων';

	document.getElementById('toolkit_big_cursor_white').title = 'Λευκός Κέρσορας';
	document.getElementById('toolkit_big_cursor_white_txt').innerHTML = 'Λευκός<br>Κέρσορας';
	document.getElementById('toolkit_big_cursor_black').title = 'Μαύρος Κέρσορας';
	document.getElementById('toolkit_big_cursor_black_txt').innerHTML = 'Μαύρος<br>Κέρσορας';
	document.getElementById('toolkit_zoom_in').title = 'Μεγέθυνση Οθόνης';
	document.getElementById('toolkit_zoom_in_txt').innerHTML = 'Μεγέθυνση<br>Οθόνης';

	document.getElementById('toolkit_reset').title = 'Αφαίρεση';
	document.getElementById('big_button').innerHTML = 'Αφαίρεση';
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
function initializeFonts ()
{
	var items = document.querySelectorAll('body,h1,h2,h3,h4,h5,h6,p,a,button:not(.control_button,.reset_button),input,textarea,li,td,th,strong,span:not(.material-icons,.material-icons-outlined,.button_text,.header_text),blockquote,div');
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
	//A bug at the query selections selects footer elements
	document.getElementById('change_language_button').style.fontSize='12px';
	document.getElementById('footer_link').style.fontSize='12px';
	document.getElementById('footer_year').style.fontSize='12px';
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
		if (counter == 1.61)
			{
				var items = document.querySelectorAll('body,h1,h2,h3,h4,h5,h6,p,a,button:not(.control_button,.reset_button),input,textarea,li,td,th,strong,span:not(.material-icons,.material-icons-outlined,.button_text,.header_text),blockquote,div');
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					var font = window.getComputedStyle(item).getPropertyValue('font-size').split('px');
					var fontSize = Number(font[0]);
					item.style.fontSize = (fontSize * 0.61).toFixed() + 'px';
				}
				counter = 1.0;
			}
		else if (counter < 1.61) //Checks the value of the fontSize so text doesn't become too big
		{
			var items = document.querySelectorAll('body,h1,h2,h3,h4,h5,h6,p,a,button:not(.control_button,.reset_button),input,textarea,li,td,th,strong,span:not(.material-icons,.material-icons-outlined,.button_text,.header_text),blockquote,div');
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var font = window.getComputedStyle(item).getPropertyValue('font-size').split('px');
				var fontSize = Number(font[0]);
				item.style.fontSize = (fontSize * 1.1).toFixed() + 'px';
			}
			counter = (counter * 1.1).toFixed(2);
		}
		
	}

	window.toolkitState.fontSize = counter;
	setFontProgress(counter);
	updateState();
}

function setFontProgress(fontSize)
{
	if (fontSize === '1.10') {
		document.getElementById('zoom_progress').style.width = '20%';
	}
	else if (fontSize === '1.21') {
		document.getElementById('zoom_progress').style.width = '40%';
	}
	else if (fontSize === '1.33') {
		document.getElementById('zoom_progress').style.width = '60%';
	}
	else if (fontSize === '1.46') {
		document.getElementById('zoom_progress').style.width = '80%';
	}
	else if (fontSize === '1.61') {
		document.getElementById('zoom_progress').style.width = '100%';
	}
	else {
		document.getElementById('zoom_progress').style.width = '0px';
	}
	//A bug at the query selections also selects font_size and changes it size
	document.getElementById('change_language_button').style.fontSize='12px';
	document.getElementById('footer_link').style.fontSize='12px';
	document.getElementById('footer_year').style.fontSize='12px';
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

