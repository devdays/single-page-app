(function (global) {
    "use strict";
    define({
        load: function (name, require, load, config) {
            console.log("tmpl load: " + name);

            var deps = [];

            deps.push('underscore');
            deps.push('jquery');
            deps.push('amplify');

            require(deps, function () {
                console.log("tmpl ready for amplify: " + name);
                //amplify.request.define("tmpl" + name, "ajax", {
                //    url: name,
                //    dataType: "html",
                //    type: "GET"
                //});

                //amplify.request("tmpl" + name, function (source) {
                //    var template = _.template(source);
                //    return template;
                //});
                return "<div>Hello</div>";
            });
                //console.log("tmpl load: " + name);

                //var deps = [];

                //deps.push('text!' + name);
                //deps.push('underscore');

                //require(deps, function (source, _) {
                //    console.log("tmpl source " + JSON.stringify(source));
                //    var template = _.template(source);
                //    console.log("tmpl loaded " + typeof (load)
                //      + " template " + typeof(template) + " : " + JSON.stringify(template));
                //    load(template);
                //});
        }
    });
})(this);
