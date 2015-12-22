define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"modules/client/Skin/FullScreenFrame.css",children:[]};
result.data = "\nbody.flexFrame{display:-webkit-box;display:-moz-box;display:-webkit-flex;display:-ms-flexbox;display:box;display:flex;}body.flexFrame .njsFullScreenFrame{display:-webkit-box;display:-moz-box;display" + 
 ":-webkit-flex;display:-ms-flexbox;display:box;display:flex;}body.flexFrame .njsFullScreenFrame > .active.flexFrame{display:-webkit-box !important;display:-moz-box !important;display:-webkit-flex !impo" + 
 "rtant;display:-ms-flexbox !important;display:box !important;display:flex !important}@media print{body.flexFrame .njsFullScreenFrame > .active.flexFrame{display:-webkit-box !important;display:-moz-box " + 
 "!important;display:-webkit-flex !important;display:-ms-flexbox !important;display:box !important;display:flex !important}}.njsFullScreenFrame > *{display:none !important;}@media print{.njsFullScreenFr" + 
 "ame > *{display:none !important}}.njsFullScreenFrame > .active{display:block !important;}.njsFullScreenFrame > .active.tableFrame{display:table !important}@media print{.njsFullScreenFrame > .active{di" + 
 "splay:block !important}.njsFullScreenFrame > .active.tableFrame{display:table !important}}"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});