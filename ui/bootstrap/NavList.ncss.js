define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"ui/bootstrap/NavList.css",children:[]};
result.data = "\n.NavList .nav-list{padding-left:15px;padding-right:15px;margin-bottom:0}.NavList .nav-list > li > a,.NavList .nav-list .nav-header{margin-left:-15px;margin-right:-15px;text-shadow:0 1px 0 rgba(255,2" + 
 "55,255,0.5)}.NavList .nav-list > li > a{padding:3px 15px}.NavList .nav-list > .active > a,.NavList .nav-list > .active > a:hover,.NavList .nav-list > .active > a:focus{color:#fff;text-shadow:0 -1px 0 " + 
 "rgba(0,0,0,0.2);background-color:#08c}.NavList .nav-list [class^=\"icon-\"],.NavList .nav-list [class*=\" icon-\"]{margin-right:2px}.NavList .nav-list .divider{*width:100%;height:1px;margin:9px 1px;*m" + 
 "argin:-5px 0 5px;overflow:hidden;background-color:#e5e5e5;border-bottom:1px solid #fff}.NavList .nav-header{display:block;padding:3px 15px;font-size:11px;font-weight:bold;line-height:20px;color:#999;t" + 
 "ext-shadow:0 1px 0 rgba(255,255,255,0.5);text-transform:uppercase}.NavList .nav li + .nav-header{margin-top:9px}"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});