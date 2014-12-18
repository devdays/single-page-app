(function (global) {
    "use strict";
    define({
        load: function (name, require, load, config) {

            console.log("tmpl load: " + name);

            var deps = [];

            deps.push('text!' + name);
            deps.push('underscore');

            require(deps, function (source, _) {
                console.log("tmpl source " + JSON.stringify(source));
                var template = _.template(source);
                console.log("tmpl loaded " + typeof (load)
                  + " template " + typeof(template) + " : " + JSON.stringify(template));
                load(template);
            });
        }
    });
})(this);
