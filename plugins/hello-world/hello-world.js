var helloWorld = this;
var bs, menuHookGl;

exports.init = function( core ) {

  
  console.error("hahaha");

};

exports.shutdown = function() {

  //Called when plugin is disabled.
  //You should also unregister hooks here.
  console.log("Goodbye, world!");
  bs.removeMenuItem("bosonMenu",menuHookGl);

};
