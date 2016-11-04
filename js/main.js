define(["jquery", "map"], function($, Map) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
    console.log($);
    var map = new Map({
        x: -3,
        y: -3
    }, {
        x: 6,
        y: 6
    });

    document.Hexmap = map;

    map.drawExample();
});
