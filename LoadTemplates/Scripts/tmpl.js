/*
 this demo probably does not make sense, although it does do great to show
    how to build require plugins. Reason being that the app hits the server
    everytime it needs a template, to run tmpl.js which runs amplify, even 
    to retrieve the template.
    It does not solve the issue of storing the templates locally without hitting
    the server. 
    bummer
    */


(function (global) {
    "use strict";
    define(['underscore', 'jquery', 'amplify'], {
        load: function (name, require, onload, config) {
            console.log("tmpl load: " + name);
            var url = name, //req.toUrl(name + '.customFileExtension'),
                text;

           // require(
          //      ['underscore', 'jquery', 'amplify'],
           // function (_, $, amplify) {
                console.log("tmpl require");
                //Use a method to load the text (provide elsewhere)
                //by the plugin
                fetchTemplate(url, function (templateText) {
                    console.log("afterFetchText: " + templateText);
                    //Transform the text as appropriate for
                    //the plugin by using a transform()
                    //method provided elsewhere in the plugin.
                    var tmpl = _.template(templateText);
                    console.log("after transform: " + templateText);
                    //Have RequireJS execute the JavaScript within
                    //the correct environment/context, and trigger the load
                    //call for this resource.
                    onload(tmpl);
                    console.log("onload.fromText complete");
                });
                onload(template);
           // }
           // );
        }
    });

    function fetchTemplate(url, text) {
        console.log("fetchTemplate: " + url);

        // todo put into a promise
        var fileName = url.replace(/^.*(\\|\/|\:)/, '');
        fileName = fileName.match(/(.*)\.[^.]+$/);
        console.log("url: " + url + ", filename: " + fileName);

        amplify.request.define(fileName, "ajax", {
            url: url,
            dataType: "html",
            type: "GET",
            // cache for two minutes during testing
            cache: 120000
        });

        amplify.request({
            resourceId: fileName,
            success: function (source) {
                console.log("success loading template");
                text(source);
            },
            error: function( message, level ) {
                alert("error loading " + filename + ": " + message);
            }
        });
    }

    function fetchErr(name) {
        throw new Error("error loading " + filename);
    }
})(this);