(function(){
  var now = new Date().getTime();
  var e = document.getElementsByTagName("script")[0];
  var d = document.createElement("script");
  d.src = "/api/env.js?_t="+ now;
  d.type = "text/javascript";
  e.parentNode.insertBefore(d,e);
})();
