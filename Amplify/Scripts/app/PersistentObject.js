// requires amplify, Q, jQuery. app

// getPersistentJsonObject uses Amplify and Q to request info from the server, if
// needed. It immediately returns a promise. When the data has been retrieved it
// publishes an amplify.publish using the resourceId + "Retrieved". You can subscribe
// using amplify.subscribe(resourceId+"Retrieved")
// cachePersist:
//     boolean Cache the data in memory for the remainder of this page load.
//     number Cache the data in memory for the specified number of milliseconds.
//     string Cache the data using a pre-defined caching mechanism.
//          "persist" to cache in the default store
// example:  true
// example:  "persist"
// example:  { }
// To retrieve from "/myRestFulApi/{type}" pass in { type : yourId } into data
//
app.getPersistentJsonObject = function (resourceId, url, cachePersist, data) {
    this.resourceId = resourceId;
    this.url = url;
    this.persist = cachePersist;
    this.data = data;

    amplify.request.define(this.resourceId, "ajax", {
        url: this.url,
        data: this.data,
        dataType: "json",
        type: "GET",
        cache: this.persist
    });

    var deferral = Q.defer();

    amplify.request({
        resourceId: this.resourceId,
        success: function (data) {
            amplify.publish(resourceId + 'Retrieved', data);
            return deferral.resolve;
        },
        error: deferral.reject
    });

    return deferral.promise;
}