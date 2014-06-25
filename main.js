define(function (require, exports, module) {

    var AppInit = brackets.getModule("utils/AppInit"),
        CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

 
    var Themes = require("themes");

    AppInit.appReady(function () {

        var promise = ExtensionUtils.loadStyleSheet(module, "notepadplus.css");

        promise.then(function () {
            EditorManager.resizeEditor();
        });

        if (CodeMirror.defaults.theme && CodeMirror.defaults.theme !== "default") {
            return null;
        }

        return promise.then(Themes.init);
    });
 
});
