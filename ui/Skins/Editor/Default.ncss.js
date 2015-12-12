define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"ui/Skins/Editor/Default.css",children:[]};
result.data = "\n.njsEditor{height:20px;}.njsEditor >.invalid{border-color:#ff4500}.njsEditor input,.njsEditor select,.njsEditor textarea{width:100%;float:left}"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});