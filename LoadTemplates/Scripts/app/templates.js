/*
 * templates.js is used as a require(templates)
 * example

 require(['app/templates', 'underscore'], function (templates, _) {

    waitWheelGoesOn(); 
    // initializes and loads the templates
    app.templates = new templates(['productsTmpl', 'productTmpl']);

    // surround loadTemplates at the beginning of the page to cache the templates
    // the load function returns a promise so you can put up the wait wheel.
 
       
    app.templates.load().then(function(templates){
	    waitWheelGoesOff();
    }

    // loads from server or from cache
    app.templates.getTemplate('productTmpl')

 */

define(function (require) {
    "use strict";

    // using simplified CommonJS syntax so it is clear what vars I can use in this function
    // and not to confuse the order of them
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var amplify = require('amplify');

    var validTemplateNames = [];
    var failedTemplateNames = [];
    var errors = [];

    /*
     * retrieves a single template from the amplify cache or if it cannot
     * find the value there, then pulls it from the server using loadTemplateFromServer()
     * returns a promise
     * the then() function will include the raw template text.
     */
    var retrieveTemplate = function (templateName) {
        var deferral = Q.defer();

        console.log("retrieveTemplate incoming templateName: " + templateName);
        var rawTemplate = amplify.store(templateName);
        console.log("initial rawTemplate: " + rawTemplate);

        // in case the template has not been previously loaded
        // or the first time through
        if (rawTemplate === undefined) {
            // loadTemplate returns a promise with the rawTemplate
            // as the parameter of the then function
            var requirement = '../Templates/' + templateName + '.html';

            console.log("ready to loadTemplateFromServer: " + requirement);
            $.get(requirement)
                .done(function (rawTemplate) {
                    console.log("retrieveTemplate '" + templateName + "': " + rawTemplate);
                    amplify.store(templateName, rawTemplate);
                    deferral.resolve(rawTemplate);
                })
                .fail(function (err) {
                    console.log("error retrieveTemplate '" + templateName + "': " + err.status);
                    // remove item from the store
                    amplify.store(templateName, null);
                    deferral.reject("error " + err.status + " loading: " + templateName + ": " + err.statusText);
                });
        } else {
            deferral.resolve(rawTemplate);
        }

        return deferral.promise;
    };

    var loadTemplates = function (templateNames) {
        var deferral = Q.defer();
        // clear the errors list for this new set of loads
        errors = [];
        console.log("loadTemplates: " + JSON.stringify(templateNames));

        var loadTemplateFunctions = [];

        // set up an array of functions to load templates
        _.forEach(templateNames, function (templateName) {
            console.log("ready to retrieveTemplate: " + templateName);
            loadTemplateFunctions.push(retrieveTemplate(templateName));
        });

        Q.allSettled(loadTemplateFunctions)
        .then(function (results) {
            console.log("loading results: " + JSON.stringify(results));
            results.forEach(function (result) {
                if (result.state === "fulfilled") {
                    var value = result.value;
                } else {
                    errors.push(result.reason);
                }
            });
            if (errors.length > 0) {
                deferral.reject(errors);
            } else {
                deferral.resolve();
            }
        });
        return deferral.promise;
    };

    var test = function () {
        console.log("test");
    };

    return {
        getTemplate: retrieveTemplate,
        load: loadTemplates,
        test: test
    };
});
