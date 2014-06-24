define(function (require, exports, module) {

    var Menus = brackets.getModule("command/Menus"),
		AppInit = brackets.getModule("utils/AppInit"),
        CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
		PreferencesManager = brackets.getModule("preferences/PreferencesManager");

		var THEMES = {
			'default'                       : 'Brackets Default',
			'notepadplus'          		    : 'Notepad ++ theme'
		};	

		var SETTINGS_KEY = "brackets";
		var DEFAULT_THEME = "notepadplus";

		
		var commands = [];

		function getSettings() {
			var theme = PreferencesManager.get(SETTINGS_KEY + '.theme') || DEFAULT_THEME;
			return {
				theme: theme
			};
		}

		function setSettings(settings) {
			var all = settings || {},
				key, value;

			for (key in all) {
				value = all[key];
				key = SETTINGS_KEY + "." + key;
				PreferencesManager.set(key, value);
			}
		}
		function applyTheme(id, name) {

			var editor = $("#editor-holder .CodeMirror"),
				previous = getSettings().theme;

			function setTheme() {

				editor.removeClass("cm-s-default");
				editor.removeClass("cm-s-" + previous);

				editor.addClass("cm-s-" + name);
				editor.addClass('cm-s-dark');

				CodeMirror.defaults.theme = name;

				commands.forEach(function (cid) {
					CommandManager.get(cid).setChecked(false);
				});

				var command = CommandManager.get(id);
				if (command) {
					command.setChecked(true);
				}

				setSettings({
					theme: name
				});
			}

			if (name === "default") {
				return setTheme();
			}

			ExtensionUtils.loadStyleSheet(module, "themes/" + name + ".css").then(setTheme);
		} 
   
		function handler(id, name) {
			return function () {
				return applyTheme(id, name);
			};
		}

		function addCommand(menu, name) {
			var id = "darker." + name;
			var title = THEMES[name] || name;
			var command = CommandManager.register(title, id, handler(id, name));

			menu.addMenuItem(id);
			commands.push(id);

			return command;
		}

		function init() {

			var menu = Menus.addMenu("Darker", "darkerthemes", Menus.BEFORE, Menus.AppMenuBar.HELP_MENU),
				settings = getSettings(),
				name, command;

			for (name in THEMES) {
				if (name.indexOf('-') === 0) {
					menu.addMenuDivider();
					continue;
				}
				command = addCommand(menu, name);
				if (settings.theme === name) {
					command.execute();
				}
			}
		}

		exports.init = init;
			
			
   AppInit.appReady(function () {

        var promise = ExtensionUtils.loadStyleSheet(module, "notepadplus.css");

        promise.then(function () {
            EditorManager.resizeEditor();
        });
 		
        if (CodeMirror.defaults.theme && CodeMirror.defaults.theme !== "default") {
            return null;
        }
 
    });
});
