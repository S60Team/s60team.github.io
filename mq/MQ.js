// spell-checker:disable
/*
  ! ВНИМАНИЕ
    Google Chrome версии 101+ будет ограничивать количество 
      получаемой информации, полученной с помощью navigator.userAgent!
    Google Chrome версии 119+ не поддерживает WebSQL.

  *  Скрипт получает (после загрузки body) возможности Браузера,
  *  изменяет внешний вид страницы в зависимости от разрешения экрана и
  *  отображает на странице возможности Браузера.
*/
// ToDo: пока не придумал...
/*
  vw, vh, vmin, vmax: Edg16, FF19, Chr26, Saf6.1(8).
  cqw, cqh, cqi, cqb, cqmin, cqmax: FF110, Chr105, Saf16.
  fr: Edg16, FF54, Chr58, Saf10.1(10.3).
  dppx (2x): Edg79, FF62, Chr68, Saf16.0.
  rem: IE9(11) Edg12, FF3.6, Chr4, Saf5, Opr11.6.
  sv* units (svb, svh, svi, svmax, svmin, svw),
  lv* units (lvb, lvh, lvi, lvmax, lvmin, lvw),
  dv* units (dvb, dvh, dvi, dvmax, dvmin, dvw)
  and logical vi/vb Edg108, FF101m Chr108, Saf15.4.
  calc(): Edg12, FF16, Chr26, Saf6.1(7)
*/

// Исправление для старых браузеров (не IE):
// HTML5BP: убирает ошибки консоли в браузерах:
(function(){var method;var noop=function(){};
var methods=["assert","clear","count","debug","dir","dirxml","error",
  "exception","group","groupCollapsed", "groupEnd","info","log","markTimeline",
  "profile","profileEnd","table","time","timeEnd","timeline","timelineEnd",
  "timeStamp","trace","warn"];
var length=methods.length;
var console=window.console=window.console||{};
while(length--){
  method=methods[length];if(!console[method]){console[method]=noop;}
}})();

// Переменные:
var isOpera, isOpera2, isFirefox, isSafari,
  isChrome, isChrome2, isChrome3, isOperaMini, isIE, ie,
  isIE10, isIE11, isEdge, isEdgeChromium, isMaxthon, OS_Name = "unknown",
  nua = window.navigator.userAgent, npl = window.navigator.platform,
  htm = document.getElementsByTagName('html')[0],
  CSSssr = '', CSSnestDecl = '', Atomics1;

// Новинки:
// CSS conditional and nesting:
//htm.setAttribute("data-css-cond-nest", CSS.supports('selector(& div)'));
try {
  if(CSS.supports('selector(& div)') === true){
    console.log('selector(& div): true');
  } else {
    console.log('selector(& div): false');
  }
}catch(e){
  console.log('selector(& div): false');
}
//for(var p in document.__proto__){console.log(p)}

// @supports selector(:focus-within)
// :focus-within Chr 60, Egde 79, FF 52, Saf 10.1 (10.3 iOS)
try {
  document.querySelector(':focus-within');
  console.log(':focus-within true');
} catch(e){
  console.log(':focus-within false');
}
// @supports selector(:has(*))
//   Chr 105, Egde 105, FF 121, Saf 15.4
try {
  document.querySelector('p:has(*)');
  console.log(':has true');
} catch(e){
  console.log(':has false');
}
try {
  document.querySelector('p:has(+ *)');
  console.log(':has relative true');
} catch(e){
  console.log(':has relative false');
}
// :view-transition Chr 109, Egde 109, Opr 95, Saf 18
try {
  document.querySelector('::view-transition');
  console.log('::view-transition true');
} catch(e){
  console.log('::view-transition false');
}
try {
  if('MozAppearance' in document.documentElement.style === true ||
         "mozInnerScreenX" in window){
    //if(!!URL.canParse === true){
    if('baseline-source' in document.documentElement.style){
      console.log('Firefox 115+');
    }
  }
} catch(e){
  console.log('Firefox 115');
}

try {
  // CSSStartingStyleRule: Chr 117, Egde 117, FF 129, Opr 103, Saf 17.5
  if('CSSStartingStyleRule' in window){ CSSssr = "CSSssr"; }
  else { CSSssr = "nCSSssr"; }

  // Chrome 130, Edge 130, Firefox 132, Opera 115, Safari 18.2
  if('CSSNestedDeclarations' in window &&
    "style" in CSSNestedDeclarations.prototype){ CSSnestDecl = "CSSnestDecl"; }
  else { CSSnestDecl = "nCSSnestDecl"; }

  // Atomics: Chrome 133, Edge 133, Firefox 137, Opera 118, Safari 18.4
  if('pause' in Atomics){ Atomics1 = "latest"; }
  else { Atomics1 = "nLatest"; }
}catch(e){
  CSSssr = "nCSSssr";
  CSSnestDecl = "nCSSnestDecl";
  Atomics1 = "nLatest";
}

/*
// Float16Array: Firefox 129, Safari 18.2
var float16_array = false;
try {
  var x = new Float16Array([21, 31]);
  if(x[1] == 31){ float16_array = true; }
} catch(e){}

// calc-size: Chrome 129, Edge 129, Opera 115
var calc_size = false;
try {
  if(CSS.supports('width: calc-size(auto, size)') === true){
    calc_size = true;
  } else {calc_size = false; }
} catch(e){ }
// 
if(float16_array === false && calc_size === true){
  //console.log('Chrome 129, Edge 129, Opera 115');
  latest = true;
} else if (float16_array === true && calc_size === false){
  //console.log('Firefox 129, Safari 18.2');
  latest = true;
}
*/


// Определяем ОС с помощью поддержки возможностей:
/*
// v1:
var windoze = '';
if(navigator.platform.match(/(Win\d+)/) !== null){
  try {
    if(!!OverconstrainedError === true){
      windoze = '<span class="Win7" title="Windows 7+"> &nbsp; </span>';
    }
  } catch(e){
    if('webdriver' in navigator){
      windoze = '<span class="Win7" title="Windows 7+"> &nbsp; </span>';
    }
    else{
      if(navigator.webdriver === false){
        windoze = '<span class="Win7" title="Windows 7+"> &nbsp; </span>';
      } else {
        windoze = '<span class="WinXP" title="Windows XP+"> &nbsp; </span>';
      }
    }
  }
  try {
    if(!!AudioSinkInfo !== undefined){ // Chrome 110
      windoze = '<span class="Win11" title="Windows 10+"> &nbsp; </span>';
    }
  } catch(e){
    try {
      if('MozAppearance' in document.documentElement.style === true ||
         "mozInnerScreenX" in window){
        if(!!RTCEncodedAudioFrame === true){  // Firefox 117
          windoze = '<span class="Win11" title="Windows 10+"> &nbsp; </span>';
        }
      }
    } catch(e){}
  }
}
*/
// v2: Работает отлично!
var windoze = '';
try {
  // Chrome 66, Edge 79, Opera 53, Safari 16.4
  if(!!CSS.ch === true && !!CSSConditionRule === true){
    windoze = '<span class="Win7" title="Windows 7+"> &nbsp; '+
      'Chrome 66, Edge 79, Opera 53, Safari 16.4 </span>';
  } // Chrome 47, Edge 12, Firefox 53, IE9, Opera 36, Safari 10.1(10.3 iOS):
  else if(!!CSSNamespaceRule === true && !!CSSConditionRule === true){
    windoze = '<span class="Win7" title="Windows 7+"> &nbsp; '+
      'Chrome 47, Edge 12, Firefox 53, IE9, Opera 36,'+
      ' Safari 10.1(10.3 iOS) </span>';
  }
}catch(e){
  windoze = '<span class="WinXP" title="Windows XP+"> &nbsp; '+
    'Chrome 46, Firefox 52, Opera 35, Safari 10, IE8 </span>';
}
try {
  if(!!AudioSinkInfo !== undefined){ // Chrome 110, Edge 110, Opera 96
    try {  // Chr 117, Egde 117, FF 129, Opr 103, Saf 17.5
      if('pause' in Atomics){
        windoze = '<span class="Win11" title="Windows 11+"> &nbsp; '+
        'Chrome 133, Firefox 137, Opera 118, Safari 18.4</span>'
      } else {
        windoze = '<span class="Win10" title="Windows 10+"> &nbsp; '+
        'Chr 117, FF 129, Opr 103, Saf 17.5</span>';
      }
    }catch(e){
      windoze = '<span class="Win10" title="Windows 10+"> &nbsp;'+
        ' Chrome 110, Opera 96 </span>';
    }
  }
} catch(e){
  try {
    if('MozAppearance' in document.documentElement.style === true ||
       "mozInnerScreenX" in window){
      if(!!RTCEncodedAudioFrame === true){ // Firefox 117
        if('pause' in Atomics){
          windoze = '<span class="Win11" title="Windows 11"> '+
          '&nbsp; Firefox 137 </span>';
        } else {
          windoze = '<span class="Win10" title="Windows 10+"> '+
          '&nbsp; Firefox 117 </span>';
        }
      }
    }
    else { // Chr 117, Egde 117, FF 129, Opr 103, Saf 17.5
      try {
        if('CSSStartingStyleRule' in window){
          if('pause' in Atomics){
            windoze = '<span class="Win11" title="Windows 11+"> &nbsp; '+
            'Chrome 133, Firefox 137, Opera 118, Safari 18.4</span>'
          } else {
            windoze = '<span class="Win10" title="Windows 10+"> &nbsp; '+
            'Chr 117, FF 129, Opr 103, Saf 17.5</span>';
          }
        }
      }catch(e){}
    }
    //if(!!RTCEncodedAudioFrame !== true && 'CSSStartingStyleRule' in window){
    //  windoze = '<span class="Win11" title="Windows 10+"> &nbsp; </span>';}
  } catch(e){ }
}
// Chrome 118, Edge 118, Opera 104, Safari 16.4
//if(!!CSS.ic === true){}

/*
// * Устаревшие браузеры:
try {
  // Container-queries:
  if("container" in document.documentElement.style === true){
    //console.log("Chrome 105, Edge 105, Opera 91, Firefox 110, Safari 16");
  }
} catch(e){
  // Ваш браузер устарел. Обновите его или смените устройство.
}
*/

// * Кусок от feature.js
function creatu(el) {
  return document.createElement(el);
}
/*
  //if("defer" in creatu("script")){ console.log('defer'); }
  //if("async" in creatu("script")){ console.log('async'); }
  // vw:
  function viewportUnit() {
    var el = creatu("dummy");
    try {
      el.style.width = "1vw";
      var test = el.style.width !== "";
      return !!test;
    } catch (err) {
      return false;
    }
  }
  //console.log('vw: '+viewportUnit());
  var vws;
  if(viewportUnit() !== false){ vws = "vw"; }
  else { vws = "noVw"; }

  // rem:
  function remUnit() {
    var el = creatu("dummy");
    try {
      el.style.width = "1rem";
      var test = el.style.width !== "";
      return !!test;
    } catch (err) {
      return false;
    }
  }
  //console.log('rem: '+remUnit());
  var rems = "";
  if(remUnit() !== false){ rems = "rem"; }
  else { rems = "noRem"; }
*/

// Literal Notation & namespace
var detect = detect || {};
detect = {
  // Получаем ОС и её версию (читаем userAgent):
  OSname: function () {
    try {
      if(npl.match(/(iPhone|iPad|MacIntel)/) !== null &&
         'MozAppearance' in document.documentElement.style !== true){ // Настоящий
        var m_ios = nua.match(/OS\s(\d+((\_|\.)\d+((\_|\.)\d+)?)?)/i);
        var m_macos = nua.match(/Mac\sOS\s\w\s(\d+((\_|\.)\d+((\_|\.)\d+)?)?)/i);
        if(m_ios !== null){
          var m_iosv2 = m_ios[0].replace(/\_/g,'.');
          OS_Name = m_iosv2.replace("OS",'iOS');
        } else {
          var m_macos2 = m_macos[0].replace(/\_/g,'.');
          OS_Name = m_macos2.replace(/Mac\sOS\s\w/,'MacOS');
        }
      } else { // Не iOS...
        // Windows Phone:
        if (nua.match(/(WPDesktop|IEMobile)/) !== null){
          if(nua.match(/Windows Phone\s(\d+(\.\d+)?)/i) !== null &&
              npl.match(/Win\d+/) == null){
            // Настоящий?
            var m_wp = nua.match(/Windows Phone\s(\d+(\.\d+)?)/i);
            OS_Name = m_wp[0];
          } else {
            // Вроде ненастоящий:
            if (npl.match(/Win\d+/) == null){
              // настоящий (ARM):
              var m_wp2 = nua.match(/Windows\sPhone OS\s(\d+(\.\d+)?)/i);
              OS_Name = m_wp2[0].replace(" OS", '');
            }
          }
        } else { // не Windows Phone и не iOS...
          // Android:
          if(npl.match(/(armv|aarch|ARM)/) !== null){ // Настоящий
            var m_andr = nua.match(/Android\s(\d+(\.\d+){0,3})/i);
            if (m_andr !== null){
              OS_Name = m_andr[0];
            } else { // не могу получить версию, но это Андроид:
              if(nua.match(/Android/i) !== null){ OS_Name = "Android"; }
            }
          } else { // не Windows Phone, не iOS и не Андроид...
            // Настоящий Windows:
            if (nua.match(/\sNT\s/) !== null && npl.match(/(Win\d+)/) !== null){
              var m_win = nua.match(/\sNT\s(\d+\.\d)/);
              // Исправление для QtWeb:
              var swin = "0.0";
              try {
                swin = m_win[0].replace(" NT ", "");
              } catch(e){
                OS_Name = "Windows";
              }
              // Прочие браузеры работают нормально:
              if(swin == "10.0"){ OS_Name = "Windows 10"; }
              if(swin == "6.3"){ OS_Name = "Windows 8.1"; }
              if(swin == "6.2"){ OS_Name = "Windows 8"; }
              if(swin == "6.1"){ OS_Name = "Windows 7"; }
              if(swin == "6.0"){ OS_Name = "Windows Vista"; }
              if(swin == "5.2"){ OS_Name = "Windows Server 2003"; }
              if(swin == "5.1"){ OS_Name = "Windows XP"; }
              if(swin == "5.0"){ OS_Name = "Windows 2000"; }
            } else { // не Windows Phone, не iOS, не Андроид и не Windows...
              // Linux:
              if(npl.match(/Linux\s/i) !== null &&
                  npl.match(/(i686|x86_64)/i) !== null ){
                if (nua.match(/Ubuntu/) !== null ){ OS_Name = "Ubuntu Linux"; }
                else {
                  if (nua.match(/CrOS/) !== null ){ OS_Name = "Chrome OS (Linux)"; }
                  else { OS_Name = "Linux"; }
                } // end Ubuntu.
              } // end Linux.
            } // end NT.
          } // end Other OS.
        } // end Windows Phone.
      } // end iOS.

      // Исправление для ботов:
      // Windows:
      if((npl.match(/(Win\d+)/) !== null &&
          npl.match(/(armv|aarch|ARM)/) == null) && OS_Name == "unknown"){
        OS_Name = "Windows";
      }
      // Linux:
      if(npl.match(/(arm|aarch)/g) === null &&
          npl.match(/Linux\s/i) !== null && OS_Name == "unknown"){
            OS_Name = "Linux";
      }
      // Linux ARM Android:
      if(npl.match(/(armv|aarch|ARM)/) !== null && OS_Name == "unknown"){
        OS_Name = "Android";
      }
      // Symbian (Series60):
      if(npl.match(/(Win\d+|Linux|MacIntel|aarch|ARM)/i) == null &&
          nua.match(/Symbian/) !== null ){
        if(nua.match(/Series60/) !== null){ OS_Name = "Symbian S60"; }
        else { OS_Name = "Symbian"; }
      }
      // Blackberry:
      if(npl.match(/Blackberry/i) !== null && OS_Name == "unknown"){
        OS_Name = "Blackberry";
      }
      // iOS:
      if(npl.match(/iPad|iPhone/) !== null && OS_Name == "unknown" &&
          navigator.vendor.match(/Apple/g) !== null){
        if('MozAppearance' in document.documentElement.style === true ||
            "mozInnerScreenX" in window){
          OS_Name == "unknown";
        }
        else { OS_Name = "iOS"; }
      }
      // Возвращаем:
      return OS_Name;
    } catch(e){
      return e;
    }
  },
  // Определение Браузера и версии с помощью особенностей Браузера 
  //   (модифицировано): https://is.gd/erufeg
  Browser: function () {
    var bName="", bVersion="";
    var TempVar = 0;
    try {
      // Получаем Браузер:
      // Opera: 9.6 - 99, Opera Neon, FakeOpera
      isOpera = !!window.opr && !!opr.addons || !!window.opera ||
        nua.match(/MMS\//) != null;
      isOpera2 = nua.indexOf(' OPR/') >= 0;
      // Firefox 1.2 - 115:
      //isFirefox = typeof InstallTrigger !== 'undefined' ||
      // 'MozAppearance' in document.documentElement.style === true;
      // Firefox 3.6+:
      isFirefox = 'MozAppearance' in document.documentElement.style === true ||
        "mozInnerScreenX" in window;
      // Safari 5:
      isSafari = /constructor/i.test(window.HTMLElement) ||
        (function (p){
          return p.toString() === "[object SafariRemoteNotification]";
        })(
          !window['safari'] ||
            typeof safari !== 'undefined' && window['safari'].pushNotification) || /Apple/g.test(navigator.vendor);
      // Chrome *, Opera >= 14, Android 4.0.4
      isChrome = !!window.chrome &&
        (!!window.chrome.webstore || !!window.chrome.csi ||
          !!window.chrome.runtime);
      // Chrome *, iOS, Safari >= 3, Opera >= 14
      isChrome2 = 'WebkitAppearance' in document.documentElement.style ||
        nua.indexOf("CriOS") != -1;
      // Maxthon > 5.2.5.3000 (Chrome 61), ViaBrowser, Chrome *, Opera >= 14
      isChrome3 = !!window.chrome;
      // Opera Mini:
      isOperaMini = Object.prototype.toString.call(window.operamini) === '[object OperaMini]' ||
        nua.indexOf('Opera Mini') > -1;
      //
      // IE: 6-11 получаем версию браузера:
      isIE = document.all && document.compatMode; // isIE="CSS1Compat"
      isIE = !!isIE;
      isIE11 = '-ms-scroll-limit' in document.documentElement.style &&
        '-ms-ime-align' in document.documentElement.style;
      // !!isIE10 = true||false
      isIE10 = document.all && window.atob;
      isIE11 = !!isIE11;
      isIE10 = !!isIE10;
      ie = (function(){
        var undef, divo = document.createElement('div'),
        v = 3, all = divo.getElementsByTagName('i');
        while (divo.innerHTML = '<!--[if gt IE ' + (++v) +']><i></i><![endif]-->', all[0]);
        return v > 4 ? v : undef;
      }());
      if(ie === undefined){
        if(isIE11 === true){ ie = 11; }
        else{
          if(isIE10 === true){ ie = 10; }
          else{ie = false;}
        }
      } // end Определяем версию IE.
      // Microsoft Edge:
      isEdgeChromium = isChrome && nua.indexOf("Edg") != -1;
      isEdge = !isIE && !!window.StyleMedia; // работает, но IE11 считает Edge7
    }catch(e){}
    // Определяем Maxthon:
    if(isChrome === true || isChrome2 === true){
      try {
        var emxVersion = window.external.mxVersion;
        // Maxthon 3.0, 4.1.3, 4.9.5, 5.2.x:
        if(emxVersion !== undefined){
          TempVar = emxVersion;
          isMaxthon = true;
        }
      } catch(e) {}
      try {
        // Maxthon Nitro 1.0.1, Maxthon 6.1.1 - 7.1.8:
        if('maxthon' in window){
          try {
            // Maxthon 6.1.1 - 7.1.8:
            if(typeof window.maxthon.browserInfo() == 'string'){
              var mxvx = JSON.parse(window.maxthon.browserInfo());
              TempVar = mxvx.version;
              isMaxthon = true;
            }
          } catch(err){
            // Maxthon Nitro 1.0.1:
            isMaxthon = true;
          }
        }
      } catch(error){}
    } // end_Maxthon.
    isMaxthon = !!isMaxthon;
    var MaxthonV = TempVar;
    //----------------------------------------------------
    // Теперь определяем версию Браузера и сам Браузер:
    bVersion = 0;
    // Internet Explorer:
    if(ie > 0){ bName = "IE"; bVersion = ie;}
    // Chrome:
    if(isChrome2===true && isChrome===true){
      // Назначить 0, если Windows и Android:
      if (OS_Name.match(/Windows/) !== null && nua.match(/Android/) !== null) {
        bVersion = 0;
      }
      else if (OS_Name.match(/Windows/) !== null && nua.match(/Linux/) !== null) {
        bVersion = 0;
      }
      // Всё нормально, указываем правильную версию:
      else {
        var chr1 = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        if(chr1 !== null){bVersion = chr1[1];}
      }
      bName = "Chrome";
    }
    // Opera на движке Chrome:
    if((isChrome===true ||isChrome2===true) && isOpera2===true){
      var chropr = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
      bVersion = chropr[1];
      bName = 'Chrome (Opera)';
    }
    if(!!window.opr===true && isChrome2===true){
      bName = 'Chrome (Opera)';
    } 
    // Opera на движке Presto:
    if(isChrome===false && isOpera===true){ bName = 'Opera'; }
    // Chrome (Не настоящая Opera):
    try {
      if(nua.match(/OPR\/0/) === true){ bName = 'Chrome'; }
    } catch(e){}
    // Настоящий Safari: iOS
    try {
      if((isSafari===true || navigator.vendor.match(/Apple/g) !== null) &&
          OS_Name.match(/(MacOS|iOS)/) !== null){
        // Если есть версия:
        var zsaf = nua.match(/Version\/(\d+(\.\d+){0,3})/i);
        if(zsaf !== null){
          bVersion = zsaf[1]; bName = "Safari";
        } else {
          // Нет версии, берём Safari
          var zsaf2 = nua.match(/Safari\/(\d+(\.\d+){0,3})/i);
          if(zsaf2 !== null){
            bVersion = zsaf2[1]; bName = "Safari";
          } else {
            var zsaf3 = nua.match(/AppleWebKit\/(\d+(\.\d+){0,3})/i);
            bVersion = zsaf3[1]; bName = "Safari";
          }
        }
      }
    }catch(e){}
    // Не настоящий Safari:
    try {
      if(OS_Name.match(/(MacOS|iOS)/)===null &&
          nua.match(/(iPhone|iPad|Mac\sOS)/) !== null){
        // Edge, эмулитрует Safari
        if(nua.match(/Edg\//) !== null){
          bName = "Chrome (Edge)"; // это Хром в конце концов!
          var chrmev = nua.match(/Edg\/(\d+(\.\d+){0,3})/i);
          if (chrmev !== null) {
            bVersion = chrmev[1]; // указываем версию Хрома.
          }
        } else {
          if(isOpera==true){ bName = 'Opera'; } bVersion = 0;
        }
      }

      // Получаем версию Chrome на iOS:
      var m_crios = nua.match(/CriOS\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/);
      if (m_crios!==null && OS_Name.match(/(MacOS|iOS)/) !== null) {
        bVersion = m_crios[1]; bName = "Chrome (iOS)";
      }
      // Получаем версию Fx на iOS:
      var m_fxios = nua.match(/FxiOS\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/);
      if (m_fxios == true && OS_Name.match(/(MacOS|iOS)/) !== null) {
        bVersion = m_fxios[1]; bName = "Fx (iOS)";
      }
      // Приложение Facebook:
      if(nua.match(/FBAV\//i) !== null){
        if(nua.match(/Chrome\//i) === null){ // iOS
          var fb_m = nua.match(/AppleWebKit\/(\d+(\.\d+){0,3})/i);
          if(!!fb_m == true){
            bVersion = nua.match(/FBSV\/(\d+(\.\d+){0,3})/i);
            bVersion = bVersion[1];
            //bVersion = fb_m[1];
          }
          bName = "Safari (Facebook)";
        }
        // Android
        if(nua.match(/Chrome\//i) !== null){
          bName = "Chrome (Facebook)";
          var chrFB = nua.match(/Chrome\/(\d+(\.\d+){0,3})/i);
          bVersion = chrFB[1];
        }
      }

      // Ненастоящая Opera:
      if(isChrome==true && nua.match(/Opera/) !== null){
        bName = "Chrome (Fake Opera)";
      }

      // Ненастоящий Firefox:
      if(isChrome==true && nua.match(/Firefox/) !== null){
        bName = "Chrome (Fake Firefox)";
      }

      // Настоящий Firefox:
      if(isFirefox == true){
        var fff_m = nua.match(/Firefox\/(\d+(\.\d+){0,3})/i);
        if(fff_m !== null){
          bVersion = fff_m[1];
          bName = "Firefox";
        }
      }

      // Ненастоящий IE:
      if(isChrome==true && nua.match(/rident/) !== null){
        bName = "Chrome (Fake IE)";
      }
      // Opera Neon:
      if(isChrome==true && nua.match(/MMS\//) !== null){
        bName = "Chrome (OperaNeon)";
      }
      // Opera GX:
      if(isChrome2==true && nua.match(/OPX\//) !== null){
        bName = "Chrome (OperaGX)";
        var oprgx = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        if(oprgx !== null){bVersion = oprgx[1];}
      }
      // Opera Mini Android:
      if(isOpera2==true && nua.match(/Version\//) !== null){
        var oprm = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        if(oprm !== null){bVersion = oprm[1];}
        bName = "Chrome (OperaMini)";
      }

      // Разновидности Firefox:
      var m_ffx = nua.match(/(Basilisk|mypal|PaleMoon|Waterfox|SeaMonkey|K\-Meleon)/i);
      //if(m_ffx !== null && isFirefox===true){
      if("mozInnerScreenX" in window){
        // PaleMoon Fix:
        if(bVersion == ""){
          var pale_m = nua.match(/PaleMoon\/(\d+(\.\d+){0,3})/i);
          var km_m = nua.match(/K\-Meleon\/(\d+(\.\d+){0,3})/i);
          if(pale_m !== null){ bVersion = pale_m[1]; }
          else{
            if(km_m !== null){ bVersion = km_m[1]; }
          }
        }
        if(m_ffx !== null){ bName = "Firefox ("+m_ffx[1]+")"; }
      }

      // Fake Nokia Browser:
      if(isFirefox==true && nua.match(/NokiaBrowser/i)!== null){bVersion = 0; }

      // Maxthon (Chrome):
      if(isMaxthon==true && (isChrome==true || isChrome2==true )){
        bName = "Chrome (Maxthon)";
        var mx1 = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        if(mx1 !== null){bVersion = mx1[1];}
        // Если Браузер в режиме adaptive, ставим правильную версию:
        //else { bVersion = MaxthonV; }
      }
      else {
        if(isChrome2==true && nua.match(/Maxthon/) !== null){
          bName = "Chrome (Maxthon)";
          var mx2 = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
          bVersion = mx2[1];
        }
      }
      // UCBrowser (Chrome):
      if(isChrome2==true && nua.match(/Iron/) !== null){
        bName = "Chrome (Iron)";
        var chri = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        bVersion = chri[1];
      }
      // UCBrowser (Chrome):
      if(isChrome2==true && nua.match(/UCBrowser\//) !== null){
        bName = "Chrome";
        var chruc = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        bVersion = chruc[1];
      }

      // Браузеры, основанные на Хром:
      var chrom_m = nua.match(/(Atom|YaBrowser|Edg|Avast|CCleaner|Vivaldi|Iron|Midori|MiuiBrowser|Mint\sBrowser|HuaweiBrowser|VivoBrowser|MZBrowser|HiBrowser|SamsungBrowser|UCBrowser)\/?\s*(\d+(\.\d+){0,3})/i);
      if(bName.match(/Fake/) === null){
        if(chrom_m !== null){
          bName = "Chrome ("+chrom_m[1]+")";
          var chrv = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
          if(chrv !== null){bVersion = chrv[1];}
        }
      }
      if('WhaleNaverSign' in window){
        bName = "Chrome (Whale)";
      }
      // Opera Mini:
      if(isOperaMini == true){
        var oprm_m = nua.match(/Opera\sMini\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        bName = "Opera Mini";
        bVersion = oprm_m[1];
      }
    }catch(e){}
    // Opera:
    try {
      if(isOpera == true && navigator.vendor == undefined){
        var oprp_m = nua.match(/Version\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        var oprpv_m = nua.match(/Opera\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        if(oprp_m !== null){
          bVersion = oprp_m[1];
        } else {
          bVersion = oprpv_m[1];
        }
        bName = "Opera";
      }
    }catch(e){}
    
    // Microsoft Edge:
    if(isEdgeChromium == true){
      var edgc_m = nua.match(/Edg\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
      if(bVersion != 0){
        if(edgc_m !== null){ bVersion = edgc_m[1]; }
      }
      bName = "Chrome (Edge)";
    }
    
    // Firefox (MyPal):
    try {
      var ffm_m = nua.match(/Mypal\/(\d+(\.\d+){0,3})/);
      if(isFirefox==true && ffm_m !== null){
        bName = "Firefox (MyPal)";
        bVersion = ffm_m[1];
      }
    }catch(e){}

    // CanvasBlocker: Firefox, не настоящий агент
    if("mozInnerScreenX" in window && bName.match(/Firefox/) === null){
      bName = "Firefox";
      bVersion = 0;
    }

    // Поисковые системы, тесты и прочие:
    try {
      var bots = nua.match(/(AdWord|Bot|Bing|YandexMetrika|adm\.tools|crawl|PTST|Headless|spid|Dataprovider|rank|hit|null|Google\sWeb)/i);
      if(bots !== null){
        if(bName == "unknown" || bots !== null){
          if(isFirefox==true){ bName = "Bot Firefox"; }
          if(isOpera==true){ bName = "Bot Opera"; }
          if(isSafari==true){ bName = "Bot Safari"; }
          if(isMaxthon==false && isChrome2==true && isOpera2==false){
            bName = "Bot Chrome";
          } //bVersion = 0;
          if(isMaxthon==true){ bName = "Maxthon";bVersion = MaxthonV; }
          if(isMaxthon==false && isChrome2==true && isOpera2==true){
            bName = "Bot Chrome (Opera)";
          }
        }
      }
      // Исправляем ошибку:
      if(bName=="Safari (Fake)" && nua.match(/NokiaBrowser/)!== null){
        bName = "Fake NokiaBrowser";
        bVersion = 0;
      }
    }catch(e){}

    // Исправляем всё остальное:
    // Если версия не начинается с цифры:
    //if(bVersion.match(/^\d+/) === null){ bVersion = 0; }
    // Если версия содержит пробел:
    //else if(bVersion.match(/\s/) !== null && ie == 0){ bVersion = 0; }

    // SliTaz: TazWeb
    try {
      if(nua.match(/TazWeb\//) !== null){
        var slitaz_m = nua.match(/TazWeb\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        if(slitaz_m !== null){
          bVersion = slitaz_m[1];
          bName = "Chrome (TazWeb)";
        }
      }
    }catch(e){}

    // IE11 fake UserAgent:
    if (ie > 0){ bName = "IE";}

    // Maxthon Nitro (Chrome):
    try {
      if(nua.match(/MxNitro\//) == true){
        var mxv_m = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
        if(mxv_m !== null){
          bVersion = mxv_m[1];
          bName = "Chrome (Maxthon Nitro)";
        }
      }

      // Maxthon 4.1.3.2000: версия из UserAgent:
      //$mxi = is_null($MaxthonV);
      var mx4_m = nua.match(/Maxthon\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
      if(mx4_m !== null){ // && $mxi == 1
        MaxthonV = mx4_m[1];
      }
    }catch(e){}
    //if(bVersion == 0 && isMaxthon == true){bVersion = MaxthonV; }
    // если Да, указываем настоящую версию Maxthon:
    //if(isMaxthonVersion == true){bVersion = MaxthonV; }
    
    // А теперь выводим версию:
    if(bName != "IE"){ // НЕ InternetExplorer
      // А если UserAgent не настоящий, но это IE?
      if(isIE == true){
        bName = "IE";
        if(ie == 0){
          try {
            var iez_m = nua.match(/MSIE\s(\d)/);
            if(nua.match(/Trident\/7/) !== null){ bVersion = 11;}
            else if(nua.match(/Trident\/6/) !== null){ bVersion = 10;}
            else if(nua.match(/Trident\/5/) !== null){ bVersion = 9;}
            else if(nua.match(/Trident\/4/) !== null){ bVersion = 8;}
            else { bVersion = iez_m[1]; }
          }catch(e){}
        } else { bVersion = ie; }
      }
      // Теперь точно не IE:
      else {
        // Мы не смогли определить браузер:
        if(bName == ""){
          bName = "Unknown";
          // Chrome, но с другим UserAgent:
          //   Maxthon < 5.2.5.3000 (Chrome 61), ViaBrowser, 
          //   Chrome *, Opera >= 14
          //   и Safari 5.1.7 на Windows.
          try {
            if(isChrome==false && isChrome2==true && isChrome3==false){
              // Не настоящий Firefox:
              if(nua.match(/Firefox/) !== null){
                bName = "Chrome (Fake Firefox)"; bVersion = 0;
              }
              // Safari 5.1.7 на Windows:
              else if(navigator.vendor.match(/Apple/g)!==null &&
                  isSafari==true && OS_Name.match(/Windows/)!==null){
                bName = "Safari";
                var saf_win = nua.match(/\sVersion\/(\d+(\.\d+){0,3})/);
                if(nua.match(/\sVersion\/(\d+(\.\d+){0,3})/) !== null){
                  bVersion = saf_win[1];
                } else {
                  // Нет версии, берём Safari
                  var saf_win0 = nua.match(/Safari\/(\d+(\.\d+){0,3})/);
                  if(saf_win0 !== null){
                    bVersion = saf_win0[1];
                  } else {
                    var saf_win2 = nua.match(/\sAppleWebKit\/(\d+(\.\d+){0,3})/);
                    bVersion = saf_win2[1];
                  }
                }
              }
              else {
                bName = "Chrome";
                var chr3m = nua.match(/Chrome\/(\d+(\.\d+(\.\d+)?(\.\d+)?)?)/i);
                //bVersion = 0;
                // Не Android, значит версия = 0!
                if(npl.match(/(armv|aarch|ARM)/) === null){ bVersion = 0; }
                // Android:
                else {
                  // Android, но UserAgent = Windows, значит версия = 0!
                  if(nua.match(/Windows/) !== null && npl.match(/arm/i) !== null){
                    bVersion = 0;
                  }
                  // Android:
                  else {
                    if(chr3m!==null){ bVersion = chr3m[1];}
                    else{ bVersion = 0; }
                  }
                }
              }
            }
            // Не Chrome-подобный Браузер, значит версия будет неизвестна:
            else { bVersion = bVersion; }
          }catch(e){}
        } // Браузер не определён.}
      } // Прочие браузеры.
    } else {
      bVersion = ie; // IE.
    }
    // Всё готово!

    return { name: bName, version: bVersion };
  },
  // Мобильное устройство: телефон, смартфон, планшет, КПК...
  isMobile: function () { // в последнюю очередь спрашиваем пользовательский агент.
    try {
      if(navigator.platform.match(/(arm|aarch64|iP)/g) != null){
        return 'mobile';
      }
      else {
        if(navigator.platform.match(/(Win\d+|i686|x86_64|MacIntel)/) !== null){
          return 'pc';
        }
        else {
          if(navigator.userAgent.match("Mobi") !== null &&
            navigator.platform != "Win32"){
            return 'mobile';
          }
          else{ return 'pc'; }
        }
      }
    } catch(e){
      return 'unknown';
    }
  },
  // Поддерживает ли Браузер касания (НЕ устройство, а Браузер!):
  isTouch: function () {
    try {
      if(navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0){
        return 'Tach';
      } else {
        return 'nTach';
      }
    } catch(e){
      try {
        if ('ontouchstart' in window || 'createTouch' in document ||
            window.DocumentTouch && document instanceof DocumentTouch) {
          return 'Tach';
        } else {
          return 'nTach';
        }
      }catch(e){
        return 'nTach';
      }
    }
  },
  // Поддержка Браузером: insertAdjacent HTML & Text
  isInsertAdjacent: function () {
    if (('insertAdjacentHTML' || 'insertAdjacentText') in (document.documentElement || window.document)) {
      return 'iA';
    } else {
      return 'nIA';
    }
  },
  // Поддержка Браузером: querySelector & querySelectorAll
  isQuerySelector: function () {
    if (('querySelector' || 'querySelectorAll') in (document.documentElement || window.document)) {
      return 'qs';
    } else {
      return 'nQS';
    }
  },
  /*
    Поддержка Браузером: Flexbox:
      https://github.com/ergcode/ergonomic.detect_flex
    [1] flex (W3C 2012) supported
    [2] flex (W3C 2012) is supported with the condition
      of adding vendor prefixes for -webkit-
    [3] flex (W3C 2012) is supported with the condition
      of adding vendor prefixes for -ms-
    [4] box (W3C 2009), is maintained with the condition
      of adding vendor prefixes for -webkit-
    [5] box (W3C 2009), is maintained with the condition
      of adding vendor prefixes for -moz-
    [6] supported display: table
    [7] supported by display: inline
  */
  isFlexbox: function () {
    var _DD;
    !function(){
      window._DD;var e=document,t=window.getComputedStyle,
      l=e.getElementsByTagName("head")[0],a=e.createElement("p"),
      r=a.style,n="display",i=["flex","-webkit-flex","-ms-flexbox",
        "-webkit-box","-moz-box","table","inline"],
      o=["flexWrap","WebkitFlexWrap","msFlexWrap"];
      l.appendChild(a);
      for(var p=0,d=i.length;p<d;p++)if((!o[p]||o[p]in r)&&(r.cssText=n+":"+i[p],(t?t(a,null).getPropertyValue(n):a.currentStyle[n])==i[p])){_DD=p+1;break;}l.removeChild(a);
    }();
    return 'fb'+_DD;
  },
  // Поддержка Браузером: CSS3 Grid
  isGrid: function () {
    var el = document.createElement("div");
    el.style.cssText = "display:grid";
    if(!!el.style.length === true){
      return 'grid';
    } else {
      return 'nGrid';
    }
  },
  // Поддержка Браузером: CSS3 Calc
  isCalc: function () {
    var el = document.createElement("div");
    el.style.cssText = "width:calc(10px)";
    //return !!el.style.length;
    if(!!el.style.length === true){
      return 'calc';
    } else {
      return 'nCalc';
    }
  },
  // Поддержка Браузером: CSS3 @supports
  isSupports: function () {
    var supportsCSS = !!((window.CSS && window.CSS.supports) || window.supportsCSS || false);
    if (supportsCSS === false) {
      return 'nSup';
    } else {
      return 'sup';
    }
  },
  // Поддержка Браузером: ClassList
  isClassList: function () {
    var supportCL = !!document.documentElement.classList;
    if (supportCL === false) {
      return 'nCl';
    } else {
      return 'cl';
    }
  },
  // Онлайн / Оффлайн
  // ! Не работает так как необходимо.
  isOnLine: function () {
    try {
      if (window.navigator.onLine) { return 'onl'; }
      else { return 'offl'; }
    } catch(e){ return 'unknownLanStatus'; }
  },
  // Платформа Браузера (Win32, Win64, Linux x86_64)
  isPlatform: function () {
    try {
      var wnmp = window.navigator.platform;
      return wnmp;
    } catch(e){
      return "unknownPlatform";
    }
  },
  // Определения языка Браузера:
  whatLang: function () {
    if(window.navigator.userLanguage !== undefined){ // IE10
      return window.navigator.userLanguage;
    } else {
      return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
    }
  },
  // Поддержка Браузером: Cookies
  isCookies: function () {
    var cookieEnabled = (navigator.cookieEnabled)? true : false;
    if (typeof navigator.cookieEnabled=="undefined" && !cookieEnabled){
      document.cookie="testcookie";
      cookieEnabled=(document.cookie.indexOf("testcookie")!=-1)? true : false;
    }
    if (cookieEnabled){
      return 'cook';
    } else {
      return 'nCook';
    }
  },
  // Поддержка Браузером v2: Local Storage:
  isLocalStorage: function () {
    // Правильная проверка:
    var lstorag;
    try {
      localStorage.setItem('test','text');
      lstorag = localStorage.getItem('test');
      if(lstorag === 'text'){
        localStorage.removeItem('test');
        return 'ls';
      }
      else {
        localStorage.removeItem('test');
        return 'nLS';
      }
    }catch(e){
      return 'nLS';
    }
  },
  // FileSystem API: http://dev.w3.org/2009/dap/file-system/pub/FileSystem/
  isFileSystem: function () {
    if ('requestFileSystem' in window) {
      return 'FS';
    } else {
      return 'nFS';
    }
  },
  // File API: виртуальная файловая система (только в Chrome).
  isFileAPI: function () {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      return 'File';
    } else {
      return 'nFile';
    }
  },
  // Базы данных:
  // Поддержка Браузером: WebSQL (SQLite):
  isWebSQL: function () {
    var supports_webSQL = "openDatabase" in window;
    if(supports_webSQL === true){
      return 'WSQL';
    } else {
      return 'nWSQL';
    }
  },
  // Поддержка Браузером: indexedDB:
  isIndexedDB: function () {
    if (!(('indexedDB'||'mozIndexedDB'||'webkitIndexedDB'||'msIndexedDB') in window)) {
      return 'nIDB';
      //return;
    } else {
      return 'IDB';
    }
  },
  // Новое!
  // Поддержка Браузером: Веб-компоненты
  isWebComponents: function () {
    var capaWebComponents = "webc";
    if ('customElements' in window){
      capaWebComponents += '1';
    } else {
      if ('registerElement' in document){
        capaWebComponents += '0';
      } else {
        capaWebComponents = 'nWebC';
      }
    }
    return capaWebComponents;
  },
  /* Поддержка Браузером: ES6 Object:
  isES6: function () {
    //if(theES6 === true){ return 'ES6';} else { return 'nES6'; }

    // https://stackoverflow.com/a/48531693
    //try { Function("() => {};"); return 'ES6'; }catch(e){ return 'nES6'; }

    // Old:
    //if(!!(Object.assign&&Object.is&&Object.setPrototypeOf)){ return 'ES6'; } else { return 'nES6'; }

    return ES6support;
  },*/
  // Promise -> Fetch -> Async/Await with Fetch
  // Поддержка Браузером: Promises:
  Promises: function () {
    function Promises(){
      return"Promise"in window&&"resolve"in window.Promise&&"reject"in window.Promise&&"all"in window.Promise&&"race"in window.Promise&&function(){
        var A;return new window.Promise(function(e){A=e;}),"function"==typeof A;
      }();
    }
    if(Promises()===true){
      return 'prms';
    } else {
      return 'nPrms';
    }
  },
  // Поддержка Браузером: Fetch:
  isFetch: function () {
    if ("fetch" in window){
      return 'ftch';
    } else {
      return 'nFtch';
    }
  },
  // Пробуем получить navigator.userAgentData в Google Chrome версии > 103:
  isUAdata: function () {
    if ('userAgentData' in navigator){ // если поддерживается:
      var nuab = navigator.userAgentData.brands;
      var brend = "-", versn = 0;
      //, brnd = "-";
      // Поддерживается, но определить версию не получается:
      if(nuab.length === 0){
        return false; //"navigator.userAgentData is supported, but cant be identified.";
      } else{
        // Перебираем все Брэнды:
        for (var uad = 0; uad < nuab.length; uad++) {
          /* Совпадение с:
          brnd = nuab[uad].brand.match(/(Opera\sGX|Opera|YaBrowser|CCleaner\sBrowser|Microsoft\sEdge|Google\sChrome)/g) || [];
          // Только нужные:
          if(brnd[0] != undefined){ brend = brnd[0]; versn = nuab[uad].version; break;}
          // Прочие: Chromium
          else {
            if(nuab[uad].brand.match(/Brand/g) == null){
              brend = nuab[uad].brand; versn = nuab[uad].version;
            }
          }*/
          if(nuab[uad].brand.match(/Chromium/g) == null &&
              nuab[uad].brand.match(/Brand/g) == null){
            brend = nuab[uad].brand; versn = nuab[uad].version; break;
          }
          else if(nuab[uad].brand.match(/Brand/g) == null){
            brend = nuab[uad].brand; versn = nuab[uad].version;
          }
        } // end Указываем Брэнд и Версию.
        // Выводим информацию:
        return "navigator.userAgentData: Brand: "+ brend +
        ", Version: "+ versn +", Mobile: "+navigator.userAgentData.mobile+
        ", Platform: "+navigator.userAgentData.platform;
      }
    } else { // Не поддерживается:
      // Выводим информацию в тег "uaData": Не поддерживается.
      return false;
      //"navigator.userAgentData is not supported or disabled by security.";
    }
  },
  // Поддержка Service Worker:
  isServiceWorker: function () {
    // this.isFetch() Скорее всего, если браузер поддерживает Fetch,
    //   то у него есть и Рабочий.
    if ('serviceWorker' in navigator){ // если поддерживается:
      return 'sWrkr';
    } else { // Не поддерживается:
      if(this.isFetch() === "Fetch"){
        return 'sWrkr2';
      } else {
        return 'nSWrkr';
      }
    }
  },
  isWebWorker: function () {
    // Веб-работник (web worker),
    //  предназначен для выполнения фоновых вычислений:
    // IE 10*, FF 3.5, Chr 3, Safari 4, Opr 10.6, Safari iOS —, Android —
    if("Worker" in window){ //SharedWorker
      return 'wWrkr';
    } else {
      return 'nwWrkr';
    }
  },
  isBeacon:function () {
    // navigator.sendBeacon:
    // Chr 39, FF 31, Saf 11.1, Opr 26, Edg 14
    if ('sendBeacon' in navigator){ // если поддерживается:
      return 'sBecon';
    } else {
      return 'nSBecon';
    }
  },
  isVar:function () {
    // CSS3 Variables:
    // Chrome 49, Firefox 31, Opera 36, Edge 16, Safari 10
    try {
      if(window.CSS && CSS.supports('(--foo: red)')){
        return 'cssVar';
      } else { return 'nCSSvar'; }
    } catch(e) {  }
  },
  isColor:function(){
    //* Предпочитает цветовую схему (Prefers Color Scheme):
    try {
      if(//window.matchMedia('(prefers-color-scheme: dark)').matches === true ||
        //window.matchMedia('(prefers-color-scheme: light)').matches === true ||
        window.matchMedia('(prefers-color-scheme)').matches === true){
        return 'color';
      } else { return 'nColor'; }
    } catch(e){ return 'nColor'; }
  },
  isAccentColor:function(){
    //* Акцентный цвет: Chr93, Edg93, FF92, Saf15.4
    try {
      if(CSS.supports("accent-color:indigo") === true){ return 'accColor'; }
      else { return 'nAccColor'; }
    } catch(e){ return 'nAccColor'; }
  },
  isContainerQueries:function(){
    //* Container Queries (2022): Chr105, Edg106, FF110, Saf16
    if ("container" in document.documentElement.style) { return 'cQuery'; }
    else { return 'nCQuery'; }
  },
  isSubgrid:function(){
    //* Под-сетка: Chr117, Edg117, FF71, Saf16
    try {
      if(CSS.supports("grid-template-columns:subgrid") === true){
        return 'subGrid';
      }
      else{ return 'nSubgrid'; }
    }catch(e){return 'nSubgrid';}
  },
  // предпочитает другой контраст:
  isPrefersContrast:function(){
    try {
      if(window.matchMedia('(prefers-contrast: no-preference)').matches === true){
        return 'pContrast';
      }
      else if(window.matchMedia('(prefers-contrast: high)').matches === true){
        return 'pContrastH';
      }
      else { return 'nContrast'; }
    }catch(e){return 'nContrast';}
  },
  isPrefersRData:function(){
    // предпочитает сократить траффик (Opera?):
    try {
      if(window.matchMedia('not all and (prefers-reduced-data), (prefers-reduced-data), ').matches ||
        window.matchMedia('(prefers-reduced-data: no-preference)').matches){ return "pRD";}
      else { return 'nPRD'; }
    }catch(e){return 'nPRD';}
  },
  isLightLevel:function(){
    // зависимость от освещения:
    // @media (light-level dim|normal|washed)
    try {
      if(window.matchMedia('(light-level: dim)').matches === true){
        return "lightDim";
      }
      else if(window.matchMedia('(light-level: normal)').matches === true){
        return "lightNormal";
      }
      else if(window.matchMedia('(light-level: washed)').matches === true){
        return "lightWashed";
      }
      else{ return "noLight"; }
    }catch(e){return 'noLight';}
  },
  isLayer:function(){
    // Каскадные слои: Chr99 (Opr85), Edg99, Saf15.4, FF97
    if('CSSLayerStatementRule' in window){ return "layer";}
    else { return 'nLayer'; }
  },
  isLazyLoad:function(){
    try {
      if ('loading' in HTMLImageElement.prototype) { return "lazy"; }
      else { return 'nLazy'; }
    } catch(e){ return 'nLazy'; }
  },
  /*isMapGroupBy:function(){
    // Map.groupBy: Chr 117, FF 119, Saf 17.4
    try {
      var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var res = Map.groupBy(arr, n => n % 2 === 0 ? 'even' : 'odd');
      console.log(res);
      // Map { 'odd' => [1, 3, 5, 7, 9], 'even' => [2, 4, 6, 8, 10] }
      return 'mapGroupBy';
    } catch(e){
      return 'nMapGroupBy';
    }
  },*/
  // 
  // media-queries:
  isMatchMedia:function(){
    if ("matchMedia" in window){ return 'matchMedia'; }
    else { return 'nMatchMedia'; }
  },
  isMutationObserver:function(){
    if ("MutationObserver" in window) {return 'MutObs'; }
    else { return 'nMutObs'; }
  },
  // navigator.connection: Chr61 (Opr48), Edg79, FF31 only
  //   effectiveType slow-2g, 2g, 3g, 4g
  isSpeed:function(){
    var spd = [];
    if('connection' in navigator){
      spd[0] = navigator.connection.downlink;
      spd[1] = navigator.connection.effectiveType;
      if(spd !== (null || undefined)){return spd;}
    } else {
      spd[0] = '0';
      spd[1] = 'no';
      return spd;
    }
  },
  // Old:
  isMutationEvent:function(){
    if ("MutationEvent" in window) {return 'Mutate'; }
    else { return 'nMutate'; }
  },
  isAVIF:function(){
    // Использует невидимое изображение, добавленное в начале страницы:
    var cl = document.body.getAttribute('data-avif');
    if(cl == "true"){ return "aviF"; }
    else if(cl == "false"){ return "nAviF"; }
  },
  isWebP:function(){
    // Использует невидимое изображение, добавленное в начале страницы:
    var cl = document.body.getAttribute('data-webp');
    if(cl == "true"){ return "webP"; }
    else if(cl == "false"){ return "nWebP"; }
  },
  // ! Устаревшие технологии: AppCache, base64, data-*
  // Data URI: <img src="data:"/>
  isJPEGXL:function(){
    // Использует невидимое изображение, добавленное в начале страницы:
    var cl = document.body.getAttribute('data-jxl');
    if(cl == "true"){ return "jpegXL"; }
    else if(cl == "false"){ return "nJPEGXL"; }
    else { return "nJPEGXL"; }
  },
  isJPEGXR:function(){
    // Использует невидимое изображение, добавленное в начале страницы:
    var cl = document.body.getAttribute('data-jxr');
    if(cl == "true"){ return "jpegXR"; }
    else if(cl == "false"){ return "nJPEGXR"; }
    else { return "nJPEGXR"; }
  },
  // IE8+
  isBase64: function(){
    var d3 = null;
    var data = new Image();
    data.onload = data.onerror = function(){
      if(this.width != 1 || this.height != 1){
        return d3 = false;
      } else {
        return d3 = true;
      }
    };
    data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    if(d3 === false){ return 'nB64'; } else { return 'b64'; }
  },
  isAppCache: function () {
    // Автономное приложение (appcache, файл manifest) макс. 5мб
    // IE 10-11, FF 3.5-115, Chr 5-71, Safari 4, Opr 10.6-49,
    // Safari iOS 2.1, Android 2
    if("applicationCache" in window){
      return 'apCach';
    } else {
      return 'nApCach';
    }
  },
  isDataset:function () {
    // Dataset (дата-аттрибуты):
    //  Chrome 7, Firefox 6, Opera 12.18, IE 11, Safari 5.1,
    //  Android Chrome 123, Android Firefox 124, Android 3, iOS Safari 5.1
    try {
      var hom = document.getElementsByTagName('body')[0].dataset.home = 'true';
      if(hom === 'true'){ return 'dt'; } else { return 'nDt'; }
    } catch(e){ return 'nDt'; }
  }
};
// End Feature Detection.

// Добавляет класс поддержки к <html>
var docElement=(document.documentElement||window.document);
docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1js$2');

// Добавляет поиск по классу браузерам, в которых этого нет:
document.getElementsByClassName = function(cl) {
  var retnode = [];
  var elem = this.getElementsByTagName('*');
  for (var i = 0; i < elem.length; i++) {
    if((' ' + elem[i].className + ' ').indexOf(' ' + cl + ' ') > -1){
      retnode.push(elem[i]);
    }
  }
  return retnode;
};

// Функции для удобства:
function addClass(o, c){ // добавить класс
  var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
  if (re.test(o.className)) return;
  o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
}
function removeClass(o, c){ // удалить класс
  var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
  o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
}
function hasClass(o, c) { // существует ли класс
  if (o.classList) {
    o.classList.contains(c);
  } else {
    new RegExp('(^| )' + c + '( |$)', 'gi').test(o.c);
  }
}

// ---------------------------------------------------------
// аналог localStorage для Firefox v2.0 - 12 (FF10 Win2000):
if("globalStorage" in window){
  try {
    globalStorage[location.host].name = "Mykola";
    if(globalStorage[location.host].name == "Mykola"){
      addClass(htm, 'gStor');
    }
    globalStorage[location.host].removeItem("name");
  }catch(e){
    addClass(htm, 'nGStor');
  }
} else {
  addClass(htm, 'nGStor');
}

// ---------------------------------------------------------

// ---------------------------------------------------------
// Media Queries:
function MediaQ() {
  // начинаем:
  var diw = 0, dbcw = 0, dbch = 0, ih = 0, iw = 0;
  // Внутренняя ширина экрана:
  diw = window.innerWidth || document.documentElement.clientWidth ||
    document.body.clientWidth;
  dbcw = document.body.clientWidth;
  dbch = document.body.clientHeight;
  // Получаем внутреннюю ширину и длинну окна браузера:
  iw = document.documentElement.clientWidth || window.innerWidth;
  ih = document.documentElement.clientHeight || window.innerHeight;

  // Перечислим все элементы с классом colr:
  var colr = document.getElementsByClassName("colr");
  var colorz = [], screenz = [];
  for (var hi = 0; hi < colr.length; hi++) {
    // Заберём у них дата-аттрибуты цвета и разрешения экрана:
    var currScreenColor = colr[hi].getAttribute("data-color");
    var currScreenWidth = colr[hi].getAttribute("data-scrwidth");
    if(detect.Browser().name == "IE"){
      colr[hi].style.setAttribute("cssText","background-color:#"+currScreenColor);
    } else {
      colr[hi].setAttribute("style","background-color:#"+currScreenColor);
    }
    // и добавим их в массив:
    colorz[hi] = currScreenColor;  // цветов,
    screenz[hi] = currScreenWidth; // разрешений экранов.
  }
  // Перебираем все элементы в массиве Разрешений:
  for (var ai = 0; ai < screenz.length; ai++) {
    // Если Внутренняя ширина экрана совпадает с значением в массиве, прибавляем 1
    if (diw == screenz[ai+1]){
      screenz[ai+1];
    }
    // Если Внутренняя ширина экрана меньше или больше значения в массиве:
    if (diw <= screenz[ai] && diw > screenz[ai+1]){
      screenz[ai];
    }
  }
  // Перебираем все элементы в массиве Разрешений. Снова:
  for (var i = 0; i < screenz.length; i++) {
    // Если Внутренняя ширина экрана меньше или равно значению в массиве:
    if (diw <= screenz[i]) {
      // Устанавливаем цвет фона страницы:
      if(detect.Browser().name == "IE"){
        document.body.style.setAttribute("cssText","background-color:#"+ colorz[i]);
      }
      else {
        document.body.setAttribute('data-screen', screenz[i]);
        document.body.setAttribute('style', 'background-color:#' + colorz[i]);
      }
    } // Цвет фона задан.
  }

  // Задаёт цвет текста свойств Браузера. С CSS немного проще:
  var scrRes = document.getElementsByClassName("screenRes");
  var browsCapab = document.getElementById("browserCapabilities");
  if(diw > 800){
    removeClass(browsCapab,'darkGray2');
    addClass(browsCapab,'white2');
    // Перебираем элементы с классом "screenRes":
    for (var iz = 0; iz < scrRes.length; iz++) {
      removeClass(scrRes[iz],'darkGray');
      addClass(scrRes[iz],'white'); // и задаём им цвет текста (белый).
    }
  }
  if(diw <= 800){
    removeClass(browsCapab,'white2');
    addClass(browsCapab,'darkGray2');
    // Перебираем элементы с классом "screenRes":
    for (var iy = 0; iy < scrRes.length; iy++) {
      removeClass(scrRes[iy],'white');
      addClass(scrRes[iy],'darkGray'); // и задаём им цвет текста (угольный).
    }
  }
  // Часть 2:
  // В зависимости от Внутренней ширины экрана изменяем вид таблицы экранов:
  var sc1 = document.getElementById("screensCell1");
  var sc2 = document.getElementById("screensCell2");
  if(diw >= 320){
    removeClass(sc1,'floatL'); addClass(sc1,'inlBlock');
    removeClass(sc2,'floatL'); addClass(sc2,'inlBlock');
  }
  if(diw < 320){
    removeClass(sc1,'inlBlock'); addClass(sc1,'floatL');
    removeClass(sc2,'inlBlock'); addClass(sc2,'floatL');
  }

  // Получаем ID элемента текста:
  var mainInfo = document.getElementById("mainInfo");

  // Logo:
  var macLogo = '<span class="logo-macos"></span>';
  var iOSLogo = '<span class="logo-ios"></span>';
  var androidLogo = '<span class="logo-android"></span>';
  var linuxLogo = '<span class="logo-linux"></span>';
  var winLogo = '<span class="logo-windows"></span>';
  try {
    if(window.navigator.platform.match(/(Win\d+|x64)/)){ winLogo = winLogo; }
    else{
      if(detect.OSname().match("Linux") !== null){
        winLogo = linuxLogo; }
      else if(detect.OSname().match("Android") !== null){
        winLogo = androidLogo; }
      else if(detect.OSname().match("Mac") !== null){
        winLogo = macLogo; }
      else if(detect.OSname().match("iOS") !== null){
        winLogo = iOSLogo; }
      else if(detect.OSname().match("Windows") !== null){
        winLogo = winLogo; }
    }
  }catch(e){}

  // Устанавливаем в ID "w" текст с свойствами экрана,
  //  имя и версия Браузера, строка агента Браузера:
  var scrLogo, scrLogo2, scrLogo3;
  scrLogo = '<span class="screen_w" title="screen width"></span>';
  scrLogo2 = '<span class="inner_w" title="inner width"></span>';
  scrLogo3 = '<span class="body_w" title="body width"></span>';

  var UAdata="";
  if(detect.isUAdata() !== false){
    UAdata = '<span class="nua">'+ detect.isUAdata() +"</span><br />";
  } else { UAdata=""; }

  // Browser Logo:
  var browserLogo="",nam="";
  if(detect.Browser().name.match("Chrome") !== null){
    if(detect.Browser().name.match(/Chrome \(Opera/g) != null){
      browserLogo = '<span class="logo-opera" title="'+detect.Browser().name+
        '">'+detect.Browser().name+'</span>';
    }
    else if(navigator.userAgent.match(/OPR\/[1-9]/ig) !== null){
      browserLogo = '<span class="logo-opera" title="'+detect.Browser().name+
        ' (Opera)">'+detect.Browser().name+' (Opera)</span>';
    }
    else{
      nam = detect.Browser().name.replace(/Chrome/g," ");
      browserLogo = '<span class="logo-chrome" title="'+detect.Browser().name+
        '"></span> '+detect.Browser().name;
    }
  }
  else if(detect.Browser().name.match("Opera") !== null){
    if(detect.Browser().name == "Opera"){
      nam = detect.Browser().name.replace(/Opera/g," ");
    }
    browserLogo = '<span class="logo-opera" title="'+detect.Browser().name+
      '">'+detect.Browser().name+'</span>';
  }
  // PaleMoon (Firefox from MoonChild):
  else if(detect.Browser().name.match("Firefox") !== null){
    nam = detect.Browser().name.replace(/Firefox/g,"");
    browserLogo = '<span class="logo-firefox" title="'+detect.Browser().name+
      '">'+detect.Browser().name+'</span>';
  }
  else if(detect.Browser().name.match("Firefox") !== null &&
      navigator.userAgent.match(/PaleMoon/g) !== null){
    nam = detect.Browser().name.replace(/Firefox/g,"");
    browserLogo = '<span class="logo-firefox" title="'+detect.Browser().name+
      '">'+detect.Browser().name+'</span>';
  }
  else if(detect.Browser().name.match("Safari") !== null){
    browserLogo = '<span class="logo-safari" title="'+detect.Browser().name+
      '">'+detect.Browser().name+'</span>';
  }
  else if(detect.Browser().name.match("IE") !== null){
    browserLogo = '<span class="logo-ie" title="'+detect.Browser().name+
      '">'+detect.Browser().name+'</span>';
  }
  else {
    browserLogo = detect.Browser().name+" ";
  }
  // Выводим текст:
  /*
  try {isAVIFVar = localStorage.getItem('AVIF');}catch(e){isAVIFVar = 'nAviF';}
  try {isWebpVar = localStorage.getItem('webp');}catch(e){isWebpVar = 'nWebP';}
  try {avifVar = localStorage.getItem('avif');}catch(e){avifVar = 'nAviF';}
  */
  // Picture, SrcSet, CSS Math: Clamp.
  var the_srcset = '', the_picture = '',clamp = '', es6i = '',
    cacheAPI = '', savesData = '';
  if("srcset" in creatu("img")){ the_srcset = 'srcset'; }
  else {the_srcset = 'nSrcSet';}
  if("HTMLPictureElement" in window){ the_picture = 'picture'; }
  else {the_picture = 'nPic';}
  if('CSSMathClamp' in window){ clamp = "Clamp"; } else {clamp = "nClamp";}
  // Detect ES6 import:
  try {
    if('noModule' in HTMLScriptElement.prototype){es6i="ES6import";}
    else{es6i="nES6import";}
  }catch(e){es6i="nES6import";}
  if('caches' in self){ cacheAPI = 'cacheAPI'; }
  else{ cacheAPI = "nCacheAPI"; }
  if ('connection' in navigator) {
    if (navigator.connection.saveData === true) {savesData = "saveData";}
    else { savesData = "noSaveData"; }
  } else { savesData = "noSaveData"; }
  //
  var pxRatio = '';
  if ("devicePixelRatio" in window){
    pxRatio = "  &nbsp;  |  &nbsp;  " +
      '<abbr title="Device Pixel Ratio" data-title="Device Pixel Ratio">'+
      Math.floor(window.devicePixelRatio * 100) / 100+'</abbr>';
  } else { pxRatio = ''; }
  // Общий текст:
  var theText = scrLogo+" "+
    screen.width + "&times;" + screen.height +
    "  &nbsp;  |  &nbsp;  "+ scrLogo2 +" "+
    iw+"&times;"+ih+"" +
    "  &nbsp;  |  &nbsp;  "+ scrLogo3 +" "+
    dbcw + "&times;" + dbch + pxRatio +
    " <br />"+ browserLogo +" "+detect.Browser().version+'<div class="the_os">'+
    winLogo +"  "+detect.OSname()+"</div><span class='nua'>"+
      navigator.userAgent+"</span><br />" +
    // Поддержка функций браузера:
    detect.isTouch() +" "+ detect.isPlatform() +" "+ detect.isOnLine() +" "+
      detect.whatLang() +"<br /> "+
    // Старые:
    '<abbr title="InsertAdjacent: Chr4, FF48, Opr9.6, Saf3.1, IE6+" '+
      'data-title="InsertAdjacent: Chr4, FF48, Opr9.6, Saf3.1, IE6+"> '+
      detect.isInsertAdjacent() +"</abbr> "+
    '<abbr title="QuerySelectorAll: Chr4, FF3.5, Opr10.1, Saf3.2, IE9+" '+
      'data-title="QuerySelectorAll: Chr4, FF3.5, Opr10.1, Saf3.2, IE9+"> '+
      detect.isQuerySelector() +"</abbr> "+
    '<abbr title="srcset: Chr38, Opr25, Edg16, Saf9(9 iOS), FF38" '+
      'data-title="srcset: Chr38, Opr25, Edg16, Saf9(9 iOS), FF38">'+
      the_srcset +"</abbr> "+
    '<abbr title="Picture: Chr38, Opr25, Edg13, Saf9.1(9.3 iOS), FF38" '+
      'data-title="Picture: Chr38, Opr25, Edg13, Saf9.1(9.3 iOS), FF38">'+
      the_picture +"</abbr> \r\n"+
    '<abbr title="ClassList: Chr28, FF26, Opr15, Saf7, IE10+" '+
      'data-title="ClassList: Chr28, FF26, Opr15, Saf7, IE10+"> '+
       detect.isClassList() +" </abbr> "+
    detect.isBase64() +" "+
    '<abbr title="dataset: Chr7, FF6, Opr12, IE11, Saf5.1" '+
      'data-title="dataset: Chr7, FF6, Opr12, IE11, Saf5.1"> '+ 
      detect.isDataset() +' </abbr><br />\r\n'+
    // Новые:
    '<abbr title="WebWorker: Chr4, Saf4, Opr10.6, FF3.5, IE10+" '+
      'data-title="WebWorker: Chr4, Saf4, Opr10.6, FF3.5, IE10+">'+
      detect.isWebWorker()+"</abbr> "+
    '<abbr title="Flexbox: Chr29, FF28, Saf9, Opr12.1" '+
      'data-title="Flexbox: Chr29, FF28, Saf9, Opr12.1">'+
      detect.isFlexbox() +"</abbr> "+
    '<abbr title="Grid: Chr58, FF54(52), Saf10.1 (10.3), Opr44" '+
      'data-title="Grid: Chr58, FF54(52), Saf10.1 (10.3), Opr44">'+
      detect.isGrid() +"</abbr> "+
    '<abbr title="Calc: Chr26, Saf6.1 (7 iOS), Opr15, FF16" '+
      'data-title="Calc: Chr26, Saf6.1 (7 iOS), Opr15, FF16">'+
      detect.isCalc() +"</abbr> "+
    '<abbr title="@supports: Chr28, FF22, Saf9, Opr12.1" '+
      'data-title="@supports: Chr28, FF22, Saf9, Opr12.1">'+
      detect.isSupports() +"</abbr> "+
    '<abbr title="App Cache: IE 10-11, FF 3.5-115, Chr 5-71, Saf 4 (2.1 iOS),'+
      ' Opr 10.6-49, Saf , Android 2"'+
      'data-title="App Cache: IE 10-11, FF 3.5-115, Chr 5-71, Saf 4 (2.1 iOS),'+
        ' Opr 10.6-49, Android 2">'+
      detect.isAppCache() +"</abbr><br />\r\n"+
    '<abbr title="MutationEvent: Chr4, Opr12.1, Edg79, Saf3.1(3.2 iOS), FF2, IE9" '+
      'data-title="MutationEvent: Chr4, Opr12.1, Edg79, Saf3.1(3.2 iOS), FF2, IE9">'+
      detect.isMutationEvent()+"</abbr> "+
    '<abbr title="MatchMedia: Chr10, FF6, Opr12.1, IE10+, Saf5.1" '+
      'data-title="MatchMedia: Chr10, FF6, Opr12.1, IE10+, Saf5.1">'+
      detect.isMatchMedia()+"</abbr> "+
    // Хранилище:
    detect.isCookies() +" "+
    '<abbr title="LocalStorage: Chr5, Opr10.5, Saf4, IE8+" '+
      'data-title="LocalStorage: Chr5, Opr10.5, Saf4, IE8+">' +
      detect.isLocalStorage() +"</abbr> "+
    detect.isFileSystem()+" "+detect.isFileAPI()+" "+
    '<abbr title="WebSQL: Chr4-123, Opr10.5, Saf3.2" '+
      'data-title="WebSQL: Chr4-123, Opr10.5, Saf3.2">'+
      detect.isWebSQL() +"</abbr> "+
    '<abbr title="IndexedDB: Chr24, FF16, Opr15, Saf10, IE10+" '+
      'data-title="IndexedDB: Chr24, FF16, Opr15, Saf10, IE10+">'+
      detect.isIndexedDB() +"</abbr><br />\r\n"+
    // Новейшее:
    '<abbr title="Observer: Chr18, Opr15, Edg12, Saf6.1(13 iOS), FF14, IE11" '+
      'data-title="Observer: Chr18, Opr15, Edg12, Saf6.1(13 iOS), FF14, IE11">'+
      detect.isMutationObserver()+"</abbr> "+
    '<abbr title="WebComponents: Chr67, Edg79, Saf 10.1 (11 iOS), Opr64, FF63" '+
      'data-title="WebComponents: Chr 67, Edg 79, Saf 10.1 (11 iOS), Opr 64, FF 63">'+
      detect.isWebComponents()+"</abbr> "+
    '<abbr title="CSS3 Variables: Chr49, FF31, Opr36, Edg16, Saf10" '+
      'data-title="CSS3 Variables: Chr49, FF31, Opr36, Edg16, Saf10">'+
      detect.isVar()+'</abbr> '+
    '<abbr title="FullES6: Chr51, FF54, Opr38, Edg15, Saf10" '+
      'data-title="FullES6: Chr51, FF54, Opr38, Edg15, Saf10">'+
      ES6support +"</abbr> "+
    //  'data-title="FullES6: Chr51, FF54, Opr38, Edg15, Saf10">'+detect.isES6() +"</abbr> "+
    '<abbr title="Promises: Chr33, Opr20, Edg12, Saf8, FF29" '+
      'data-title="Promises: Chr33, Opr20, Edg12, Saf8, FF29">'+
      detect.Promises() +"</abbr> "+
    '<abbr title="Fetch: Chr42, FF39, Saf10.3, Opr29, Edg14" '+
      'data-title="Fetch: Chr42, FF39, Saf10.3, Opr29, Edg14">'+
      detect.isFetch()+"</abbr> "+
    ' <abbr title="navigator.sendBeacon: Chr39, FF31, Saf11.3, Opr26, Edg14"'+
      'data-title="navigator.sendBeacon: Chr39, FF31, Saf11.3, Opr26, Edg14">'+
      detect.isBeacon()+"</abbr> "+
    '<abbr title="ServiceWorker: Chr45, Saf11.1, Opr32, FF44" '+
    'data-title="ServiceWorker: Chr45, Saf11.1, Opr32, FF44">'+
    detect.isServiceWorker()+"</abbr><br />\r\n "+
    '<abbr title="Container Queries: Chr105, Saf16, Edg106, FF110" '+
    'data-title="Container Queries: Chr105, Saf16, Edg106, FF110">'+
    detect.isContainerQueries()+"</abbr> "+
    '<abbr title="Color Scheme: Chr76, Opr62, Edg79, Saf12.1(13 iOS), FF67" '+
      'data-title="Color Scheme: Chr76, Opr62, Edg79, Saf12.1(13 iOS), FF67"> '+
      detect.isColor() +' </abbr>\r\n '+
      '<abbr title=\"Accent-Color: Chr93, Edg93, FF92, Saf15.4\" '+
        'data-title=\"Accent-Color: Chr93, Edg93, FF92, Saf15.4\">'+
        detect.isAccentColor()+'</abbr> '+
    '<abbr title=\"Subgrid: Chr117, Edg117, FF71, Saf16\" '+
      'data-title=\"Subgrid: Chr117, Edg117, FF71, Saf16\">'+
      detect.isSubgrid()+'</abbr> '+
    /*detect.isLightLevel()+"<br />\r\n "+*/
    '<abbr title=\"Prefers-reduced-data\" '+
      'data-title=\"Prefers-reduced-data\">'+
      detect.isPrefersRData() +"</abbr> "+
    detect.isPrefersContrast() +" \r\n "+
    '<abbr title=\"CSS Math: Clamp: Chr100, Opr86, Edg100, Saf16.4\" '+
      'data-title=\"CSS Math: Clamp: Chr100, Opr86, Edg100, Saf16.4\">'+
      clamp +"</abbr> "+
    '<abbr title=\"Cascade layers: Chr99, Edg99, Saf15.4, FF97\" '+
      'data-title=\"Cascade layers: Chr99, Edg99, Saf15.4, FF97\">'+
      detect.isLayer()+"</abbr> "+
      "<br />\r\n "+
    '<abbr title=\"ES6 Import: Chr63, Opr50, Edg79, Saf11.1, FF67\" '+
      'data-title=\"ES6 Import: Chr63, Opr50, Edg79, Saf11.1, FF67\">'+
      es6i +"</abbr> "+
    '<abbr title="Cache API: Chr47 (Opr34), Edg16, Saf11.1 (11.3 iOS), FF41" '+
      'data-title="WebP: Chr32, Edg18, Saf14 (14.4 iOS), FF65">'+
      cacheAPI +"</abbr> "+
    '<abbr title=\"CSSStartingStyleRule: Chr117, Egd117, Opr103, Saf17.5, FF129\" '+
      'data-title=\"CSSStartingStyleRule: Chr117, Egd117, Opr103, Saf17.5, FF129\">'+
      CSSssr +"</abbr> "+
    '<abbr title="CSSNestedDeclarations: Chr130, Edg130, Opr115, Saf18.2, FF132" '+
      'data-title="CSSNestedDeclarations: Chr130, Edg130, Opr115, Saf18.2, FF132">'+
      CSSnestDecl +"</abbr> "+
    '<abbr title="Atomics: Chr133, Edg133, Opr118, Saf18.4, FF137" '+
      'data-title="Atomics: Chr133, Edg133, Opr118, Saf18.4, FF137">'+
      Atomics1 +"</abbr> "+
    savesData +" "+
    "<br />\r\n "+
    // Изображения:
    '<abbr title="WebP: Chr32, Edg18, Saf14 (14.4 iOS), FF65" '+
      'data-title="WebP: Chr32, Edg18, Saf14 (14.4 iOS), FF65">'+
      detect.isWebP() +"</abbr> "+
    //detect.isAVIF() //isAVIFVar
    ' <abbr title="AVIF: Chr87, FF115" '+
      'data-title="AVIF: Chr87, FF115">'+
      detect.isAVIF() +'</abbr> '+
    ' <abbr title="LazyLoad: Chr77, FF75(121), Saf16.4, Opr64, Edg79" '+
      'data-title="LazyLoad: Chr77, FF75(121), Saf16.4, Opr64, Edg79">'+
      detect.isLazyLoad() +'</abbr> '+
      //detect.isJPEGXL() +" "+
      //detect.isJPEGXR()
    "<br />\r\n "+

    // Windows?
    windoze + "<br />\r\n "+
    
    // Скорость интернета и пинг:
    //'Последняя скорость: '+ detect.isSpeed()[0] +
    //' Мбит/с ('+ detect.isSpeed()[1] +').<br />\r\n'+
    //' Текущая скорость: '+ totalSpeed +'\r\n'+"<br />"+
    // navigator.userAgentData: 
    UAdata +
    // Определение (feature-detection):
    '<span class="logo-opera" title="Opera"></span>'+isOpera+', '+
    '<span class="logo-opera" title="OperaUA"></span>'+isOpera2+', '+
    '<span class="logo-firefox" title="Firefox"></span>'+isFirefox+', '+
    '<span class="logo-safari" title="Safari"></span>'+isSafari+', '+
    '<span class="logo-edge" title="EdgeChromium">'+isEdgeChromium+
      '</span>, <br />'+
    '<span class="logo-chrome" title="Chrome1"></span>'+isChrome+', '+
    '<span class="logo-chrome" title="Chrome2"></span>'+isChrome2+', '+
    '<span class="logo-chrome" title="Chrome3"></span>'+isChrome3+', '+
    '<span class="logo-operamini" title="OperaMini">'+isOperaMini+'</span>, '+
    '<span class="logo-maxthon" title="Maxthon">'+isMaxthon+'</span>, <br />'+
    '<span class="logo-ie8" title="IE6-9">'+isIE+'</span>, '+
    '<span class="logo-isie" title="ie">'+ie+'</span>, '+
    '<span class="logo-ie" title="ie10">'+isIE10+'</span>, '+
    '<span class="logo-ie" title="ie11">'+isIE11+'</span>, '+
    '<span class="logo-isEdge" title="edg">'+isEdge+'</span>, <br />'+
    //
    ' <abbr title="Apple Computer, Inc.|Google Inc.|Maxthon Inc.|'+
    'Maxthon Asia Ltd.|NAVER Corp.|\'\' Firefox, IE11|undefined Opera 12,'+
    ' IE6-10" data-title="Apple Computer, Inc.|Google Inc.|Maxthon Inc.|'+
    'Maxthon Asia Ltd.|NAVER Corp.|\'\' Firefox, IE11|undefined Opera 12'+
    ', IE6-10"> Vendor: </abbr>&nbsp;&laquo;'+ navigator.vendor +
    // MXAsia: 4.1.3,4.4.7,Nitro | MXinc 3.5.2, 4.9.5 | Googl MX_5.2.1

    // navigator.vendor.length = 0 for Firefox, IE11
    "&raquo; | <abbr title=\"Gecko (Firefox, Chrome, Safari, IE11),"+
    ' undefined (IE6-10)\" data-title="Gecko (Firefox, Chrome, Safari, IE11),'+
    " undefined (IE6-10)\"> Product: </abbr>&nbsp;"+ navigator.product +
      " | <abbr title=\"Netscape (Firefox, Chrome, Safari, IE11), "+
      "Opera (Opera 9.64-12.18), Microsoft Internet Explorer(IE6-10)\""+
      " data-title=\"Netscape (Firefox, Chrome, Safari, IE11), "+
      "Opera (Opera 9.64-12.18),"+
      " Microsoft Internet Explorer(IE6-10)\"> appName:</abbr> "+
        navigator.appName +'<br />';
  // Поддержка ES6: работает, но лучше использовать старое определение.
  //function isES6() { try { Function("() => {};"); return true; }
  //catch(e) { return false; } }
  //theText += "\r\n &nbsp; ES6: "+ isES6();

  //try {console.log(document.documentElement.style);}catch(e){}
  // показать все inline-стили.
  //try {for (var x in document.documentElement.style) {
  //  theText += "\r\n "+document.documentElement.style.getPropertyValue[x];
  //}}catch(e){}
  //try {theText += "\r\n &nbsp;"+
  // document.documentElement.style.toString();}catch(e){}

  

  try {
    var output = '';
    for (var property in document.documentElement.style) {
      //output += property + ': ' +
      //  document.documentElement.style[property]+'; ';
      output += property +",\r\n ";
    }
    theText += "<details><summary>All inline css</summary><small>"+ output +
      "</small></details>\r\n";
  } catch(e){}

  // Добавляем в ID "mainInfo" предыдущий текст (свойства Браузера):
  mainInfo.innerHTML = theText;
  // Готово!

} // end MediaQ().
/*
// При первой загрузке страницы:
MediaQ();
// Пробуем ещё раз: теперь разрешение экрана соответствует.
MediaQ();
*/
// При полной загрузке документа:
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn, true); // now true
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading'){
        fn();
      }
    });
  }
}
// При полной загрузке документа, v2:
//function ready(f){/in/.test(document.readyState)?setTimeout('ready('+f+')',9):f();} // jshint ignore:line

ready(function(){
  var abody = document.body;
  var atest = undefined;

  // Если картинки не отключены:
  /*var bbody = document.getElementsByTagName('body')[0];
  var image_avif = document.createElement('img');
  image_avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbW'+
  'lhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2'+
  'aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABkAAAAoaWluZg'+
  'AAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3Bl'+
  'AAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgSAAAAAAABNjb2xybmNseAABAA'+
  '0ABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACFtZGF0EgAKBzgABhAQ0GkyDBZABhhhhAAA'+
  'eUzRyg==';
  if(image_avif.width > 0){
    bbody.setAttribute('data-image-avif', 'true');
  } else {console.log(image_avif.width);}
  var image_webp = document.createElement('img');
  image_webp.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASo'+
    'QABAAAgA0JaQAA3AA/vv9UAA=';
  if(image_webp.width > 0){
    bbody.setAttribute('data-image-webp', 'true');
  
  } else {console.log(image_avif.width);}
  */

  /*
    AVIF: Chr 85 (Opr 71), Safari 16.4 (16.0 iOS), Edg 121, FF 113
    HEIC/HEIF: Safari 17 (17.0 iOS)
    WebP: Chr 32 (Opr 19), Safari 16.0 (14 iOS), Edg 18, FF 65
    JPEG-XR: Edg 11-18, IE 9-11
    JPEG-XL: Safari 17.0 (17.0 iOS),
      (Chr 91 (Opr 77), Edg 91, FF 90 = PC, with flags)
    JPEG-2000: Safari 5 (5 iOS) not Windows
  */
  if(document.getElementById('aavif').width === 1){
    abody.setAttribute('data-avif', 'true');
  } else {
    abody.setAttribute('data-avif', 'false');
  }
  if(document.getElementById('awebp').width === 16){
    abody.setAttribute('data-webp', 'true');
  } else {
    abody.setAttribute('data-webp', 'false');
  }
  // Safari:
  if(document.getElementById('ajxl').width === 1){
    abody.setAttribute('data-jxl', 'true');
  } else {
    abody.setAttribute('data-jxl', 'false');
  }
  if(document.getElementById('ajxr').width === 1){
    abody.setAttribute('data-jxr', 'true');
  } else {
    abody.setAttribute('data-jxr', 'false');
  }
  /*
  try {
    if(document.getElementById('awebp').width === 16){
      abody.setAttribute('data-webp', 'true');
    } else {
      abody.setAttribute('data-webp', 'false');
    }
  }catch(e){abody.setAttribute('data-webp', 'false');}
  // Версия с тэгом picture:
  try {
    atest = abody.getAttribute('data-test');
    if(atest.match(/image\/avif/)!= null){
      abody.setAttribute('data-avif', 'true');
    } else if(atest.match(/image\/webp/)!= null){
      abody.setAttribute('data-avif', 'false');
    } else if(atest.match(/false/)!= null){ // IE11
      abody.setAttribute('data-webp', 'false');
      abody.setAttribute('data-avif', 'false');
    }
  }catch(e){
    abody.setAttribute('data-webp', 'false');
    abody.setAttribute('data-avif', 'false');
  }*/

  // Для того, чтобы код сработал как надо, функцию надо выполнить 2 раза:
  MediaQ();
  MediaQ();

  // Добавить классы в тэг "html" для отладки (аналог Modernizr):
  //ff2: pc ntach ia nqs fb5 ncalc nsup ncl onl en cook nls nwsql nidb
  //  nwebc nES6 nprms nftch nswrkr nwWrkr nappc
  // Проверка:
  if(hasClass(htm, "nqs") === undefined || hasClass(htm, "qs") === undefined){
    // Браузеры:
    if(detect.Browser().name.match("Firefox") !== null){
      addClass(htm, "ff");
    }
    else if(detect.Browser().name.match("Chrome") !== null){
      addClass(htm, "chr");
    }
    else if(detect.Browser().name == "Opera"){
    //else if(isOpera === true){
      addClass(htm, "opr");
    }
    else if(detect.Browser().name == "Safari"){
      addClass(htm, "saf");
    }
    else if(detect.Browser().name == "IE"){
      addClass(htm, "ie");
    }
    //
    // Свойства Браузера:
    if(detect.isMobile().match("mobile")){
      addClass(htm, "mobile");
    } else {
      addClass(htm, "pc");
    }
    if(detect.isTouch().match("nTach")){
      addClass(htm, "ntach");
    } else {
      addClass(htm, "tach");
    }
    if(detect.isInsertAdjacent().match("nIA")){
      addClass(htm, "nia");
    } else {
      addClass(htm, "ia");
    }
    if(detect.isQuerySelector().match("nQS")){
      addClass(htm, "nqs");
    } else {
      addClass(htm, "qs");
    }
    if(detect.isFlexbox().match("flexbox") !== null){
      addClass(htm, detect.isFlexbox().replace("flexbox","fb"));
    } else {
      addClass(htm, "nfb");
    }
    if(detect.isCalc().match("nCalc")){
      addClass(htm, "ncalc");
    } else {
      addClass(htm, "calc");
    }
    if(detect.isSupports().match("nSup")){
      addClass(htm, "nsup");
    } else {
      addClass(htm, "sup");
    }
    if(detect.isClassList().match("nCl")){
      addClass(htm, "ncl");
    } else {
      addClass(htm, "cl");
    }
    try {
      if(detect.isOnLine().match("offl")){
        addClass(htm, "offl");
      } else {
        if(detect.isOnLine().match("onl")){
          addClass(htm, "onl");
        }
      }
      if(navigator.userAgent.match("32") !== null){
        addClass(htm, "x86");
      }
      else if(navigator.userAgent.match("/(x64|WOW64|x86_64)/g") !== null){
        addClass(htm, "x64");
      }
      else if(navigator.userAgent.match("Android") !== null){
        addClass(htm, "ARM");
      }
    }catch(e){}
    try {
      if(detect.whatLang().length < 3){
        addClass(htm, detect.whatLang());
      } else {
        addClass(htm, detect.whatLang().charAt(0)+detect.whatLang().charAt(1));
      }
    }catch(e){
      addClass(htm, detect.whatLang());
    }
    if(detect.isCookies().match("nCook")){
      addClass(htm, "ncook");
    } else {
      addClass(htm, "cook");
    }
    if(detect.isLocalStorage().match("nLS")){
      addClass(htm, "nls");
    } else {
      addClass(htm, "ls");
    }
    if(detect.isWebSQL().match("nWSQL")){
      addClass(htm, "nwsql");
    } else {
      addClass(htm, "wsql");
    }
    if(detect.isIndexedDB().match("nIDB")){
      addClass(htm, "nidb");
    } else {
      addClass(htm, "idb");
    }
    if(detect.isWebComponents().match("nWebC")){
      addClass(htm, "nwebc");
    } else {
      addClass(htm, "webc");
    }
    /*try {
      if(detect.isES6().match("nES6")){
        addClass(htm, "nES6");
      } else {
        addClass(htm, "ES6");
      }
    }catch(e){
      if(ES6support == 'ES6'){ addClass(htm, "ES6"); }
      else { addClass(htm, "nES6"); }
    }*/
    if(detect.Promises().match("nPrms")){
      addClass(htm, "nprms");
    } else {
      addClass(htm, "prms");
    }
    if(detect.isFetch().match("nFtch")){
      addClass(htm, "nftch");
    } else {
      addClass(htm, "ftch");
    }
    if(detect.isServiceWorker().match("nSWrkr")){
      addClass(htm, "nswrkr");
    } else {
      addClass(htm, "swrkr");
    }
    if(detect.isWebWorker().match("nwWrkr")){
      addClass(htm, "nwWrkr");
    } else {
      addClass(htm, "wWrkr");
    }
    if(detect.isAppCache().match("nApCach")){
      addClass(htm, "nappc");
    } else {
      addClass(htm, "appc");
    }
    // важно!
    if(detect.isBase64().match("nB64")){
      addClass(htm, "nb64");
    } else {
      addClass(htm, "b64");
    }
  }
});

// При изменении размеров экрана:
if (window.attachEvent) {
  window.attachEvent('onresize', function(){
    MediaQ();
    MediaQ();
  }, true);
}
else { // если не IE:
  window.addEventListener('resize', function(){
    MediaQ();
    MediaQ();
  }, true);
}

// При повороте экрана:
try {
  window.addEventListener('orientationchange', function(){
    MediaQ();
    MediaQ();
  }, true);
} catch(e){
  //
}

// Выполнять функцию каждые 2 сек:
//setInterval(function(){ MediaQ(); }, 2000);

// - END MediaQueries Events.
