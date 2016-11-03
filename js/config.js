require.config({
  shim: {

  },
  paths: {
      jquery: "../bower_components/jquery/dist/jquery",
      requirejs: "../bower_components/requirejs/require",
      hex: "hex",
      map: "map"
  },
  packages: [

  ]
});

requirejs(["main"]);
