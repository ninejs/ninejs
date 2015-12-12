define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"modules/client/Skin/FullScreenFrame.html",children:[]};
result.data = "<div class=\"njsFullScreenFrame col-max\" data-ninejs-attach=\"containerNode\"></div>"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});