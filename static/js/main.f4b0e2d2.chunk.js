(this["webpackJsonplifting-form-evaluation"]=this["webpackJsonplifting-form-evaluation"]||[]).push([[0],{264:function(e,t,n){},271:function(e,t){},272:function(e,t){},280:function(e,t){},281:function(e,t){},282:function(e,t){},284:function(e,t,n){},286:function(e,t,n){"use strict";n.r(t);var r=n(112),i=n(234),a=n.n(i),s=(n(264),n(5)),o=n(4),c=n.n(o),l=n(11);function u(e,t){var n=9.81*e.upperArm.mass,r=9.81*e.foreArm.mass,i=9.81*e.head.mass,a=9.81*e.trunk.mass,s=9.81*e.hand.mass;e.upperArm.Fy=n,e.foreArm.Fy=r,e.head.Fy=i,e.trunk.Fy=a,e.hand.Fy=s;var o=-(e.upperArm.x-e.l5s1.x)*t,c=-(e.foreArm.x-e.l5s1.x)*t,l=-(e.head.x-e.l5s1.x)*t,u=-(e.trunk.x-e.l5s1.x)*t,d=-(e.hand.x-e.l5s1.x)*t;e.upperArm.Dx=o,e.foreArm.Dx=c,e.head.Dx=l,e.trunk.Dx=u,e.hand.Dx=d;var h=n*o,f=r*c,p=i*l,m=a*u,j=s*d,b=2*(h+f+j)+p+m;e.upperArm.Mo=h,e.foreArm.Mo=f,e.head.Mo=p,e.trunk.Mo=m,e.hand.Mo=j,e.l5s1.totalMo=b;var x=2*(n+r+s)+i+a+b/.05;e.l5s1.load=x}var d=n(235),h=n.n(d),f=n(236),p=n.n(f),m=n(237);function j(e,t,n,r,i){function a(t,n){var r=w[n],i=e.poseArr[n],a=i[5].position,s=i[7].position,o=i[9].position,c=i[11].position;t.fillStyle="Red",t.fillRect(a.x,a.y,f,f),t.fillRect(s.x,s.y,f,f),t.fillRect(c.x,c.y,f,f),t.fillRect(o.x,o.y,f,f),t.fillStyle="Grey",t.fillRect(r.upperArm.x,r.upperArm.y,f,f),t.fillRect(r.foreArm.x,r.foreArm.y,f,f),t.fillRect(r.head.x,r.head.y,f,f),t.fillRect(r.trunk.x,r.trunk.y,f,f),t.fillRect(r.hand.x,r.hand.y,f,f),t.fillStyle="White",t.fillRect(r.l5s1.x,r.l5s1.y,f,f)}function s(e,t){var n=w[t].l5s1.load;e.font=j.toString()+"px Arial",e.fillStyle="White",e.fillText("maxLoad: "+Math.round(k.val)+" N, Frame: "+k.frame,j/4,d-g-j/4,l),e.fillText("Load: "+Math.round(n)+" N",j/4,d-g-1.5*j,l),e.fillStyle="Green";for(var r=0;r<=t;r++){var i=w[r].l5s1.load;e.fillStyle=i<3432?"Green":i<6500?"Yellow":"Red";var a=Math.min(i/k.val*g,i/6800*g);e.fillRect(r*x,d-a,x,a)}}var o=new h.a({workerScript:"/spinal-load-evaluator/gif.worker.js"}),c=new p.a;console.log("Doing Calculations"),console.log("refLength: "+r),console.log("weight: "+n),console.log("mass: "+t);var l=e.frames[0].width,d=e.frames[0].height,f=Math.min(l/30,d/30),j=Math.min(d/15,l/15),b=e.frames.length,x=Math.ceil(l/b),g=d/10,v=e.poseArr[0][5].position,y=e.poseArr[0][7].position,O=r/Math.sqrt(Math.pow(y.x-v.x,2)+Math.pow(y.y-v.y,2));console.log("refToScreenRatio: "+O);var w=function(e,t,n,r){for(var i=[],a=0;a<e.frames.length;a++){var s=e.poseArr[a],o=s[5].position,c=s[7].position,l=s[9].position,d=s[11].position,h=s[3].position,f={upperArm:{x:o.x-.447*(o.x-c.x),y:o.y-.447*(o.y-c.y),mass:.03075*n},foreArm:{x:c.x-.432*(c.x-l.x),y:c.y-.432*(c.y-l.y),mass:.0172*n},head:{x:h.x,y:h.y,mass:.0823*n},trunk:{x:d.x-.5995*(d.x-o.x),y:d.y-.5995*(d.y-o.y),mass:.5415*n},hand:{x:l.x-(c.x-l.x)*(.108/.145)*.4,y:l.y-(c.y-l.y)*(.108/.145)*.4,mass:.00575*n+Number(t)},l5s1:{x:d.x-.25*(d.x-o.x),y:d.y-.25*(d.y-o.y)}};u(f,r),i.push(f)}return i}(e,t,n,O);console.log(w);for(var k={val:0,frame:-1},A=0;A<w.length;A++){var S=Math.abs(w[A].l5s1.load);S>k.val&&(k.val=S,k.frame=A)}console.log("Getting Video");for(var R=0;R<e.frames.length;R++){var L=e.frames[R],F=document.createElement("canvas");F.width=l,F.height=d;var M=F.getContext("2d");M.putImageData(L,0,0),M.font=j.toString()+"px Arial",M.fillStyle="White",M.fillText("Frame: "+R,j/4,j,l),a(M,R),s(M,R);o.addFrame(F,{delay:200}),c.file("frame"+R+".jpg",F.toDataURL("image/jpeg").split(";base64,")[1],{base64:!0})}o.on("finished",(function(e){i(!1);var t=URL.createObjectURL(e),n=document.querySelector("#lift");n.src=t,n.alt="lift",document.querySelector('button[type="submit"]').removeAttribute("disabled"),c.generateAsync({type:"blob"}).then((function(e){var t=document.querySelector("#download");t.onclick=function(t){t.preventDefault(),Object(m.saveAs)(e,"frames.zip")},t.removeAttribute("disabled"),console.log("finished")}))})),o.render()}n(285);var b=n(259);function x(e){return g.apply(this,arguments)}function g(){return(g=Object(l.a)(c.a.mark((function e(t){var n,r,i,a,s,o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=function(){return(a=Object(l.a)(c.a.mark((function e(t){var r,i;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=0;case 1:if(!(r<t.length)){e.next=9;break}return e.next=4,n(t[r]);case 4:i=e.sent,s.poseArr.push(i);case 6:r++,e.next=1;break;case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)},i=function(e){return a.apply(this,arguments)},r=function(){return(r=Object(l.a)(c.a.mark((function e(t){var n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null===t){e.next=8;break}return e.next=3,b.a();case 3:return n=e.sent,e.next=6,n.estimateSinglePose(t,{flipHorizontal:!1});case 6:return r=e.sent,e.abrupt("return",r.keypoints);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)},n=function(e){return r.apply(this,arguments)},s={poseArr:[],frames:[]},e.next=7,v(t,5);case 7:return o=e.sent,s.frames=o,e.next=11,i(s.frames);case 11:return e.abrupt("return",s);case 12:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function v(e){return y.apply(this,arguments)}function y(){return(y=Object(l.a)(c.a.mark((function e(t){var n,r=arguments;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.length>1&&void 0!==r[1]?r[1]:5,e.abrupt("return",new Promise(function(){var e=Object(l.a)(c.a.mark((function e(r){var i,a,s,o,u,d,h,f,p,m,j,b,x,g;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t).then((function(e){return e.blob()}));case 2:i=e.sent,a=URL.createObjectURL(i),(s=document.createElement("video")).addEventListener("seeked",Object(l.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:o&&o();case 1:case"end":return e.stop()}}),e)})))),s.src=a;case 7:if(s.duration!==1/0&&!isNaN(s.duration)||!(s.readyState<2)){e.next=13;break}return e.next=10,new Promise((function(e){return setTimeout(e,1e3)}));case 10:s.currentTime=1e7*Math.random(),e.next=7;break;case 13:u=s.duration,d=document.createElement("canvas"),h=d.getContext("2d"),f=Math.min(1,500/s.videoWidth,500/s.videoHeight),p=s.videoWidth*f,m=s.videoHeight*f,d.width=p,d.height=m,j=[],b=1/n,x=0;case 23:if(!(x<u)){e.next=33;break}return s.currentTime=x,e.next=27,new Promise((function(e){return o=e}));case 27:h.drawImage(s,0,0,p,m),g=h.getImageData(0,0,p,m),j.push(g),x+=b,e.next=23;break;case 33:r(j);case 34:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var O=n(26);function w(e){function t(e){return n.apply(this,arguments)}function n(){return(n=Object(l.a)(c.a.mark((function e(t){var n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise((function(e){var n=new FileReader;n.onload=function(t){return e(n.result)},n.readAsDataURL(t[0])}));case 2:return n=e.sent,e.abrupt("return",n);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function r(){return(r=Object(l.a)(c.a.mark((function n(r){var i,a,s,o,l,u,d,h,f,p;return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(r.preventDefault(),i=document.querySelector("input[type=file]"),a=document.querySelector("button[type=submit]"),s=document.querySelector("#mass"),o=document.querySelector("#weight"),l=document.querySelector("#ref_length"),!(!i.files[0].type.match("video.*")||o.value<=0||l.value<=0)){n.next=9;break}return i.files[0].type.match("video.*")?alert("Please enter non-zero values for upper arm length and weight"):alert("Please upload a video file, some acceptable formats are: .mp4, .m4v, .mov, .avi, .mpg, .webm"),n.abrupt("return");case 9:return u=s.value,d=o.value,h=l.value,n.next=14,t(i.files);case 14:return f=n.sent,e.setLoading(!0),a.setAttribute("disabled",""),i.value="",s.value="",o.value="",l.value="",console.log("Getting poses"),n.next=24,x(f);case 24:p=n.sent,console.log(p),j(p,u,d,h,e.setLoading);case 27:case"end":return n.stop()}}),n)})))).apply(this,arguments)}return Object(O.jsxs)("form",{className:"video_input_form",onSubmit:function(e){return r.apply(this,arguments)},children:[Object(O.jsxs)("div",{className:"input_line",children:[Object(O.jsx)("label",{htmlFor:"ref_length",children:"Length of upper arm (shoulder to elbow)(m): "}),Object(O.jsx)("input",{type:"number",min:"0",step:"any",required:!0,id:"ref_length",name:"ref_length"})]}),Object(O.jsxs)("div",{className:"input_line",children:[Object(O.jsx)("label",{htmlFor:"weight",children:"Your weight (kg): "}),Object(O.jsx)("input",{type:"number",min:"0",step:"any",required:!0,id:"weight",name:"weight"}),Object(O.jsx)("label",{htmlFor:"mass",children:"Mass of object (kg): "}),Object(O.jsx)("input",{type:"number",min:"0",step:"any",required:!0,id:"mass",name:"mass"})]}),Object(O.jsxs)("div",{className:"input_line",children:[Object(O.jsx)("label",{htmlFor:"videoFile",children:"Upload a new video: "}),Object(O.jsx)("input",{type:"file",accept:"video/*",required:!0,id:"videoFile",name:"videoFile"}),Object(O.jsx)("button",{type:"submit",children:"Submit"})]})]})}var k=n.p+"static/media/loading.ee7e6982.gif",A=n.p+"static/media/noise.5cb9fa79.gif";function S(e){var t=Object(O.jsx)("div",{id:"video_output",children:Object(O.jsx)("img",{src:k,alt:"loading"})}),n=Object(O.jsxs)("div",{id:"video_output",children:[Object(O.jsx)("img",{src:A,alt:"temp",id:"lift"}),Object(O.jsx)("button",{id:"download",disabled:!0,children:"Download Frames"})]});return e.isLoading?t:n}n(284);function R(){var e=Object(r.useState)(!1),t=Object(s.a)(e,2),n=t[0],i=t[1];return Object(O.jsxs)("div",{className:"App",children:[Object(O.jsx)("h1",{children:"Spinal Load Evaluator"}),Object(O.jsx)("p",{children:Object(O.jsx)("a",{href:"https://github.com/joieli/spinal-load-evaluator",children:"GitHub Repo and Demo Video"})}),Object(O.jsx)(S,{isLoading:n}),Object(O.jsx)(w,{setLoading:i}),Object(O.jsx)("p",{children:"Restrictions: "}),Object(O.jsxs)("ul",{children:[Object(O.jsx)("li",{children:"Record lift from lifter's left side"}),Object(O.jsx)("li",{children:"Two handed lifts only"}),Object(O.jsx)("li",{children:"Entire head, trunk(shoulder to hips) and arms must be visible"}),Object(O.jsx)("li",{children:"No twisting during lift"}),Object(O.jsx)("li",{children:"Object being lifted cannot have a long moment arm"}),Object(O.jsx)("li",{children:"No more than one person in frame at a time"}),Object(O.jsx)("li",{children:"Please limit video length to under 15 seconds"})]}),Object(O.jsx)("p",{children:"Output Colors: "}),Object(O.jsxs)("ul",{children:[Object(O.jsx)("li",{children:"Red: Location of relevant parts detected by posenet"}),Object(O.jsx)("li",{children:"Grey: Location of body segment center of masses"}),Object(O.jsx)("li",{children:"White: Location of the L5/S1 joint"})]}),Object(O.jsxs)("div",{className:"footer",children:[Object(O.jsx)("p",{children:"Notes: "}),Object(O.jsxs)("ul",{children:[Object(O.jsxs)("li",{children:["Accuracy of force values is dependent on accurate detection of the location of these pody parts:",Object(O.jsx)("ul",{children:Object(O.jsx)("li",{children:"Left wrist, left elbow, left shoulder, left hip, left ear"})})]}),Object(O.jsxs)("li",{children:["Please check that posenet has acurately determined the location of the above body parts in the video",Object(O.jsxs)("ul",{children:[Object(O.jsx)("li",{children:"Perfect detection is rare, if the estimation of location is far off, try taking the video again "}),Object(O.jsx)("li",{children:"At best, force values should only be used as an estimation. "}),Object(O.jsx)("li",{children:"Change in force throughout lift should generally be of more interest."})]})]}),Object(O.jsx)("li",{children:"Program assumes that center of mass of the object being lifted is at the same place as the hand"}),Object(O.jsx)("li",{children:"Program assumes that the lift begins at the first fram and ends at the last"}),Object(O.jsx)("li",{children:"Upper arm length is used to determine real-life:on-screen distance ratio"}),Object(O.jsx)("li",{children:"Uses a 2D statics based evaluation of force at each frame"}),Object(O.jsx)("li",{children:"Video output is in the form of a gif, analysis done at 5 fps"})]}),Object(O.jsx)("p",{children:"Packages and References: "}),Object(O.jsxs)("ul",{children:[Object(O.jsxs)("li",{children:["React: ",Object(O.jsx)("a",{href:"https://reactjs.org/",children:"https://reactjs.org/"})]}),Object(O.jsxs)("li",{children:["Posenet: ",Object(O.jsx)("a",{href:"https://github.com/tensorflow/tfjs-models/tree/master/posenet",children:"https://github.com/tensorflow/tfjs-models/tree/master/posenet"})]}),Object(O.jsxs)("li",{children:["file-saver: ",Object(O.jsx)("a",{href:"https://github.com/eligrey/FileSaver.js",children:"https://github.com/eligrey/FileSaver.js"})]}),Object(O.jsxs)("li",{children:["gif.js: ",Object(O.jsx)("a",{href:"https://github.com/jnordberg/gif.js",children:"https://github.com/jnordberg/gif.js"})]}),Object(O.jsxs)("li",{children:["jszip: ",Object(O.jsx)("a",{href:"https://stuk.github.io/jszip/",children:"https://stuk.github.io/jszip/"})]}),Object(O.jsxs)("li",{children:["Body segment masses and center of mass: ",Object(O.jsx)("a",{href:"https://doi.org/10.1080/02701367.1983.10605290",children:"https://doi.org/10.1080/02701367.1983.10605290"})]}),Object(O.jsx)("li",{children:"Body Segment Lengths: Winter DA. Biomechanics and motor control of human movement. John Wiley & Sons; 2009. "}),Object(O.jsxs)("li",{children:["Spinal compression limits: ",Object(O.jsx)("a",{href:"https://doi.org/10.1080/00140139308967899",children:"https://doi.org/10.1080/00140139308967899"})]})]})]})]})}var L=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,287)).then((function(t){var n=t.getCLS,r=t.getFID,i=t.getFCP,a=t.getLCP,s=t.getTTFB;n(e),r(e),i(e),a(e),s(e)}))};a.a.render(Object(O.jsx)(R,{}),document.getElementById("root")),L()}},[[286,1,2]]]);
//# sourceMappingURL=main.f4b0e2d2.chunk.js.map