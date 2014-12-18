(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'sammy', 'underscore'], factory);
    } else {
        (window.Sammy = window.Sammy || {}).Tmpl = factory(window.jQuery, window.Sammy, window._);
    }
}(function ($, Sammy, _) {


    // `Sammy.LoDash` is a wrapper around the underscore/lodash templating engine.
    // http://lodash.com/docs#template

    Sammy.LoDash = function (app, method_alias) {

        // *Helper:* Uses _.template to parse a template and interpolate 
        // and work with the passed data
        //
        // * `template` A String template that will be compiled by _.template()
        // * `data` An Object containing the replacement values for the template.
        //   data is extended with the <tt>EventContext</tt> allowing you to call 
        //   its methods within the template.

        var template = function (template, data) {
            data = $.extend({}, this, data);

            var results = _.template(template, data);
            return results;
        };

        // set the default method name/extension
        if (!method_alias) { method_alias = 'lodash'; }
        // create the helper at the method alias
        app.helper(method_alias, template);
    };

    return Sammy.LoDash;
}));

