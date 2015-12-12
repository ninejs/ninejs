define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"modules/client/Skin/FullScreenFrame.css",children:[]};
result.data = "\n.njsFullScreenFrame > *{display:none !important;}@media print{.njsFullScreenFrame > *{display:none !important}}.njsFullScreenFrame > .active{display:block !important;}.njsFullScreenFrame > .active.t" + 
 "ableFrame{display:table !important}@media print{.njsFullScreenFrame > .active{display:block !important}.njsFullScreenFrame > .active.tableFrame{display:table !important}}"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});