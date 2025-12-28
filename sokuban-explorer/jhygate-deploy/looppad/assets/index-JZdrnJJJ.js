(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();const T=600,v=.05,S=2e4,R=`
  <div class="pad-inner">
    <div class="pad-number"></div>
    <div class="icon-wrapper">
      <div class="record-icon"></div>
    </div>
    <div class="pad-status">Empty</div>
  </div>
`,B=`
  <div class="pad-inner">
    <div class="pad-number"></div>
    <div class="icon-wrapper">
      <div class="record-icon"></div>
    </div>
    <div class="pad-status">Recording</div>
  </div>
`,b=`
  <div class="pad-inner">
    <div class="pad-number"></div>
    <div class="looping"></div>
    <div class="icon-wrapper">
      <div class="play-icon"></div>
    </div>
    <div class="waveform">
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
    </div>
    <div class="pad-status">Ready</div>
  </div>
`,x=`
  <div class="pad-inner">
    <div class="pad-number"></div>
    <div class="looping"></div>
    <div class="icon-wrapper">
      <div class="play-icon"></div>
    </div>
    <div class="waveform">
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
      <div class="waveform-bar"></div>
    </div>
    <div class="pad-status">Playing</div>
  </div>
`,k=`
  <div class="pad-inner">
    <div class="pad-number"></div>
    <div class="icon-wrapper">
      <img src="icons/settings.svg" style="width: 55px; height: 55px;">
    </div>
    <div class="pad-status">Settings</div>
  </div>
`,A="LoopPadDB",D=1,m="recorders";function w(){return new Promise((e,t)=>{const s=indexedDB.open(A,D);s.onerror=()=>t(s.error),s.onsuccess=()=>e(s.result),s.onupgradeneeded=o=>{const n=o.target.result;n.objectStoreNames.contains(m)||n.createObjectStore(m,{keyPath:"id"})}})}function E(e){if(!e)return null;const t=[];for(let s=0;s<e.numberOfChannels;s++)t.push(Array.from(e.getChannelData(s)));return{sampleRate:e.sampleRate,length:e.length,duration:e.duration,numberOfChannels:e.numberOfChannels,channels:t}}function L(e,t){if(!e)return null;const s=t.createBuffer(e.numberOfChannels,e.length,e.sampleRate);for(let o=0;o<e.numberOfChannels;o++)s.getChannelData(o).set(e.channels[o]);return s}async function y(e,t){try{const n=(await w()).transaction(m,"readwrite").objectStore(m),r=e.trimmedBuffer!=null,i={id:t,recordingState:e.recordingState,loop:e.loop,trimAudio:e.trimAudio,trimThreshold:e.trimThreshold,trimAudioLeft:e.trimAudioLeft,trimAudioRight:e.trimAudioRight,loopSync:e.loopSync,syncThreshold:e.syncThreshold,recordSyncStart:e.recordSyncStart,recordSyncEnd:e.recordSyncEnd,playSyncStart:e.playSyncStart,loopable:e.loopable,playingPressOption:e.playingPressOption,audioBuffer:E(e.trimmedBuffer),hasAudio:r},a=n.put(i);await new Promise((c,u)=>{a.onsuccess=()=>c(),a.onerror=()=>u(a.error)})}catch(s){console.error("Error saving recorder:",s)}}async function _(e,t){try{const r=(await w()).transaction(m,"readonly").objectStore(m).get(t),i=await new Promise((a,c)=>{r.onsuccess=()=>a(r.result),r.onerror=()=>c(r.error)});return i?(e.loop=i.loop||!1,e.trimAudio=i.trimAudio||!1,e.trimThreshold=i.trimThreshold||v,e.trimAudioLeft=i.trimAudioLeft||!1,e.trimAudioRight=i.trimAudioRight||!1,e.loopSync=i.loopSync||!1,e.syncThreshold=i.syncThreshold||S,e.recordSyncStart=i.recordSyncStart||!1,e.recordSyncEnd=i.recordSyncEnd||!1,e.playSyncStart=i.playSyncStart||!1,e.loopable=i.loopable||!1,e.playingPressOption=i.playingPressOption||"stop",i.audioBuffer&&i.hasAudio&&(e.ctx=new AudioContext,e.trimmedBuffer=L(i.audioBuffer,e.ctx),e.recordingState="recorded",e.button.innerHTML=b,e.button.classList.add("has-audio")),!0):!1}catch(s){return console.error("Error loading recorder:",s),!1}}async function I(e){try{for(let t=0;t<e.length;t++)await _(e[t],t)}catch(t){console.error("Error loading all recorders:",t)}}async function C(){try{const o=(await w()).transaction(m,"readwrite").objectStore(m).clear();await new Promise((n,r)=>{o.onsuccess=()=>n(),o.onerror=()=>r(o.error)}),alert("All saved data cleared!")}catch(e){console.error("Error clearing data:",e)}}async function P(e){try{const t={version:1,exportDate:new Date().toISOString(),recorders:[]};for(let i=0;i<e.length;i++){const a=e[i],c={index:i,recordingState:a.recordingState,loop:a.loop,trimAudio:a.trimAudio,trimThreshold:a.trimThreshold,trimAudioLeft:a.trimAudioLeft,trimAudioRight:a.trimAudioRight,loopSync:a.loopSync,syncThreshold:a.syncThreshold,recordSyncStart:a.recordSyncStart,recordSyncEnd:a.recordSyncEnd,playSyncStart:a.playSyncStart,loopable:a.loopable,playingPressOption:a.playingPressOption,audioBuffer:E(a.trimmedBuffer),hasAudio:a.trimmedBuffer!=null};t.recorders.push(c)}const s=JSON.stringify(t,null,2),o=new Blob([s],{type:"application/json"}),n=URL.createObjectURL(o),r=document.createElement("a");r.href=n,r.download=`looppad-config-${new Date().toISOString().slice(0,10)}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n),alert("Configuration exported successfully!")}catch(t){console.error("Error exporting config:",t),alert("Error exporting configuration")}}async function O(e){try{const t=document.createElement("input");t.type="file",t.accept=".json",t.onchange=async s=>{var r;const o=(r=s.target.files)==null?void 0:r[0];if(!o)return;const n=new FileReader;n.onload=async i=>{try{const a=JSON.parse(i.target.result);if(!a.version||!a.recorders){alert("Invalid configuration file");return}for(const c of a.recorders){const u=c.index;if(u>=0&&u<e.length){const d=e[u];d.loop=c.loop||!1,d.trimAudio=c.trimAudio||!1,d.trimThreshold=c.trimThreshold||v,d.trimAudioLeft=c.trimAudioLeft||!1,d.trimAudioRight=c.trimAudioRight||!1,d.loopSync=c.loopSync||!1,d.syncThreshold=c.syncThreshold||S,d.recordSyncStart=c.recordSyncStart||!1,d.recordSyncEnd=c.recordSyncEnd||!1,d.playSyncStart=c.playSyncStart||!1,d.loopable=c.loopable||!1,d.playingPressOption=c.playingPressOption||"stop",c.audioBuffer&&c.hasAudio?(d.ctx=new AudioContext,d.trimmedBuffer=L(c.audioBuffer,d.ctx),d.recordingState="recorded",d.button.innerHTML=b,d.button.classList.add("has-audio")):(d.recordingState="not-recording",d.trimmedBuffer=null,d.ctx=null,d.showIcon()),await y(d,u)}}alert("Configuration loaded successfully!")}catch(a){console.error("Error parsing config file:",a),alert("Error loading configuration file")}},n.readAsText(o)},t.click()}catch(t){console.error("Error importing config:",t),alert("Error importing configuration")}}function M(e){const t=document.getElementById("clear-session"),s=document.getElementById("export-config"),o=document.getElementById("import-config");if(!t||!s||!o){console.error("Buttons not found in DOM!");return}t.addEventListener("click",()=>{confirm("Are you sure you want to clear all saved data? This cannot be undone.")&&(C(),setTimeout(()=>location.reload(),500))}),s.addEventListener("click",()=>P(e)),o.addEventListener("click",()=>O(e))}function U(e,t,s=.02){const{numberOfChannels:o,sampleRate:n,length:r}=e;let i=0,a=r-1;const c=l=>{for(let f=0;f<o;f++)if(Math.abs(e.getChannelData(f)[l])>=s)return!1;return!0};for(;i<a&&c(i);)i++;const u=Math.max(1,a-i+1),d=t.createBuffer(o,u,n);for(let l=0;l<o;l++)d.getChannelData(l).set(e.getChannelData(l).subarray(i,a+1));return d}function g(e,t){const s=t.filter(i=>i.recordingState==="playing"&&i.loop===!0),o=[];for(const i of s){const a=i.trackLength-i.currentTime,c=i.ctx.currentTime-i.startTime;c<=a?o.push(0-c):o.push(a)}console.log(s),console.log(o);const n=o.filter(i=>Math.abs(i)*1e3<e);if(console.log(n,"FILTERED"),n.length===0)return null;const r=n.reduce((i,a)=>Math.abs(i)<Math.abs(a)?i:a);return console.log(r),r}class p{constructor(t,s,o,n){this.recordingState="not-recording",this.startTime=void 0,this.loop=!1,this.button=document.getElementById(t),this.key=s,this.appState=o,this.clickCount=0,this.resetting=!1,this.index=n,this.mediaRecorder=null,this.chunks=[],this.silenceDuration=0,this.endTrim=0,this.trimmedBuffer=null,this.ctx=null,this.src=null,this.trimAudio=!1,this.trimThreshold=v,this.trimAudioLeft=!1,this.trimAudioRight=!1,this.loopSync=!1,this.syncThreshold=S,this.recordSyncStart=!1,this.recordSyncEnd=!1,this.playSyncStart=!1,this.loopable=!1,this.playingPressOption="stop",this._isPressed=!1,this._bindUI(),this._initMedia()}get trackLength(){return this.trimmedBuffer.duration}get currentTime(){return this.ctx.currentTime-this.startTime}showSettingsIcon(){this.button.innerHTML=k}showIcon(){this.recordingState==="not-recording"?this.button.innerHTML=R:this.recordingState==="recording"?this.button.innerHTML=B:this.recordingState==="recorded"?this.button.innerHTML=b:this.recordingState==="playing"&&(this.button.innerHTML=x);const t=this.button.querySelector(".pad-number");t.textContent=(this.index+1).toString();const s=this.button.querySelector(".looping");s&&this.loopable&&(s.innerHTML='<img src="/icons/loop.svg" style="width: 20px; height: 20px;">')}_bindUI(){this.showIcon(),this.button.addEventListener("pointerdown",t=>{t.preventDefault(),this._onPointerDown()}),this.button.addEventListener("pointerup",t=>{t.preventDefault(),this._onPointerUp()}),this.button.addEventListener("pointercancel",()=>this._onPointerUp()),document.addEventListener("pointerup",t=>{this._isPressed&&this._onPointerUp()}),this.button.style.setProperty("--delete-time",`${T}ms`),document.addEventListener("keydown",t=>this._onKeyDown(t)),document.addEventListener("keyup",t=>this._onKeyUp(t))}_onKeyDown(t){t.key.toLowerCase()===this.key.toLowerCase()&&!t.repeat&&this._onPointerDown()}_onKeyUp(t){t.key.toLowerCase()===this.key.toLowerCase()&&this._onPointerUp()}async _initMedia(){try{const t=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1},video:!1});this.mediaRecorder=new MediaRecorder(t),this.mediaRecorder.ondataavailable=s=>this.chunks.push(s.data),this.mediaRecorder.onstop=async()=>{await this._processChunks()}}catch(t){console.error(t.name,t.message)}}async _processChunks(){this.ctx=new AudioContext;const t=await new Blob(this.chunks,{type:"audio/mp4;"}).arrayBuffer();let s=await this.ctx.decodeAudioData(t);if(this.trimAudio===!0&&(s=U(s,this.ctx,this.trimThreshold)),this.silenceDuration>0){const o=Math.floor(this.silenceDuration*this.ctx.sampleRate),n=s.length+o,r=this.ctx.createBuffer(s.numberOfChannels,n,this.ctx.sampleRate);for(let i=0;i<s.numberOfChannels;i++){const a=s.getChannelData(i);r.getChannelData(i).set(a,o)}s=r}if(this.endTrim>0){const o=Math.floor(this.endTrim*this.ctx.sampleRate),n=s.length-o,r=this.ctx.createBuffer(s.numberOfChannels,n,this.ctx.sampleRate);for(let i=0;i<s.numberOfChannels;i++){const a=s.getChannelData(i);r.getChannelData(i).set(a.subarray(0,n))}this.trimmedBuffer=r}else this.trimmedBuffer=s;this.chunks=[],this.silenceDuration=0,this.endTrim=0,this.index!==null&&y(this,this.index)}_onPointerDown(){this._isPressed=!0,!this.appState.settingsClicked&&(this.resetting=!1,this.clickCount+=1,console.log(this.clickCount),this._holdTimer=setTimeout(()=>this._resetButton(),T),clearTimeout(this._clickResetTimer),this._clickResetTimer=setTimeout(()=>this.clickCount=0,300),this.button.style.setProperty("filter"," drop-shadow(0px 0px)"),(this.recordingState==="playing"||this.recordingState==="recorded")&&this.button.classList.add("holding"))}_onPointerUp(){if(!(!this._isPressed&&!this.appState.settingsClicked)){if(this._isPressed=!1,this.appState.settingsClicked){document.getElementById("trim-audio").checked=this.trimAudio,document.getElementById("trim-threshold").value=this.trimThreshold.toString(),document.getElementById("trim-start").checked=this.trimAudioLeft,document.getElementById("trim-end").checked=this.trimAudioRight,document.getElementById("loop-sync").checked=this.loopSync,document.getElementById("sync-threshold").value=this.syncThreshold.toString(),document.getElementById("record-sync-start").checked=this.recordSyncStart,document.getElementById("record-sync-end").checked=this.recordSyncEnd,document.getElementById("play-sync-start").checked=this.playSyncStart,document.getElementById("loopable").checked=this.loopable,this.playingPressOption==="stop"?document.getElementById("press-option-stop").checked=!0:this.playingPressOption==="restart"&&(document.getElementById("press-option-restart").checked=!0),this.appState.settingsRecorder=this,this.appState.settingsModal.showModal(),this.appState.settingsClicked=!1;return}if(clearTimeout(this._holdTimer),this.button.classList.remove("holding"),this.button.style.setProperty("filter"," drop-shadow(-4px 4px)"),this.resetting){this.resetting=!1;return}this.handleButtonPress()}}_resetButton(){this.recordingState="not-recording",this.showIcon(),this.button.style.setProperty("filter"," drop-shadow(-4px 4px)"),this.button.classList.remove("holding"),this.button.classList.remove("playing"),this.button.classList.remove("recording"),this.button.classList.remove("has-audio"),this.loop=!1,this.resetting=!0,this._stopAudio(),this.trimmedBuffer=null,this.ctx=null,this.index!==null&&y(this,this.index)}_startRecording(){if(!this.mediaRecorder)return;this.recordingState="recording",this.showIcon(),this.button.classList.add("recording");const t=g(this.syncThreshold,this.appState.recorders);let s=0;this.silenceDuration=0,t>0&&(s=t,this.silenceDuration=0),t<0&&(this.silenceDuration=Math.abs(t)),this.recordSyncStart===!1&&(this.silenceDuration=0,this.startTrim=0),setTimeout(()=>{this.mediaRecorder.start()},s*1e3)}_stopRecording(){const t=g(this.syncThreshold,this.appState.recorders);let s=0;this.endTrim=0,t>0&&(s=t),t<0&&(this.endTrim=Math.abs(t)),this.recordSyncEnd===!1&&(this.endTrim=0,this.stopDelay=0),setTimeout(()=>{this.recordingState="recorded",this.showIcon(),this.button.classList.remove("recording"),this.button.classList.add("has-audio"),this.mediaRecorder.stop()},s*1e3)}_setupAudioPlay(){let t=g(this.syncThreshold,this.appState.recorders);(!this.loopSync||!this.playSyncStart||t==null)&&(t=0),console.log(t,"TIME TO START"),this._startAudio(t)}_startAudio(t){let s=0,o=0;t<0?(s=0,o=0-t):(s=t,o=0),this._holdTimer=setTimeout(()=>{if(console.log("STARTED"),this.recordingState="playing",this.showIcon(),!this.trimmedBuffer||!this.ctx)return;const n=this.ctx.createBufferSource();n.buffer=this.trimmedBuffer,n.connect(this.ctx.destination),this.button.classList.remove("playing");const r=(this.trimmedBuffer.duration-o)*1e3;this.button.style.setProperty("--play-duration",`${r}ms`),requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.button.classList.add("playing")})}),n.start(0,o),this.src=n,this.startTime=this.ctx.currentTime,n.onended=()=>{this.loop?(this._stopAudio(),this._startAudio(0)):this._endAudio()}},s*1e3)}_stopAudio(){if(this.src){try{this.src.onended=null,this.src.stop()}catch{}try{this.src.disconnect()}catch{}this.src=null}this.button.classList.remove("playing")}_endAudio(){this._stopAudio(),this.showIcon(),this.recordingState="recorded"}handleButtonPress(){switch(console.log(this.recordingState,"HANDLE BUTTON PRESS"),this.recordingState){case"not-recording":this._startRecording();break;case"recording":this._endAudio(),this._stopRecording();break;case"recorded":this._setupAudioPlay();break;case"playing":(this.clickCount===1||this.loopable==!1)&&(console.log(this.clickCount,"click"),this.playingPressOption==="restart"&&(this._stopAudio(),this._setupAudioPlay()),this.playingPressOption==="stop"&&(this._endAudio(),this.loop=!1)),this.clickCount===2&&this.loopable==!0&&(console.log(this.clickCount,"click"),this.loop=!this.loop);break}}}class N{constructor(t){this.appState=t,this.createSettingsDialog(),this.settingsUIButton=document.getElementById("settings-icon"),this.setButtonEventListeners(),this.setFormEventListeners()}createSettingsDialog(){const t=document.createElement("dialog");t.id="settings",t.innerHTML=`
      <div class="settings-container">
        <div class="settings-header">
          <h1>Pad Settings</h1>
          <button type="button" class="close-btn" id="settings-close">×</button>
        </div>

        <form id="settings-form">
          <div class="settings-section">
            <h2>Audio Trimming</h2>
            <div class="setting-row">
              <input type="checkbox" id="trim-audio" class="checkbox">
              <label for="trim-audio">Enable Audio Trimming</label>
            </div>
            <div class="setting-row indent-1">
              <label for="trim-threshold">Threshold</label>
              <input type="number" id="trim-threshold" class="input-field" step="0.01" min="0" max="1">
            </div>
            <div class="setting-row indent-1">
              <input type="checkbox" id="trim-start" class="checkbox">
              <label for="trim-start">Trim Start</label>
            </div>
            <div class="setting-row indent-1">
              <input type="checkbox" id="trim-end" class="checkbox">
              <label for="trim-end">Trim End</label>
            </div>
          </div>

          <div class="settings-section">
            <h2>Loop Synchronization</h2>
            <div class="setting-row">
              <input type="checkbox" id="loop-sync" class="checkbox">
              <label for="loop-sync">Enable Loop Sync</label>
            </div>
            <div class="setting-row indent-1">
              <label for="sync-threshold">Sync Threshold (ms)</label>
              <input type="number" id="sync-threshold" class="input-field" step="100" min="0">
            </div>
            <div class="setting-row indent-2">
              <input type="checkbox" id="record-sync-start" class="checkbox">
              <label for="record-sync-start">Record Sync Start</label>
            </div>
            <div class="setting-row indent-2">
              <input type="checkbox" id="record-sync-end" class="checkbox">
              <label for="record-sync-end">Record Sync End</label>
            </div>
            <div class="setting-row indent-2">
              <input type="checkbox" id="play-sync-start" class="checkbox">
              <label for="play-sync-start">Play Sync Start</label>
            </div>
          </div>

          <div class="settings-section">
            <h2>Playback Options</h2>
            <div class="setting-row">
              <input type="checkbox" id="loopable" class="checkbox">
              <label for="loopable">Loopable</label>
            </div>
            <div class="setting-row">
              <span class="label-text">Press to:</span>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" id="press-option-stop" name="press-option" value="stop">
                  <span>Stop</span>
                </label>
                <label class="radio-label">
                  <input type="radio" id="press-option-restart" name="press-option" value="restart">
                  <span>Restart</span>
                </label>
              </div>
            </div>
          </div>

          <div class="settings-footer">
            <button id="settings-submit" type="submit" class="submit-btn">Save Settings</button>
          </div>
        </form>
      </div>
    `,document.body.appendChild(t),t.querySelector("#settings-close").addEventListener("click",()=>{t.close()}),this.appState.settingsModal=t}setButtonEventListeners(){this.settingsUIButton.addEventListener("click",()=>{this.appState.settingsClicked=!0;for(const s of this.appState.recorders)s.showSettingsIcon()}),document.getElementById("settings-form").addEventListener("submit",s=>{s.preventDefault(),this.appState.settingsModal.close()}),this.appState.settingsModal.addEventListener("close",s=>{if(this.appState.settingsRecorder){this.appState.settingsRecorder=null;for(const o of this.appState.recorders)o.showIcon()}})}setFormEventListeners(){var t,s,o,n,r,i,a,c,u,d;(t=document.getElementById("trim-audio"))==null||t.addEventListener("change",l=>{this.appState.settingsRecorder&&(this.appState.settingsRecorder.trimAudio=l.target.checked)}),(s=document.getElementById("trim-start"))==null||s.addEventListener("change",l=>{this.appState.settingsRecorder&&(this.appState.settingsRecorder.trimAudioLeft=l.target.checked)}),(o=document.getElementById("trim-end"))==null||o.addEventListener("change",l=>{this.appState.settingsRecorder&&(this.appState.settingsRecorder.trimAudioRight=l.target.checked)}),(n=document.getElementById("loop-sync"))==null||n.addEventListener("change",l=>{this.appState.settingsRecorder&&(this.appState.settingsRecorder.loopSync=l.target.checked)}),(r=document.getElementById("record-sync-start"))==null||r.addEventListener("change",l=>{this.appState.settingsRecorder&&(this.appState.settingsRecorder.recordSyncStart=l.target.checked)}),(i=document.getElementById("record-sync-end"))==null||i.addEventListener("change",l=>{this.appState.settingsRecorder&&(this.appState.settingsRecorder.recordSyncEnd=l.target.checked)}),(a=document.getElementById("play-sync-start"))==null||a.addEventListener("change",l=>{this.appState.settingsRecorder&&(this.appState.settingsRecorder.playSyncStart=l.target.checked)}),(c=document.getElementById("loopable"))==null||c.addEventListener("change",l=>{this.appState.settingsRecorder&&(this.appState.settingsRecorder.loopable=l.target.checked)}),(u=document.getElementById("trim-threshold"))==null||u.addEventListener("input",l=>{this.appState.settingsRecorder&&(this.appState.settingsRecorder.trimThreshold=parseFloat(l.target.value)||0)}),(d=document.getElementById("sync-threshold"))==null||d.addEventListener("input",l=>{this.appState.settingsRecorder&&(this.appState.settingsRecorder.syncThreshold=parseFloat(l.target.value)||0)}),document.querySelectorAll('input[name="press-option"]').forEach(l=>{l.addEventListener("change",f=>{this.appState.settingsRecorder&&f.target.checked&&(this.appState.settingsRecorder.playingPressOption=f.target.value)})})}}const h={settingsClicked:!1,settingsRecorder:null,settingsModal:null,recorders:[]},F=new p("btn1","q",h,0),H=new p("btn2","w",h,1),q=new p("btn3","e",h,2),j=new p("btn4","a",h,3),K=new p("btn5","s",h,4),G=new p("btn6","d",h,5),Y=new p("btn7","z",h,6),$=new p("btn8","x",h,7),z=new p("btn9","c",h,8);h.recorders=[F,H,q,j,K,G,Y,$,z];I(h.recorders);new N(h);document.addEventListener("DOMContentLoaded",()=>{M(h.recorders)});
