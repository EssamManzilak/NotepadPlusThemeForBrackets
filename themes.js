define(function (require, exports, module) {

    "use strict";

    var THEMES = {
        'default'	: 'Brackets Default',
        'notepadplus'	: 'Notepad ++ theme'
    };

    var SETTINGS_KEY = "brackets-notepadplus";
    var DEFAULT_THEME = "notepadplus";


    var Menus = brackets.getModule("command/Menus"),
        CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        CommandManager = brackets.getModule("command/CommandManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager");

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

        ExtensionUtils.loadStyleSheet(module, name + ".css").then(setTheme);
    }

    function handler(id, name) {

        return function () {
            return applyTheme(id, name);
        };
    }

    function addCommand(menu, name) {
        var id = "essam." + name;
        var title = THEMES[name] || name;
        var command = CommandManager.register(title, id, handler(id, name));

        menu.addMenuItem(id);
        commands.push(id);

        return command;
    }

    function init() {

        var menu = Menus.addMenu("Notepad Plus Theme", "essamthemes", Menus.BEFORE, Menus.AppMenuBar.HELP_MENU),
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
});
