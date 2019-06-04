"use strict";function t(t){return t&&"object"==typeof t&&"default"in t?t.default:t}var e=t(require("react")),n=t(require("js-sha1")),o=function(){this.conf={components:{},introComponents:[]},this.errors=[]};o.prototype.title=function(t){return this.conf.components[t].title},o.prototype.get=function(){return this.conf},o.prototype.parseNewLogic=function(t){var e=[],n=function(){for(var t=[],n=arguments.length;n--;)t[n]=arguments[n];e.push(t.join(" ")),console.log.apply(console,["logic parse warning:"].concat(t))},o={components:{},introComponents:[]};return t.components&&(Array.isArray(t.components)?(t.components.map(function(t,e){if(t.name&&t.title){var i=[],a={name:t.name,title:t.title,next:t.next?Array.isArray(t.next)?t.next:[t.next]:[],tooltip:t.tooltip,inputs:[],advancedInputs:[]};Array.isArray(t.inputs)&&t.inputs.map(function(t,o){if(t.title&&t.name&&t.type)if("function"==typeof t.validation||void 0===t.validation)if("string"==typeof t.tooltip||void 0===t.tooltip)if(-1==i.indexOf(t.name)){var r={name:t.name,title:t.title,type:t.type,validation:t.validation,tooltip:t.tooltip,default:t.default};switch(t.type){case"text":"string"!=typeof t.default&&void 0!==t.default&&(n("logic.components["+e+"].inputs["+o+"].default must be a string or undefined, using default empty string"),r.default=""),null==t.default&&(r.default="");break;case"number":"number"!=typeof t.default&&void 0!==t.default&&(n("logic.components["+e+"].inputs["+o+"].default must be a number or undefined, using default 0"),r.default=0),null==t.default&&(r.default=0);break;case"switch":"boolean"!=typeof t.default&&void 0!==t.default&&(n("logic.components["+e+"].inputs["+o+"].default must be a boolean or undefined, using default empty string"),r.default=!1),null==t.default&&(r.default=!1);break;case"dropdown":if(!Array.isArray(t.options))return void n("logic.components["+e+"].inputs["+o+"].options is not defined or is not an array, skipping this item");r.options=t.options.map(function(t,i){if("string"==typeof t.title&&"string"==typeof t.value&&("string"==typeof t.tooltip||null==t.tooltip))return{title:t.title,tooltip:t.tooltip,value:t.value};n("logic.components["+e+"].inputs["+o+"].options["+i+"] does not have the correct items (title string, value string, tooltip string), skipping this item")}).filter(function(t){return t});break;default:return void n("logic.components["+e+"].inputs["+o+"].type = '"+t.type+"' is not valid, this input will be ignored")}i.push(t.name),a[t.advanced?"advancedInputs":"inputs"].push(r)}else n("logic.components["+e+"].inputs["+o+"].name can't be equal to other names");else n("logic.components["+e+"].inputs["+o+"].tooltip must be a string or not undefined");else n("logic.components["+e+"].inputs["+o+"].validation must be undefined or a function");else n("logic.components["+e+"].inputs["+o+"] does not have a name, type or title field, this input will be ignored")}),o.components[t.name]=a}else n("logic.components["+e+"] does not have a name or title field, this component will be ignored")}),Object.keys(o.components).map(function(t){o.components[t].next=o.components[t].next.filter(function(t){return!!o.components[t]||(n("logic.component[???].next contains '"+t+"' that does not exsist, this item will be ignored"),!1)})})):n("logic.components is not an array")),t.introComponents&&(Array.isArray(t.introComponents)?t.introComponents.map(function(t){o.components[t]?o.introComponents.push(t):n("logic.introComponents['"+t+"'] is not a known component")}):"string"==typeof t.introComponents?o.components[t.introComponents]?o.introComponents.push(t.introComponents):n("logic.introComponents = '"+name+"' is not a known component"):n("logic.introComponents is not an array or string")),this.errors=e,this.conf=o,o};var i=function(t,e){this.Logic=t,this.FlowMaker=e,this.maxDepth=0,this.flow=[],this.exportBuzzy=!1,this.reExport=!1,this.exportFunc=void 0};i.prototype.setExportFunc=function(t){this.exportFunc=t},i.prototype.caclMaxDepth=function(){var t=this;this.maxDepth=0;var e=function(n){n.map(function(n){n.depth>t.maxDepth&&(t.maxDepth=n.depth),e(n.next)})};e(this.flow),this.FlowMaker.forceUpdate()},i.prototype.flowItem=function(t,e,n){var o=function(t){for(var e="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",o=0;o<20;o++)e+=n.charAt(Math.floor(Math.random()*n.length));return e}();return{depth:n+1,next:[],id:o,path:e.concat([o]),inputData:{},inputValidation:{},component:t}},i.prototype.startFlow=function(t){var e=this.Logic.conf.components[t];e&&(this.flow.push(this.flowItem(e,[],0)),this.caclMaxDepth(),this.export())},i.prototype.addComponent=function(t,e){var n=this.Logic.conf.components[t];if(n){var o=this.findPath(e);o.next.push(this.flowItem(n,o.path,o.depth)),this.caclMaxDepth(),this.export()}},i.prototype.findPath=function(t){var e=void 0,n=function(o){for(var i=0;i<o.length;i++){if(o[i].path===t){e=o[i];break}n(o[i].next)}};return n(this.flow),e},i.prototype.removeComponent=function(t){var e=function(n){n=Object.assign([],n);for(var o=0;o<n.length;o++){if(n[o].path===t){n.splice(o,1);break}n[o].next=e(n[o].next)}return n};this.flow=e(this.flow),this.caclMaxDepth(),this.export()},i.prototype.export=function(){var t=this;this.exportBuzzy?this.reExport=!0:(this.exportBuzzy=!0,setTimeout(function(){if(t.reExport)return t.exportBuzzy=!1,t.reExport=!1,void t.export();var e=[],n=function(t,e){e.map(function(e){var o={},i={};Object.keys(e.inputData).map(function(t){o[t]=e.inputData[t].value,e.inputData[t].error&&(i[t]=e.inputData[t].error)}),t.push({component:{title:e.component.title,name:e.component.name},inputs:o,inputErrors:i,id:e.id,next:[]}),n(t[t.length-1].next,e.next)})};n(e,t.flow),"function"==typeof t.exportFunc&&t.exportFunc(e),setTimeout(function(){t.exportBuzzy=!1,t.reExport&&(t.reExport=!1,t.export())},30)},50))},i.prototype.import=function(t){var e=this;if(Array.isArray(t)){var n=[],o=function(t,n,i){t.map(function(t){var a=e.flowItem(e.Logic.conf.components[t.component.name],i,i.length);a.id=t.id,a.inputData=Object.keys(t.inputs).reduce(function(e,n){return e[n]={value:t.inputs[n],error:""},e},{}),a.path.splice(-1,1),a.path.push(t.id),n.push(a),o(t.next,n[n.length-1].next,i.concat([t.id]))})};o(t,n,[]),this.flow=n,this.caclMaxDepth()}},i.prototype.updateInputValue=function(t,e,n,o){var i=this.findPath(t);i&&(o?i.component.advancedInputs&&i.component.advancedInputs[n]&&(i.inputData[i.component.advancedInputs[n].name]=e):i.component.inputs&&i.component.inputs[n]&&(i.inputData[i.component.inputs[n].name]=e)),this.export()};var a=function(){return e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},e.createElement("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}),e.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))},r=function(){return e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},e.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}),e.createElement("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z"}))},s=function(){return e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},e.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}),e.createElement("path",{d:"M8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71z"}))},p=function(){return e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},e.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}),e.createElement("path",{d:"M8.71 12.29L11.3 9.7c.39-.39 1.02-.39 1.41 0l2.59 2.59c.63.63.18 1.71-.71 1.71H9.41c-.89 0-1.33-1.08-.7-1.71z"}))},l=function(){return e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24"},e.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}),e.createElement("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"}))},c=function(){return e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},e.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}),e.createElement("path",{d:"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"}))},u=function(){return e.createElement("svg",{className:"flow-alertIcon",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},e.createElement("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"}),e.createElement("line",{x1:"12",y1:"9",x2:"12",y2:"13"}),e.createElement("line",{x1:"12",y1:"17",x2:"12",y2:"17"}))},h=function(t){function n(){t.call(this),this.state={open:!1}}return t&&(n.__proto__=t),(n.prototype=Object.create(t&&t.prototype)).constructor=n,n.prototype.clickRoundButton=function(){this.setState({open:!this.state.open})},n.prototype.clickOption=function(t){this.props.out(t),this.setState({open:!1})},n.prototype.render=function(){var t=this,n=this.props,o=this.state;return e.createElement("div",{className:"flow-addIcon"},e.createElement("div",{className:"flow-round "+(o.open?"flow-open":"flow-closed"),onClick:function(){return t.clickRoundButton()}},e.createElement(a,null)),e.createElement("div",{className:"flow-options "+(o.open?"flow-open":"flow-closed")},n.options?n.options.map(function(n,o){return e.createElement("div",{onClick:function(){return t.clickOption(n)},key:o,className:"flow-option"},t.props?t.props.Logic.title(n):n)}):""))},n}(e.Component),d=function(t){function n(){t.apply(this,arguments)}return t&&(n.__proto__=t),(n.prototype=Object.create(t&&t.prototype)).constructor=n,n.prototype.render=function(){return this.props.tip?e.createElement("div",{className:"flow-tooltip flow-transparrent"+(this.props.transparrent?"True":"False")},e.createElement("div",{className:"flow-icon"},e.createElement(l,null)),e.createElement("div",{className:"flow-noWidth"},e.createElement("div",{className:"flow-fullwidth"},e.createElement("div",{className:"flow-popup"},this.props.tip)))):""},n}(e.Component),m=function(t){function n(){t.call(this),this.refID="",this.state={value:"",error:"",dropDownSelected:-1,isAfterInit:!1,dropDownopen:!1}}return t&&(n.__proto__=t),(n.prototype=Object.create(t&&t.prototype)).constructor=n,n.prototype.tellParent=function(){this.props.onChange&&this.props.onChange({error:this.state.error,value:this.state.value})},n.prototype.updateDefaultVal=function(){var t=this;if(this.props.input&&!this.state.isAfterInit||this.refID!=this.props.refID){this.refID=this.props.refID;var e=void 0!==this.props.initalVal?this.props.initalVal:this.props.input.default;this.setState({value:e,isAfterInit:!0},function(){t.validate(e,function(){if("dropdown"==t.props.input.type&&-1==t.state.dropDownSelected){var n=0;t.props.input.options.map(function(t,o){t.value==e&&(n=o)}),t.setState({dropDownSelected:n})}t.tellParent()})})}},n.prototype.validate=function(t,e){if("function"==typeof this.props.input.validation){var n=this.props.input.validation(void 0,t);"string"!=typeof n&&(n=""),this.setState({error:n},e)}"function"==typeof e&&e()},n.prototype.updateValue=function(t){var e=this;this.setState({value:t},function(){e.validate(t,function(){e.tellParent()})})},n.prototype.componentDidMount=function(){this.updateDefaultVal()},n.prototype.componentDidUpdate=function(){this.updateDefaultVal(),this.props.hiddenDropdown&&this.state.dropDownopen&&this.setState({dropDownopen:!1})},n.prototype.render=function(){var t,n=this,o=this.state.error,i=this.props.input;if(!i)return e.createElement("div",{className:"flow-input"});var a=function(){return e.createElement("div",{className:"flow-label",onClick:function(){return t?t.focus():"switch"==i.type?n.updateValue(!n.state.value):""}},e.createElement("span",null,i.title),e.createElement(d,{transparrent:!0,tip:i.tooltip}))};return e.createElement("div",{className:"flow-input flow-input-type-"+i.type+" flow-hasErr"+(o?"True":"False")},"switch"!=i.type?e.createElement(a,null):"",e.createElement("div",{className:"flow-actualInput"},"text"==i.type||"number"==i.type?e.createElement("div",{className:"flow-text"},e.createElement("input",{ref:function(e){return t=e},type:i.type,value:this.state.value,onChange:function(t){return n.updateValue(t.target.value)}})):"switch"==i.type?e.createElement("div",{className:"flow-switch"},e.createElement("div",{onClick:function(){return n.updateValue(!n.state.value)},className:"flow-actualSwitch "+(this.state.value?"flow-true":"flow-false")},e.createElement("div",{className:"flow-inside"},e.createElement(c,null)))):"dropdown"==i.type?e.createElement("div",{className:"flow-dropdown"},e.createElement("div",{className:"flow-select",onClick:function(){return n.setState({dropDownopen:!n.state.dropDownopen})}},e.createElement("div",{className:"flow-optTitle"},-1!=this.state.dropDownSelected&&i.options&&0!=i.options.length?i.options[this.state.dropDownSelected].title:"..."),e.createElement("div",{className:"flow-icon"},i.options&&0!=i.options.length?e.createElement(s,null):"")),e.createElement("div",{className:"flow-options flow-open"+(this.state.dropDownopen?"True":"False")},i.options.map(function(t,o){return e.createElement("div",{key:o,className:"flow-option",onClick:function(){n.updateValue(t.value),n.setState({dropDownSelected:o,dropDownopen:!1})}},e.createElement("div",{className:"flow-optTitle"},t.title),e.createElement(d,{tip:t.tooltip}))}))):""),"switch"==i.type?e.createElement(a,null):"",o?e.createElement("div",{className:"flow-error"},o):"")},n}(e.Component),f=function(t){function n(){t.call(this),this.state={hover:!1,showAddOptions:!1,showAdvanced:!1},this.remove=this.remove.bind(this)}return t&&(n.__proto__=t),(n.prototype=Object.create(t&&t.prototype)).constructor=n,n.prototype.remove=function(){this.props.graphInstance.props.Tree.removeComponent(this.props.graphInstance.props.data.path)},n.prototype.add=function(){1!=this.props.graphInstance.props.data.component.next.length?this.setState({showAddOptions:!0}):this.realAdd(this.props.graphInstance.props.data.component.next[0])},n.prototype.realAdd=function(t){this.setState({showAddOptions:!1}),t&&this.props.graphInstance.props.Tree.addComponent(t,this.props.graphInstance.props.data.path)},n.prototype.render=function(){var t=this,n=this.props.graphInstance.props.data;if(!n)return"";var o,i=n.component,l=i.inputs,c=i.advancedInputs;return e.createElement("div",{className:"flow-fullBlock flow-hover"+(this.state.hover&&!this.state.showAddOptions?"True":"False"),onMouseOver:function(){t.state.hover||t.setState({hover:!0})},onMouseOut:function(){t.state.hover&&t.setState({hover:!1})}},e.createElement("div",{className:"flow-side"},e.createElement("div",{className:"flow-innerSide"},e.createElement("div",{className:"flow-round",onClick:this.remove},e.createElement(r,null)))),e.createElement("div",{className:"flow-middle"},e.createElement("div",{className:"flow-title"},i.title,e.createElement(d,{transparrent:!0,tip:i.tooltip})),e.createElement("div",{className:"flow-inputs"},l.map(function(o,i){var a=n.inputData[o.name];return e.createElement(m,{refID:n.id,key:i,input:o,initalVal:a?a.value:void 0,onChange:function(e){t.props.graphInstance.props.Tree.updateInputValue(n.path,e,i,!1)}})}),c.length>0?(o=c.filter(function(t){return!0!==(!n.inputData[t.name]||!t.validation||t.validation(void 0,n.inputData[t.name].value))}).length>0&&!t.state.showAdvanced,e.createElement("div",{className:"flow-showAdvanced"},e.createElement("div",{className:"flow-button error"+(o?"True":"False"),onClick:function(){t.setState({showAdvanced:!t.state.showAdvanced},function(){t.props.graphParrentInstance?t.props.graphParrentInstance.forceUpdate():t.props.graphInstance&&t.props.graphInstance.forceUpdate()})}},o?e.createElement(u,null):"","Advanced ",e.createElement(t.state.showAdvanced?p:s,null)))):""),e.createElement("div",{className:"flow-inputs flow-advancedInputs flow-show"+(this.state.showAdvanced?"True":"False")},c.map(function(o,i){var a=n.inputData[o.name];return e.createElement(m,{hiddenDropdown:!t.state.showAdvanced,key:i,input:o,initalVal:a?a.value:void 0,onChange:function(e){t.props.graphInstance.props.Tree.updateInputValue(n.path,e,i,!0)}})}))),i.next.length>0?e.createElement("div",{className:"flow-nextOptions flow-show"+(this.state.showAddOptions?"True":"False")},e.createElement("div",{className:"flow-closePopup",onClick:function(){return t.realAdd()}},e.createElement(a,null)),e.createElement("div",{className:"flow-pos"},e.createElement("div",{className:"flow-optionsTitle"},"Options"),i.next.map(function(n,o){return e.createElement("div",{onClick:function(){return t.realAdd({componentName:n})},className:"flow-option",key:o},t.props?t.props.graphInstance.props.Logic.title(n):n)}))):"",i.next.length>0?e.createElement("div",{className:"flow-side"},e.createElement("div",{className:"flow-innerSide"},e.createElement("div",{className:"flow-round",onClick:function(){return t.add()}},e.createElement(a,null)))):"")},n}(e.Component),v=function(t){function n(){t.call(this),this.state={element:void 0,lastParentPosition:0},this.mounted=!1}return t&&(n.__proto__=t),(n.prototype=Object.create(t&&t.prototype)).constructor=n,n.prototype.componentDidMount=function(){this.mounted=!0,this.watchParent()},n.prototype.componentWillUnmount=function(){this.mounted=!1},n.prototype.watchParent=function(){var t=this;if(this.mounted){var e=this.props.connectTo,n=void 0;e&&(n=e.getBoundingClientRect()).top!=this.state.lastParentPosition&&this.setState({lastParentPosition:n.top}),setTimeout(function(){t.watchParent()},800)}},n.prototype.render=function(){var t=this,n=0,o=0,i="";if(this.props.connectTo&&this.state.element){var a=this.props.connectTo.getBoundingClientRect(),r=this.state.element.getBoundingClientRect(),s=a.y+a.height/2-(r.y+r.height/2);0==s?(n=20,o=10,i="straight"):s<0?(o=(n=20-s)-10,i="bottomToTop"):(n=s+20,o=10,i="topToBottom")}return e.createElement("div",{className:"flow-graphPart",style:{width:this.props.width}},n&&o&&i?e.createElement("div",{className:"flow-lineToParrent",style:{bottom:o+"px"}},e.createElement("svg",{viewBox:"0 0 80 "+n,height:n+"px",style:{minHeight:n+"px"},xmlns:"http://www.w3.org/2000/svg"},e.createElement("path","bottomToTop"==i?{strokeWidth:"7",stroke:"#ccc",strokeLinecap:"round",fill:"none",d:"M0,10 C70,10 30,"+(n-10)+" 80,"+(n-10)}:"topToBottom"==i?{strokeWidth:"7",stroke:"#ccc",strokeLinecap:"round",fill:"none",d:"M0,"+(n-10)+" C70,"+(n-10)+" 30,10 80,10"}:{strokeWidth:"7",stroke:"#ccc",strokeLinecap:"round",fill:"none",d:"M0,10 C70,10 30,10 80,10"}))):"",e.createElement("div",{ref:function(e){var n=t.props.connectTo,o=void 0;if(n&&(o=n.getBoundingClientRect()),"object"!=typeof t.state.element||o&&o.top!=t.state.lastParentPosition){var i={element:e};o&&(i.lastParentPosition=o.top),t.setState(i)}},className:"flow-graph",style:{minWidth:this.props.itemWidth}},e.createElement(f,{graphInstance:this,graphParrentInstance:this.props.connectToInstance})),e.createElement("div",{className:"flow-next"},this.props.data.next.map(function(n,o){return e.createElement(v,{Tree:t.props.Tree,Logic:t.props.Logic,connectTo:t.state.element,connectToInstance:t,width:t.props.width-t.props.itemWidth,itemWidth:t.props.itemWidth,key:o,data:n})})))},n}(e.Component);module.exports=function(t){function a(){t.call(this),this.Logic=new o,this.Tree=new i(this.Logic,this),this.lastlogicHash="",this.state={settings:this.Logic.get()}}return t&&(a.__proto__=t),(a.prototype=Object.create(t&&t.prototype)).constructor=a,a.prototype.componentDidMount=function(){var t=this,e=n(this.props.logic);e!=this.lastlogicHash?(this.lastlogicHash=e,this.setState({settings:this.Logic.parseNewLogic(this.props.logic)},function(){return t.afterMount()})):this.afterMount()},a.prototype.afterMount=function(){"function"==typeof this.props.onChange&&this.Tree.setExportFunc(this.props.onChange),"object"==typeof this.props.flow&&this.Tree.import(this.props.flow)},a.prototype.render=function(){var t=this,n=this.state.settings;return e.createElement("div",{className:"flowMakerComp"},e.createElement("div",{className:"flowMakerContainer",style:{minWidth:250+380*this.Tree.maxDepth+"px"}},e.createElement("div",{className:"flow-row",style:{minWidth:"250px"}},n.introComponents.length>0?e.createElement("div",{className:"flow-startPoint"},e.createElement("h3",null,"Start here"),e.createElement(h,{Tree:this.Tree,Logic:this.Logic,options:n.introComponents,out:function(e){return t.Tree.startFlow(e)}})):""),e.createElement("div",{className:"flow-actualGraph",style:{width:380*this.Tree.maxDepth+"px"}},this.Tree.flow.map(function(n,o){return e.createElement(v,{Tree:t.Tree,Logic:t.Logic,width:380*t.Tree.maxDepth,itemWidth:380,key:o,data:n})}))))},a}(e.Component);
//# sourceMappingURL=flowmaker.js.map
