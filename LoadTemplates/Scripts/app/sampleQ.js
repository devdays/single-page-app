define(function (require) {
    "use strict";

    // using simplified CommonJS syntax so it is clear what vars I can use in this function
    // and not to confuse the order of them
    var Q = require('q');
    // var amplify = require('amplify');

    // a private method that delays 
    var count = function (beginningNumber, endingNumber) {
        var deferral = Q.defer();
        var newNumber = 0;
        if (endingNumber < beginningNumber) {
            deferral.reject("endingNumber before beginningNumber");
        }

        // do soemthing that takes some time (retrieve data from server)
        for (var i = beginningNumber; i < endingNumber; i++) {
            Q.delay(100);
            newNumber += i;
        }

        console.log("in sampleQ: " + newNumber + typeof (newNumber));
        deferral.resolve(newNumber);

        return deferral.promise;
    };

    return {
        count: count
    };
});