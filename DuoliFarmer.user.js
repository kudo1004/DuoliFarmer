// ==UserScript==
// @name         DuoliFarmer
// @namespace    https://tampermonkey.net
// @version      1.0
// @description  DuoliFarmer giúp bạn tăng Xp Duolingo siêu nhanh!
// @author       kudodz
// @match        https://*.duolingo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingopro.net
// @grant        none
// @license      none
// @downloadURL https://raw.githubusercontent.com/kudo1004/DuoliFarmer/refs/heads/main/DuoliFarmer.user.js
// @updateURL https://raw.githubusercontent.com/kudo1004/DuoliFarmer/refs/heads/main/DuoliFarmer.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const sessionUrl = "https://www.duolingo.com/2017-06-30/sessions";
let isFarming = false, isVisible = true;
const getJwtToken = () => document.cookie.split(';').find(c => c.trim().startsWith('jwt_token='))?.split('=')[1] || null;
const decodeJwtToken = token => JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
const formatHeaders = jwtToken => ({ "Content-Type": "application/json", "Authorization": Bearer ${jwtToken}, "User-Agent": navigator.userAgent });
const getUserInfo = async (sub, headers) => (await fetch(https://www.duolingo.com/2017-06-30/users/${sub}?fields=username,fromLanguage,learningLanguage, { headers })).json();
const farmXp = async (headers, sessionPayload, updateSessionPayload) => {
  while (isFarming) {
    try {
      const session = await (await fetch(sessionUrl, { method: 'POST', headers, body: JSON.stringify(sessionPayload) })).json();
      const updatedSession = await (await fetch(${sessionUrl}/${session.id}, { method: 'PUT', headers, body: JSON.stringify({ ...session, ...updateSessionPayload }) })).json();
      document.getElementById("_xpAmount").innerText = parseInt(document.getElementById("_xpAmount").innerText) + updatedSession.xpGain;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};
const initDuoFarmer = async () => {
  const containerHTML = <div class=_container id=_container><div class=_header><p class=_title>DuoliFarmer</div><div class=_description><p id=_loginStatus>Đây là phiên bản mini nên sẽ bị giới hạn.</div><div class=_content><div class=_radioButtons><button class=active data-option=10>Auto</button> </div><button class=_startBtn id=_startBtn>Bắt Đầu Farm</button></div><footer class=_footer><a href=https://r.naturelye.com/discord target=_blank>Discord</a> <span id=_version class=_version>v1.0</span></footer></div><button class=_toggleBtn id=_toggleBtn>→</button><div class=_overlay id=_loadingOverlay><div class=_swalModal><h2>DuoliFarmer</h2><p id=_loadingMessage>Liên hệ Discord của tôi để được hỗ trợ.<div class=_spinner id=_spinner></div><div class=_hint id=_hint>Bạn Không Nên Farm Quá Lâu Để Tránh Bị Ban!</div><div class=_xpInfo>+ <span id=_xpAmount>0</span> XP</div><button id=_stopOverlayBtn>Dừng</button></div></div>;
  const style = document.createElement('style');
  style.innerHTML = ._container,._toggleBtn{right:10px;position:fixed}._footer a,._startBtn,._swalModal h2,._title{font-weight:700}._container{bottom:50px;width:250px;padding:12px;background:#fff;border:2px solid #28a745;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,.3),0 4px 8px rgba(0,0,0,.1);transition:transform .5s,opacity .5s;z-index:9999}.hidden{transform:translateX(110%);opacity:0}._toggleBtn{top:40%;transform:translateY(-50%);width:35px;height:35px;background:#28a745;color:#fff;border:none;border-radius:50%;display:flex;justify-content:center;align-items:center;cursor:pointer;box-shadow:0 4px 8px rgba(0,0,0,.2);transition:transform .3s;z-index:10000}._toggleBtn:active{transform:translateY(-50%) scale(.9)}._header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}._title{font-size:1.1rem;color:#28a745}._description,._radioButtons{font-size:.9rem;margin-bottom:15px}._description{padding:8px;background:#f9f9f9;border-left:4px solid #28a745;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,.1);color:#444}._radioButtons button.active,._startBtn{background:#28a745;color:#fff}._radioButtons{display:flex;flex-wrap:wrap;gap:8px}._radioButtons button{flex:1 1 calc(33.333% - 8px);padding:8px;background:#e9f5e9;border:2px solid #28a745;color:#28a745;border-radius:8px;cursor:pointer;transition:background .3s,color .3s}._radioButtons button:disabled,._radioButtons button:disabled.active{background:#f0f0f0;color:#bbb;border:2px solid #ccc;cursor:not-allowed}._startBtn{width:100%;padding:10px;border:none;border-radius:8px;font-size:1rem;cursor:pointer;transition:background-color .3s}._overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);display:none;align-items:center;justify-content:center;z-index:9999;animation:.3s overlayFadeIn}._swalModal{background:#fff;border-radius:5px;padding:20px;width:30em;max-width:100%;text-align:center;position:relative;box-shadow:0 0 20px rgba(0,0,0,.2);animation:.3s modalPopIn}._swalModal h2{color:#00aa28;font-size:1.7em;margin:0 0 .4em}._swalModal p{color:#777;font-size:1em;margin:.4em 0}._swalModal ._hint{color:#aaa;font-size:.9em;margin:.4em 0}._swalModal ._xpInfo{color:#00ae57;font-size:1.1em;margin:1em 0}._swalModal button{background-color:#c70f4f;color:#fff;border:0;border-radius:.5em;font-size:1.075em;padding:10px 24px;margin:15px 5px 0;cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,.15)}._spinner{display:inline-block;width:70px;height:70px;margin:15px}._spinner:after{content:" ";display:block;width:64px;height:64px;border-radius:50%;border:6px solid #3085d6;border-color:#3085d6 transparent;animation:1.2s linear infinite spinnerRotate}._footer{margin-top:10px;font-size:.85rem;display:flex;justify-content:space-between}._footer a{color:#002d75;font-style:italic}._version{font-size:.9rem;color:#888}@keyframes spinnerRotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}};
  document.head.appendChild(style);
  document.body.innerHTML += containerHTML;
  const JWT = getJwtToken();
  if (!JWT) {
    document.getElementById("_startBtn").disabled = true;
    document.getElementById("_loginStatus").innerText = "Bạn chưa đăng nhập! (Nếu bạn đã đăng nhập, hãy tải lại trang này)";
    return;
  }
  const HEADERS = formatHeaders(JWT);
  const { username, fromLanguage, learningLanguage } = await getUserInfo(decodeJwtToken(JWT).sub, HEADERS);
  document.getElementById("_loginStatus").innerHTML = Chào <strong>${username}</strong>! <br>Liên hệ với Discord của tôi để được hỗ trợ.;
  const sessionPayload = {
    challengeTypes: ["assist", "characterIntro", "characterMatch", "characterPuzzle", "characterSelect", "characterTrace", "characterWrite", "completeReverseTranslation", "definition", "dialogue", "extendedMatch", "extendedListenMatch", "form", "freeResponse", "gapFill", "judge", "listen", "listenComplete", "listenMatch", "match", "name", "listenComprehension", "listenIsolation", "listenSpeak", "listenTap", "orderTapComplete", "partialListen", "partialReverseTranslate", "patternTapComplete", "radioBinary", "radioImageSelect", "radioListenMatch", "radioListenRecognize", "radioSelect", "readComprehension", "reverseAssist", "sameDifferent", "select", "selectPronunciation", "selectTranscription", "svgPuzzle", "syllableTap", "syllableListenTap", "speak", "tapCloze", "tapClozeTable", "tapComplete", "tapCompleteTable", "tapDescribe", "translate", "transliterate", "transliterationAssist", "typeCloze", "typeClozeTable", "typeComplete", "typeCompleteTable", "writeComprehension"],
    fromLanguage,learningLanguage, type: "GLOBAL_PRACTICE"
  };
  const updateSessionPayload = { heartsLeft: 0, startTime: Math.floor(Date.now() / 1000), enableBonusPoints: false, endTime: Math.floor(Date.now() / 1000) + 112, failed: false, maxInLessonStreak: 9, shouldLearnThings: true };
  document.getElementById("_toggleBtn").addEventListener("click", () => {
    isVisible = !isVisible;
    const container = document.getElementById("_container");
    container.classList.toggle("hidden", !isVisible);
    document.getElementById("_toggleBtn").innerHTML = isVisible ? "→" : "←";
  });
  const startBtn = document.getElementById("_startBtn");
  startBtn.addEventListener("click", () => {
    document.getElementById("_loadingOverlay").style.display = "flex";
    isFarming = true;
    farmXp(HEADERS, sessionPayload, updateSessionPayload);
  });
  document.getElementById("_stopOverlayBtn").addEventListener("click", () => {
    document.getElementById("_loadingOverlay").style.display = "none";
    isFarming = false;
    startBtn.disabled = true;
    startBtn.innerText = "Chờ một chút...";
    setTimeout(() => {
      startBtn.disabled = false;
      startBtn.innerText = "Bắt Đầu";
    }, 2000);
  });
};
initDuoFarmer();
})();
