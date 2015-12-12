define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"ui/bootstrap/NavBar.css",children:[]};
result.data = "\n.NavBar .nav-collapse.collapse{height:auto}"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});