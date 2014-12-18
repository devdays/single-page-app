// ====== set up require.js ================
(function () {
    "use strict";

    require.config({
        baseUrl: 'Scripts',
        paths: {
            "underscore": "lodash",
            "jquery": "jquery-2.0.3",
            "q": "q",
            "sammy" : "sammy-0.7.4"
        },
        priority: ['jQuery','sammy'],

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
            // we get an error that jQuery is not defined without this 
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

    // todo replace with require app/data
    //    app.data = [{ name: 'Action Figure', category: 'Toy' },
    //{ name: 'Bicycle', category: 'Transportation' }];

    // for testing in this case, you may want to clear local storage
    localStorage.clear();
}(this));

define('dataLoaded', ['app/data', 'app/templates', 'q'], function (data, templates, Q) {
    Q.all([
        data.loadProducts(),
        app.templates.load(['productsTmpl', 'productTmpl', 'errorTmpl'])
        ]
        ).then(function (products, templates) {
            app.data = {};
            
            app.data.products = products;
            console.log("data: " + JSON.stringify(app.data));

            app.templates = templates;
            console.log("templates: " + JSON.stringify(app.templates));
        })    
        .catch(function (error) {
            console.log("unable to load : " + error);
        });
});

require(['jquery', 'sammy', 'underscore', 'dataLoaded'],
    function (jquery, sammy, _) {

        // set up a Sammy Application by passing a Function to the $.sammy 
        // (which is a shortcut for the Sammy.Application constructor).
        // note: instead of using $.sammy, use sammy all by itself.
        // app.myApp = $.sammy(function(){
        app.myApp = sammy(function() {
            this.element_selector = '#content';

            var params = this.params;
            console.log("params: " + JSON.stringify(params));
            var path = this.path;
            console.log("path: " + JSON.stringify(path));



            this.get('', function () {
                context.app.swap('');
                context.$element().append('<h5>Home Page</h5>');
            });

            this.get('#!/products', function () {

            });

            this.get('#!/products/:id', function () {
                var id = this.params['id'];
                displayItem('productTmpl', app.data.products, id);
            });

            this.get('#!/categories', function () {

            });
        });

        // implements fadeout fadein
        this.swap = function (content, callback) {
            var context = this;
            context.$element().fadeOut('slow', function () {
                context.$element().html(content);
                context.$element().fadeIn('slow', function () {
                    if (callback) {
                        callback.apply();
                    }
                });
            });
        };

        $(function () {
            app.myApp.run('');
        });

        var displayItem = function (templateName, data, id) {
            console.log("displayItem: ")
            app.templates.getTemplate(templateName)
        .then(function (template) {

            console.log("template:" + template);
            if (template !== undefined) {
                console.log("template found");
                var compiledTemplate = _.template(template);
                console.log("app.data.products: " + JSON.stringify(data));
                var theItem = _.find(data, { 'id': id });
                console.log("product " + id + ": " + JSON.stringify(theItem));
                var output = compiledTemplate({ product: theItem });
                this.swap(output);
            };
        });
        };

        var displayItems = function () {
            context.app.swap('');
        };

        var highlightMenu = function (itemToHighlight) {
            $("#mainMenu a").click(function (e) {
                e.preventDefault(); // Don´t follow the link
                $("#mainMenu a").removeClass('selected'); // Remove class on all menu items
                $(this).addClass('selected'); // Add class to current menu item
            });
        };

        // to do page transitions http://www.onextrapixel.com/2010/02/23/how-to-use-jquery-to-make-slick-page-transitions/

    })();
