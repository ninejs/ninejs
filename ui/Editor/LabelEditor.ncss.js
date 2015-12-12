define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"ui/Editor/LabelEditor.css",children:[]};
result.data = "\n.njsEditor.labelEditor .njsLabel{display:none;width:100%;height:100%;cursor:pointer}.njsEditor.labelEditor.isLabel > *{display:none}.njsEditor.labelEditor.isLabel .njsLabel{display:block !important}"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});