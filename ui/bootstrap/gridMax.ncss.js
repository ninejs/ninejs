define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"ui/bootstrap/gridMax.css",children:[]};
result.data = "\n.col-max{width:100%;max-width:100%;}.col-max.container{width:100%;max-width:100%}.vpanmax{height:100%;max-height:100%}"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});