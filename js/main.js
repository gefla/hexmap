define(["jquery", "map"], function($, Map) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
    console.log($);
    var canvas = document.getElementById("layout-test-orientation-pointy");
    var map = new Map(canvas, {
        x: -5,
        y: -5
    }, {
        x: 10,
        y: 10
    });

    document.Hexmap = map;

    map.drawExample();
});
