

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
        } //,
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

/*
require(['app/data', 'q'], function (products) {
    app.data = products;
    console.log("app.data: " + JSON.stringify(app.data));
});
*/

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

require(['app/sampleQ', 'q'], function (sample, Q) {

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