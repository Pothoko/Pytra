// Variables globales
let selectedFile = null;
let scansCount = 0;
let threatsCount = 0;
let urlChecksCount = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeTabSystem();
    initializeFileUpload();
    initializeButtons();
    initializeContactForm();
    loadStatistics();
});

// Sistema de Tabs
function initializeTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remover clase active de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Agregar clase active al botón y contenido seleccionado
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Sistema de Carga de Archivos
function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');

    // Clic en el área de carga
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Seleccionar archivo
    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFileSelect(e.dataTransfer.files[0]);
    });
}

function handleFileSelect(file) {
    if (!file) return;

    selectedFile = file;
    const fileInfo = document.getElementById('fileInfo');
    const uploadArea = document.getElementById('uploadArea');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    uploadArea.style.display = 'none';
    fileInfo.style.display = 'block';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Inicializar botones de escaneo
function initializeButtons() {
    const scanFileBtn = document.getElementById('scanFileBtn');
    const scanUrlBtn = document.getElementById('scanUrlBtn');
    const scanHashBtn = document.getElementById('scanHashBtn');

    scanFileBtn.addEventListener('click', scanFile);
    scanUrlBtn.addEventListener('click', scanURL);
    scanHashBtn.addEventListener('click', scanHash);
}

// Escanear Archivo
async function scanFile() {
    if (!selectedFile) {
        alert('Por favor selecciona un archivo');
        return;
    }

    showLoadingSpinner();
    
    // Simular análisis del archivo
    setTimeout(() => {
        const results = analyzeFile(selectedFile);
        displayResults(results);
        hideLoadingSpinner();
        scansCount++;
        updateStatistics();
    }, 2000);
}

// Escanear URL
async function scanURL() {
    const urlInput = document.getElementById('urlInput').value.trim();
    
    if (!urlInput) {
        alert('Por favor ingresa una URL');
        return;
    }

    if (!isValidURL(urlInput)) {
        alert('Por favor ingresa una URL válida');
        return;
    }

    showLoadingSpinner();

    // Simular análisis de URL
    setTimeout(() => {
        const results = analyzeURL(urlInput);
        displayResults(results);
        hideLoadingSpinner();
        urlChecksCount++;
        updateStatistics();
    }, 2500);
}

// Escanear Hash
async function scanHash() {
    const hashInput = document.getElementById('hashInput').value.trim();
    
    if (!hashInput) {
        alert('Por favor ingresa un hash');
        return;
    }

    showLoadingSpinner();

    // Simular análisis de hash
    setTimeout(() => {
        const results = analyzeHash(hashInput);
        displayResults(results);
        hideLoadingSpinner();
        updateStatistics();
    }, 2000);
}

// Función para validar URLs
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Análisis de Archivo
function analyzeFile(file) {
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    const isLargeFile = fileSize > 50 * 1024 * 1024; // 50MB
    
    // Simular análisis basado en extensión
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.zip', '.rar'];
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    let threat = 'SEGURO';
    let threatLevel = 'safe';
    let description = 'El archivo no presenta amenazas conocidas.';
    let details = [];

    // Simular detección de amenazas
    const randomThreat = Math.random();
    
    if (randomThreat > 0.7) {
        threat = 'AMENAZA DETECTADA';
        threatLevel = 'danger';
        description = 'Se detectó un archivo potencialmente peligroso.';
        details = [
            'Tipo de amenaza: Malware.Generic',
            'Familia: Trojan',
            'Riesgo: Alto',
            'Acción recomendada: Eliminar el archivo'
        ];
        threatsCount++;
    } else if (randomThreat > 0.4) {
        if (dangerousExtensions.includes(extension)) {
            threat = 'ADVERTENCIA';
            threatLevel = 'warning';
            description = 'El archivo tiene una extensión potencialmente peligrosa.';
            details = [
                `Extensión: ${extension}`,
                'Tipo de archivo: Ejecutable',
                'Riesgo: Medio',
                'Acción recomendada: Usar con precaución'
            ];
        }
    }

    if (isLargeFile) {
        details.push('Nota: Archivo grande detectado');
    }

    return {
        type: 'file',
        target: file.name,
        threat: threat,
        threatLevel: threatLevel,
        description: description,
        details: details,
        scanTime: new Date().toLocaleTimeString('es-ES')
    };
}

// Análisis de URL
function analyzeURL(url) {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Lista de dominios "peligrosos" simulados
    const dangerousDomains = ['malware.com', 'phishing.net', 'suspicious.org', 'fake-bank.com'];
    const spamKeywords = ['download', 'free', 'crack', 'keygen', 'virus'];
    
    let threat = 'SEGURO';
    let threatLevel = 'safe';
    let description = 'La URL parece ser segura.';
    let details = [];

    const randomThreat = Math.random();

    if (randomThreat > 0.75 || dangerousDomains.includes(domain)) {
        threat = 'URL MALICIOSA';
        threatLevel = 'danger';
        description = 'Esta URL es conocida por ser maliciosa.';
        details = [
            `Dominio: ${domain}`,
            'Tipo de amenaza: Phishing/Malware',
            'Estado: Bloqueado',
            'Acción recomendada: No acceder a este sitio'
        ];
        threatsCount++;
    } else if (randomThreat > 0.4) {
        const hasSpamKeywords = spamKeywords.some(keyword => url.includes(keyword));
        if (hasSpamKeywords) {
            threat = 'ADVERTENCIA';
            threatLevel = 'warning';
            description = 'La URL podría contener contenido sospechoso.';
            details = [
                `Dominio: ${domain}`,
                'Patrón detectado: Palabras clave sospechosas',
                'Riesgo: Medio',
                'Acción recomendada: Usar con precaución'
            ];
        }
    }

    details.push(`Protocolo: ${urlObj.protocol.replace(':', '')}`);

    return {
        type: 'url',
        target: url,
        threat: threat,
        threatLevel: threatLevel,
        description: description,
        details: details,
        scanTime: new Date().toLocaleTimeString('es-ES')
    };
}

// Análisis de Hash
function analyzeHash(hash) {
    const hashLength = hash.length;
    let hashType = 'Desconocido';
    
    // Detectar tipo de hash
    if (hashLength === 32) {
        hashType = 'MD5';
    } else if (hashLength === 40) {
        hashType = 'SHA-1';
    } else if (hashLength === 64) {
        hashType = 'SHA-256';
    }

    let threat = 'LIMPIO';
    let threatLevel = 'safe';
    let description = 'El hash no se encuentra en bases de datos de malware conocido.';
    let details = [];

    const randomThreat = Math.random();

    if (randomThreat > 0.8) {
        threat = 'MALWARE CONOCIDO';
        threatLevel = 'danger';
        description = 'Este hash corresponde a un archivo malicioso conocido.';
        details = [
            `Tipo de hash: ${hashType}`,
            'Familia de malware: Win32.Trojan',
            'Detecciones: 45/70 motores',
            'Primer envío: 2024-01-15',
            'Acción recomendada: Eliminar el archivo'
        ];
        threatsCount++;
    } else if (randomThreat > 0.5) {
        threat = 'NO CLASIFICADO';
        threatLevel = 'warning';
        description = 'El hash no tiene suficientes análisis.';
        details = [
            `Tipo de hash: ${hashType}`,
            'Estado: Insuficientemente analizado',
            'Detecciones: 2/70 motores',
            'Acción recomendada: Analizar manualmente'
        ];
    }

    details.push(`Timestamp del análisis: ${new Date().toLocaleString('es-ES')}`);

    return {
        type: 'hash',
        target: hash.substring(0, 16) + '...',
        threat: threat,
        threatLevel: threatLevel,
        description: description,
        details: details,
        scanTime: new Date().toLocaleTimeString('es-ES')
    };
}

// Mostrar resultados
function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsContent = document.getElementById('resultsContent');
    
    let iconMap = {
        'safe': '✓',
        'warning': '⚠',
        'danger': '✕'
    };

    let detailsHTML = results.details.map(detail => `<li>${detail}</li>`).join('');
    
    const resultHTML = `
        <div class="result-item ${results.threatLevel}">
            <div class="result-icon">${iconMap[results.threatLevel]}</div>
            <div class="result-text">
                <h4>${results.threat}</h4>
                <p><strong>Objetivo:</strong> ${results.target}</p>
                <p><strong>Descripción:</strong> ${results.description}</p>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem; font-size: 0.9rem;">
                    ${detailsHTML}
                </ul>
                <p style="margin-top: 0.5rem; color: #999; font-size: 0.85rem;">
                    <strong>Hora del escaneo:</strong> ${results.scanTime}
                </p>
            </div>
        </div>
    `;
    
    resultsContent.innerHTML = resultHTML;
    resultsContainer.style.display = 'block';

    // Scroll a resultados
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Cerrar resultados
function closeResults() {
    document.getElementById('resultsContainer').style.display = 'none';
}

// Mostrar/Ocultar spinner de carga
function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// Formulario de contacto
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
        contactForm.reset();
    });
}

// Actualizar estadísticas
function updateStatistics() {
    document.getElementById('filesScanned').textContent = scansCount;
    document.getElementById('threatsDetected').textContent = threatsCount;
    document.getElementById('urlsChecked').textContent = urlChecksCount;
    saveStatistics();
}

// Guardar estadísticas en localStorage
function saveStatistics() {
    localStorage.setItem('scansCount', scansCount);
    localStorage.setItem('threatsCount', threatsCount);
    localStorage.setItem('urlChecksCount', urlChecksCount);
}

// Cargar estadísticas desde localStorage
function loadStatistics() {
    scansCount = parseInt(localStorage.getItem('scansCount')) || 0;
    threatsCount = parseInt(localStorage.getItem('threatsCount')) || 0;
    urlChecksCount = parseInt(localStorage.getItem('urlChecksCount')) || 0;
    updateStatistics();
}

// Scroll suave para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Detectar navegador
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = 'Desconocido';
    
    if (ua.indexOf('Chrome') > -1) browserName = 'Chrome';
    else if (ua.indexOf('Firefox') > -1) browserName = 'Firefox';
    else if (ua.indexOf('Safari') > -1) browserName = 'Safari';
    else if (ua.indexOf('Edge') > -1) browserName = 'Edge';
    
    return browserName;
}

// Validación de entrada en tiempo real
document.getElementById('urlInput')?.addEventListener('input', function() {
    if (this.value.trim() && !isValidURL(this.value.trim())) {
        this.style.borderColor = '#ff6b6b';
    } else {
        this.style.borderColor = '#eee';
    }
});

// Animación al cargar la página
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Efecto de paralaje en el hero
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPosition = `0% ${scrollPosition * 0.5}px`;
    }
});
