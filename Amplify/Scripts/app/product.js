
// requires amplify

// var app = namespace('app');
var app = {};

app.product = function () {

    this.create = function (productName, category, price) {
        var product = {
            productName: productName,
            category: category,
            price: price
        };

        // publish that you have added a product
        amplify.publish('productCreated', product);
        return product;
    };

    this.all = function () {

        var store = amplify.store("productsStore");
        if (store === undefined) {
            store = new Object();
            store.products = new Array();
            amplify.store("productsStore", store);
        }

        return store;
    };

    this.add = function (product) {
        var data = this.all();

        data.products.push(product);
        // store the new data
        amplify.store("productsStore", data);

        // publishe that the product store has been updated
        amplify.publish("productsStoreUpdated");
    };
    this.clear = function () {

        amplify.store("productsStore", null);
        amplify.publish("productsStoreUpdated", this);
    };
    this.find= function (id) {
        var data = this.all();
        //todo
    };
    return {
        create: create,
        all: all,
        add: add,
        clear: clear
    }
}(amplify);