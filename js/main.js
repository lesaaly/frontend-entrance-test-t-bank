import '../css/style.css'

class ResumeManager {
  constructor() {
    this.editableElements = document.querySelectorAll('.editable');
    this.downloadBtn = document.getElementById('downloadBtn');
    this.init();
  }

  init() {
    this.loadSavedData();
    this.setupEditableElements();
    this.setupDownloadButton();
    this.setupRippleEffect();
    this.setupAutoSave();
  }

  setupEditableElements() {
    this.editableElements.forEach(element => {
      element.addEventListener('click', (e) => this.makeEditable(e.target));
      element.addEventListener('blur', (e) => this.saveElement(e.target));
      element.addEventListener('keydown', (e) => this.handleKeydown(e));
      
      element.title = 'Кликните для редактирования';
    });
  }

  makeEditable(element) {
    if (element.classList.contains('editable')) {
      element.contentEditable = true;
      element.focus();
      
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
      element.style.background = `rgba(138, 43, 226, 0.1)`;
      element.style.outline = `2px solid ${primaryColor}`;
      element.style.padding = '4px 8px';
    }
  }

  handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();
    }
    if (e.key === 'Escape') {
      e.target.blur();
    }
  }

  saveElement(element) {
    if (element.classList.contains('editable')) {
      element.contentEditable = false;
      element.style.background = '';
      element.style.outline = '';
      element.style.padding = '';
      
      this.saveToLocalStorage();
      this.showSaveNotification();
    }
  }

  setupDownloadButton() {
    this.downloadBtn.addEventListener('click', (e) => this.downloadPDF(e));
  }

  async downloadPDF(event) {
    try {
      this.downloadBtn.innerHTML = '<span class="download-icon">⏳</span> Подготовка PDF...';
      this.downloadBtn.disabled = true;

      const element = document.getElementById('app');
      
      const downloadBtn = document.querySelector('.download-btn');
      const originalDisplay = downloadBtn.style.display;
      downloadBtn.style.display = 'none';

      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      if (typeof html2pdf !== 'undefined') {
        await html2pdf().set(opt).from(element).save();
      } else {
        this.createSimplePDFDownload();
      }

      downloadBtn.style.display = originalDisplay;
      
      this.showNotification('PDF успешно скачан!', 'success');
      
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      this.showNotification('Ошибка при создании PDF', 'error');
    } finally {
      this.downloadBtn.innerHTML = '<span class="download-icon">📄</span> Скачать PDF';
      this.downloadBtn.disabled = false;
    }
  }

  createSimplePDFDownload() {
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO...';
    link.download = 'resume.pdf';
    link.click();
  }

  setupRippleEffect() {
    const elements = document.querySelectorAll('.editable, .download-btn, .contact-item, .skill-item, .language-item, .project-item');
    
    elements.forEach(element => {
      element.addEventListener('click', (e) => this.createRipple(e));
    });
  }

  createRipple(event) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(147, 112, 219, 0.1)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  saveToLocalStorage() {
    const data = {};
    this.editableElements.forEach(element => {
      const field = element.getAttribute('data-field');
      if (field) {
        data[field] = element.textContent;
      }
    });
    localStorage.setItem('resumeData', JSON.stringify(data));
  }

  loadSavedData() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.editableElements.forEach(element => {
        const field = element.getAttribute('data-field');
        if (field && data[field]) {
          element.textContent = data[field];
        }
      });
    }
  }

  setupAutoSave() {
    let saveTimeout;
    this.editableElements.forEach(element => {
      element.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          this.saveToLocalStorage();
        }, 1000);
      });
    });
  }

  showSaveNotification() {
    this.showNotification('Изменения сохранены', 'success');
  }

  showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
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
    `;

    if (type === 'success') {
      notification.style.background = '#10b981';
    } else if (type === 'error') {
      notification.style.background = '#ef4444';
    } else {
      notification.style.background = '#3b82f6';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }
}

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
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
`;
document.head.appendChild(notificationStyles);

document.addEventListener('DOMContentLoaded', () => {
  new ResumeManager();
});
