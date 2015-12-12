define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"ui/bootstrap/SplitButtonDropdown.css",children:[]};
result.data = "\n.SplitButtonDropdown .dropdown-menu .itemLabel{cursor:pointer}"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});