(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{71:function(e,t,a){e.exports=a(93)},93:function(e,t,a){"use strict";a.r(t);var n=a(49),r=a(1),o=a.n(r),c=a(32),i=a(70),s=a(20),l=o.a.createContext(),u={todos:[]};function d(e,t){switch(t.type){case"INIT_STATE":return t.payload;case"ADD_TODO":return Object(s.a)({},e,{todos:[].concat(Object(i.a)(e.todos),[t.payload])});case"UPDATE_TODO":return Object(s.a)({},e,{todos:e.todos.map(function(e){return t.payload.id===e.id?Object(s.a)({},e,t.payload):e})});case"TOGGLE_COMPLETED":return Object(s.a)({},e,{todos:e.todos.map(function(e){return t.payload===e.id?Object(s.a)({},e,{completed:!e.completed}):e})});case"CLEAR_COMPLETED":return Object(s.a)({},e,{todos:e.todos.filter(function(e){return!e.completed})});default:return e}}function p(e){var t=o.a.useReducer(d,u),a=Object(c.a)(t,2),n={state:a[0],dispatch:a[1]};return o.a.createElement(l.Provider,{value:n},e.children)}l.Consumer;var f=a(11),m=a.n(f),g=a(33),h=a(37),b=a(68),y=a(2),x=a(30),v=a(3),E=a(47),O=a(31),w=a(69),T=a(46),j=a(51),I=a(52),C=a.n(I),k=a(42),D=y.a.create({navbar:{flexDirection:"row",alignSelf:"stretch",height:80,borderTopColor:"lightgrey",borderTopWidth:1},navbarItem:{flex:1,alignItems:"center",justifyContent:"center"},navbarItemText:{fontSize:22}}),S=function(){return o.a.createElement(v.a,{style:D.navbar},o.a.createElement(O.a,{style:D.navbarItem},o.a.createElement(x.a,{style:D.navbarItemText},"My Notes")),o.a.createElement(O.a,{style:D.navbarItem},o.a.createElement(x.a,{style:D.navbarItemText},"My Lists")))},A=y.a.create({container:{alignItems:"center",flexGrow:1,justifyContent:"center"},header:{justifyContent:"center"},title:{fontSize:40},inputContainer:Object(h.a)({alignSelf:"stretch",flexDirection:"row",backgroundColor:"lightgrey"},"alignSelf","stretch"),textInput:{flex:1,fontSize:30,color:"white",padding:20},addButton:{width:"20%",alignItems:"center",justifyContent:"center"},addButtonText:{fontSize:30},todoList:{alignSelf:"stretch",flex:1},todo:{flexDirection:"row",alignItems:"center",height:100,borderBottomColor:"lightgrey",borderBottomWidth:1,padding:20},todoInfos:{flex:1},todoName:{fontSize:22,fontWeight:"bold"},todoImage:{height:80,width:80,borderRadius:10,marginRight:10}}),_=function(){var e=Object(g.a)(m.a.mark(function e(t){var a,n;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.likewiseapp.net/api/elf/url/search?secret=acf6f606-3230-40d0-a95d-a11f9d6a0de8&name=".concat(t));case 2:return a=e.sent,e.next=5,a.json();case 5:return n=e.sent,e.abrupt("return",Object(k.get)(n,"data.0.link"));case 7:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),z=function(){var e=Object(g.a)(m.a.mark(function e(t){var a;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.likewiseapp.net/api/elf/ogs?secret=acf6f606-3230-40d0-a95d-a11f9d6a0de8&url=".concat(t));case 2:return a=e.sent,e.abrupt("return",a.json());case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),L=function(){return new j.a({size:1e3,storageBackend:C.a,defaultExpires:null,enableCache:!0,sync:{}})},B=function(){var e=o.a.useContext(l),t=e.state,a=e.dispatch,n=o.a.useState(!1),r=Object(c.a)(n,2),i=r[0],s=r[1],u=o.a.useState(""),d=Object(c.a)(u,2),p=d[0],f=d[1];o.a.useEffect(Object(g.a)(m.a.mark(function e(){var t,n;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=L(),e.next=3,t.load({key:"state"});case 3:n=e.sent,console.log("state",n),t&&n&&(a({type:"INIT_STATE",payload:n}),s(!0));case 6:case"end":return e.stop()}},e)})),[]),o.a.useEffect(function(){var e=L();e&&i&&(console.log("save state",t),e.save({key:"state",data:t}))},[t]);var h=o.a.useCallback(function(){var e=Object(g.a)(m.a.mark(function e(t){var n,r,o;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(f(""),n=Date.now(),a({type:"ADD_TODO",payload:{name:p,id:n,completed:!1}}),r=p,p.includes("://")){e.next=8;break}return e.next=7,_(p);case 7:r=e.sent;case 8:return console.log("url",r),e.next=11,z(r);case 11:return o=e.sent,console.log("data",o),e.next=15,a({type:"UPDATE_TODO",payload:{id:n,name:Object(k.get)(o,"ograph.ogTitle"),item:{image:Object(k.get)(o,"ograph.ogImage.originalImage")}}});case 15:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}());return o.a.createElement(b.a,{style:A.container},o.a.createElement(v.a,{style:A.todoList},t.todos.map(function(e){return o.a.createElement(O.a,{style:A.todo,key:e.id},!(!e.item||!e.item.image)&&o.a.createElement(T.a,{style:A.todoImage,resizeMethod:"scale",source:{uri:e.item.image}}),o.a.createElement(x.a,{style:A.todoName},e.name))})),o.a.createElement(w.a,{behavior:"padding",enabled:!0,style:{alignSelf:"stretch"}},o.a.createElement(v.a,{style:A.inputContainer,behavior:"padding",enabled:!0},o.a.createElement(E.a,{style:A.textInput,placeholder:"Take a note...",placeholderTextColor:"white",returnKeyType:"done",value:p,onChangeText:f,onSubmitEditing:h}))),o.a.createElement(S,null))},M=function(){return o.a.createElement(p,null,o.a.createElement(B,null))};n.a.registerComponent("px",function(){return M}),n.a.runApplication("px",{rootTag:document.getElementById("root")})}},[[71,1,2]]]);
//# sourceMappingURL=main.e639ef91.chunk.js.map