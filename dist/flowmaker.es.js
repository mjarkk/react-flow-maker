import e,{useState as t,useEffect as n}from"react";import o from"js-sha1";class a{constructor(){this.conf={components:{},introComponents:[]},this.errors=[]}title(e){return this.conf.components[e].title}get(){return this.conf}parseNewLogic(e){const t=[],n=(...e)=>{t.push(e.join(" ")),console.log("logic parse warning:",...e)};let o={components:{},introComponents:[]};return e.components&&(Array.isArray(e.components)?(e.components.map(((e,t)=>{if(!e.name||!e.title)return void n(`logic.components[${t}] does not have a name or title field, this component will be ignored`);const a=[];let i={name:e.name,title:e.title,next:e.next?Array.isArray(e.next)?e.next:[e.next]:[],tooltip:e.tooltip,inputs:[],advancedInputs:[]};Array.isArray(e.inputs)&&e.inputs.map(((e,o)=>{if(!e.title||!e.name||!e.type)return void n(`logic.components[${t}].inputs[${o}] does not have a name, type or title field, this input will be ignored`);if("function"!=typeof e.validation&&void 0!==e.validation)return void n(`logic.components[${t}].inputs[${o}].validation must be undefined or a function`);if("string"!=typeof e.tooltip&&void 0!==e.tooltip)return void n(`logic.components[${t}].inputs[${o}].tooltip must be a string or not undefined`);if(-1!=a.indexOf(e.name))return void n(`logic.components[${t}].inputs[${o}].name can't be equal to other names`);let l={name:e.name,title:e.title,type:e.type,validation:e.validation,tooltip:e.tooltip,default:e.default};switch(e.type){case"text":"string"!=typeof e.default&&void 0!==e.default&&(n(`logic.components[${t}].inputs[${o}].default must be a string or undefined, using default empty string`),l.default=""),null==e.default&&(l.default="");break;case"number":"number"!=typeof e.default&&void 0!==e.default&&(n(`logic.components[${t}].inputs[${o}].default must be a number or undefined, using default 0`),l.default=0),null==e.default&&(l.default=0);break;case"switch":"boolean"!=typeof e.default&&void 0!==e.default&&(n(`logic.components[${t}].inputs[${o}].default must be a boolean or undefined, using default empty string`),l.default=!1),null==e.default&&(l.default=!1);break;case"dropdown":if(!Array.isArray(e.options))return void n(`logic.components[${t}].inputs[${o}].options is not defined or is not an array, skipping this item`);l.options=e.options.map(((e,a)=>{if("string"==typeof e.title&&"string"==typeof e.value&&("string"==typeof e.tooltip||null==e.tooltip))return{title:e.title,tooltip:e.tooltip,value:e.value};n(`logic.components[${t}].inputs[${o}].options[${a}] does not have the correct items (title string, value string, tooltip string), skipping this item`)})).filter((e=>e));break;default:return void n(`logic.components[${t}].inputs[${o}].type = '${e.type}' is not valid, this input will be ignored`)}a.push(e.name),i[e.advanced?"advancedInputs":"inputs"].push(l)})),o.components[e.name]=i})),Object.keys(o.components).map((e=>{o.components[e].next=o.components[e].next.filter((e=>!!o.components[e]||(n(`logic.component[???].next contains '${e}' that does not exsist, this item will be ignored`),!1)))}))):n("logic.components is not an array")),e.introComponents&&(Array.isArray(e.introComponents)?e.introComponents.map((e=>{o.components[e]?o.introComponents.push(e):n(`logic.introComponents['${e}'] is not a known component`)})):"string"==typeof e.introComponents?o.components[e.introComponents]?o.introComponents.push(e.introComponents):n(`logic.introComponents = '${name}' is not a known component`):n("logic.introComponents is not an array or string")),this.errors=t,this.conf=o,o}}var i={RandomString(e){let t="";const n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let o=0;o<e;o++)t+=n.charAt(Math.floor(Math.random()*n.length));return t}};class l{constructor(e,t){this.Logic=e,this.forceUpdate=t,this.maxDepth=0,this.flow=[],this.exportBuzzy=!1,this.reExport=!1,this.exportFunc=void 0}setExportFunc(e){this.exportFunc=e}caclMaxDepth(){const e=this;this.maxDepth=0;const t=n=>{n.map((n=>{n.depth>e.maxDepth&&(e.maxDepth=n.depth),t(n.next)}))};t(this.flow),this.forceUpdate()}flowItem(e,t,n){const o=i.RandomString(20);return{depth:n+1,next:[],id:o,path:[...t,o],inputData:{},inputValidation:{},component:e}}startFlow(e){let t=this.Logic.conf.components[e];t&&(this.flow.push(this.flowItem(t,[],0)),this.caclMaxDepth(),this.export())}addComponent(e,t){let n=this.Logic.conf.components[e];if(!n)return;let o=this.findPath(t);o.next.push(this.flowItem(n,o.path,o.depth)),this.caclMaxDepth(),this.export()}findPath(e){let t;const n=o=>{for(let a=0;a<o.length;a++){if(o[a].path===e){t=o[a];break}n(o[a].next)}};return n(this.flow),t}removeComponent(e){const t=n=>{n=Object.assign([],n);for(let o=0;o<n.length;o++){if(n[o].path===e){n.splice(o,1);break}n[o].next=t(n[o].next)}return n};this.flow=t(this.flow),this.caclMaxDepth(),this.export()}export(){this.exportBuzzy?this.reExport=!0:(this.exportBuzzy=!0,setTimeout((()=>{if(this.reExport)return this.exportBuzzy=!1,this.reExport=!1,void this.export();let e=[];const t=(e,n)=>{n.map((n=>{let o={},a={};Object.keys(n.inputData).map((e=>{o[e]=n.inputData[e].value,n.inputData[e].error&&(a[e]=n.inputData[e].error)})),n.component.name,e.push({component:{title:n.component.title,name:n.component.name},inputs:o,inputErrors:a,id:n.id,next:[]}),t(e[e.length-1].next,n.next)}))};t(e,this.flow),"function"==typeof this.exportFunc&&this.exportFunc(e),setTimeout((()=>{this.exportBuzzy=!1,this.reExport&&(this.reExport=!1,this.export())}),30)}),50))}import(e){if(!Array.isArray(e))return;let t=[];const n=(e,t,o)=>{e.map((e=>{let a=this.flowItem(this.Logic.conf.components[e.component.name],o,o.length);a.id=e.id,a.inputData=Object.keys(e.inputs).reduce(((t,n)=>(t[n]={value:e.inputs[n],error:""},t)),{}),a.path.splice(-1,1),a.path.push(e.id),t.push(a),n(e.next,t[t.length-1].next,[...o,e.id])}))};n(e,t,[]),this.flow=t,this.caclMaxDepth()}updateInputValue(e,t,n,o){let a=this.findPath(e);if(a)if(o){if(a.component.advancedInputs&&a.component.advancedInputs[n]){const e=a.component.advancedInputs[n];a.inputData[e.name]=t}}else if(a.component.inputs&&a.component.inputs[n]){const e=a.component.inputs[n];a.inputData[e.name]=t}this.export()}}const s=()=>e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},e.createElement("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}),e.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),r=()=>e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},e.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}),e.createElement("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z"})),c=()=>e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},e.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}),e.createElement("path",{d:"M8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71z"})),p=()=>e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},e.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}),e.createElement("path",{d:"M8.71 12.29L11.3 9.7c.39-.39 1.02-.39 1.41 0l2.59 2.59c.63.63.18 1.71-.71 1.71H9.41c-.89 0-1.33-1.08-.7-1.71z"})),m=()=>e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24"},e.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}),e.createElement("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"})),d=()=>e.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},e.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}),e.createElement("path",{d:"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"})),u=()=>e.createElement("svg",{className:"flow-alertIcon",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},e.createElement("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"}),e.createElement("line",{x1:"12",y1:"9",x2:"12",y2:"13"}),e.createElement("line",{x1:"12",y1:"17",x2:"12",y2:"17"}));function h({options:n,Logic:o,out:a}){const[i,l]=t(!1);return e.createElement("div",{className:"flow-addIcon"},e.createElement("div",{className:"flow-round "+(i?"flow-open":"flow-closed"),onClick:()=>l((e=>!e))},e.createElement(s,null)),e.createElement("div",{className:"flow-options "+(i?"flow-open":"flow-closed")},n?n.map(((t,n)=>e.createElement("div",{onClick:()=>function(e){a(e),l(!1)}(t),key:n,className:"flow-option"},o?o.title(t):t))):""))}function f({tip:t,transparrent:n}){return t?e.createElement("div",{className:"flow-tooltip flow-transparrent"+(n?"True":"False")},e.createElement("div",{className:"flow-icon"},e.createElement(m,null)),e.createElement("div",{className:"flow-noWidth"},e.createElement("div",{className:"flow-fullwidth"},e.createElement("div",{className:"flow-popup"},t)))):""}class w{constructor(){this.val=""}}function v({onChange:o,hiddenDropdown:a,input:i,refID:l,initalVal:s}){let[r]=t(new w),[p,m]=t({value:"",error:"",dropDownSelected:-1,isAfterInit:!1,dropDownopen:!1});function u(){o&&o({error:p.error,value:p.value})}function h(e,t){if("function"==typeof i.validation){let n=i.validation(void 0,e);"string"!=typeof n&&(n=""),m({error:n},t)}"function"==typeof t&&t()}function v(){if(i&&!p.isAfterInit||r.val!=l){r.val=l;const e=void 0!==s?s:i.default;m({value:e,isAfterInit:!0},(()=>{h(e,(()=>{if("dropdown"==i.type&&-1==p.dropDownSelected){let t=0;i.options.map(((n,o)=>{n.value==e&&(t=o)})),m({dropDownSelected:t})}u()}))}))}}function g(e){m({value:e},(()=>{h(e,(()=>{u()}))}))}n((()=>v()),[]),n((()=>{v(),a&&p.dropDownopen&&m({dropDownopen:!1})}),[a]);const E=p.error;let x;if(!i)return e.createElement("div",{className:"flow-input"});const y=()=>e.createElement("div",{className:"flow-label",onClick:()=>x?x.focus():"switch"==i.type?g(!p.value):""},e.createElement("span",null,i.title),e.createElement(f,{transparrent:!0,tip:i.tooltip}));return e.createElement("div",{className:`flow-input flow-input-type-${i.type} flow-hasErr${E?"True":"False"}`},"switch"!=i.type?e.createElement(y,null):"",e.createElement("div",{className:"flow-actualInput"},"text"==i.type||"number"==i.type?e.createElement("div",{className:"flow-text"},e.createElement("input",{ref:e=>x=e,type:i.type,value:p.value,onChange:e=>g(e.target.value)})):"switch"==i.type?e.createElement("div",{className:"flow-switch"},e.createElement("div",{onClick:()=>g(!p.value),className:"flow-actualSwitch "+(p.value?"flow-true":"flow-false")},e.createElement("div",{className:"flow-inside"},e.createElement(d,null)))):"dropdown"==i.type?e.createElement("div",{className:"flow-dropdown"},e.createElement("div",{className:"flow-select",onClick:()=>m({dropDownopen:!p.dropDownopen})},e.createElement("div",{className:"flow-optTitle"},-1!=p.dropDownSelected&&i.options&&0!=i.options.length?i.options[p.dropDownSelected].title:"..."),e.createElement("div",{className:"flow-icon"},i.options&&0!=i.options.length?e.createElement(c,null):"")),e.createElement("div",{className:"flow-options flow-open"+(p.dropDownopen?"True":"False")},i.options.map(((t,n)=>e.createElement("div",{key:n,className:"flow-option",onClick:()=>{g(t.value),m({dropDownSelected:n,dropDownopen:!1})}},e.createElement("div",{className:"flow-optTitle"},t.title),e.createElement(f,{tip:t.tooltip})))))):""),"switch"==i.type?e.createElement(y,null):"",E?e.createElement("div",{className:"flow-error"},E):"")}function g({Tree:n,Logic:o,data:a,graphInstanceForceUpdate:i,graphParrentInstance:l}){let[m,d]=t({hover:!1,showAddOptions:!1,showAdvanced:!1});function h(e){d({showAddOptions:!1}),e&&n.addComponent(e,a.path)}if(!a)return"";const w=a.component,g=w.inputs,E=w.advancedInputs;return e.createElement("div",{className:"flow-fullBlock flow-hover"+(m.hover&&!m.showAddOptions?"True":"False"),onMouseOver:()=>{m.hover||d({hover:!0})},onMouseOut:()=>{m.hover&&d({hover:!1})}},e.createElement("div",{className:"flow-side"},e.createElement("div",{className:"flow-innerSide"},e.createElement("div",{className:"flow-round",onClick:function(){n.removeComponent(a.path)}},e.createElement(r,null)))),e.createElement("div",{className:"flow-middle"},e.createElement("div",{className:"flow-title"},w.title,e.createElement(f,{transparrent:!0,tip:w.tooltip})),e.createElement("div",{className:"flow-inputs"},g.map(((t,o)=>{const i=a.inputData[t.name];return e.createElement(v,{refID:a.id,key:o,input:t,initalVal:i?i.value:void 0,onChange:e=>n.updateInputValue(a.path,e,o,!1)})})),E.length>0?(()=>{const t=E.filter((e=>!0!==(!a.inputData[e.name]||!e.validation||e.validation(void 0,a.inputData[e.name].value)))).length>0&&!m.showAdvanced;return e.createElement("div",{className:"flow-showAdvanced"},e.createElement("div",{className:"flow-button error"+(t?"True":"False"),onClick:()=>{d({showAdvanced:!m.showAdvanced},(()=>{l?l.forceUpdate():i&&i()}))}},t?e.createElement(u,null):"","Advanced ",m.showAdvanced?e.createElement(p,null):e.createElement(c,null)))})():""),e.createElement("div",{className:"flow-inputs flow-advancedInputs flow-show"+(m.showAdvanced?"True":"False")},E.map(((t,o)=>{const i=a.inputData[t.name];return e.createElement(v,{hiddenDropdown:!m.showAdvanced,key:o,input:t,initalVal:i?i.value:void 0,onChange:e=>n.updateInputValue(a.path,e,o,!0)})})))),w.next.length>0?e.createElement("div",{className:"flow-nextOptions flow-show"+(m.showAddOptions?"True":"False")},e.createElement("div",{className:"flow-closePopup",onClick:()=>h()},e.createElement(s,null)),e.createElement("div",{className:"flow-pos"},e.createElement("div",{className:"flow-optionsTitle"},"Options"),w.next.map(((t,n)=>e.createElement("div",{onClick:()=>h({componentName:t}),className:"flow-option",key:n},props?o.title(t):t))))):"",w.next.length>0?e.createElement("div",{className:"flow-side"},e.createElement("div",{className:"flow-innerSide"},e.createElement("div",{className:"flow-round",onClick:()=>{1!=a.component.next.length?d({showAddOptions:!0}):h(a.component.next[0])}},e.createElement(s,null)))):"")}const E=function({connectTo:o,connectToInstance:a,itemWidth:i,width:l,Logic:s,Tree:r,data:c}){const[p,m]=t({element:void 0,lastParentPosition:0}),[d,u]=t(!1);let h=!1;function f(){if(h){let e,t=o;t&&(e=t.getBoundingClientRect(),e.top!=p.lastParentPosition&&m({lastParentPosition:e.top})),setTimeout((()=>{f()}),800)}}n((()=>(h=!0,f(),()=>h=!1)),[]);let w=0,v=0,x="";if(o&&p.element){let e=o.getBoundingClientRect(),t=p.element.getBoundingClientRect(),n=e.y+e.height/2-(t.y+t.height/2);0==n?(w=20,v=10,x="straight"):n<0?(w=20-n,v=w-10,x="bottomToTop"):(w=n+20,v=10,x="topToBottom")}return e.createElement("div",{className:"flow-graphPart",style:{width:l}},w&&v&&x?e.createElement("div",{className:"flow-lineToParrent",style:{bottom:`${v}px`}},e.createElement("svg",{viewBox:`0 0 80 ${w}`,height:`${w}px`,style:{minHeight:`${w}px`},xmlns:"http://www.w3.org/2000/svg"},"bottomToTop"==x?e.createElement("path",{strokeWidth:"7",stroke:"#ccc",strokeLinecap:"round",fill:"none",d:`M0,10 C70,10 30,${w-10} 80,${w-10}`}):"topToBottom"==x?e.createElement("path",{strokeWidth:"7",stroke:"#ccc",strokeLinecap:"round",fill:"none",d:`M0,${w-10} C70,${w-10} 30,10 80,10`}):e.createElement("path",{strokeWidth:"7",stroke:"#ccc",strokeLinecap:"round",fill:"none",d:"M0,10 C70,10 30,10 80,10"}))):"",e.createElement("div",{ref:e=>{let t;if(o&&(t=o.getBoundingClientRect()),"object"==typeof p.element&&(!t||t.top==p.lastParentPosition))return;let n={element:e};t&&(n.lastParentPosition=t.top),m(n)},className:"flow-graph",style:{minWidth:i}},e.createElement(g,{Tree:r,Logic:s,data:c,graphInstanceForceUpdate:u((e=>!e)),graphParrentInstance:a})),e.createElement("div",{className:"flow-next"},c.next.map(((t,n)=>e.createElement(E,{Tree:r,Logic:s,connectTo:p.element,connectToInstance:this,width:l-i,itemWidth:i,key:n,data:t})))))};class x{constructor(){this.val=""}}function y({flow:i,logic:s,onChange:r}){const[c,p]=t(!1),[m]=t(new a),[d]=t(new l(m,(()=>p((e=>!e))))),[u]=t(new x),[f,w]=t({settings:m.get()});function v(){"function"==typeof r&&d.setExportFunc(r),"object"==typeof i&&d.import(i)}return n((()=>{const e=o(s);e!=u.val?(u.val=e,w({settings:m.parseNewLogic(s)},(()=>v()))):v()}),[]),e.createElement("div",{className:"flowMakerComp"},e.createElement("div",{className:"flowMakerContainer",style:{minWidth:250+380*d.maxDepth+"px"}},e.createElement("div",{className:"flow-row",style:{minWidth:"250px"}},f.settings.introComponents.length>0?e.createElement("div",{className:"flow-startPoint"},e.createElement("h3",null,"Start here"),e.createElement(h,{Tree:d,Logic:m,options:f.settings.introComponents,out:e=>d.startFlow(e)})):""),e.createElement("div",{className:"flow-actualGraph",style:{width:380*d.maxDepth+"px"}},d.flow.map(((t,n)=>e.createElement(E,{Tree:d,Logic:m,width:380*d.maxDepth,itemWidth:380,key:n,data:t}))))))}export default y;
//# sourceMappingURL=flowmaker.es.js.map
