define(['amplify', 'q'], function (amplify, Q) {

    var loadProducts = function () {
        var deferred = Q.defer();
        console.log("retrieving productsData");

        var products = amplify.store("productsData");

        console.log("amplify productsData: " + JSON.stringify(products));

        if (products === undefined) {
            console.log("request productsData from server");
            amplify.request.define("productsData", "ajax", {
                url: "../data/products.txt",
                dataType: "json",
                type: "GET",
                // do not have productsData cache or persist
                // instead we use amplify.store so we can clear the value.
            });

            // 
            amplify.request({
                resourceId: "productsData",
                success: function (products) {
                    console.log("productsData retrieved from server: " + JSON.stringify(products));
                    amplify.store("productsData", products);
                    deferred.resolve(products);
                },
                error: function (message, level) {
                    deferred.reject("products failed to load: " + message);
                }
            });
        } else {
            console.log("productsData retrieved from cache: " + JSON.stringify(products));
            deferred.resolve(products);
        }

        return deferred.promise;
    }
    return {
        loadProducts: loadProducts
    }
});