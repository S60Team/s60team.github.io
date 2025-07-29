ES6support = '';
function check() {
  "use strict";
  if (typeof Symbol == "undefined") return false;
  // https://gist.github.com/DaBs/89ccc2ffd1d435efdacff05248514f38
  var str = 'class ಠ_ಠ extends Array {constructor(j = "a", ...c){'+
  'const q = (({u: e}) => {return { [`s${c}`]: Symbol(j) };})({});super(j, q, ...c);}}'+
  'new Promise((f) => {const a = function* (){return "\\u{20BB7}".match(/./u)[0].length === 2 || true;};'+
  'for (let vre of a()) {const [uw, as, he, re] = [new Set(), new WeakSet(), new Map(), new WeakMap()];break;}'+
  'f(new Proxy({}, {get: (han, h) => h in han ? han[h] : "42".repeat(0o10)}));}).then(bi => new ಠ_ಠ(bi.rd));';
  try { eval(str); } catch(e) { return false; }
  return true;
  // All credits to Netflix for providing this approach to ES6 feature detection.
  // Although this could be written in many different ways
  //   this proved to be the most direct and elegant approach for me.
  // License: MIT
}
if (check() !== false) {
  ES6support = 'ES6';
  // The engine supports ES6 features you want to use:
  var s = document.createElement('script');
  s.src = "es6script.js";
  document.head.appendChild(s);
} else {
  // The engine does not support those ES6 features.
  ES6support = 'nES6';
}