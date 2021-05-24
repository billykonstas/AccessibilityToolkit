window.onload = function ()
{
	window.accessibilityTool = new accessibilityTool();
}

function accessibilityTool ()
{
	this.createToolbar();
	this.initializeToolbox();

	this.toolBox = document.getElementById('toolbox');

	//Open and Close Buttons
	var openButton = document.getElementById('toolbarOpenButton');
	var closeButton = document.getElementById('close_button');

	openButton.addEventListener("click", this.openBox.bind(this));
	closeButton.addEventListener("click", this.closeBox.bind(this));

	document.addEventListener('keyup', this.toolboxVisibility.bind(this));

	//contrast_colors_block Buttons
	var greyscaleButton = document.getElementById('toolbox_contrast_greyscale');
	var brightButton = document.getElementById('toolbox_contrast_bright');
	var reverseButton = document.getElementById('toolbox_contrast_reverse');

	greyscaleButton.addEventListener('click', this.changeContrast);
	brightButton.addEventListener('click', this.changeContrast);
	reverseButton.addEventListener('click', this.changeContrast);

	//highlight_content_block Buttons
	var highLinks = document.getElementById('toolbox_highlight_links');
	var highHeaders = document.getElementById('toolbox_highlight_headers');
	var imageTitles = document.getElementById('toolbox_highlight_image_titles');

	highLinks.addEventListener('click', this.highlightContent);
	highHeaders.addEventListener('click', this.highlightContent);
	imageTitles.addEventListener('click', this.showTitles);

	//font_size_block Buttons
	var maxFont = document.getElementById('toolbox_max_font');
	var minFont = document.getElementById('toolbox_min_font');
	var changeFont = document.getElementById('toolbox_change_font');

	maxFont.addEventListener('click', this.changeFontSize);
	minFont.addEventListener('click', this.changeFontSize);
	changeFont.addEventListener('click', this.changeFont);

	//cursor_and_zoom_block buttons

	var whiteCursor = document.getElementById('toolbox_big_cursor_white');
	var blackCursor = document.getElementById('toolbox_big_cursor_black');
	var zoom = document.getElementById('toolbox_zoom_in');

	whiteCursor.addEventListener('click', this.changeCursor);
	blackCursor.addEventListener('click', this.changeCursor);
	zoom.addEventListener('click', this.zoomScreen);

	//reset Button
	var reset = document.getElementById('toolbox_reset');

	reset.addEventListener('click',this.resetAll.bind(this));

}

//Initialization

accessibilityTool.prototype.initializeToolbox = function (event)
{
	window.toolboxState = JSON.parse(localStorage.getItem('toolboxState')) || {
		classList: {},
		fontSize: 1,
		imagesTitle: false,
		initFontSize: 1,
		openState: false
	};

	//Add checkmarks to all the selected buttons
	if (window.toolboxState.classList) {
		for (var bodyClass in window.toolboxState.classList) {
			var initBodyClassList = window.toolboxState.classList[bodyClass];

			var enabledButton = document.getElementById(initBodyClassList);
			if (enabledButton) {
				enabledButton.classList.add('enabled');
			}
			document.body.classList.add(initBodyClassList);
		}
	}

	//If the button for the images titles was selected, generate the titles at the startup
	if(window.toolboxState.imagesTitle == true)
	{
		generateImageTitles();
	}

	//If there was a change at the fontSize previously, apply this change at the startup
	if(window.toolboxState.fontSize !== 1)
	{
		setFontSize(window.toolboxState.fontSize);
		accessibilityTool.prototype.initializeFonts();

	}

	if(window.toolboxState.openState == true)
	{
		accessibilityTool.prototype.openBox();
	}
	else
	{
		accessibilityTool.prototype.closeBox();
	}
}

//Toolbox creation
accessibilityTool.prototype.createToolbar = function ()
{
	//var html = document.createElement('html');
	html = "<meta charset='utf-8'><link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp' rel='stylesheet'><button title='Άνοιγμα Παραθύρου' id='toolbarOpenButton' class='starting_button'><div><span class=\"material-icons\" style=\"color: white\">accessible</span></div></button><div id='toolbox' class='toolbox'><div class='toolbox_header'><span class='header_text'>Μενού Προσβασιμότητας</span><button title='Κλείσιμο Παραθύρου' id='close_button'><span class='material-icons' style='color: white'>close</span></button></div><div class='buttons_with_header_block' id='contrast_colors_block'><span class='button_block_header'>Αντίθεση Χρωμάτων</span><button class='control_button' title='Αποκορεσμός' id='toolbox_contrast_greyscale'><span class='material-icons'>brightness_medium</span><div class='checkMark'><span class='material-icons'>check_circle</span></div><span class='button_text'>Αποκορεσμός</span></button><button class='control_button' title='Ανοιχτή Αντίθεση' id='toolbox_contrast_bright'><span class='material-icons'>brightness_low</span><div class='checkMark'><span class='material-icons'>check_circle</span></div><span class='button_text'>Ανοιχτή<br>Αντίθεση</span></button><button class='control_button' title='Αντιστροφή Χρωμάτων' id=\"toolbox_contrast_reverse\"><span class='material-icons'>brightness_7</span><div class='checkMark'><span class='material-icons'>check_circle</span></div><span class='button_text'>Αντιστροφή<br>Χρωμάτων</span></button></div><div class='buttons_with_header_block' id='font_size_block'><div class='button_block_headerAND_fontSize'><span id='right_of_font_size_header'></span><span class='button_block_header' id='font_size_header'>Μέγεθος Κειμένου</span><span id='font_size'></span></div><button class='control_button' title=\"\" id='toolbox_max_font'><span class='material-icons'>format_size</span><span class='button_text'>Μεγιστοποίηση<br>Κειμένου</span></button><button class='control_button' title=\"\" id='toolbox_min_font'><span class='material-icons'>text_fields</span><span class='button_text'>Σμίκρυση<br>Κειμένου</span></button><button class='control_button' title=\"\" id='toolbox_change_font'><span class='material-icons'>format_shapes</span><div class='checkMark'><span class='material-icons'>check_circle</span></div><span class='button_text'>Αλλαγή<br>Γραματοσειράς</span></button></div><div class='buttons_with_header_block' id='highlight_content_block'><span class='button_block_header'>Επισήμανση Περιεχομένου</span><button class='control_button' title='highlight_button_links' id='toolbox_highlight_links'><span class='material-icons'>link</span><div class='checkMark'><span class='material-icons'>check_circle</span></div><span class='button_text'>Επισήμανση<br>Συνδέσμων</span></button><button class='control_button' title='highlight_button_headers' id='toolbox_highlight_headers'><span class='material-icons'>title</span><div class='checkMark'><span class='material-icons'>check_circle</span></div><span class='button_text'>Επισήμανση<br>Τίτλων</span></button><button class='control_button' title='highlight_button_images' id='toolbox_highlight_image_titles'><span class='material-icons'>insert_photo</span><div class='checkMark'><span class='material-icons'>check_circle</span></div><span class='button_text'>Εμφάνιση Τίτλων<br>Εικόνων</span></button></div><div class='buttons_with_header_block' id='cursor_and_zoom_block'><span class='button_block_header'>Μεγένθυση</span><button class='control_button' id='toolbox_big_cursor_white'><span class='material-icons-outlined'>mouse</span><div class='checkMark'><span class='material-icons'>check_circle</span></div><span class='button_text'>Λευκός<br>Κέρσορας</span></button><button class='control_button' id='toolbox_big_cursor_black'><span class='material-icons'>mouse</span><div class='checkMark'><span class='material-icons'>check_circle</span></div><span class='button_text'>Μαύρος<br>Κέρσορας</span></button><button class='control_button' id='toolbox_zoom_in'><span class='material-icons'>zoom_in</span><div class='checkMark'><span class='material-icons'>check_circle</span></div><span class='button_text'>Μεγένθυση<br>Οθόνης</span></button></div><div class='reset_button_block'><button class='reset_button' id='toolbox_reset'><span class='button_text'>Αφαίρεση Επιλογών</span><span class='material-icons' style='font-size: 30px'>delete_sweep</span></button></div></div>";
	var styleTag = document.createElement('style');
	styleTag.textContent = "/*The round button at the beginning*/.starting_button{position: fixed !important;z-index: 1 !important;display: block !important;left: 10px;background-color: #310357;cursor: pointer;border: solid 4px #7e44ad;border-radius: 100%;padding: 10px;//box-shadow: 4px 4px 4px #888888;}.starting_button:focus, .starting_button:hover{border-color: #310357;background-color: #7e44ad;}/*The toolbox menu opened*/.toolbox{color: black;box-shadow: 1px 0 4px 0 #777;overflow-y: auto;position: fixed;height: 100%;width: 300px;top: 0;left: 0;border-radius: 0px 50px 50px 0px;background-color: white;z-index: 1;visibility: visible; /*put hidden later*/opacity: 1;transition: opacity .4s;}.toolbox_header{position: relative;background-color: yellow;color: white;width: 100%;height: 50px;text-align: center;display:table;border-radius: 0px 50px 0px 0px;box-shadow:20px 20px 50px 10px pink inset;border: 2px solid white;box-sizing: border-box;}.header_text{font-size: 18px;display:table-cell; vertical-align:middle; padding-right: 30px;}#close_button{background-color: Transparent;position: fixed;cursor: pointer;height: 50px;width: 50px;right: 5px;outline:none;border: none;position: absolute;}.button_block_headerAND_fontSize{display: block;max-height: 35px;}.button_block_headerAND_fontSize span{display: inline-block;text-align: center;position: relative;vertical-align: middle;}#right_of_font_size_header{font-size: 20px;text-align: left;width: 75px;}#font_size{color: #00e800;//position: absolute;//left: 240px;//top: 193px;height: 23px;width: 73px;font-size: 18px;margin-bottom: 10px;}.toolbox_header img{margin-right: 5px;}.buttons_with_header_block{position: relative;display: block;text-align: center;box-sizing: border-box;height: 125px;margin-top: 8px;}.button_block_header{font-size: 20px;display: block;margin-bottom: 10px;text-align: center;color: black;}.control_button{position: relative;background-color: white;cursor: pointer;display: inline-block;font-size: 12px;height: 95px;width: 32%;text-align: center;margin-bottom: 20px;vertical-align: middle;border: 2px solid black;border-radius: 10px;}/*CSS for the check mark*/.checkMark{color: dodgerblue;position: absolute;top: 2px;left: 2px;z-index: 0;visibility: hidden;}/*When a button is pressed, change the button color and make the border dashed*/.enabled{background-color: yellow;box-shadow:20px 20px 50px 10px pink inset;border: dashed 2px black;}/*When the button is pressed make the check mark appear*/.enabled .checkMark{visibility: visible;}/*To use the material icons package*/.material-icons,.button_text{display: block;width: 100%;}.material-icons-outlined{font-family: 'Material Icons Outlined'; display: block;width: 100%;}.control_button:hover,.reset_button:hover{background-color: yellow;box-shadow:20px 20px 50px 10px pink inset;}.reset_button_block{height: 95px;margin-top: 40px; box-sizing: border-box;text-align: center;}.reset_button{background-color: white;cursor: pointer;font-size: 16px;height: 95px;width: 200px;margin-bottom: 20px;vertical-align: middle;border: 2px solid black;border-radius: 10px;}/*Apply filters*//*Greyscale to everything expect the toolbox*/body.toolbox_contrast_greyscale > :not(#toolbox){filter: grayscale(1);}body.toolbox_contrast_bright{color: black;background: transparent;}body.toolbox_contrast_reverse :not(div):not(.toolbox):not(span):not(button){background-color: #000;color: #fff;filter: invert(100%);}body.toolbox_highlight_links :any-link{background-color: yellow;text-decoration: underline;}body.toolbox_highlight_headers h1,body.toolbox_highlight_headers h2,body.toolbox_highlight_headers h3,body.toolbox_highlight_headers h4,body.toolbox_highlight_headers h5,body.toolbox_highlight_headers h6{background-color: yellow;text-decoration: underline;}span.toolbox_image_titles{display: block;font-size: 20px;max-width: 180px;line-height: 1;margin: 0 auto;font-weight: normal;text-align: center;background: yellow;color: black;padding: 10px;border: solid 2px black;}body.toolbox_change_font :not(div):not(.toolbox):not(span):not(button){font-family: Arial, Helvetica, sans-serif;}body.toolbox_big_cursor_white{cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAzCAYAAAAZ+mH/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDA1OTE2NURCQzkyMTFFN0IwODJCQjE5QzZFMDg2QjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDA1OTE2NUVCQzkyMTFFN0IwODJCQjE5QzZFMDg2QjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMDU5MTY1QkJDOTIxMUU3QjA4MkJCMTlDNkUwODZCNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMDU5MTY1Q0JDOTIxMUU3QjA4MkJCMTlDNkUwODZCNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Phwph8YAAAWrSURBVHjavFldSGxVFF7zq+N4/RtTuY1SU2SWoqUW/iAZhL1UFD4kVBD02Jv45os/+Psi+CCU9hRYkGVF1kOUmEYZpmGJEpqJ4Ev5e/XqzDi7tU5rz92zx7nqzBwXfBxn73P2/va311pnnS0AwDuI3xG34H9zIGwMC8NUsyIOEU8iphAexDnCzn2mE5AkrPx3PRPJZiJSEavZiqgkyJ5BfInIQQSZiOmKXDRBDSuSc1OKxFplJWISkasQMU2RiIF9Ph+kpqbKn88ivmAiIYTTLEVUfzAIeL1ecLlcsulpxKdmKxIxYFpaGrS0tEBOTg44nU7VWT83W5G3EIJQWVkpyAYGBkRBQYFAZYTsQ/yM8JJgxDfZqoRJVFRUiGAwaBDp6uoS+fn5AhVRiSwoRNxK5CSsSAQJv98vpPX19Ym8vLwbUSQmiZtU5L4kVEVSUlJMU+RSElKR3Nxc4XA4TFHkSiTIent7hcfjMUWRK5OQihCRZCtyLRJmKXJtElIRzKxJUyQuElKR7OxsPXzjUiRuEmSdnZ0GkUQVSYhEshRJmIRUJCsrK25FkkKCrKenR2RmZsalSNJIkHV0dIiMjAxht9uvpUhSScSrSNJJXKLIgxoRm2kkyPr7+w0imiI/MZEUScSeSCESCoXg9PQULJboqKO21tZW2Nvbg7GxMeOKVZtaxb+E+DdhEoeHh1BbWwv7+/sxidhsNkB14fz8XO2SVfxrRORKJI6OjoyJsPgFzAPhdrfbbUyws7MTzxqkIq9YL7uzu7sbsAqHkpISWFpaitqOsrIyQOeLV0z60hu779PoWDA8PAy7u7uGnFjmwcTERLgfX+XQ1tYGk5OThvToi9T8B+JDzgdB/lYJ8ceT/DvIvwOI7SgSVqs1rAARoG1gh4KFhQWYnZ2F+vr6yOWgUouLi5IE2TziH46GAE94rhChq5/7QhHbQU5EGBwchKGhITg4ODD2XNrW1haMj49HECDHbGxsNJ5jowOXF3i1enq2cJuNv+RSOVfcyxNVVVWivb39ooI2jObmZrG9vR2RD3C7RGFhoXrfPqIC8RjiIcRtRB5/Snr42IGQhUgnRuWIV4kNJhaYn583YlpVAO2uZLyysgINDQ1QXFwcDkvyDdqy6elpw1k5EZ0hvmf5z1j6gOIPQcVn7ilB3xZadiN8gHhZ/qb+8vLyqOw4MzNj9KNPyee+46On23x1MzknL8jBZ2P2CCWOj4/VpLKMGER8hjhA0HlBOfXTyskJa2pqIhLTxsYGrK6uhtMI4hfEX+wLAc05Q3JhsfIEhdm7iK/5YUqvi6qD0oSqFRUVQVNTE2AVLpvIB15n59MdVFcb3tQafuVzK/LyUkQx4mHEUwhapsBVi9LSUrG8vBy1LT6fz+hXxitmQrd4O2x6QaMr8RvibY5xku2YQV76J+ITkpG2Ym1tDaampiAQCIQfPjk5gerqasPB2fycngXvvy1WjfmGUnQ8TsoiHuVrgRJSHn4F79L9FMK0at0wmYn09HRVjTlW4gEKR3bMiO0hZnWIR/jVesRee8bwK2FFA95hvEihSMdKlC3JH1TfoCw7Nzcnmyg61tmnbJpTGkYSzSC+ReyxR9/lmwJKLAO3+fk+2irb+vo6jI6OQl1dHZydncHIyAhsbm4a+UJNxIhMmWeUA1yhErGyRJmcwTJYNpd22O5kkuTtP8icQNkV07yRbb1e74VZlsk/weO7lS0Jm1Op+dJ48hStELWyai5Gs5zA5XIZH8daRKggZd/jbfFofhEhl13LYvq/GiyKYum8oh9jTCoU//kK8TyHuJffHVFK2Hmv9bAR2hUUvwjxvyfe53yiP0eVz0cc5tM8oUV5Xwh9XHuMyWKZ4MFoFX8zGZkUyME/5lrijqx7tEiTL6+I+a57yCVrAQcP+BznFLJvlC1Vixa/gqDy/ggr8p8AAwB38ep+f+/fmwAAAABJRU5ErkJggg=='), auto ;}body.toolbox_big_cursor_white button,body.toolbox_big_cursor_white #close_button,body.toolbox_big_cursor_white :any-link{cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAtCAYAAAAz8ULgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkE0QzFBMjdCQzkyMTFFNzg4RDE5NkYzNkM0MDkwNzAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkE0QzFBMjhCQzkyMTFFNzg4RDE5NkYzNkM0MDkwNzAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGQTRDMUEyNUJDOTIxMUU3ODhEMTk2RjM2QzQwOTA3MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGQTRDMUEyNkJDOTIxMUU3ODhEMTk2RjM2QzQwOTA3MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnfOpO8AAAhdSURBVHjaxFlpTBVX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'), auto;}body.toolbox_big_cursor_black{cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAzCAYAAAAZ+mH/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODM1RTg1NDJCQzhFMTFFNzhFNDdGMzY5NjY0M0JBMTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODM1RTg1NDNCQzhFMTFFNzhFNDdGMzY5NjY0M0JBMTQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MzVFODU0MEJDOEUxMUU3OEU0N0YzNjk2NjQzQkExNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MzVFODU0MUJDOEUxMUU3OEU0N0YzNjk2NjQzQkExNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PisYaokAAAcASURBVHjavFhrTFRH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'), auto;}body.toolbox_big_cursor_black button,body.toolbox_big_cursor_black #close_button,body.toolbox_big_cursor_black :any-link{cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA1CAYAAAADOrgJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUIxMTcwRTBCQTVCMTFFNzlFMTNDNDI4RjQ5NjYzNDAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUIxMTcwRTFCQTVCMTFFNzlFMTNDNDI4RjQ5NjYzNDAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QjExNzBERUJBNUIxMUU3OUUxM0M0MjhGNDk2NjM0MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QjExNzBERkJBNUIxMUU3OUUxM0M0MjhGNDk2NjM0MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsArU6kAAAuPSURBVHjazFoJcE1L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'), auto;}body.toolbox_zoom_in :not(div):not(.toolbox):not(button):not(span){zoom: 1.4;-moz-transform: scale(1.4) ;-moz-transform-origin: 40% 0;}@media only screen and (max-width: 300px){.toolbox{width: 100%;}}";
	document.head.appendChild(styleTag);

	var toolbar = document.createElement('div');
	toolbar.id = 'toolbar_init';
	toolbar.innerHTML = html;

	document.body.insertBefore(toolbar, document.body.firstChild);
}

accessibilityTool.prototype.toolboxVisibility = function ()
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
	document.getElementById("toolbox").style.visibility='visible';
	window.toolboxState.openState=true;
	updateState();

	//Make the check marks appear when the window is open
	var checkMarks = document.querySelectorAll('.enabled .checkMark');
	for (var j = 0; j < checkMarks.length; j++)
	{
		checkMarks[j].style.removeProperty('visibility');
	}

}

accessibilityTool.prototype.closeBox = function (event)
{
	//Makes the toolbox hidden when the close button is pressed
	document.getElementById("toolbox").style.visibility='hidden';
	window.toolboxState.openState=false;
	updateState();

	//Also makes all the checkMarks hidden
	var checkMarks = document.querySelectorAll('.enabled .checkMark');
	for (var j = 0; j < checkMarks.length; j++)
	{
		checkMarks[j].style.visibility='hidden';
	}
}

function updateState () {
	var jsonSting = JSON.stringify(window.toolboxState);
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem('toolboxState', jsonSting);
	} else {
		console.log('No Storage Found');
	}
}

//Buttons functionality
//Applying contrast

accessibilityTool.prototype.changeContrast = function (event)
{

	//var checkMarkDIV = document.getElementById(this.id).getElementsByClassName('checkMark')[0];

	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolboxState.classList[this.id];
	}
	else{

		//When a contrast button is pressed the other contrast buttons are removed from the classList
		//checkMarkDIV.style.visibility = 'visible';

		var contrastButtons = document.querySelectorAll('#contrast_colors_block button');
		for (var i = 0; i < contrastButtons.length; i++) {
			contrastButtons[i].classList.remove('enabled');
			document.body.classList.remove(contrastButtons[i].id);

			delete window.toolboxState.classList[contrastButtons[i].id];
		}
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolboxState.classList[this.id] = this.id;
	}
	updateState();
}


//Highlighting content

accessibilityTool.prototype.highlightContent = function (event)
{
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolboxState.classList[this.id];
	}
	else{
		//When a contrast button is pressed the other highlight buttons are removed from the classList

		var highButtons = [document.getElementById('toolbox_highlight_links'),document.getElementById('toolbox_highlight_headers')];
		for (var i = 0; i < highButtons.length; i++) {
			highButtons[i].classList.remove('enabled');
			document.body.classList.remove(highButtons[i].id);

			delete window.toolboxState.classList[highButtons[i].id];
		}
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolboxState.classList[this.id] = this.id;
	}
	updateState();
}


accessibilityTool.prototype.showTitles = function (event)
{
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolboxState.classList[this.id];

		var imageTitleSpans = document.querySelectorAll('span.toolbox_image_titles');
		for (i=0; i < imageTitleSpans.length; i++)
		{
			imageTitleSpans[i].remove();
		}
		window.toolboxState.imagesTitle = false;
	}
	else{
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolboxState.classList[this.id] = this.id;
		generateImageTitles();
		window.toolboxState.imagesTitle = true;
	}
	updateState();
}

function generateImageTitles()
{
	var images = document.images;
	for (var i = 0; i < images.length; i++) {
		var img = images[i];
		if (img.alt) {
			var title = document.createElement('span');
			title.className = 'toolbox_image_titles';
			title.textContent = img.alt;
			img.parentNode.insertBefore(title, img);
		}
		else {
			var title = document.createElement('span');
			title.className = 'toolbox_image_titles';
			title.textContent = 'image without text';
			img.parentNode.insertBefore(title, img);
		}
	}
}

//Changes fonts

accessibilityTool.prototype.initializeFonts = function ()
{
	var items = document.querySelectorAll('body,h1,h2,h3,h4,h5,h6,p,a,button:not(.control_button,.reset_button),input,textarea,li,td,th,strong,span:not(.material-icons,.material-icons-outlined,.button_text,.button_block_header,.header_text),blockquote,div:not(#toolbar_init)');
	var initFontSize = window.toolboxState.fontSize;
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
}

accessibilityTool.prototype.changeFont = function (event) {
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolboxState.classList[this.id];
	} else {
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolboxState.classList[this.id] = this.id;
	}
}

accessibilityTool.prototype.changeFontSize = function (event)
{

	var counter = window.toolboxState.fontSize;
	if (this.id === 'toolbox_max_font') {
		if (counter < 1.61) //Checks the value of the fontSize so text doesn't become too big
		{
			var items = document.querySelectorAll('body,h1,h2,h3,h4,h5,h6,p,a,button:not(.control_button,.reset_button),input,textarea,li,td,th,strong,span:not(.material-icons,.material-icons-outlined,.button_text,.button_block_header,.header_text),blockquote,div:not(#toolbar_init)');
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var font = window.getComputedStyle(item).getPropertyValue('font-size').split('px');
				var fontSize = Number(font[0]);
				item.style.fontSize = (fontSize * 1.1).toFixed() + 'px';
			}
			counter = (counter * 1.1).toFixed(2);
		}
	}
	if (this.id === 'toolbox_min_font') {
		if (counter > 1) //Checks the value of the fontSize so text doesn't become too small
		{
			var items = document.querySelectorAll('body,h1,h2,h3,h4,h5,h6,p,a,button:not(.control_button,.reset_button),input,textarea,li,td,th,strong,span:not(.material-icons,.material-icons-outlined,.button_text,.button_block_header,.header_text),blockquote,div:not(#toolbar_init)');
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var font = window.getComputedStyle(item).getPropertyValue('font-size').split('px');
				var fontSize = Number(font[0]);
				item.style.fontSize = (fontSize / 1.1).toFixed() + 'px';
			}
			counter = (counter / 1.1).toFixed(2);
		}

	}

	window.toolboxState.fontSize = counter;
	setFontSize(counter);
	updateState();
}

function setFontSize(fontSize)
{
	if (fontSize > 1) {
		//document.getElementById('mic-toolbox-fonts-up').classList.add('vi-font-enabled');
		var initPerc = (Number(fontSize) * 100 - 100).toFixed();
		var perc = '+' + initPerc + '%';
		document.getElementById('font_size').innerText=perc;
		//A bug at the query selections also selects font_size and changes it size
		document.getElementById('font_size').style.fontSize='18px';
	}
	else {
		//document.getElementById('mic-toolbox-fonts-up').classList.remove('vi-font-enabled');
		document.getElementById('font_size').innerText='';
	}
}

//Change cursors
accessibilityTool.prototype.changeCursor = function (event)
{
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolboxState.classList[this.id];
	}
	else {
		var highButtons = [document.getElementById('toolbox_big_cursor_white'),document.getElementById('toolbox_big_cursor_black')];
		for (var i = 0; i < highButtons.length; i++) {
			highButtons[i].classList.remove('enabled');
			document.body.classList.remove(highButtons[i].id);

			delete window.toolboxState.classList[highButtons[i].id];
		}
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolboxState.classList[this.id] = this.id;
	}
	updateState();
}
//Zoom

accessibilityTool.prototype.zoomScreen = function (event)
{
	if (document.body.classList.contains(this.id)) {
		this.classList.remove('enabled');
		document.body.classList.remove(this.id);
		delete window.toolboxState.classList[this.id];
	}
	else {
		this.classList.add('enabled');
		document.body.classList.add(this.id);
		window.toolboxState.classList[this.id] = this.id;
	}
	updateState();

}

//Resetting

accessibilityTool.prototype.resetAll = function (event)
{
	localStorage.removeItem('toolboxState');
	window.location.reload();
}
