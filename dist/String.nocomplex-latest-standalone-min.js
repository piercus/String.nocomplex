/**
 * almond 0.2.7 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.2'

// Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>

/**
 * String.nocomplex version: "0.0.2" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
 * Available via the MIT license.
 * see: http://github.com/cagosta/String.nocomplex for details
 */

!function(){var n,e,r;!function(t){function o(n,e){return _.call(n,e)}function i(n,e){var r,t,o,i,u,s,l,c,a,f,p=e&&e.split("/"),h=x.map,g=h&&h["*"]||{};if(n&&"."===n.charAt(0))if(e){for(p=p.slice(0,p.length-1),n=p.concat(n.split("/")),c=0;c<n.length;c+=1)if(f=n[c],"."===f)n.splice(c,1),c-=1;else if(".."===f){if(1===c&&(".."===n[2]||".."===n[0]))break;c>0&&(n.splice(c-1,2),c-=2)}n=n.join("/")}else 0===n.indexOf("./")&&(n=n.substring(2));if((p||g)&&h){for(r=n.split("/"),c=r.length;c>0;c-=1){if(t=r.slice(0,c).join("/"),p)for(a=p.length;a>0;a-=1)if(o=h[p.slice(0,a).join("/")],o&&(o=o[t])){i=o,u=c;break}if(i)break;!s&&g&&g[t]&&(s=g[t],l=c)}!i&&s&&(i=s,u=l),i&&(r.splice(0,u,i),n=r.join("/"))}return n}function u(n,e){return function(){return h.apply(t,v.call(arguments,0).concat([n,e]))}}function s(n){return function(e){return i(e,n)}}function l(n){return function(e){m[n]=e}}function c(n){if(o(w,n)){var e=w[n];delete w[n],b[n]=!0,p.apply(t,e)}if(!o(m,n)&&!o(b,n))throw new Error("No "+n);return m[n]}function a(n){var e,r=n?n.indexOf("!"):-1;return r>-1&&(e=n.substring(0,r),n=n.substring(r+1,n.length)),[e,n]}function f(n){return function(){return x&&x.config&&x.config[n]||{}}}var p,h,g,d,m={},w={},x={},b={},_=Object.prototype.hasOwnProperty,v=[].slice;g=function(n,e){var r,t=a(n),o=t[0];return n=t[1],o&&(o=i(o,e),r=c(o)),o?n=r&&r.normalize?r.normalize(n,s(e)):i(n,e):(n=i(n,e),t=a(n),o=t[0],n=t[1],o&&(r=c(o))),{f:o?o+"!"+n:n,n:n,pr:o,p:r}},d={require:function(n){return u(n)},exports:function(n){var e=m[n];return"undefined"!=typeof e?e:m[n]={}},module:function(n){return{id:n,uri:"",exports:m[n],config:f(n)}}},p=function(n,e,r,i){var s,a,f,p,h,x,_=[],v=typeof r;if(i=i||n,"undefined"===v||"function"===v){for(e=!e.length&&r.length?["require","exports","module"]:e,h=0;h<e.length;h+=1)if(p=g(e[h],i),a=p.f,"require"===a)_[h]=d.require(n);else if("exports"===a)_[h]=d.exports(n),x=!0;else if("module"===a)s=_[h]=d.module(n);else if(o(m,a)||o(w,a)||o(b,a))_[h]=c(a);else{if(!p.p)throw new Error(n+" missing "+a);p.p.load(p.n,u(i,!0),l(a),{}),_[h]=m[a]}f=r?r.apply(m[n],_):void 0,n&&(s&&s.exports!==t&&s.exports!==m[n]?m[n]=s.exports:f===t&&x||(m[n]=f))}else n&&(m[n]=r)},n=e=h=function(n,e,r,o,i){return"string"==typeof n?d[n]?d[n](e):c(g(n,e).f):(n.splice||(x=n,e.splice?(n=e,e=r,r=null):n=t),e=e||function(){},"function"==typeof r&&(r=o,o=i),o?p(t,n,e,r):setTimeout(function(){p(t,n,e,r)},4),h)},h.config=function(n){return x=n,x.deps&&h(x.deps,x.callback),h},n._defined=m,r=function(n,e,r){e.splice||(r=e,e=[]),o(m,n)||o(w,n)||(w[n]=[n,e,r])},r.amd={jQuery:!0}}(),r("bower_components/almond/almond",function(){}),!function(n,e){function t(n,e){var r,t,o=n.toLowerCase();for(e=[].concat(e),r=0;r<e.length;r+=1)if(t=e[r]){if(t.test&&t.test(n))return!0;if(t.toLowerCase()===o)return!0}}var o=e.prototype.trim,i=e.prototype.trimRight,u=e.prototype.trimLeft,s=function(n){return 1*n||0},l=function(n,e){if(1>e)return"";for(var r="";e>0;)1&e&&(r+=n),e>>=1,n+=n;return r},c=[].slice,a=function(n){return null==n?"\\s":n.source?n.source:"["+d.escapeRegExp(n)+"]"},f={lt:"<",gt:">",quot:'"',amp:"&",apos:"'"},p={};for(var h in f)p[f[h]]=h;p["'"]="#39";var g=function(){function n(n){return Object.prototype.toString.call(n).slice(8,-1).toLowerCase()}var r=l,t=function(){return t.cache.hasOwnProperty(arguments[0])||(t.cache[arguments[0]]=t.parse(arguments[0])),t.format.call(null,t.cache[arguments[0]],arguments)};return t.format=function(t,o){var i,u,s,l,c,a,f,p=1,h=t.length,d="",m=[];for(u=0;h>u;u++)if(d=n(t[u]),"string"===d)m.push(t[u]);else if("array"===d){if(l=t[u],l[2])for(i=o[p],s=0;s<l[2].length;s++){if(!i.hasOwnProperty(l[2][s]))throw new Error(g('[_.sprintf] property "%s" does not exist',l[2][s]));i=i[l[2][s]]}else i=l[1]?o[l[1]]:o[p++];if(/[^s]/.test(l[8])&&"number"!=n(i))throw new Error(g("[_.sprintf] expecting number but found %s",n(i)));switch(l[8]){case"b":i=i.toString(2);break;case"c":i=e.fromCharCode(i);break;case"d":i=parseInt(i,10);break;case"e":i=l[7]?i.toExponential(l[7]):i.toExponential();break;case"f":i=l[7]?parseFloat(i).toFixed(l[7]):parseFloat(i);break;case"o":i=i.toString(8);break;case"s":i=(i=e(i))&&l[7]?i.substring(0,l[7]):i;break;case"u":i=Math.abs(i);break;case"x":i=i.toString(16);break;case"X":i=i.toString(16).toUpperCase()}i=/[def]/.test(l[8])&&l[3]&&i>=0?"+"+i:i,a=l[4]?"0"==l[4]?"0":l[4].charAt(1):" ",f=l[6]-e(i).length,c=l[6]?r(a,f):"",m.push(l[5]?i+c:c+i)}return m.join("")},t.cache={},t.parse=function(n){for(var e=n,r=[],t=[],o=0;e;){if(null!==(r=/^[^\x25]+/.exec(e)))t.push(r[0]);else if(null!==(r=/^\x25{2}/.exec(e)))t.push("%");else{if(null===(r=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(e)))throw new Error("[_.sprintf] huh?");if(r[2]){o|=1;var i=[],u=r[2],s=[];if(null===(s=/^([a-z_][a-z_\d]*)/i.exec(u)))throw new Error("[_.sprintf] huh?");for(i.push(s[1]);""!==(u=u.substring(s[0].length));)if(null!==(s=/^\.([a-z_][a-z_\d]*)/i.exec(u)))i.push(s[1]);else{if(null===(s=/^\[(\d+)\]/.exec(u)))throw new Error("[_.sprintf] huh?");i.push(s[1])}r[2]=i}else o|=2;if(3===o)throw new Error("[_.sprintf] mixing positional and named placeholders is not (yet) supported");t.push(r)}e=e.substring(r[0].length)}return t},t}(),d={VERSION:"2.3.0",isBlank:function(n){return null==n&&(n=""),/^\s*$/.test(n)},stripTags:function(n){return null==n?"":e(n).replace(/<\/?[^>]+>/g,"")},capitalize:function(n){return n=null==n?"":e(n),n.charAt(0).toUpperCase()+n.slice(1)},chop:function(n,r){return null==n?[]:(n=e(n),r=~~r,r>0?n.match(new RegExp(".{1,"+r+"}","g")):[n])},clean:function(n){return d.strip(n).replace(/\s+/g," ")},count:function(n,r){if(null==n||null==r)return 0;n=e(n),r=e(r);for(var t=0,o=0,i=r.length;;){if(o=n.indexOf(r,o),-1===o)break;t++,o+=i}return t},chars:function(n){return null==n?[]:e(n).split("")},swapCase:function(n){return null==n?"":e(n).replace(/\S/g,function(n){return n===n.toUpperCase()?n.toLowerCase():n.toUpperCase()})},escapeHTML:function(n){return null==n?"":e(n).replace(/[&<>"']/g,function(n){return"&"+p[n]+";"})},unescapeHTML:function(n){return null==n?"":e(n).replace(/\&([^;]+);/g,function(n,r){var t;return r in f?f[r]:(t=r.match(/^#x([\da-fA-F]+)$/))?e.fromCharCode(parseInt(t[1],16)):(t=r.match(/^#(\d+)$/))?e.fromCharCode(~~t[1]):n})},escapeRegExp:function(n){return null==n?"":e(n).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")},splice:function(n,e,r,t){var o=d.chars(n);return o.splice(~~e,~~r,t),o.join("")},insert:function(n,e,r){return d.splice(n,e,0,r)},include:function(n,r){return""===r?!0:null==n?!1:-1!==e(n).indexOf(r)},join:function(){var n=c.call(arguments),e=n.shift();return null==e&&(e=""),n.join(e)},lines:function(n){return null==n?[]:e(n).split("\n")},reverse:function(n){return d.chars(n).reverse().join("")},startsWith:function(n,r){return""===r?!0:null==n||null==r?!1:(n=e(n),r=e(r),n.length>=r.length&&n.slice(0,r.length)===r)},endsWith:function(n,r){return""===r?!0:null==n||null==r?!1:(n=e(n),r=e(r),n.length>=r.length&&n.slice(n.length-r.length)===r)},succ:function(n){return null==n?"":(n=e(n),n.slice(0,-1)+e.fromCharCode(n.charCodeAt(n.length-1)+1))},titleize:function(n){return null==n?"":(n=e(n).toLowerCase(),n.replace(/(?:^|\s|-)\S/g,function(n){return n.toUpperCase()}))},camelize:function(n){return d.trim(n).replace(/[-_\s]+(.)?/g,function(n,e){return e?e.toUpperCase():""})},underscored:function(n){return d.trim(n).replace(/([a-z\d])([A-Z]+)/g,"$1_$2").replace(/[-\s]+/g,"_").toLowerCase()},dasherize:function(n){return d.trim(n).replace(/([A-Z])/g,"-$1").replace(/[-_\s]+/g,"-").toLowerCase()},classify:function(n){return d.titleize(e(n).replace(/[\W_]/g," ")).replace(/\s/g,"")},humanize:function(n){return d.capitalize(d.underscored(n).replace(/_id$/,"").replace(/_/g," "))},trim:function(n,r){return null==n?"":!r&&o?o.call(n):(r=a(r),e(n).replace(new RegExp("^"+r+"+|"+r+"+$","g"),""))},ltrim:function(n,r){return null==n?"":!r&&u?u.call(n):(r=a(r),e(n).replace(new RegExp("^"+r+"+"),""))},rtrim:function(n,r){return null==n?"":!r&&i?i.call(n):(r=a(r),e(n).replace(new RegExp(r+"+$"),""))},truncate:function(n,r,t){return null==n?"":(n=e(n),t=t||"...",r=~~r,n.length>r?n.slice(0,r)+t:n)},prune:function(n,r,t){if(null==n)return"";if(n=e(n),r=~~r,t=null!=t?e(t):"...",n.length<=r)return n;var o=function(n){return n.toUpperCase()!==n.toLowerCase()?"A":" "},i=n.slice(0,r+1).replace(/.(?=\W*\w*$)/g,o);return i=i.slice(i.length-2).match(/\w\w/)?i.replace(/\s*\S+$/,""):d.rtrim(i.slice(0,i.length-1)),(i+t).length>n.length?n:n.slice(0,i.length)+t},words:function(n,e){return d.isBlank(n)?[]:d.trim(n,e).split(e||/\s+/)},pad:function(n,r,t,o){n=null==n?"":e(n),r=~~r;var i=0;switch(t?t.length>1&&(t=t.charAt(0)):t=" ",o){case"right":return i=r-n.length,n+l(t,i);case"both":return i=r-n.length,l(t,Math.ceil(i/2))+n+l(t,Math.floor(i/2));default:return i=r-n.length,l(t,i)+n}},lpad:function(n,e,r){return d.pad(n,e,r)},rpad:function(n,e,r){return d.pad(n,e,r,"right")},lrpad:function(n,e,r){return d.pad(n,e,r,"both")},sprintf:g,vsprintf:function(n,e){return e.unshift(n),g.apply(null,e)},toNumber:function(n,e){return n?(n=d.trim(n),n.match(/^-?\d+(?:\.\d+)?$/)?s(s(n).toFixed(~~e)):0/0):0},numberFormat:function(n,e,r,t){if(isNaN(n)||null==n)return"";n=n.toFixed(~~e),t="string"==typeof t?t:",";var o=n.split("."),i=o[0],u=o[1]?(r||".")+o[1]:"";return i.replace(/(\d)(?=(?:\d{3})+$)/g,"$1"+t)+u},strRight:function(n,r){if(null==n)return"";n=e(n),r=null!=r?e(r):r;var t=r?n.indexOf(r):-1;return~t?n.slice(t+r.length,n.length):n},strRightBack:function(n,r){if(null==n)return"";n=e(n),r=null!=r?e(r):r;var t=r?n.lastIndexOf(r):-1;return~t?n.slice(t+r.length,n.length):n},strLeft:function(n,r){if(null==n)return"";n=e(n),r=null!=r?e(r):r;var t=r?n.indexOf(r):-1;return~t?n.slice(0,t):n},strLeftBack:function(n,e){if(null==n)return"";n+="",e=null!=e?""+e:e;var r=n.lastIndexOf(e);return~r?n.slice(0,r):n},toSentence:function(n,e,r,t){e=e||", ",r=r||" and ";var o=n.slice(),i=o.pop();return n.length>2&&t&&(r=d.rtrim(e)+r),o.length?o.join(e)+r+i:i},toSentenceSerial:function(){var n=c.call(arguments);return n[3]=!0,d.toSentence.apply(d,n)},slugify:function(n){if(null==n)return"";var r="ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",t="aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",o=new RegExp(a(r),"g");return n=e(n).toLowerCase().replace(o,function(n){var e=r.indexOf(n);return t.charAt(e)||"-"}),d.dasherize(n.replace(/[^\w\s-]/g,""))},surround:function(n,e){return[e,n,e].join("")},quote:function(n,e){return d.surround(n,e||'"')},unquote:function(n,e){return e=e||'"',n[0]===e&&n[n.length-1]===e?n.slice(1,n.length-1):n},exports:function(){var n={};for(var e in this)this.hasOwnProperty(e)&&!e.match(/^(?:include|contains|reverse)$/)&&(n[e]=this[e]);return n},repeat:function(n,r,t){if(null==n)return"";if(r=~~r,null==t)return l(e(n),r);for(var o=[];r>0;o[--r]=n);return o.join(t)},naturalCmp:function(n,r){if(n==r)return 0;if(!n)return-1;if(!r)return 1;for(var t=/(\.\d+)|(\d+)|(\D+)/g,o=e(n).toLowerCase().match(t),i=e(r).toLowerCase().match(t),u=Math.min(o.length,i.length),s=0;u>s;s++){var l=o[s],c=i[s];if(l!==c){var a=parseInt(l,10);if(!isNaN(a)){var f=parseInt(c,10);if(!isNaN(f)&&a-f)return a-f}return c>l?-1:1}}return o.length===i.length?o.length-i.length:r>n?-1:1},levenshtein:function(n,r){if(null==n&&null==r)return 0;if(null==n)return e(r).length;if(null==r)return e(n).length;n=e(n),r=e(r);for(var t,o,i=[],u=0;u<=r.length;u++)for(var s=0;s<=n.length;s++)o=u&&s?n.charAt(s-1)===r.charAt(u-1)?t:Math.min(i[s],i[s-1],t)+1:u+s,t=i[s],i[s]=o;return i.pop()},toBoolean:function(n,e,r){return"number"==typeof n&&(n=""+n),"string"!=typeof n?!!n:(n=d.trim(n),t(n,e||["true","1"])?!0:t(n,r||["false","0"])?!1:void 0)}};d.strip=d.trim,d.lstrip=d.ltrim,d.rstrip=d.rtrim,d.center=d.lrpad,d.rjust=d.lpad,d.ljust=d.rpad,d.contains=d.include,d.q=d.quote,d.toBool=d.toBoolean,"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(module.exports=d),exports._s=d),"function"==typeof r&&r.amd&&r("underscore.string",[],function(){return d}),n._=n._||{},n._.string=n._.str=d}(this,String),r("String.nocomplex/String.nocomplex",["underscore.string"],function(n){var e=Array.prototype.slice,r=function(r){String.prototype[r]=function(){var t=e.call(arguments);return t.unshift(this),n[r].apply(this,t)}};for(var t in n)n.hasOwnProperty(t)&&r(t);return String.prototype});var t=function(){this.isNode=!1,this.isBrowser=!1,this.isUnknown=!1,this._exports,this.detect()};t.prototype={detect:function(){"undefined"!=typeof module&&module.exports?this._setAsNode():"undefined"!=typeof window?this._setAsBrowser():this._setAsUnknown()},_setAsNode:function(){this.isNode=!0,this.name="node"},_setAsBrowser:function(){this.isBrowser=!0,this._global=window,this.name="browser"},_setAsUnknown:function(){this.isUnknown=!0,this.name="unknown"},setGlobal:function(n){this._global=n},ifNode:function(n){this.isNode&&n()},ifBrowser:function(n){this.isBrowser&&n()},exports:function(n,e){this.isNode?this._global.exports=e:this.isBrowser&&(this._global[n]=e)}};var o,n,i=new t;i.ifNode(function(){o=__dirname,n=e("requirejs"),i.setGlobal(module)}),i.ifBrowser(function(){o="."}),n.config({baseUrl:function(){return"undefined"==typeof r?__dirname:"."}(),shim:{mocha:{exports:"mocha"}},paths:{"String.nocomplex":".",almond:"bower_components/almond/almond",chai:"bower_components/chai/chai","chai-as-promised":"bower_components/chai-as-promised/lib/chai-as-promised",mocha:"bower_components/mocha/mocha","normalize-css":"bower_components/normalize-css/normalize.css",requirejs:"bower_components/requirejs/require",async:"bower_components/requirejs-plugins/src/async",depend:"bower_components/requirejs-plugins/src/depend",font:"bower_components/requirejs-plugins/src/font",goog:"bower_components/requirejs-plugins/src/goog",image:"bower_components/requirejs-plugins/src/image",json:"bower_components/requirejs-plugins/src/json",mdown:"bower_components/requirejs-plugins/src/mdown",noext:"bower_components/requirejs-plugins/src/noext",propertyParser:"bower_components/requirejs-plugins/src/propertyParser","Markdown.Converter":"bower_components/requirejs-plugins/lib/Markdown.Converter",text:"bower_components/requirejs-plugins/lib/text","sinon-chai":"bower_components/sinon-chai/lib/sinon-chai",sinonjs:"bower_components/sinonjs/sinon","underscore.string":"bower_components/underscore.string/lib/underscore.string"}});var u=!!n._defined,s=u;if(i.ifNode(function(){s=!0}),s){var l=n("String.nocomplex/String.nocomplex");i.exports("StringNocomplex",l)}else n(["String.nocomplex/String.nocomplex"],function(n){i.exports("StringNocomplex",n)});r("String.nocomplex/main",function(){})}();