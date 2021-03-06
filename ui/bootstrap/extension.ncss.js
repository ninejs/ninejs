define(['ninejs/css', 'ninejs/config'], function(style, config) {
var result = {path:"ui/bootstrap/extension.css",children:[]};
result.data = "\r\n.no-margin{margin:0 !important}.no-margin-left{margin-left:0 !important}.no-margin-top{margin-top:0 !important}.no-margin-right{margin-right:0 !important}.no-margin-bottom{margin-bottom:0 !importa" + 
 "nt}.row .vpan12,.container .vpan12,.row-fluid .vpan12,.container-fluid .vpan12{height:100%}.row .vpan11,.container .vpan11,.row-fluid .vpan11,.container-fluid .vpan11{height:91.66666666666667%}.row .v" + 
 "offset11,.container .voffset11,.row-fluid .voffset11,.container-fluid .voffset11{margin-top:92.6666666666667%}.row .vpan10,.container .vpan10,.row-fluid .vpan10,.container-fluid .vpan10{height:83.3333" + 
 "3333333333%}.row .voffset10,.container .voffset10,.row-fluid .voffset10,.container-fluid .voffset10{margin-top:84.3333333333333%}.row .vpan9,.container .vpan9,.row-fluid .vpan9,.container-fluid .vpan9" + 
 "{height:75%}.row .voffset9,.container .voffset9,.row-fluid .voffset9,.container-fluid .voffset9{margin-top:76%}.row .vpan8,.container .vpan8,.row-fluid .vpan8,.container-fluid .vpan8{height:66.6666666" + 
 "6666667%}.row .voffset8,.container .voffset8,.row-fluid .voffset8,.container-fluid .voffset8{margin-top:67.6666666666667%}.row .vpan7,.container .vpan7,.row-fluid .vpan7,.container-fluid .vpan7{height" + 
 ":58.333333333333336%}.row .voffset7,.container .voffset7,.row-fluid .voffset7,.container-fluid .voffset7{margin-top:59.3333333333333%}.row .vpan6,.container .vpan6,.row-fluid .vpan6,.container-fluid ." + 
 "vpan6{height:50%}.row .voffset6,.container .voffset6,.row-fluid .voffset6,.container-fluid .voffset6{margin-top:51%}.row .vpan5,.container .vpan5,.row-fluid .vpan5,.container-fluid .vpan5{height:41.66" + 
 "6666666666664%}.row .voffset5,.container .voffset5,.row-fluid .voffset5,.container-fluid .voffset5{margin-top:42.6666666666667%}.row .vpan4,.container .vpan4,.row-fluid .vpan4,.container-fluid .vpan4{" + 
 "height:33.333333333333336%}.row .voffset4,.container .voffset4,.row-fluid .voffset4,.container-fluid .voffset4{margin-top:34.3333333333333%}.row .vpan3,.container .vpan3,.row-fluid .vpan3,.container-f" + 
 "luid .vpan3{height:25%}.row .voffset3,.container .voffset3,.row-fluid .voffset3,.container-fluid .voffset3{margin-top:26%}.row .vpan2,.container .vpan2,.row-fluid .vpan2,.container-fluid .vpan2{height" + 
 ":16.666666666666668%}.row .voffset2,.container .voffset2,.row-fluid .voffset2,.container-fluid .voffset2{margin-top:17.6666666666667%}.row .vpan1,.container .vpan1,.row-fluid .vpan1,.container-fluid ." + 
 "vpan1{height:8.333333333333334%}.row .voffset1,.container .voffset1,.row-fluid .voffset1,.container-fluid .voffset1{margin-top:9.3333333333333%}"; 
if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }

return style.style(result);
});