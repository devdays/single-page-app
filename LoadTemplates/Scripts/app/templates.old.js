//
define(function (require) {
    // using simplified CommonJS syntax so it is clear what vars I can use in this function
    // and not to confuse the order of them
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var amplify = require('amplify');

    console.log("template.js");

    app.templates = function (names) {
        var templateNames = names;
        var templateArray;

        // retrieves a promise 
        // the promise returns the raw template retrieved using the require text plugin
        // which uses a XMLHttpRequest
        // called from retrieveTemplate
        function loadTemplateFromServer(templateName, Q) {
            var deferral = Q.defer();

            var requirement = 'text!../Templates/' + templateName + ".html";
            require([requirement],
                function (rawTemplate) {
                    console.log("loadTemplateFromServer: " + rawTemplate);
                    deferral.resolve(rawTemplate);
                },
                function (error) {
                    console.log("error loadTemplateFromServer for " + templateName + ": " + error);
                    deferral.reject(new Error(error));
                });

            return deferral.promise;
        }

        /*
         * retrieves a single template from the amplify cache or if it cannot
         * find the value there, then pulls it from the server using loadTemplateFromServer()
         * returns a promise
         * the then() function will include the raw template text.
         */
        function retrieveTemplate(templateName, Q) {
            var deferral = Q.defer();
            var resultTemplate = {};


            console.log("incoming templateName: " + templateName);
            var rawTemplateText = amplify.store(templateName);
            console.log("initial rawTemplateText: " + rawTemplateText);

            // if the template has not been saved previously
            if (rawTemplateText === undefined) {

                // loadTemplate returns a promise with the rawTemplate
                // as the parameter of the then function
                loadTemplateFromServer(templateName, Q)
                    .then(function (rawTemplate) {
                        amplify.store(templateName, rawTemplate);
                        // continue even if there is an error saving in local storage
                        resultTemplate = {
                            tmplName: templateName,
                            template: rawTemplate
                        }
                        console.log('resultTemplate from server: ' + JSON.stringify(resultTemplate));
                        deferral.resolve(resultTemplate);
                    })
                    .catch(function (error) {
                        console.log("catch loadTemplateFromServer error loading " + templateName);
                        // remove item from the store
                        amplify.store(templateName, null);
                        resultTemplate.tmplName = templateName;
                        console.log('resultTemplate from error: ' + JSON.stringify(resultTemplate));
                        deferral.reject(resultTemplate);
                    });
            } else {
                resultTemplate = {
                    tmplName: templateName,
                    template: rawTemplateText
                }
                console.log('resultTemplate from cache: ' + JSON.stringify(resultTemplate));
                deferral.resolve(resultTemplate);
            }

            return deferral.promise;
        }

        /* retrieveTemplates
         * retrieves the templates and returns LoDash compiled templates in
         * an array of 
         * { tmplName: templateName, template: compiledTemplate }
         * the template is retrieved from localStorage or sessionStorage. if available
         * as determined by amplify. If not, it will retrieve the template from the
         * server using require's text plugin.
         * the templateNames are by convention in the ../Template folder 
         * relative to require's path and do not need the .html extension.
         * example usage for the "productsTmpl" template is in the file /Templates/productsTmpl.html:
         *
         * the function uses Q.allSelected so that all available templates are returned.
         *
         * sample return value in the then() method:
             [
             {
               "state":"fulfilled",
               "value":
               {
                 "tmplName":"productsTmpl",
                 "template":"<ul>\r\n    <% _.forEach(products, function(product) { %>\r\n    <li>\r\n        <strong><%- product.name %></strong>\r\n        <span>( Cateogry: <span class=\"value\"><%- product.category %></span> )</span>\r\n    </li>\r\n    <% }); %>\r\n</ul>"
               }
             },
             {
               "state":"rejected",
               "reason":{"tmplName":"errorTmpl"}
             
             }
             ] 
         */
        retrieveTemplates = function () {
            var deferral = Q.defer();
            console.log("retrieveTemplates templateNames: " + JSON.stringify(templateNames));

            // use amplify to for local storage of each template
            require(['amplify', 'underscore', 'q'], function (amplify, _, Q) {
                console.log("require lodash" + _.VERSION);
                var templateFunctions = [];

                //for each template name
                _.forEach(templateNames, function (templateName) {
                    var templateFunction = retrieveTemplate(templateName, Q);
                    templateFunctions.push(templateFunction);
                }); // _.foreach

                Q.allSettled(templateFunctions).then(function (resultTemplates) {

                    console.log("ALL !!! resultTemplates: " + JSON.stringify(resultTemplates));
                    deferral.resolve(resultTemplates);
                });
            });

            return deferral.promise;
        }

        /* old
         * getCompiledTemplate takes the templateArray retrieved from retrieveTemplates
         *
        getCompiledTemplate = function(templateArray, templateName, returnedCompiledTemplate)
        {
            // get the template
            var flattenedTemplates = _.flatten(templateArray, 'value');
            console.log("flattenedTemplates: " + JSON.stringify(flattenedTemplates));
    
            var flattenedWithoutNulls = _.compact(flattenedTemplates);
            console.log("flattenedWithoutNulls: " + JSON.stringify(flattenedWithoutNulls));
    
            var rawTemplateItem = _.find(flattenedWithoutNulls, { "tmplName": templateName });
            console.log("rawTemplateItem : " + JSON.stringify(rawTemplateItem));
            if (rawTemplateItem != undefined) {
                var compiledTemplate = _.template(rawTemplateItem.template);
                console.log("ready to call returnedCompiledTemplate")
                returnedCompiledTemplate(compiledTemplate);
            } else {
                returnedCompiledTemplate(undefined);
            }
        }
        */

        /* 
        * calls retrieveTemplates to get the actual templates.
    
        * use the following data in templateArray to test
                var myTemplates = [{ "state": "fulfilled", "value": { "tmplName": "productsTmpl", "template": "<ul>\r\n    <% _.forEach(products, function(product) { %>\r\n    <li>\r\n        <strong><%- product.name %></strong>\r\n        <span>( Cateogry: <span class=\"value\"><%- product.category %></span> )</span>\r\n    </li>\r\n    <% }); %>\r\n</ul>" } }, { "state": "rejected", "reason": { "tmplName": "errorTmpl" } }, { "state": "fulfilled", "value": { "tmplName": "productTmpl", "template": "<strong><%- product.name %></strong>\r\n<span>( Cateogry: <span class=\"value\"><%- product.category %></span> )</span>" } }];
        * takes a templateName, the exact one you want to use, and a function 
        */

        getCompiledTemplate = function (templateName, returnedCompiledTemplate) {
            // todo figure out how to cache the templates into a dictionary
            getAllRawTemplates().then(function (flattenedWithoutNulls) {
                // get the template

                console.log("find rawTemplateItem : " + JSON.stringify(rawTemplateItem));
                var rawTemplateItem = _.find(flattenedWithoutNulls, { "tmplName": templateName });
                console.log("rawTemplateItem : " + JSON.stringify(rawTemplateItem));

                if (rawTemplateItem != undefined) {
                    var compiledTemplate = _.template(rawTemplateItem.template);
                    console.log("ready to call returnedCompiledTemplate")
                    returnedCompiledTemplate(compiledTemplate);
                } else {
                    returnedCompiledTemplate(undefined);
                }

            });
        }

        getAllRawTemplates = function () {
            var deferred = Q.defer()

            retrieveTemplates().then(function (templateArray) {
                var flattenedTemplates = _.flatten(templateArray, 'value');
                console.log("flattenedTemplates: " + JSON.stringify(flattenedTemplates));

                var flattenedWithoutNulls = _.compact(flattenedTemplates);
                console.log("flattenedWithoutNulls: " + JSON.stringify(flattenedWithoutNulls));
                deferred.resolve(flattenedWithoutNulls);
            }).error(function (err) {
                deferred.reject(new Error(err));
            })

            return deferred.promise;
        };

        getTemplateNames = function () {
            console.log("getTemplateNames: " + JSON.stringify(templateNames));
            return templateNames;
        };

        return {
            templateNames: getTemplateNames,
            /* getAllRawTemplates returns a promise whose then() method
             * returns successful templates with the template text before compiled
                        [
                            {
                                "tmplName":"productsTmpl",
                                "template":"whatever"
                            },
                            {
                                "tmplName":"productTmpl",
                                "template":"whatever"
                            },
    
                        ] 
           */
            getAllRawTemplates: getAllRawTemplates,
            /*
            * takes two parameters. The name of the template you want, such as "productsTmpl"
            * and the function of what you want to do with the template. The template is returned in the
            * function first parameter.
            */
            getCompiledTemplate: getCompiledTemplate
        };
    };
});