require(["./common"],function(){require(["../app/app-index"],function(e){e.init()})}),define("../index",function(){}),define("../app/config",[],function(){return{needPV:!0,guide:{showIfFirstVisit:!0,autoNextDelay:3e3},extension:{appId:"hhgmonhbodfiplppmcangkmlfkcnilpd",uploadDelay:250}}}),define("../app/EventManager",[],function(){function t(e,t){return e+"_"+t}function n(n,r,i){var s=t(n,r),o=e[s];o||(o=[],e[s]=o),o.push(i)}function r(n,r,i){var s=t(n,r),o=e[s];if(!o)return;for(var u=0;u<o.length;u++){var a=o[u];if(a==i){o.splice(u,1);break}}}function i(n,r,i){var s=t(n,r),o=e[s];if(!o)return;for(var u=0;u<o.length;u++){var a=o[u];a(i)}}var e={};return{bind:n,unbind:r,trigger:i}}),define("../app/nodeTemplate",["./EventManager"],function(e){function u(){var e=new go.Size(9,15),n=new go.Size(14,14),r=3,i={ArduinoUNO:t(go.Node,"Spot",a(),f(!1),l("0",new go.Spot(.947,.037),"Rectangle","#F1C933",e),l("1",new go.Spot(.912,.037),"Rectangle","#F1C933",e),l("2",new go.Spot(.877,.037),"Rectangle","#F1C933",e),l("3",new go.Spot(.842,.037),"Rectangle","#F1C933",e),l("4",new go.Spot(.807,.037),"Rectangle","#F1C933",e),l("5",new go.Spot(.772,.037),"Rectangle","#F1C933",e),l("6",new go.Spot(.737,.037),"Rectangle","#F1C933",e),l("7",new go.Spot(.702,.037),"Rectangle","#F1C933",e),l("8",new go.Spot(.653,.037),"Rectangle","#F1C933",e),l("9",new go.Spot(.618,.037),"Rectangle","#F1C933",e),l("10",new go.Spot(.583,.037),"Rectangle","#F1C933",e),l("11",new go.Spot(.548,.037),"Rectangle","#F1C933",e),l("12",new go.Spot(.513,.037),"Rectangle","#F1C933",e),l("13",new go.Spot(.478,.037),"Rectangle","#F1C933",e),l("A0",new go.Spot(.771,.984),"Rectangle","#F1C933",e),l("A1",new go.Spot(.806,.984),"Rectangle","#F1C933",e),l("A2",new go.Spot(.841,.984),"Rectangle","#F1C933",e),l("A3",new go.Spot(.876,.984),"Rectangle","#F1C933",e),l("A4",new go.Spot(.911,.984),"Rectangle","#F1C933",e),l("A5",new go.Spot(.946,.984),"Rectangle","#F1C933",e),l("SerialPort",new go.Spot(.0089,.248),"Rectangle","#F1C933",new go.Size(30,65))),"one-port-top":t(go.Node,"Spot",a(),f(),l("P0",new go.Spot(.5,0,0,-r),null,"#F1C933",n,"#F19833")),"one-port-bottom":t(go.Node,"Spot",a(),f(),l("P0",new go.Spot(.5,1,0,r),null,"#F1C933",n,"#F19833")),"one-port-right":t(go.Node,"Spot",a(),f(),l("P0",new go.Spot(1,.5,r,0),null,"#F1C933",n,"#F19833")),"two-port-top":t(go.Node,"Spot",a(),f(),l("P0",new go.Spot(.333,0,0,-r),null,"#F1C933",n,"#F19833"),l("P1",new go.Spot(.667,0,0,-r),null,"#F1C933",n,"#F19833")),"two-port-bottom":t(go.Node,"Spot",a(),f(),l("P0",new go.Spot(.333,1,0,r),null,"#F1C933",n,"#F19833"),l("P1",new go.Spot(.667,1,0,r),null,"#F1C933",n,"#F19833")),joystick:t(go.Node,"Spot",a(),f(),l("P0",new go.Spot(.5,0,0,-r),null,"#F1C933",n,"#F19833"),l("P1",new go.Spot(.333,1,0,r),null,"#F1C933",n,"#F19833"),l("P2",new go.Spot(.667,1,0,r),null,"#F1C933",n,"#F19833"))},s=t(go.Link,{routing:go.Link.AvoidsNodes,corner:5,click:p},(new go.Binding("points")).makeTwoWay(),t(go.Shape,{name:"LINE",isPanelMain:!0,fill:"#95a3ad",stroke:"#95a3ad",strokeWidth:3})),o=t(go.Adornment,"Auto",t(go.Shape,{fill:null,stroke:"#1ca8f8",strokeWidth:2}),t(go.Placeholder)),u=t(go.Adornment,"Link",t(go.Shape,{isPanelMain:!0,stroke:"#F19833",strokeWidth:0}));return{node:i,link:s,nodeSelection:o,linkSelection:u}}function a(){return[(new go.Binding("location","location",go.Point.parse)).makeTwoWay(go.Point.stringify),new go.Binding("selectable"),new go.Binding("deletable"),(new go.Binding("angle")).makeTwoWay(),{cursor:"pointer",locationSpot:go.Spot.Center,click:c,doubleClick:h,toolTip:t(go.Adornment,"Auto",t(go.Shape,{fill:"#F1C933",stroke:null}),t(go.TextBlock,{margin:10,font:n,stroke:"#69550B"},new go.Binding("text","label")))}]}function f(e){return e=e!=0,e?t(go.Panel,"Auto",t(go.Shape,"RoundedRectangle",{fill:"#d7d7d7",stroke:null}),t(go.Picture,new go.Binding("source"),new go.Binding("width"),new go.Binding("height"))):t(go.Picture,new go.Binding("source"),new go.Binding("width"),new go.Binding("height"))}function l(e,r,i,s,o,u){return t(go.Shape,i||"Circle",{name:"PORT",fromLinkable:!0,toLinkable:!0,portId:e,alignment:r,alignmentFocus:r,fill:s||"transparent",desiredSize:o||new go.Size(5,5),stroke:u||null,cursor:"crosshair",click:d,mouseEnter:v,mouseLeave:m,toolTip:t(go.Adornment,"Auto",t(go.Shape,{fill:"#F1C933",stroke:null}),t(go.TextBlock,{margin:10,font:n,stroke:"#69550B"},new go.Binding("text","",function(t){var n=t.ports,r=n[e];return t.type=="component"||r.type==3?r.label:"Pin "+r.label})))})}function c(t,n){e.trigger("hardware","nodeClick",n),t.handled=!0}function h(t,n){n.data.type=="board"&&e.trigger("project","switchPanel",1)}function p(t,n){e.trigger("hardware","linkClick",n),t.handled=!0}function d(t,n){e.trigger("hardware","portClick",n),t.handled=!0}function v(e,t){s=t.fill,t.fill=o}function m(e,t){t.fill=s}var t=go.GraphObject.make,n="14px Microsoft Yahei",r="#F1C933",i="#F19833",s="#ffe42b",o="#F19833";return u()}),define("../app/util",["jquery"],function(e){function t(t){var n=400;e("div.x-message").stop(!0).fadeOut(n/2,function(){e(this).remove()}),t=typeof t=="string"?{text:t}:t;var r=t.type||"info",i=t.text,s='<div class="x-message alert alert-'+r+' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+i+"</div>",o=e(s);o.appendTo(e("body")).css({left:(e(window).width()-o.width())/2,top:-o.height()}).animate({top:150},n,"swing").delay(2e3).fadeOut(n,function(){e(this).remove()})}function n(t){t=typeof t=="string"?{selector:t}:t;var n=t.selector,r=e(n);if(!r||!r.hasClass("x-dialog"))return console.log("Can not find "+n+" or it is not a x-dialog"),!1;var i=t.onConfirm,s=t.onCancel,o=t.onClosing,u=t.onClose,a=t.onShow,f=t.content;f&&e(".x-dialog-content",r).text(f);var l=e(".dialog-layer").addClass("active"),c=function(){r.slideUp(200,function(){r.hide().removeClass("active"),l.removeClass("active"),u&&u()})};return e(".x-dialog-btns .confirm",r).off("click").on("click",function(){if(!o||o()!=0)c(),i&&i()}),e(".x-dialog-close,.x-dialog-btns .cancel",r).off("click").on("click",function(){if(!o||o()!=0)c(),s&&s()}),r.css({top:-r.height()}),function(){a&&a(),r.show().addClass("active").animate({top:200},300,"swing")}(),r}function r(e,t,n){return t=t||"li",n?e.hasClass("active")?(e.removeClass("active"),!1):(e.parent().find(t+".active").removeClass("active"),e.addClass("active"),!0):e.hasClass("active")?!1:(e.parent().find(t+".active").removeClass("active"),e.addClass("active"),!0)}return{message:t,dialog:n,toggleActive:r}}),define("../app/hardware",["jquery","jquery-ui","jquery.cookie","./nodeTemplate","./EventManager","./util"],function(e,t,t,n,r,i){function y(){u=go.GraphObject.make,a=u(go.Diagram,c,{initialContentAlignment:go.Spot.Center,allowClipboard:!1,allowCopy:!1,allowTextEdit:!1,allowReshape:!1,allowRelink:!1,allowLink:!0,maxSelectionCount:1,"toolManager.hoverDelay":500,"clickCreatingTool.isEnabled":!1,"clickCreatingTool.isDoubleClick":!1,"linkingTool.portGravity":50,"linkingTool.linkValidation":Z,"relinkingTool.linkValidation":Z,"grid.visible":!0,"toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom,"dragSelectingTool.isEnabled":!1,"animationManager.isEnabled":!1,click:V,doubleClick:$,contextClick:J,PartCreated:K}),a.grid=u(go.Panel,"Grid",u(go.Shape,"LineH",{stroke:"#EBEFF7"}),u(go.Shape,"LineV",{stroke:"#EBEFF7"}),u(go.Shape,"LineH",{stroke:"#F0F3F8",interval:5}),u(go.Shape,"LineV",{stroke:"#F0F3F8",interval:5}));for(var e in n.node){var t=n.node[e];a.nodeTemplateMap.add(e=="default"?"":e,t)}a.linkTemplate=n.link,a.nodeSelectionAdornmentTemplate=n.nodeSelection,a.linkSelectionAdornmentTemplate=n.linkSelection,a.toolManager.linkingTool.temporaryLink=u(go.Link,u(go.Shape,{stroke:"#95a3ad",strokeWidth:2}));var r=u(go.Node,u(go.Shape,{stroke:null,fill:null,portId:"",width:0,height:0}));a.toolManager.linkingTool.temporaryFromNode=r,a.toolManager.linkingTool.temporaryFromPort=r.port;var i=u(go.Node,u(go.Shape,{stroke:null,fill:null,portId:"",width:0,height:0}));a.toolManager.linkingTool.temporaryToNode=i,a.toolManager.linkingTool.temporaryToPort=i.port;var s=a.toolManager.clickCreatingTool;s.insertPart=function(e){return this.archetypeNodeData=R(this.archetypeNodeData.name),go.ClickCreatingTool.prototype.insertPart.call(this,e)},s=a.toolManager.linkingTool,s.doActivate=function(){var e=this.findLinkablePort();return j(e),go.LinkingTool.prototype.doActivate.call(this)},s.doDeactivate=function(){var e=go.LinkingTool.prototype.doDeactivate.call(this);return j(),e};var o=u(go.GraphLinksModel,{linkFromPortIdProperty:"fromPort",linkToPortIdProperty:"toPort"});a.model=o,g={},N(),k(p)}function b(e){f=e}function w(){var e=[],t=a.model.nodeDataArray,n;for(var r=0;r<t.length;r++)n=t[r],e.push({type:n.type,name:n.name,key:n.key,varName:n.varName||"",location:n.location});var i=[],s=a.model.linkDataArray,o,u,f,l;for(var r=0;r<s.length;r++){o=s[r],u=[],f=o.points.toArray();for(var c=0;c<f.length;c++)l=f[c],u.push(l.x,l.y);i.push({from:o.from,to:o.to,fromPort:o.fromPort,toPort:o.toPort,points:u})}return{model:{nodeDataArray:e,linkDataArray:i},componentCounts:g}}function E(t){t=t||{};var n=t.model;if(n){typeof n=="string"&&(n=JSON.parse(n));var r=n.nodeDataArray,i,s,o;for(var f=0;f<r.length;f++)i=r[f],o=i.varName||"",s=q(i.name,f==0),i=e.extend(i,s),i.varName=o;a.model=u(go.GraphLinksModel,{linkFromPortIdProperty:"fromPort",linkToPortIdProperty:"toPort",nodeDataArray:n.nodeDataArray,linkDataArray:n.linkDataArray})}else a.clear(),D();g=t.componentCounts||[],j(),F(),I(!1)}function S(){return p}function x(e){if(p!="modern")return;var t=a.toolManager.clickCreatingTool;t.isEnabled=!0,t.archetypeNodeData={name:e};var n=q(e);h.attr("src",n.source).css({width:n.width,height:n.height,left:-999}),L()}function T(){var e=[],t=B(),n=t.findNodesConnected().iterator,r,i,s,o,u,a;while(n.next()){r=n.value,i=r.data,s=[],u=t.findLinksBetween(r).iterator;while(u.next())o=u.value,a=o.fromPort.part.data.type,a=="board"?s.push({source:o.toPort.portId,target:o.fromPort.portId}):s.push({source:o.fromPort.portId,target:o.toPort.portId});e.push({name:i.name,headCode:i.headCode,varCode:i.varCode,setupCode:i.setupCode,varName:i.varName,ports:s})}return e.sort(function(e,t){var n=e.name.localeCompare(t.name);return n==0?e.varName.localeCompare(t.varName):n})}function N(){l=e("#"+c).droppable({disabled:!0,scope:"hardware",drop:et}),h=e(".hardware .follow .follower"),e(".hardware .tools .interactive-mode > li").on("click",_),e(".hardware .tools .mode > li").on("click",M),r.bind("hardware","nodeClick",Q),r.bind("hardware","linkClick",G),r.bind("hardware","portClick",Y)}function C(t){e('.hardware .tools .mode li[data-mode="'+t+'"').click()}function k(t){t=="drag"?e('.hardware .tools .interactive-mode li[data-mode="modern"]').click():e('.hardware .tools .interactive-mode li[data-mode="drag"]').click()}function L(e){l.off("mousemove",A),h.css({left:-999});if(p!="modern"||d!="default"&&d!="clone")return;if(e===undefined&&!a.toolManager.clickCreatingTool.isEnabled)return;if(e==0){a.toolManager.clickCreatingTool.isEnabled=!1;return}l.on("mousemove",A),l.off("mouseout").on("mouseout",O)}function A(e){h.css({top:e.offsetY-h.height()/2,left:e.offsetX-h.width()/2})}function O(e){h.css({left:-999})}function M(t){var n=e(this);i.toggleActive(n),d=n.data("mode");var r=a.toolManager.clickCreatingTool,s=p=="modern";switch(d){case"default":r.isEnabled=s;break;case"clone":r.isEnabled=s;break;case"delete":r.isEnabled=!1}L()}function _(t,n){var i=e(this).addClass("hide"),s=i.data("mode"),o=e('.hardware .tools .mode li[data-mode="clone"]');s=="drag"?(p="modern",i.parent().find('li[data-mode="'+p+'"]').removeClass("hide"),o.removeClass("hide")):(p="drag",i.parent().find('li[data-mode="'+p+'"]').removeClass("hide"),o.addClass("hide")),l.droppable("option","disabled",p!="drag"),C("default"),e.cookie("interactiveMode",p),r.trigger("hardware","changeInteractiveMode",p)}function D(){P("ArduinoUNO",0,0,!0)}function P(e,t,n,r){var i=R(e,r);typeof t=="number"&&typeof n=="number"&&(i.location=t+" "+n);var s=a.model;return s.addNodeData(i),i}function H(e,t,n,r){var i={from:e,to:t,fromPort:n,toPort:r},s=a.model;return s.addLinkData(i),i}function B(){var e=a.nodes.iterator,t;while(e.next()){t=e.value;if(t.data.type=="board")return t}}function j(e){var t=B();if(!t)return;var n=t.ports.iterator,r;while(n.next())r=n.value,X(r)?r.fill="#4891ed":r.fill="#ffe42b";v&&v.diagram&&(v.fill="#F1C933"),v=e;if(v){v.fill="#F19833";var i=v.part.data.type;if(i=="component"){n.reset();while(n.next()){r=n.value;if(X(r)||!W(v,r))r.fill="#4891ed"}}}}function F(e){m&&m.diagram&&(m.fromPort.fill="#F1C933",m.toPort.fill="#4891ed"),m=e,m&&(m.fromPort.fill="#F19833",m.toPort.fill="#F19833")}function I(t){var n=e(".hardware .name-dialog");if(t){var r=e(".name",n).val(t.varName).off("blur").on("blur",function(e){var n=tt(t.key,r.val());n.success||(r.val(t.varName),i.message(n.message))});if(n.css("display")=="block"){var s=tt(t.key,r.val());s.success||(r.val(t.varName),i.message(s.message))}n.show()}else n.hide()}function q(e,t){return t?f.boards[e]:f.components[e]}function R(t,n){var r=q(t,n),i=e.extend({},r),s=(new Date).getTime();i.key=t+"_"+s;var o=g[t]||0;return i.varName+=o,o++,g[t]=o,i}function U(e){var t=e.part,n=t.data.ports;return n[e.portId]}function z(e){var t=e.part,n=t.findLinksConnected(e.portId).iterator;return n.next(),n.value}function W(e,t){var n=U(e),r=U(t);if(n.type!=r.type)return!1;var i,s;n.owner_type==0?(i=n,s=r):(i=r,s=n);if(i.special=="")return!0;var o=i.special.split(",");return o.indexOf(s.name)>=0}function X(e){var t=e.part;return t.findLinksConnected(e.portId).count>0}function V(e){j(),F(),I(!1)}function $(e){r.trigger("project","switchPanel",1)}function J(e){C("default"),L(!1)}function K(e){d=="default"&&(a.toolManager.clickCreatingTool.isEnabled=!1),L()}function Q(e){j(),F();if(d=="default"){var t=e.data,n=t.type;n=="component"?I({varName:t.varName,key:t.key}):I(!1)}else d=="delete"?(I(!1),e.deletable&&a.remove(e)):I(!1)}function G(e){j(),I(!1),d=="delete"?(e==m&&(F(),m=null),a.remove(e)):(d=="default"||d=="clone")&&F(e)}function Y(e){F(),I(!1);if(p=="modern"&&d=="default"){var t=e.part,n=t.data.type;if(!v)j(e);else{var r=v.part.data.type;if(r=="component")if(n=="component"){if(!X(v)||X(e)){j();return}var i=z(v),s=i.getOtherPort(v);if(!W(e,s)){j();return}a.remove(i);var o=s.part.data.key,u=e.part.data.key;H(o,u,s.portId,e.portId),j()}else{if(X(v)||X(e)||!W(v,e)){j();return}var o=v.part.data.key,u=e.part.data.key;H(o,u,v.portId,e.portId),j()}else if(n=="component"){if(X(v)||X(e)||!W(v,e)){j();return}var o=v.part.data.key,u=e.part.data.key;H(o,u,v.portId,e.portId),j()}else{if(!X(v)||X(e)){j();return}var i=z(v),s=i.getOtherPort(v);if(!W(e,s)){j();return}a.remove(i);var o=s.part.data.key,u=e.part.data.key;H(o,u,s.portId,e.portId),j()}}}else j()}function Z(e,t,n,r){return!X(t)&&!X(r)&&W(t,r)}function et(t,n){var r=n.helper.first(),i=r.data("component-name"),s=r.width(),o=r.height(),u=r.offset().left+s/2,f=r.offset().top+o/2,l=q(i);switch(l.category){case"one-port-top":case"two-port-top":f-=3.5;break;case"one-port-bottom":case"two-port-bottom":f+=3.5;break;case"one-port-right":u+=3.5}var c=e(a.div).offset(),h=new go.Point(u-c.left,f-c.top);h=a.transformViewToDoc(h),P(i,h.x,h.y)}function tt(e,t){if(t=="")return{message:"变量名不能为空",success:!1};if(s.indexOf(t)>=0)return{message:"变量名不能是关键字",success:!1};if(!o.test(t))return{message:"变量名只能由字母、数字或下划线组成，且不能以数字开头",success:!1};var n=a.model.nodeDataArray;for(var r=0;r<n.length;r++){var i=n[r];if(i.key!=e&&i.name==t)return{message:"变量名重复",success:!1}}var i=a.model.findNodeDataForKey(e);return i?(i.varName=t,{success:!0}):{message:"非法操作",success:!0}}var s=["asm","do","if","return","typedef","auto","double","inline","short","typeid","bool","dynamic_cast","int","signed","typename","break","else","long","sizeof","union","case","enum","mutable","static","unsigned","catch","explicit","namespace","static_cast","using","char","export","new","struct","virtual","class","extern","operator","switch","void","const","false","private","template","volatile","const_cast","float","protected","this","wchar_t","continue","for","public","throw","while","default","friend","register","true","delete","goto","reinterpret_cast","try","_Bool","_Complex","_Imaginary"],o=/^[_a-zA-Z][_a-zA-Z0-9]*$/,u,a,f,l,c="hardware-container",h,p=e.cookie("interactiveMode")||"modern",d="default",v,m,g;return{init:y,load:b,getData:w,setData:E,getInteractiveMode:S,setPlaceComponent:x,getNodes:T}}),define("../app/user",["jquery","./EventManager","./util"],function(e,t,n){function s(){l(),c()}function o(){return r?r.id:0}function u(){return r}function a(t){e.ajax({type:"GET",url:"/auth/check",dataType:"json"}).done(function(e){var n=e.code==0;r=n?e.user:null,t&&t(n)})}function f(i,s){var o=e("#login_dialog");e(".qrLoginBtn, .baseLoginBtn",o).off("click").on("click",function(t){var n=e(this).data("action");n=="qrLogin"?(e(".qrLoginBtn, .qrLogin").removeClass("active"),e(".baseLoginBtn, .baseLogin").addClass("active"),e(".qrLoginBtn").css({display:"none"}),e(".baseLoginBtn").css({display:"block"}),e("#use_weixin").removeClass("active"),e(".email",o).focus(),h(!1)):(e(".baseLoginBtn, .baseLogin").removeClass("active"),e(".qrLoginBtn, .qrLogin").addClass("active"),e(".baseLoginBtn").css({display:"none"}),e(".qrLoginBtn").css({display:"block"}),h(!0,i))}),e(".btn-login",o).off("click").on("click",function(){e.ajax({type:"POST",url:"/auth/login",dataType:"json",data:{email:e(".email",o).val(),password:e(".password",o).val()}}).done(function(s){s.code==0?(n.message(s.message),e("#login_dialog .close-btn").click(),r=s.data,p(),i&&i(),t.trigger("user","login")):s.code==1?(r=s.data,p(),i&&i()):e(".baseLogin .message span").show().html(s.message).delay(2e3).queue(function(){e(this).fadeOut().dequeue()})})}),s=s||0,s==0?(e(".qrLoginBtn").click(),e(".email",o).focus()):e(".baseLoginBtn").click(),o.css({top:-o.height()}).show().animate({top:200},400,"swing"),e(".dialog-layer").addClass("active")}function l(){var t=e("#login_dialog"),n=e("#use_weixin");e(".close-btn",t).on("click",function(r){t.slideUp(100,function(t,r){n.removeClass("active"),e(".dialog-layer").removeClass("active")}),h(!1)}),e(".qrLogin .qrcode").hover(function(t){var r=e(this).offset().top,i=e(this).offset().left;n.is(":animated")||n.addClass("active").show().css({top:r-160,left:i+50,opacity:0}).animate({left:i+260,opacity:1})},function(t){var r=e(this).offset().left;n.is(":animated")||n.animate({left:r+420,opacity:0},null,null,function(){n.removeClass("active").hide()})}),e("form",t).on("keyup",function(n){n.keyCode==13&&e(".baseLogin",t).hasClass("active")&&e(".btn-login",t).trigger("click")})}function c(){var t=e(".user"),n=e(".dialog",t),r=e(".indent",t),i=e(".software .back");e(".close-btn",n).on("click",function(){n.slideUp(200,function(e){r.show()}),i.removeClass("active")}),r.on("click",function(){n.slideDown(400,function(){r.hide()}),i.addClass("active")})}function h(s,o){clearInterval(i),s&&(i=setInterval(function(){var i=e("#qrcode_key").val();e.ajax({type:"POST",url:"/auth/login/weixin",data:{key:i},dataType:"json"}).done(function(i){i.code==0?(r=i.data,h(!1),n.message(i.message),e("#login_dialog .close-btn").click(),p(),o&&o(),t.trigger("user","login")):i.code==1&&(r=i.data,h(!1),p())})},3e3))}function p(){var t=e(".user"),n=e(".software .back");r?(t.addClass("active"),n.addClass("active"),e(".photo img",t).attr("src",r.avatar_url),e(".name",t).text(r.name)):(t.removeClass("active"),n.removeClass("active"),e(".name",t).text(""),e(".photo img",t).attr("src","#"))}var r,i;return{init:s,getUserId:o,getUserInfo:u,authCheck:a,showLoginDialog:f}}),define("../app/code",[],function(){function u(e){t=e}function a(t){var n=t.split("\n");for(var r=0;r<n.length;r++){var i=n[r];i!=""&&e.indexOf(i)<0&&e.push(i)}}function f(e){n=[],r=[],i=[],m();if(!e){var t=s,o=l();o!=""&&(t+="\n"+o);var u=c();u!=""&&(t+="\n"+u+"\n"),t+="void setup() {\n";var a=h();return a!=""&&(t+=a),t+="    \n}\n\n",t+="void loop() {\n    \n}",t}return e=v(e,l(),"head"),e=v(e,c(),"variable"),e=v(e,h(),"setup"),e}function l(){for(var t=0;t<e.length;t++){var r=e[t];r!=""&&n.indexOf(r)<0&&n.push(r)}n=n.sort(function(e,t){return e.localeCompare(t)});var i="",s="";for(var t=0;t<n.length;t++)s+=n[t]+"\n";return i+=d(s,"head"),i}function c(){var e="",t="";for(var n=0;n<r.length;n++)t+=r[n];return e+=d(t,"variable"),e}function h(){var e="",t="";for(var n=0;n<i.length;n++)t+=i[n];return e+=d(t,"setup","    "),e}function p(e){e=e||1;var t="";for(var n=0;n<e;n++)t+="    ";return t}function d(e,t,n){return n=n||"",o.replace("{{code}}",e).replace("{{tag}}",t).replace(/\{\{indent\}\}/g,n)}function v(e,t,n){var r="//end auto generate. block tag: "+n,i=e.indexOf(r);if(i<0)return e;var s="//auto generate",o=e.lastIndexOf(s,i);return o<0?e:(o=e.lastIndexOf("\n",o)+1,i=i+r.length+1,e.replace(e.substring(o,i),t))}function m(){var e=t();for(var s=0;s<e.length;s++){var o=e[s];if(o.headCode!=""){var u=o.headCode.split("\n");for(var a=0;a<u.length;a++){var f=u[a];f!=""&&n.indexOf(f)<0&&n.push(f)}}var l=o.ports,c,h=o.varCode;if(h!=""){h=h.replace(/\$NAME/g,o.varName);for(var a=0;a<l.length;a++)c=l[a],h=h.replace("$"+c.source,c.target);r.push(h)}var p=o.setupCode;if(p!=""){p=p.replace(/\$NAME/g,o.varName);for(var a=0;a<l.length;a++)c=l[a],p=p.replace("$"+c.source,c.target);p=p.replace(/([^\n]*\n)/g,"    $1"),i.push(p)}}}var e=[],t,n,r,i,s="/************************************************************\n *Copyright(C), 2016-2038, KenRobot.com\n *FileName:  //文件名\n *Author:    //作者\n *Version:   //版本\n *Date:      //完成日期\n */\n",o="{{indent}}//auto generate\n{{indent}}//warning: please don't modify\n{{code}}{{indent}}//end auto generate. block tag: {{tag}}\n";return{init:u,gen:f,addLibrary:a}}),define("../app/software",["ace/ext-language_tools","jquery","./EventManager","./code"],function(e,t,n,r){function o(e){i=ace.edit(t(".software .editor")[0]),i.setOptions({enableBasicAutocompletion:!0,enableSnippets:!0,enableLiveAutocompletion:!0}),i.setShowPrintMargin(!1),i.$blockScrolling=Infinity,i.setTheme("ace/theme/default"),i.session.setMode("ace/mode/arduino"),t(".software .back").on("click",function(e){n.trigger("project","switchPanel",0)}),r.init(e)}function u(e){e=e||{};var t=e.source||r.gen();i.setValue(t,1)}function a(){return{source:i.getValue()}}function f(){i.setValue(r.gen(i.getValue()),1)}function l(e){r.addLibrary(e.code)}function c(){var e="codebender_reformat_cursor",t=i.getCursorPosition(),n=i.getSession().getValue().split("\n");n[t.row]=n[t.row].slice(0,t.column)+e+n[t.row].slice(t.column);var r=s(n.join("\n")).split("\n");for(var o=0;o<r.length;o++){var u=r[o].indexOf(e);if(u!==-1){r[o]=r[o].substring(0,u)+r[o].substring(u+e.length,r[o].length),i.getSession().setValue(r.join("\n")),i.getSession().getSelection().selectionLead.setPosition(o,u),i.focus();break}}}var i,s=Module.cwrap("js_format_string","string",["string"]);return{init:o,getData:a,setData:u,gen:f,addLibrary:l,format:c}}),define("../app/board",["jquery","./util"],function(e,t){function s(){i=".board .list > li.normal",e(i).on("click",f)}function o(t){r=t,e(i).eq(0).click()}function u(){return{id:n.id,name:n.name,board_type:n.board_type}}function a(t){t=t||{};var n=t.id||1;for(var s in r){var o=r[s];if(o.id==n){e(i).filter('[data-board="'+s+'"]').click();break}}}function f(i){var s=e(this),o=s.data("board");n=r[o],t.toggleActive(s)}var n,r,i;return{init:s,load:o,getData:u,setData:a}}),define("../app/project",["jquery","./EventManager","./util","./config","./user","./hardware","./software","./board"],function(e,t,n,r,i,s,o,u){function c(){e(".project .operation li").on("click",E),t.bind("project","switchPanel",v),t.bind("user","login",m),g()}function h(){var t=function(){var t=!0;n.dialog({selector:".building-dialog",content:"正在编译，请稍候...",onClosing:function(){return!t}});var r=D(),s=r.id;e.ajax({type:"POST",url:"/project/build",dataType:"json",data:{id:s,user_id:i.getUserId()}}).done(function(n){t=!1;if(n.status==0){var r=P(n.id);r.status=2,r.url=n.url}var i=e(".building-dialog");e(".x-dialog-content",i).text(n.message)})};i.authCheck(function(e){e?t():i.showLoginDialog()})}function p(e){var t=function(){var t=D(),r=t.status;!r||r==0?n.message("请先保存"):r==1?n.message("请先编译"):e(t.url)};i.authCheck(function(e){e?t():i.showLoginDialog()})}function d(){var e=function(){var e=D(),t=e.id;t==0?N(!0):C(t)};i.authCheck(function(t){!t&&(l=0),t?e():i.showLoginDialog()})}function v(t){e(".project .list li.current .view > div.active").parent().find("div").eq(t).click()}function m(){var t=_();t.project_data=O(),f=[t],e.ajax({url:"/projects/"+i.getUserId(),dataType:"json"}).done(y)}function g(){i.authCheck(function(t){t?e.ajax({url:"/projects/"+i.getUserId(),dataType:"json"}).done(y):(f=[_()],A(0))})}function y(t){t.status==0?f=t.data.concat(f):f=[_()];var n=e(".project .list ul").empty();for(var r=0;r<f.length;r++){var i=f[r];if(typeof i.project_data=="string")try{i.project_data=JSON.parse(i.project_data)}catch(s){i.project_data={}}i.status===undefined&&(i.status=1),n.append(M(i))}A(-1)}function b(t){var r=e(this).parent();n.toggleActive(r,null,!0)}function w(t){var r=e(this);n.toggleActive(r,"div");var i=r.index(),a=e(".sidebar .bar ul > li"),f=e(".sidebar .tab");if(i==0)a.filter('[data-action="board"],[data-action="component"]').removeClass("hide"),a.filter('[data-action="library"],[data-action="format"]').addClass("hide"),f.filter(".tab-board,.tab-component").removeClass("hide"),f.filter(".tab-library").addClass("hide");else{a.filter('[data-action="board"],[data-action="component"]').addClass("hide"),a.filter('[data-action="library"],[data-action="format"]').removeClass("hide"),f.filter(".tab-board,.tab-component").addClass("hide"),f.filter(".tab-library").removeClass("hide");var l=a.filter('[data-action="project"]');l.hasClass("active")||l.click()}e(".main > .tabs").css({"margin-left":e(".sidebar").width()}),e(".main > .tabs .tab").removeClass("active").eq(i).addClass("active");var c,h,p=e(".project .list > ul > li"),d=r.parent().parent(),v=d.data("project-id");if(p.filter(".current").length==0)c=P(v),h=c.project_data,u.setData(h.board),s.setData(h.hardware),o.setData(h.software);else{c=D();var m=p.filter(".current");m==d?(h=c.project_data,i==0?h.software=o.getData():(h.hardware=s.getData(),o.gen())):(c.project_data=O(),c=P(v),h=c.project_data,u.setData(h.board),s.setData(h.hardware),o.setData(h.software))}p.filter(".current").removeClass("current"),d.addClass("current")}function E(t){var n=e(this),r=n.data("action");switch(r){case"new":S();break;case"edit":x();break;case"delete":T()}}function S(e){i.authCheck(function(e){e?N(!0):i.showLoginDialog()})}function x(e){i.authCheck(function(e){e?N():i.showLoginDialog()})}function T(e){var t=D(),r=t.id;if(r==0){n.message("你的项目尚未保存");return}i.authCheck(function(e){e?n.dialog({selector:".delete-project-dialog",onConfirm:function(){L(r)}}):i.showLoginDialog()})}function N(t){var n=t?_():D(),r=t?"创建项目":"保存项目",i=e(".save-dialog"),s=e("form",i);e('input[name="name"]',s).val(n.project_name),e('textarea[name="intro"]',s).val(n.project_intro),e('input[name="public-type"][value="'+n.public_type+'"]',s).attr("checked",!0),e('input[name="save"]',s).val(r);var o=e(".dialog-layer").addClass("active");e(".close-btn",i).off("click").on("click",function(e){i.slideUp(100),o.removeClass("active")}),e(".save",i).off("click").on("click",function(){C(n.id,!0)}),i.css({top:-i.height()}).show().animate({top:200},400,"swing")}function C(t,r){var s;if(r){var o=e(".save-dialog"),u=e("form",o),a=e('input[name="name"]',u).val();for(var l=0;l<f.length;l++){var c=f[l];if(c.id>0&&c.project_name==a){n.message("项目名重复");return}}s={id:t,project_name:a,user_id:i.getUserId(),project_intro:e('textarea[name="intro"]',u).val(),project_data:JSON.stringify(O()),public_type:e("input[name='public-type']:checked",u).val()},e(".close-btn",o).click()}else s={id:t,user_id:i.getUserId(),project_data:JSON.stringify(O())};n.message("正在保存，请稍候..."),e.ajax({type:"POST",url:"/project/save",data:s,dataType:"json"}).done(function(i){n.message(i.message);if(i.status==0)if(r)e.ajax({url:"project/"+i.data.project_id,dataType:"json"}).done(function(e){k(t,e)});else{var s=P(t);s.status=1}})}function k(t,r){if(r.status!=0){n.message(r.message);return}var i=r.data;i.status=1;if(typeof i.project_data=="string")try{i.project_data=JSON.parse(i.project_data)}catch(s){i.project_data={}}var o=e(".project .list > ul");if(t==0){o.find('> li[data-project-id="0"]').remove();for(var u=0;u<f.length;u++){var a=f[u];if(a.id==0){f.splice(u,1);break}}f.push(i),o.append(M(i)),A(-1)}else{var l=H(i.id);f[l]=i,o.find('> li[data-project-id="'+i.id+'"]').find(".name").text(i.project_name)}}function L(t){e.ajax({type:"POST",url:"/project/delete",data:{id:t,user_id:i.getUserId()},dataType:"json"}).done(function(r){n.message(r.message);if(r.status==0){var i=e('.project .list > ul > li[data-project-id="'+t+'"]').remove();for(var s=0;s<f.length;s++){var o=f[s];if(o.id==t){f.splice(s,1);break}}if(f.length==0){var u=_();f.push(u),e(".project .list > ul").append(M(u)),A(-1)}else{var a=e(".project .list .title");a.eq(a.length-1).click()}}})}function A(t){var n=e(".project .list .title").off("click").on("click",b);e(".project .list .view > div").off("click").on("click",w);if(t==-1){var r=n.eq(n.length-1).click().parent(),i=e(".view > div",r);i.filter(".active").length==0&&i.eq(0).click()}else e('.project .list >  ul > li[data-project-id="'+t+'"] .title').click()}function O(){return{board:u.getData(),hardware:s.getData(),software:o.getData()}}function M(e){return a.replace(/\{\{project_name\}\}/g,e.project_name).replace(/\{\{id\}\}/g,e.id)}function _(){return{id:0,user_id:i.getUserId(),project_name:"我的项目",project_intro:"我的项目简介",public_type:1,project_data:{},status:0}}function D(){var t=e(".project .list li.current").data("project-id");return P(t)}function P(e){for(var t=0;t<f.length;t++){var n=f[t];if(n.id==e)return n}}function H(e){var t=-1;for(var n=0;n<f.length;n++){var r=f[n];if(r.id==e){t=n;break}}return t}var a='<li data-project-id="{{id}}"><div class="title"><span class="name">{{project_name}}</span><i class="iconfont icon-lashenkuangxiangxia"></i></div><div class="view"><div><span class="name">{{project_name}}</span>.uno</div><div><span class="name">{{project_name}}</span>.ino</div></div></li>',f=[],l;return{init:c,isBuild:p,build:h,save:d}}),define("../app/ext/burn-dialog",["jquery","../util"],function(e,t){function f(t,u){if(r)return;n=t,r=!0,s=u,o=window.location.protocol+"//"+window.location.host,i=".burn-dialog";var a;navigator.userAgent.indexOf("WOW64")!=-1||navigator.userAgent.indexOf("Win64")!=-1?a=64:a=32;var f="http://platform.kenrobot.com/download/arduino-driver-x"+a+".zip";e(".arduino-driver-dialog .downloadUrl").attr("href",f),e(".tab-no-serial .driver",i).on("click",d),e(".tab-connect .connect",i).on("click",v),e(".tab-burn .burn",i).on("click",m)}function l(e){a=e,t.dialog({selector:i,onClosing:c,onClose:h}),p()}function c(){}function h(){e(".tab",i).removeClass("active").eq(0).addClass("active"),e(".tab-burn .burn-progress",i).removeClass("active"),e(".tab-connect .port",i).empty(),b({action:"serial.disconnect",connectionId:u}),u=null,a=null,y(!1)}function p(){b("serial.getDevices",function(t){if(t.length==0){w("no-serial"),setTimeout(p,1);return}var n=e(".tab-connect .port",i).empty(),r=0;for(var s=0;s<t.length;s++){var o=t[s];e("<option>").text(o.path).attr("title",o.displayName).appendTo(n),o.displayName&&o.displayName.toLowerCase().indexOf("arduino")>-1&&r++}r==1?e(".tab-connect .connect",i).click():w("connect")})}function d(n){e(".x-dialog-close",i).click(),setTimeout(function(){t.dialog(".arduino-driver-dialog")},400)}function v(t){var n=e(".tab-connect .port",i).val(),r=parseInt(e(".tab-connect .bitRate",i).val());b({action:"serial.connect",portPath:n,bitRate:r},function(e){e?(u=e,w("burn")):(w("connect"),E("连接失败","connect"))})}function m(t){e(".tab-burn .burn",i).addClass("burning").attr("disabled",!0),e(".tab-burn .burn-progress",i).addClass("active"),S(0),E("正在烧写","burn",0),b({action:"upload",url:o+a+"/hex",delay:s.uploadDelay},function(t){y(!1),e(".tab-burn .burn",i).removeClass("burning").attr("disabled",!1),e(".tab-burn .burn-progress",i).removeClass("active"),e(".tab-burn .burn-progress ul li.ins",i).removeClass("ins"),E("烧写"+(t?"成功":"失败"),"burn",0)}),y(!0)}function y(e){clearInterval(g);if(e){var t=function(){b("upload.progress",function(e){S(e)})};g=setInterval(t,s.uploadDelay)}}function b(e,t){e=typeof e=="string"?{action:e}:e,t=t||function(){},n.runtime.sendMessage(s.appId,e,t)}function w(n){t.toggleActive(e(".tab-"+n,i),"div"),n!="connect"&&n=="burn"&&(e(".tab-burn .burn",i).removeClass("burning").attr("disabled",!1),e(".tab-burn .burn-progress",i).removeClass("active"),e(".tab-burn .burn-progress ul li.ins",i).removeClass("ins"),E("准备就绪","burn",0))}function E(t,n,r){var s=e(".tab-"+n+" .message",i).text(t).stop().show();r!=0&&(r=r||2e3,s.delay(r).queue(function(){s.hide(),s.dequeue()}))}function S(t){var n=e(".tab-burn .burn-progress ul li",i),r=n.filter("ins").last().index(),s=Math.floor(t/100*n.length);for(var o=r+1;o<=s;o++)n.eq(o).addClass("ins")}var n,r,i,s,o,u,a,g;return{init:f,show:l}}),define("../app/ext/agent",["../util","./burn-dialog"],function(e,t){function i(e){n=e,r=u()}function s(t){if(!o()||!r){e.message("啃萝卜扩展目前只支持Chrome浏览器，其它浏览器敬请期待！");return}a(function(e){e?t():f()})}function o(){return navigator.userAgent.toLowerCase().indexOf("chrome")>-1}function u(){return o()?window.chrome:null}function a(e){r.runtime.sendMessage(n.appId,"ping",function(t){t&&t.action=="ping"&&t.result=="pong"?e(!0):e(!1)})}function f(){e.dialog(".install-dialog")}function l(e){s(function(){t.init(r,n),t.show(e)})}var n,r;return{init:i,showBurnDialog:l}}),define("../app/sidebar",["jquery","./EventManager","./util","./config","./user","./project","./board","./software","./ext/agent"],function(e,t,n,r,i,s,o,u,a){function f(){e(".sidebar .logo").on("click",l),e(".sidebar .bar ul > li").on("click",c).filter('[data-action="component"]').click()}function l(e){i.authCheck(function(e){e?n.message("你已登录"):i.showLoginDialog(null,1)})}function c(t){var r=e(this),i=r.index(),s=r.data("action");switch(s){case"format":h();break;case"save":p();break;case"build":d();break;case"burn":m();break;case"download":v();break;default:var o=e(".sidebar .tab.tab-"+s);n.toggleActive(r,null,!0);var u=n.toggleActive(o,".tab",!0);e(".main > .tabs").css({"margin-left":e(".sidebar").width()})}}function h(){u.format()}function p(){s.save()}function d(){s.build()}function v(){s.isBuild(function(e){window.location.href=e})}function m(){s.isBuild(function(e){a.showBurnDialog(e)})}return{init:f}}),define("../app/component",["jquery","jquery-ui","bootstrap-typeahead","./EventManager","./util","./hardware"],function(e,t,t,n,r,i){function a(){u=e(".component .items .list > li").on("click",c).draggable({disabled:!0,appendTo:".drag-layer",scope:"hardware",revert:!0,revertDuration:0,zIndex:9999,containment:"window",helper:h}),n.bind("hardware","changeInteractiveMode",l)}function f(e){o=e,p()}function l(e){u.draggable("option","disabled",e!="drag")}function c(t){var n=e(this);r.toggleActive(n),i.setPlaceComponent(n.data("component-name"))}function h(t){var n=e(this).data("component-name"),r=o[n];return e(".image",this).clone().css({width:r.width,height:r.height}).data("component-name",n)}function p(){var t=[];for(var n in o)t.push(o[n]);e(".search .key").typeahead({source:t,displayText:function(e){return typeof e!="undefined"&&typeof e.label!="undefined"&&e.label||e},updater:function(t){return e('.component .items .list > li[data-component-name="'+t.name+'"').click(),t}})}var s,o,u;return{init:a,load:f}}),define("../app/library",["jquery","./software"],function(e,t){function r(){e(".library .list > li").on("click",s)}function i(e){n=e}function s(r){var i=e(this),s=i.data("library"),o=n[s];if(!o)return;t.addLibrary(o),t.gen()}var n;return{init:r,load:i}}),define("../app/guide",["jquery","./config","./util"],function(e,t,n){function i(){r=t.guide;var n=e(".guide-layer");r.showIfFirstVisit?(n.on("click",s).show(),s()):n.remove()}function s(){var t=e(".guide-step"),r=t.filter(".active").index();if(r+1<t.length){r+=1;var i=t.eq(r);n.toggleActive(i,"div"),r+1==t.length&&i.css({left:(e(window).width()-i.width())/2})}else e(".guide-layer").remove()}var r;return{init:i}}),define("../app/app-index",["jquery","./config","./hardware","./user","./project","./software","./sidebar","./board","./component","./library","./ext/agent","./guide"],function(e,t,n,r,i,s,o,u,a,f,l,c){function h(){d(),p(),r.init(),o.init(),u.init(),a.init(),f.init(),n.init(),s.init(n.getNodes),l.init(t.extension),c.init(),e.ajax({url:"/config",dataType:"json"}).done(v)}function p(){e.ajaxSetup({headers:{"X-CSRF-TOKEN":e('meta[name="csrf-token"]').attr("content")}})}function d(){if(t.needPV){var e=document.createElement("script");e.src="//hm.baidu.com/hm.js?6518098de0bee39bef219952dbbae669";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)}}function v(e){u.load(e.boards),a.load(e.components),f.load(e.libraries),n.load(e),i.init()}return{init:h}});