define(['underscore'], function (_) {
    "use strict";
    var initialValue;

    var myLog = function () {
        console.log("sample.js object:" + initialValue);
    };

    var myAdd = function (aNumber) {
        console.log("sample.js object:" + (initialValue + aNumber));
        return initialValue + aNumber;
    };

    var module = {
        log: myLog,
        add: myAdd
    };

    // initialization function
    var init = function (myInitialValue) {
        initialValue = myInitialValue;
        // initialization
        return module;
    };

    return init;
});
