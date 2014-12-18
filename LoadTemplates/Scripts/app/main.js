

// ====== set up require.js ================
(function () {
    "use strict";

    require.config({
        baseUrl: 'Scripts',
        paths: {
            "underscore": "lodash",
            "jquery": "jquery-2.0.3",
            "q": "q",
            "text": "text"
        },
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

    // todo replace with require app/data
//    app.data = [{ name: 'Action Figure', category: 'Toy' },
//{ name: 'Bicycle', category: 'Transportation' }];

    // for testing in this case, you may want to clear local storage
    localStorage.clear();
}(this));


require(['app/data', 'q'], function (data, Q) {
    data.loadProducts()
        .then(function (products) {
            app.data = {};
            console.log("products loaded: " + JSON.stringify(products));
            app.data.products = products;
            console.log("app.data: " + JSON.stringify(app.data));
        })
        .catch(function (error) {
        console.log("unable to load products: " + error);
    });
});


/*
require(['app/sample'], function (sample) {
    // initialize here
    var mySample = new sample(3);

    // then call a method
    mySample.log();

    // and call another method
    var seven = mySample.add(4);

    var anotherSample = new sample(7);
    var ten = anotherSample.add(3);
});

require(['app/sampleQ', 'q'], function (sample) {

    // do something with the sample object
    sample.count(10, 20).then(function (countResponse) {
        console.log("count successful" + countResponse);
    });

    // catch an error
    sample.count(20, 10).then(function (countResponse) {
        console.log("count successful" + countResponse);
    }).catch(function (error) {
        console.log("error in sample: " + error);
    });
});
*/

require(['app/templates', 'underscore', 'q', 'jquery'],
    function (templates, _, Q, $) {

    app.templates = templates;

    app.templates.test();

    //show templates loading here

    app.templates.load(['productsTmpl', 'productTmpl', 'errorTmpl'])
        .then(function () {
            // now you can do the stuff after page load
        }). catch(function(error) {
            alert(error);
        });

    showProduct(3, _, $);

    })();

function showProduct(id, _, $) {
    app.templates.getTemplate('productTmpl')
.then(function (template) {

    console.log("template returned to showProduct: " + template);
    if (template !== undefined) {
        console.log("template found");
        var compiledTemplate = _.template(template);
        console.log("app.data.products: " + JSON.stringify(app.data.products));
        var theProduct = _.find(app.data.products, { 'id': id });
        console.log("product " + id + ": " + JSON.stringify(theProduct));
        var output = compiledTemplate({ product: theProduct });
        console.log("output: " + output);
        $('#productDiv').html(output);
    }
})
.catch(function (error) {
    $('#errorDiv').html("Error loading product data" + JSON.stringify(error));
});
}

/*
// ==== get the templates
// use require to get the app/templates.js file (no ".js") that we need to run this code
require(['app/templates'], function () {
    console.log('starting up app.templates');
    app.templates(['productsTmpl', 'productTmpl']);
    //var tNames = JSON.stringify(app.templates.templateNames);
    //console.log("templateNames: " + tNames);
    app.templates.getCompiledTemplate('productTmpl', function (template) {
        console.log("template returned to main.js: " + template);
        if (template != undefined) {
            var theProduct = _.find(productsData, { 'id': 3 });
            var output = template({ product: theProduct });
            console.log("output: " + output);
            $('#productDiv').html(output);
        };
    });

});
*/
