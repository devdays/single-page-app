(function (global) {
    "use strict";
    define({
        load: function (name, require, load, config) {

            console.log("tmpl2 load: " + name);

            var deps = [];

            deps.push('text!' + name);
            deps.push('underscore');

            require(deps, function (source, _) {
                console.log("tmpl2 source " + JSON.stringify(source));
                var template = _.template(source);
                console.log("tmpl2 loaded " + typeof (load));
                load(template);
            });
        }
    });
})(this);