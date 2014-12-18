// ====== set up require.js ================
(function () {
    "use strict";

    require.config({
        baseUrl: 'Scripts',
        paths: {
            "underscore": "lodash",
            "jquery": "jquery-1.9.1",
            "q": "q",
            "sammy": "sammy-0.7.4"//,
            //"sammy.lodash" : "sammy.lodash"
        },
        priority: ['jquery', 'sammy'],

        //Remember: only use shim config for non-AMD scripts,
        //scripts that do not already call define(). The shim
        //config will not work correctly if used on AMD scripts,
        //in particular, the exports and init config will not
        //be triggered, and the deps config will be confusing
        //for those cases.

        shim: {
            "amplify": {
                //These script dependencies should be loaded before loading
                //jquery.js
                deps: ["jquery"],
                //Once loaded, use the global 'amplify' as the
                //module value.
                exports: "amplify"
            },
            // we get an error that "jQuery is not defined" error without this 
            // shim for sammy
            "sammy": {
                deps: ["jquery"],
                exports: "sammy"
            }
        }
        //enforceDefine : true
        //map: {
        //    '*': { 'underscore': 'lodash' }
        //}
    });

})();

// ====== set up app namespace =============

(function (globals) {
    "use strict";

    console.log('set up app');

    // define the app global to whatever the global context is
    globals.app = {};

    globals.app.data = {};

    // todo replace with require app/data
    //    app.data = [{ name: 'Action Figure', category: 'Toy' },
    //{ name: 'Bicycle', category: 'Transportation' }];

    // for testing in this case, you may want to clear local storage
    //localStorage.clear();
}(this));

// ======== load data using jQuery =========

/*
define('dataObject', ['jquery'], function ($) {
    console.log('loading dataObject');
    var getJSON = function (fileName, result) {
        console.log('loading data: ' + fileName);
        $.getJSON(fileName)
        .done(function (theData) {
            console.log('data : ' + JSON.stringify(theData));
            return result(theData);
        })
        .fail(function(error) {
            throw(new Error("Could not load data from " + fileName + ":" + JSON.stringify(error)));
        });
    };
    return {
        getJSON: getJSON
    };
});
*/

// the plug-in does not return an object, rather it extends jquery.
require(['sammy', 'dataObject', 'underscore'], function (sammy, data, _) {
    "use strict"; 
    // set up a Sammy Application by passing a Function to the $.sammy 
    // (which is a shortcut for the Sammy.Application constructor).
    // note: instead of using $.sammy, use sammy all by itself.
    // app.myApp = $.sammy(function(){
    var sammyApp = sammy(function () {
        this.element_selector = '#content'; // or $element?
        //this.use('LoDash');

        data.getJSON('data/3-products.txt', function (products) {
            console.log("retrieved dataObject: " + JSON.stringify(products)); 
        });

        this.get('#/products', function (context) {
            console.log("#/products render");

            // ##TEST###
            var params = this.params;
            console.log("params: " + JSON.stringify(params));
            var path = this.path;
            console.log("path: " + JSON.stringify(path));

            //context.app.swap('');
            //context.render('templates/4-products.html', app.data);
            //.swap();
        });


        this.get('#/products/:id', function (context) {
            var id = this.params['id'];
            console.log("#/product/" + id);
            this.product = this.products[this.params['id']];
            if (!this.item) { return this.notFound(); }
            //this.partial('templates/4-product.html');
        });

        this.get('#/', function (context) {
            console.log("#/");
        });

        $(function () {
            console.log("sammyApp.run");
            sammyApp.run('#/');
            console.log("sammyApp running");
        });
    });

});