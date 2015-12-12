define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"ui/Skins/Wizard/Default.css",children:[]};
result.data = "\n.njsWizard .njsTransitionPanelContainer{height:500px}.njsWizard button{-webkit-border-radius:10px;border-radius:10px}"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});