(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function o(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(e){if(e.ep)return;e.ep=!0;const s=o(e);fetch(e.href,s)}})();class d{constructor(){this.editableElements=document.querySelectorAll(".editable"),this.downloadBtn=document.getElementById("downloadBtn"),this.init()}init(){this.loadSavedData(),this.setupEditableElements(),this.setupDownloadButton(),this.setupRippleEffect(),this.setupAutoSave()}setupEditableElements(){this.editableElements.forEach(t=>{t.addEventListener("click",o=>this.makeEditable(o.target)),t.addEventListener("blur",o=>this.saveElement(o.target)),t.addEventListener("keydown",o=>this.handleKeydown(o)),t.title="Кликните для редактирования"})}makeEditable(t){if(t.classList.contains("editable")){t.contentEditable=!0,t.focus();const o=getComputedStyle(document.documentElement).getPropertyValue("--primary-color").trim();t.style.background="rgba(138, 43, 226, 0.1)",t.style.outline=`2px solid ${o}`,t.style.padding="4px 8px"}}handleKeydown(t){t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),t.target.blur()),t.key==="Escape"&&t.target.blur()}saveElement(t){t.classList.contains("editable")&&(t.contentEditable=!1,t.style.background="",t.style.outline="",t.style.padding="",this.saveToLocalStorage(),this.showSaveNotification())}setupDownloadButton(){this.downloadBtn.addEventListener("click",t=>this.downloadPDF(t))}async downloadPDF(t){try{this.downloadBtn.innerHTML='<span class="download-icon">⏳</span> Подготовка PDF...',this.downloadBtn.disabled=!0;const o=document.getElementById("app"),i=document.querySelector(".download-btn"),e=i.style.display;i.style.display="none";const s={margin:[10,10,10,10],filename:"resume.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,letterRendering:!0},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}};typeof html2pdf<"u"?await html2pdf().set(s).from(o).save():this.createSimplePDFDownload(),i.style.display=e,this.showNotification("PDF успешно скачан!","success")}catch(o){console.error("Ошибка при создании PDF:",o),this.showNotification("Ошибка при создании PDF","error")}finally{this.downloadBtn.innerHTML='<span class="download-icon">📄</span> Скачать PDF',this.downloadBtn.disabled=!1}}createSimplePDFDownload(){const t=document.createElement("a");t.href="data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO...",t.download="resume.pdf",t.click()}setupRippleEffect(){document.querySelectorAll(".editable, .download-btn, .contact-item, .skill-item, .language-item, .project-item").forEach(o=>{o.addEventListener("click",i=>this.createRipple(i))})}createRipple(t){const o=t.currentTarget,i=o.getBoundingClientRect(),e=Math.max(i.width,i.height),s=t.clientX-i.left-e/2,a=t.clientY-i.top-e/2,n=document.createElement("span");n.className="ripple-effect",n.style.width=n.style.height=e+"px",n.style.left=s+"px",n.style.top=a+"px",n.style.position="absolute",n.style.borderRadius="50%",n.style.background="rgba(147, 112, 219, 0.1)",n.style.transform="scale(0)",n.style.animation="ripple 0.6s linear",n.style.pointerEvents="none",o.style.position="relative",o.style.overflow="hidden",o.appendChild(n),setTimeout(()=>{n.remove()},600)}saveToLocalStorage(){const t={};this.editableElements.forEach(o=>{const i=o.getAttribute("data-field");i&&(t[i]=o.textContent)}),localStorage.setItem("resumeData",JSON.stringify(t))}loadSavedData(){const t=localStorage.getItem("resumeData");if(t){const o=JSON.parse(t);this.editableElements.forEach(i=>{const e=i.getAttribute("data-field");e&&o[e]&&(i.textContent=o[e])})}}setupAutoSave(){let t;this.editableElements.forEach(o=>{o.addEventListener("input",()=>{clearTimeout(t),t=setTimeout(()=>{this.saveToLocalStorage()},1e3)})})}showSaveNotification(){this.showNotification("Изменения сохранены","success")}showNotification(t,o="info"){document.querySelectorAll(".notification").forEach(s=>s.remove());const e=document.createElement("div");e.className=`notification notification-${o}`,e.textContent=t,e.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `,o==="success"?e.style.background="#10b981":o==="error"?e.style.background="#ef4444":e.style.background="#3b82f6",document.body.appendChild(e),setTimeout(()=>{e.style.animation="slideOutRight 0.3s ease-in",setTimeout(()=>{e.parentNode&&e.remove()},300)},3e3)}}const l=document.createElement("style");l.textContent=`
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;document.head.appendChild(l);document.addEventListener("DOMContentLoaded",()=>{new d});
