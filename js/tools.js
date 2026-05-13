// ============================================
// 🔒 GLOBAL SECURITY MODULE (Compatible)
// ============================================
var SECURITY = {
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff'],
    ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'tiff', 'ico'],
    MAX_FILE_SIZE: 50 * 1024 * 1024,

    isValidImage: function(file) {
        if (!file || !file.name) {
            return { valid: false, reason: 'Invalid file' };
        }
        if (file.size > this.MAX_FILE_SIZE) {
            return { valid: false, reason: 'File too large (max 50MB)' };
        }
        if (this.ALLOWED_MIME_TYPES.indexOf(file.type) !== -1) {
            return { valid: true };
        }
        var ext = file.name.split('.').pop().toLowerCase();
        if (this.ALLOWED_EXTENSIONS.indexOf(ext) !== -1) {
            return { valid: true };
        }
        return { valid: false, reason: 'Unsupported format' };
    }
};

// ============================================
// 🚀 PIXELCRAFT TOOLS - COMPLETE VERSION
// ============================================


 // --- 🗂️ SMART RENAMER (Advanced with variables + Security) ---
const smartRenamerTool = {
    name: 'Smart Renamer',
    icon: '📁',
    files: [],
    fileData: [],
    
    render() {
        return `
            <div class="tool-header">
                <h2>🗂️ Batch Rename Images</h2>
                <p>Rename photos using variables and templates</p>
            </div>
            
            <div class="upload-area" id="toolUpload">
                <input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />
                <div class="upload-content">
                    <span class="upload-icon">📤</span>
                    <h3>Drag & drop photos here</h3>
                    <p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>
                </div>
            </div>
            
            <div class="options-panel" id="optionsPanel" style="display:none;">
                <div class="option-group" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">📝 Name Template:</label>
                    <input type="text" id="namePattern" placeholder="Example: image_#_date" 
                           style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1em;">
                    <small style="color: var(--text-secondary); margin-top: 5px; display: block;">
                        Use variables: # (number), {name}, {ext}, {width}, {height}, {date}, {size}
                    </small>
                </div>
                
                <button type="button" id="toggleVariables" 
                        style="background: var(--bg-secondary); border: 2px solid var(--border-color); padding: 10px 15px; border-radius: 8px; cursor: pointer; margin-bottom: 15px;">
                    📋 Variables
                </button>
                
                <div id="variablesList" style="display: none; background: var(--bg-secondary); border: 2px solid var(--border-color); border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                        <div class="variable-item" style="padding: 8px; background: var(--bg-primary); border-radius: 6px; cursor: pointer;" data-var="#"># — File Number</div>
                        <div class="variable-item" style="padding: 8px; background: var(--bg-primary); border-radius: 6px; cursor: pointer;" data-var="{name}">{name} — Original Name</div>
                        <div class="variable-item" style="padding: 8px; background: var(--bg-primary); border-radius: 6px; cursor: pointer;" data-var="{ext}">{ext} — Extension</div>
                        <div class="variable-item" style="padding: 8px; background: var(--bg-primary); border-radius: 6px; cursor: pointer;" data-var="{width}">{width} — Width</div>
                        <div class="variable-item" style="padding: 8px; background: var(--bg-primary); border-radius: 6px; cursor: pointer;" data-var="{height}">{height} — Height</div>
                        <div class="variable-item" style="padding: 8px; background: var(--bg-primary); border-radius: 6px; cursor: pointer;" data-var="{date}">{date} — Modified Date</div>
                        <div class="variable-item" style="padding: 8px; background: var(--bg-primary); border-radius: 6px; cursor: pointer;" data-var="{size}">{size} — File Size</div>
                    </div>
                </div>
                
                <div class="grid-2" style="margin-bottom: 20px;">
                    <div class="option-group">
                        <label>🔢 Start Number:</label>
                        <input type="number" id="startNumber" value="1" min="0" 
                               style="width: 100%; padding: 10px; border: 2px solid var(--border-color); border-radius: 8px;">
                    </div>
                    <div class="option-group">
                        <label>📏 Number Format:</label>
                        <select id="numberFormat" 
                                style="width: 100%; padding: 10px; border: 2px solid var(--border-color); border-radius: 8px;">
                            <option value="1">1, 2, 3...</option>
                            <option value="01">01, 02, 03...</option>
                            <option value="001" selected>001, 002, 003...</option>
                            <option value="0001">0001, 0002...</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn-primary btn-large" id="processBtn" 
                        style="width: 100%; padding: 16px; font-size: 1.1em;">
                    🔄 Rename & Download ZIP
                </button>
            </div>
            
            <div id="previewArea" style="display:none; margin: 20px 0;">
                <h3 style="margin-bottom: 15px;">📸 Preview (<span id="previewCount">0</span> files)</h3>
                <div id="fileList" style="background: var(--bg-secondary); border-radius: 12px; overflow: hidden; max-height: 400px; overflow-y: auto;"></div>
            </div>
            
            <div id="resultArea" class="results-area"></div>
        `;
    },
    
    async init() {
        const uploadArea = document.getElementById('toolUpload');
        const fileInput = document.getElementById('fileInput');
        
        // Click on upload area
        uploadArea.addEventListener('click', (e) => {
            if (e.target === uploadArea || e.target.closest('.upload-content')) {
                fileInput.click();
            }
        });
        
        // File selection
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
        
        // Drag & Drop
        ['dragover', 'dragenter'].forEach(evt => {
            uploadArea.addEventListener(evt, (e) => { 
                e.preventDefault(); 
                uploadArea.classList.add('dragover'); 
            });
        });
        ['dragleave', 'drop'].forEach(evt => {
            uploadArea.addEventListener(evt, () => {
                uploadArea.classList.remove('dragover');
            });
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleFiles(e.dataTransfer.files);
        });
        
        // Toggle variables list
        document.getElementById('toggleVariables').addEventListener('click', () => {
            const list = document.getElementById('variablesList');
            list.style.display = list.style.display === 'none' ? 'block' : 'none';
        });
        
        // Insert variable on click
        document.querySelectorAll('.variable-item').forEach(item => {
            item.addEventListener('click', () => {
                const pattern = item.getAttribute('data-var');
                const input = document.getElementById('namePattern');
                input.value += pattern;
                input.focus();
            });
        });
        
        // Update preview on input change
        document.getElementById('namePattern').addEventListener('input', () => this.updatePreview());
        document.getElementById('startNumber').addEventListener('input', () => this.updatePreview());
        document.getElementById('numberFormat').addEventListener('change', () => this.updatePreview());
        
        // Process button
        document.getElementById('processBtn').addEventListener('click', () => this.process());
    },
    
    // 🔒 SECURITY: Handle files with validation
    async handleFiles(fileList) {
        const rawFiles = Array.from(fileList);
        this.files = []; // Clear list
        this.fileData = [];
        let rejectedCount = 0;
        
        // Filter files through SECURITY module
        rawFiles.forEach(file => {
            const check = SECURITY.isValidImage(file);
            if (check.valid) {
                this.files.push(file);
            } else {
                rejectedCount++;
                console.warn(`🚫 Blocked: ${file.name} - ${check.reason}`);
            }
        });
        
        // Show warning if files were rejected
        if (rejectedCount > 0) {
            alert(`⚠️ ${rejectedCount} file(s) skipped: invalid format or too large.`);
        }
        
        // If no valid files, hide panel and exit
        if (this.files.length === 0) {
            document.getElementById('optionsPanel').style.display = 'none';
            return;
        }
        
        // Show options panel
        document.getElementById('optionsPanel').style.display = 'block';
        
        // Load metadata for valid files
        for (const file of this.files) {
            const data = await this.getFileMetadata(file);
            this.fileData.push(data);
        }
        
        // Update UI
        this.updatePreview();
    },
    
    // Get image metadata (width, height, etc.)
    getFileMetadata(file) {
        return new Promise(resolve => {
            const name = file.name.split('.').slice(0, -1).join('.');
            const ext = file.name.split('.').pop().toLowerCase();
            const size = file.size;
            const date = new Date(file.lastModified).toLocaleDateString('en-US');
            
            if (file.type.startsWith('image/')) {
                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                    resolve({
                        file, name, ext, width: img.width, height: img.height, size, date, url: img.src
                    });
                };
            } else {
                resolve({ file, name, ext, width: 0, height: 0, size, date, url: null });
            }
        });
    },
    
    formatNumber(num, format) {
        const numStr = num.toString();
        switch(format) {
            case '1': return numStr;
            case '01': return numStr.padStart(2, '0');
            case '001': return numStr.padStart(3, '0');
            case '0001': return numStr.padStart(4, '0');
            default: return numStr.padStart(3, '0');
        }
    },
    
    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },
    
    generateName(data, index, pattern, startNum, numFormat) {
        let newName = pattern;
        const num = parseInt(startNum) + index;
        
        newName = newName.replace(/#/g, this.formatNumber(num, numFormat));
        newName = newName.replace(/{name}/g, data.name);
        newName = newName.replace(/{ext}/g, data.ext);
        newName = newName.replace(/{width}/g, data.width);
        newName = newName.replace(/{height}/g, data.height);
        newName = newName.replace(/{date}/g, data.date.replace(/\./g, '-'));
        newName = newName.replace(/{size}/g, this.formatSize(data.size));
        
        // Remove invalid filename characters
        newName = newName.replace(/[<>:"/\\|?*]/g, '_');
        
        // Add extension if missing
        if (!newName.toLowerCase().endsWith('.' + data.ext.toLowerCase())) {
            newName += '.' + data.ext;
        }
        
        return newName;
    },
    
    updatePreview() {
        const pattern = document.getElementById('namePattern').value || '{name}_#';
        const startNum = document.getElementById('startNumber').value;
        const numFormat = document.getElementById('numberFormat').value;
        
        const fileList = document.getElementById('fileList');
        const previewArea = document.getElementById('previewArea');
        const previewCount = document.getElementById('previewCount');
        
        previewArea.style.display = 'block';
        previewCount.textContent = this.fileData.length;
        fileList.innerHTML = '';
        
        this.fileData.forEach((data, index) => {
            const newName = this.generateName(data, index, pattern, startNum, numFormat);
            
            const item = document.createElement('div');
            item.style.cssText = 'padding: 12px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 15px;';
            
            if (data.url) {
                const thumb = document.createElement('img');
                thumb.src = data.url;
                thumb.style.cssText = 'width: 50px; height: 50px; object-fit: cover; border-radius: 6px;';
                item.appendChild(thumb);
            }
            
            const info = document.createElement('div');
            info.style.cssText = 'flex: 1; overflow: hidden;';
            info.innerHTML = `
                <div style="font-size: 0.85em; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    📄 ${data.name}.${data.ext}
                </div>
                <div style="font-weight: 600; color: var(--primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ↓ ${newName}
                </div>
            `;
            item.appendChild(info);
            
            fileList.appendChild(item);
        });
    },
    
    async process() {
        if (!this.fileData.length) return;
        
        const pattern = document.getElementById('namePattern').value || '{name}_#';
        const startNum = document.getElementById('startNumber').value;
        const numFormat = document.getElementById('numberFormat').value;
        
        document.getElementById('resultArea').innerHTML = '<div class="loading">🔄 Renaming...</div>';
        
        const zip = new JSZip();
        const results = [];
        
        this.fileData.forEach((data, index) => {
            const newName = this.generateName(data, index, pattern, startNum, numFormat);
            results.push({ old: data.file.name, new: newName });
            zip.file(newName, data.file);
        });
        
        const content = await zip.generateAsync({type: 'blob'});
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'renamed_files.zip';
        a.click();
        URL.revokeObjectURL(url);
        
        let previewHTML = '<div class="results-success"><h4>✅ Renamed ' + results.length + ' files!</h4><div class="file-list">';
        results.slice(0, 10).forEach(r => {
            previewHTML += `
                <div class="file-item">
                    <span>📄 ${r.old}</span>
                    <span style="color: var(--text-secondary);">→</span>
                    <span style="color: var(--primary); font-weight: 600;">${r.new}</span>
                </div>
            `;
        });
        if (results.length > 10) {
            previewHTML += `<div class="file-item">...and ${results.length - 10} more files</div>`;
        }
        previewHTML += '</div><p style="color:var(--primary); font-weight:600; margin-top:15px;">📥 ZIP downloaded!</p></div>';
        
        document.getElementById('resultArea').innerHTML = previewHTML;
    }
};


// --- 🗜️ COMPRESS PRO (Full Version + Security) ---
const compressTool = {
    name: 'Compress Pro',
    icon: '🗜️',
    files: [],

    render() {
        return `
            <div class="tool-header">
                <h2>🗜️ Compress Pro</h2>
                <p>Reduce photo size up to 90% without quality loss</p>
            </div>
            
            <div class="upload-area" id="toolUpload">
                <input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />
                <div class="upload-content">
                    <span class="upload-icon">📤</span>
                    <h3>Drag & drop photos to compress</h3>
                    <p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>
                </div>
            </div>
            
            <div class="options-panel" id="optionsPanel" style="display:none;">
                <h3 style="margin-bottom: 15px;">⚙️ Compression Settings</h3>
                
                <div class="option-group" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600;">
                        Quality Level: <span id="qualityVal" style="color: var(--primary); font-size: 1.2em;">60%</span>
                    </label>
                    <input type="range" id="qualityRange" min="1" max="100" value="60" 
                           style="width: 100%; height: 8px; border-radius: 4px; background: var(--border-color); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 0.85em; color: var(--text-secondary);">
                        <span>Smaller Size</span>
                        <span>Better Quality</span>
                    </div>
                </div>
                
                <div id="previewArea" style="margin-bottom: 20px;">
                    <h4 style="margin-bottom: 10px;">📸 Uploaded Files: <span id="fileCount" style="color: var(--primary);">0</span></h4>
                    <div id="fileList" style="max-height: 200px; overflow-y: auto; background: var(--bg-secondary); padding: 15px; border-radius: 12px; border: 2px solid var(--border-color);"></div>
                </div>
                
                <button class="btn-primary btn-large" id="processBtn" 
                        style="width: 100%; padding: 16px; font-size: 1.1em; font-weight: 600;">
                    🗜️ Compress & Download ZIP
                </button>
            </div>
            
            <div id="resultArea" class="results-area"></div>
        `;
    },

    init() {
        const uploadArea = document.getElementById('toolUpload');
        const fileInput = document.getElementById('fileInput');
        const optionsPanel = document.getElementById('optionsPanel');
        
        // Click on upload area
        uploadArea.addEventListener('click', (e) => {
            if (e.target === uploadArea || e.target.closest('.upload-content')) {
                fileInput.click();
            }
        });
        
        // File selection
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
        
        // Drag & Drop
        ['dragover', 'dragenter'].forEach(evt => {
            uploadArea.addEventListener(evt, (e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                uploadArea.classList.add('dragover'); 
            });
        });
        
        ['dragleave', 'drop'].forEach(evt => {
            uploadArea.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.remove('dragover');
            });
        });
        
        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });
        
        // Quality slider
        const range = document.getElementById('qualityRange');
        if (range) {
            range.addEventListener('input', (e) => {
                document.getElementById('qualityVal').textContent = e.target.value + '%';
            });
        }
        
        // Process button
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.addEventListener('click', () => this.process());
        }
    },

    // 🔒 SECURITY: Handle files with validation
    handleFiles(fileList) {
        const rawFiles = Array.from(fileList);
        this.files = []; // Clear list
        let rejectedCount = 0;

        // Filter files through SECURITY module
        rawFiles.forEach(file => {
            const check = SECURITY.isValidImage(file);
            if (check.valid) {
                this.files.push(file); // Add only safe files
            } else {
                rejectedCount++;
                console.warn(`🚫 Blocked: ${file.name} - ${check.reason}`);
            }
        });

        // Show warning if files were rejected
        if (rejectedCount > 0) {
            alert(`⚠️ ${rejectedCount} file(s) skipped: invalid format or too large.`);
        }

        // Update UI
        if (this.files.length > 0) {
            document.getElementById('optionsPanel').style.display = 'block';
            
            // Render file list
            const listEl = document.getElementById('fileList');
            listEl.innerHTML = '<h4 style="margin-bottom:10px;">📸 Files:</h4>' + 
                this.files.map((f, i) => {
                    const sizeKB = (f.size / 1024).toFixed(1);
                    return `<div style="padding:8px; margin-bottom:5px; background:var(--bg-primary); border-radius:6px; font-size:0.9em; display:flex; justify-content:space-between;">
                        <span>${i+1}. ${f.name}</span>
                        <span style="color:var(--text-secondary);">${sizeKB} KB</span>
                    </div>`;
                }).join('');
        } else {
            document.getElementById('optionsPanel').style.display = 'none';
        }
    },

    async process() {
        if (!this.files.length) {
            alert('Please upload files first!');
            return;
        }
        
        const quality = parseInt(document.getElementById('qualityRange').value) / 100;
        const results = [];
        
        document.getElementById('resultArea').innerHTML = '<div class="loading">⏳ Compressing...</div>';
        const zip = new JSZip();
        
        for (const file of this.files) {
            try {
                const compressed = await this.compressImage(file, quality);
                const savings = ((file.size - compressed.size) / file.size * 100).toFixed(1);
                const newName = `compressed_${file.name}`;
                zip.file(newName, compressed);
                results.push({ 
                    original: file.name, 
                    originalSize: file.size,
                    newSize: compressed.size, 
                    savings: savings 
                });
            } catch (error) {
                console.error('Compression error:', error);
            }
        }
        
        // Create and download ZIP
        const content = await zip.generateAsync({type: 'blob'});
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed_images.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show results
        this.showResults(results);
    },

    compressImage(file, quality) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Failed to create blob'));
                            }
                        },
                        'image/jpeg',
                        quality
                    );
                    
                    URL.revokeObjectURL(img.src);
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
        });
    },

    showResults(results) {
        const totalSavings = results.reduce((sum, r) => sum + parseFloat(r.savings), 0) / results.length;
        
        let html = `
            <div class="results-success">
                <h4>✅ Complete! Compressed ${results.length} files</h4>
                <p style="margin-bottom: 15px;">Average reduction: <strong style="color: var(--success);">${totalSavings.toFixed(1)}%</strong></p>
                <div class="file-list" style="max-height: 300px; overflow-y: auto;">
                    ${results.map(r => `
                        <div class="file-item" style="padding: 10px; margin-bottom: 8px; background: var(--bg-secondary); border-radius: 8px;">
                            <div style="font-weight: 600; margin-bottom: 4px;">📄 ${r.original}</div>
                            <div style="font-size: 0.85em; color: var(--text-secondary);">
                                ${Math.round(r.originalSize / 1024)} KB → ${Math.round(r.newSize / 1024)} KB 
                                <span style="color: var(--success); font-weight: 600; margin-left: 10px;">(-${r.savings}%)</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <p style="margin-top: 20px; padding: 15px; background: var(--bg-secondary); border-radius: 8px; text-align: center; font-weight: 600; color: var(--primary);">
                    📥 ZIP file downloaded!
                </p>
            </div>
        `;
        
        document.getElementById('resultArea').innerHTML = html;
    }
};

// --- 🔄 FORMAT CONVERTER (Full Version + Security) ---
const converterTool = {
    name: 'Format Converter',
    icon: '🔄',
    files: [],

    render() {
        return `
            <div class="tool-header">
                <h2>🔄 Format Converter</h2>
                <p>Convert between PNG, JPG, WEBP, GIF, SVG, BMP</p>
            </div>
            
            <div class="upload-area" id="toolUpload">
                <!-- Support ALL image formats -->
                <input type="file" id="fileInput" multiple accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/svg+xml, image/bmp, image/*" style="display:none;" />
                <div class="upload-content">
                    <span class="upload-icon">📤</span>
                    <h3>Drag & drop photos here</h3>
                    <p style="margin-top:8px; color:var(--text-secondary); font-size:0.9em;">
                    <p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>
                    </p>
                </div>
            </div>
            
            <div class="options-panel" id="optionsPanel" style="display:none;">
                <div class="option-group">
                    <label>🎯 Convert to:</label>
                    <select id="targetFormat" style="width:100%; padding:12px; margin-bottom:15px; border-radius:8px; border:2px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); font-size:1em;">
                        <option value="image/png">PNG (Lossless)</option>
                        <option value="image/jpeg">JPG (Universal)</option>
                        <option value="image/webp">WebP (Modern)</option>
                    </select>
                </div>

                <div id="fileList" style="margin-bottom:20px; max-height:200px; overflow-y:auto; background:var(--bg-secondary); padding:15px; border-radius:12px; border:2px solid var(--border-color);"></div>
                
                <button class="btn-primary btn-large" id="processBtn" style="width:100%; padding:16px; font-size:1.1em;">
                    🔄 Convert & Download ZIP
                </button>
            </div>
            
            <div id="resultArea"></div>
        `;
    },

    init() {
        const upload = document.getElementById('toolUpload');
        const input = document.getElementById('fileInput');
        const btn = document.getElementById('processBtn');

        if (!upload || !input || !btn) {
            console.error('converterTool: Elements not found');
            return;
        }

        // Click handler
        upload.addEventListener('click', () => input.click());

        // File selection
        input.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Drag & Drop
        upload.addEventListener('dragover', (e) => { 
            e.preventDefault(); 
            upload.classList.add('dragover'); 
        });
        upload.addEventListener('dragleave', () => {
            upload.classList.remove('dragover');
        });
        upload.addEventListener('drop', (e) => {
            e.preventDefault();
            upload.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        // Process button
        btn.addEventListener('click', () => this.process());
    },

    // 🔒 SECURITY: Handle files with validation
    handleFiles(fileList) {
        const rawFiles = Array.from(fileList);
        this.files = []; // Clear list
        let rejectedCount = 0;
        
        // Filter files through SECURITY module
        rawFiles.forEach(file => {
            const check = SECURITY.isValidImage(file);
            if (check.valid) {
                this.files.push(file);
            } else {
                rejectedCount++;
                console.warn(`🚫 Blocked: ${file.name} - ${check.reason}`);
            }
        });
        
        // Show warning if files were rejected
        if (rejectedCount > 0) {
            alert(`⚠️ ${rejectedCount} file(s) skipped: invalid format or too large.`);
        }
        
        // If no valid files, hide panel and exit
        if (this.files.length === 0) {
            document.getElementById('optionsPanel').style.display = 'none';
            return;
        }
        
        // Show options panel
        document.getElementById('optionsPanel').style.display = 'block';
        
        // Show file list
        const listEl = document.getElementById('fileList');
        listEl.innerHTML = '<h4 style="margin-bottom:10px;">📸 Files:</h4>' + 
            this.files.map((f, i) => {
                const sizeKB = (f.size / 1024).toFixed(1);
                return `<div style="padding:8px; margin-bottom:5px; background:var(--bg-primary); border-radius:6px; font-size:0.9em; display:flex; justify-content:space-between;">
                    <span>${i+1}. ${f.name}</span>
                    <span style="color:var(--text-secondary);">${sizeKB} KB</span>
                </div>`;
            }).join('');
    },

    async process() {
        if (this.files.length === 0) {
            alert('Please select files first!');
            return;
        }

        const format = document.getElementById('targetFormat').value;
        const ext = format.split('/')[1]; // png, jpeg, webp
        const resultArea = document.getElementById('resultArea');
        
        resultArea.innerHTML = '<div class="loading">⏳ Converting...</div>';

        // Check JSZip
        if (typeof JSZip === 'undefined') {
            resultArea.innerHTML = '<div style="color:red; padding:15px;">❌ JSZip not loaded!</div>';
            return;
        }

        try {
            const zip = new JSZip();
            let successCount = 0;

            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                
                try {
                    // Convert image
                    const blob = await this.convertImage(file, format);
                    
                    // New filename
                    const cleanName = file.name.split('.')[0];
                    const newName = `${cleanName}.${ext}`;
                    
                    // Add to ZIP
                    zip.file(newName, blob);
                    successCount++;
                    
                } catch (err) {
                    console.error(`Error with file ${file.name}:`, err);
                }
            }

            if (successCount === 0) {
                throw new Error('No files were converted');
            }

            // Generate ZIP
            const content = await zip.generateAsync({ type: 'blob' });
            
            // Create download link
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pixelcraft_converted_${Date.now()}.zip`;
            a.style.display = 'none';
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            // Show result
            resultArea.innerHTML = `
                <div class="results-success" style="padding:20px; text-align:center;">
                    <h4 style="color:var(--success); margin-bottom:10px;">✅ Complete!</h4>
                    <p>Converted: <b>${successCount}</b> files</p>
                    <p style="margin-top:10px; color:var(--text-secondary);">
                        📥 File <b>pixelcraft_converted.zip</b> downloaded
                    </p>
                    ${successCount < this.files.length ? 
                        `<p style="color:orange; margin-top:10px;">⚠️ ${this.files.length - successCount} file(s) skipped</p>` : ''
                    }
                </div>
            `;

        } catch (error) {
            console.error(error);
            resultArea.innerHTML = `<div style="color:red; padding:15px;">❌ Error: ${error.message}</div>`;
        }
    },

    convertImage(file, format) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            // Special handling for SVG
            if (file.type === 'image/svg+xml') {
                // Convert SVG to PNG via canvas
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width || 800;
                    canvas.height = img.height || 600;
                    const ctx = canvas.getContext('2d');
                    
                    // White background for SVG
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('SVG conversion failed'));
                    }, format, 0.95);
                };
                img.src = URL.createObjectURL(file);
                return;
            }

            // For all other formats
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                // White background for JPG (to avoid black transparency)
                if (format === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas toBlob failed'));
                    }
                }, format, 0.95);

                URL.revokeObjectURL(img.src);
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }
};

// --- 📏 BATCH RESIZER (YouTube/TikTok + Vertical Presets + Security) ---
const resizerTool = {
    name: 'Batch Resizer',
    icon: '📏',
    files: [],

    render() {
        return `
            <div class="tool-header">
                <h2>📏 Batch Resizer</h2>
                <p>Resize multiple photos with one click</p>
            </div>
            
            <div class="upload-area" id="toolUpload">
                <input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />
                <div class="upload-content">
                    <span class="upload-icon">📤</span>
                    <h3>Drag & drop photos here</h3>
                    <p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>
                </div>
            </div>
            
            <div class="options-panel" id="optionsPanel" style="display:none;">
                
                <!-- Resize Mode -->
                <div class="option-group" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600;">📐 Resize Mode:</label>
                    <select id="resizeMode" style="width:100%; padding:10px; margin-bottom:15px; border-radius:8px; border:2px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary);">
                        <option value="dimensions">📏 Custom Width & Height</option>
                        <option value="percentage">📊 Percentage of Original</option>
                        <option value="preset">🎯 Presets</option>
                        <option value="longest">↔️ Longest Side</option>
                    </select>
                </div>

                <!-- Mode 1: Dimensions -->
                <div id="modeDimensions" class="resize-mode">
                    <div class="grid-2" style="margin-bottom: 15px;">
                        <div class="option-group">
                            <label>Width (px):</label>
                            <input type="number" id="resizeWidth" placeholder="1920" style="width:100%; padding:10px; border-radius:8px; border:2px solid var(--border-color);">
                        </div>
                        <div class="option-group">
                            <label>Height (px):</label>
                            <input type="number" id="resizeHeight" placeholder="1080" style="width:100%; padding:10px; border-radius:8px; border:2px solid var(--border-color);">
                        </div>
                    </div>
                    <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; cursor: pointer;">
                        <input type="checkbox" id="keepAspectRatio" checked style="width: 18px; height: 18px;" />
                        <span>🔒 Keep Aspect Ratio</span>
                    </label>
                </div>

                <!-- Mode 2: Percentage -->
                <div id="modePercentage" class="resize-mode" style="display: none;">
                    <div class="option-group" style="margin-bottom: 15px;">
                        <label>Size: <span id="percentVal" style="color: var(--primary); font-weight: bold;">50%</span></label>
                        <input type="range" id="resizePercent" min="1" max="200" value="50" style="width:100%;" />
                        <div style="display: flex; justify-content: space-between; font-size: 0.85em; color: var(--text-secondary);">
                            <span>1%</span>
                            <span>100%</span>
                            <span>200%</span>
                        </div>
                    </div>
                </div>

                <!-- Mode 3: Presets (Updated: YouTube, TikTok, Vertical) -->
                <div id="modePreset" class="resize-mode" style="display: none;">
                    <div class="option-group" style="margin-bottom: 15px;">
                        <label>Choose Preset:</label>
                        <select id="resizePreset" style="width:100%; padding:10px; margin-top:8px; border-radius:8px; border:2px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary);">
                            
                            <!-- 🎬 Social Media: Vertical -->
                            <optgroup label="📱 Social Media (Vertical)">
                                <option value="1080x1920">🎵 TikTok / Reels / Shorts (1080×1920)</option>
                                <option value="1080x1350">📷 Instagram Portrait (1080×1350)</option>
                                <option value="720x1280">📱 HD Vertical (720×1280)</option>
                            </optgroup>
                            
                            <!-- 🎬 Social Media: Horizontal/Square -->
                            <optgroup label="🌐 Social Media (Horizontal/Square)">
                                <option value="1200x630">📘 Facebook / LinkedIn (1200×630)</option>
                                <option value="1280x720">🎬 YouTube Thumbnail (1280×720)</option>
                                <option value="1080x1080">📷 Instagram Square (1080×1080)</option>
                            </optgroup>

                            <!-- 🖥️ Standard Resolutions -->
                            <optgroup label="🖥️ Standard Resolutions">
                                <option value="6144x3456">🎬 6K UHD (6144×3456)</option>
                                <option value="3840x2160">📺 4K UHD (3840×2160)</option>
                                <option value="2560x1440">🖥️ 2K QHD (2560×1440)</option>
                                <option value="1920x1080">🖥️ Full HD (1920×1080)</option>
                                <option value="1280x720">💻 HD (1280×720)</option>
                            </optgroup>
                            
                            <!-- 📏 Small / Legacy -->
                            <optgroup label="📏 Small / Legacy">
                                <option value="800x600">🖥️ SVGA (800×600)</option>
                                <option value="640x480">📟 VGA (640×480)</option>
                                <option value="thumbnail">🔲 Thumbnail (150×150)</option>
                            </optgroup>
                            
                        </select>
                    </div>
                </div>

                <!-- Mode 4: Longest Side -->
                <div id="modeLongest" class="resize-mode" style="display: none;">
                    <div class="option-group">
                        <label>Maximum Size (px):</label>
                        <input type="number" id="maxSize" value="1920" placeholder="1920" style="width:100%; padding:10px; margin-top:8px; border-radius:8px; border:2px solid var(--border-color);" />
                        <small style="color: var(--text-secondary); display: block; margin-top: 5px;">
                            Resizes the longest side to this dimension while maintaining aspect ratio
                        </small>
                    </div>
                </div>

                <!-- File List -->
                <div id="fileList" style="margin: 20px 0; max-height: 200px; overflow-y: auto; background: var(--bg-secondary); padding: 15px; border-radius: 12px; border: 2px solid var(--border-color);"></div>
                
                <button class="btn-primary btn-large" id="processBtn" style="width: 100%; padding: 16px; font-size: 1.1em;">
                    📏 Resize & Download ZIP
                </button>
            </div>
            
            <div id="resultArea"></div>
        `;
    },

    init() {
        const upload = document.getElementById('toolUpload');
        const input = document.getElementById('fileInput');
        const btn = document.getElementById('processBtn');
        const modeSelect = document.getElementById('resizeMode');

        if (!upload || !input || !btn) return;

        upload.addEventListener('click', () => input.click());
        input.addEventListener('change', (e) => this.handleFiles(e.target.files));

        upload.addEventListener('dragover', (e) => { e.preventDefault(); upload.classList.add('dragover'); });
        upload.addEventListener('dragleave', () => upload.classList.remove('dragover'));
        upload.addEventListener('drop', (e) => {
            e.preventDefault();
            upload.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        if (modeSelect) {
            modeSelect.addEventListener('change', (e) => this.switchMode(e.target.value));
        }

        const percentSlider = document.getElementById('resizePercent');
        if (percentSlider) {
            percentSlider.addEventListener('input', (e) => {
                document.getElementById('percentVal').textContent = e.target.value + '%';
            });
        }

        btn.addEventListener('click', () => this.process());
    },

    switchMode(mode) {
        document.querySelectorAll('.resize-mode').forEach(el => el.style.display = 'none');
        const modeMap = {
            'dimensions': 'modeDimensions',
            'percentage': 'modePercentage',
            'preset': 'modePreset',
            'longest': 'modeLongest'
        };
        const activeMode = modeMap[mode];
        if (activeMode) {
            document.getElementById(activeMode).style.display = 'block';
        }
    },

    // 🔒 SECURITY: Handle files with validation
    handleFiles(fileList) {
        const rawFiles = Array.from(fileList);
        this.files = []; // Clear list
        let rejectedCount = 0;

        // Filter files through SECURITY module
        rawFiles.forEach(file => {
            const check = SECURITY.isValidImage(file);
            if (check.valid) {
                this.files.push(file); // Add only safe files
            } else {
                rejectedCount++;
                console.warn(`🚫 Blocked: ${file.name} - ${check.reason}`);
            }
        });

        // Show warning if files were rejected
        if (rejectedCount > 0) {
            alert(`⚠️ ${rejectedCount} file(s) skipped: invalid format or too large.`);
        }

        // Update UI
        if (this.files.length > 0) {
            document.getElementById('optionsPanel').style.display = 'block';
            
            // Render file list
            const listEl = document.getElementById('fileList');
            listEl.innerHTML = '<h4 style="margin-bottom:10px;">📸 Files:</h4>' + 
                this.files.map((f, i) => {
                    const sizeKB = (f.size / 1024).toFixed(1);
                    return `<div style="padding:8px; margin-bottom:5px; background:var(--bg-primary); border-radius:6px; font-size:0.9em; display:flex; justify-content:space-between;">
                        <span>${i+1}. ${f.name}</span>
                        <span style="color:var(--text-secondary);">${sizeKB} KB</span>
                    </div>`;
                }).join('');
        } else {
            document.getElementById('optionsPanel').style.display = 'none';
        }
    },

    async process() {
        if (this.files.length === 0) {
            alert('Please select files first!');
            return;
        }

        const resultArea = document.getElementById('resultArea');
        resultArea.innerHTML = '<div class="loading">📏 Processing...</div>';

        if (typeof JSZip === 'undefined') {
            resultArea.innerHTML = '<div style="color:red; padding:15px;">❌ JSZip not loaded!</div>';
            return;
        }

        try {
            const zip = new JSZip();
            const mode = document.getElementById('resizeMode').value;
            let successCount = 0;

            for (const file of this.files) {
                try {
                    const targetSize = this.getTargetSize(mode, file);
                    const blob = await this.resizeImage(file, targetSize);
                    
                    const cleanName = file.name.split('.')[0];
                    const ext = file.name.split('.').pop();
                    zip.file(`${cleanName}_resized.${ext}`, blob);
                    successCount++;
                    
                } catch (err) {
                    console.error(`Error with file ${file.name}:`, err);
                }
            }

            if (successCount === 0) {
                throw new Error('No files were processed');
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'pixelcraft_resized.zip';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            resultArea.innerHTML = `
                <div class="results-success" style="padding:20px; text-align:center;">
                    <h4 style="color:var(--success); margin-bottom:10px;">✅ Complete!</h4>
                    <p>Resized: <b>${successCount}</b> files</p>
                    <p style="margin-top:10px; color:var(--text-secondary);">
                        📥 File <b>pixelcraft_resized.zip</b> downloaded
                    </p>
                </div>
            `;

        } catch (error) {
            console.error(error);
            resultArea.innerHTML = `<div style="color:red; padding:15px;">❌ Error: ${error.message}</div>`;
        }
    },

    getTargetSize(mode, file) {
        switch (mode) {
            case 'dimensions':
                return {
                    width: parseInt(document.getElementById('resizeWidth').value) || 1920,
                    height: parseInt(document.getElementById('resizeHeight').value) || 1080,
                    keepAspectRatio: document.getElementById('keepAspectRatio').checked
                };
            
            case 'percentage':
                const percent = parseInt(document.getElementById('resizePercent').value) / 100;
                return { percent: percent, keepAspectRatio: true };
            
            case 'preset':
                const preset = document.getElementById('resizePreset').value;
                if (preset === 'thumbnail') {
                    return { width: 150, height: 150, keepAspectRatio: false };
                }
                const [w, h] = preset.split('x').map(Number);
                return { width: w, height: h, keepAspectRatio: true };
            
            case 'longest':
                return {
                    maxSize: parseInt(document.getElementById('maxSize').value) || 1920,
                    keepAspectRatio: true
                };
            
            default:
                return { width: 1920, height: 1080, keepAspectRatio: true };
        }
    },

    resizeImage(file, options) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                let newWidth = img.width;
                let newHeight = img.height;

                if (options.percent) {
                    newWidth = Math.round(img.width * options.percent);
                    newHeight = Math.round(img.height * options.percent);
                } else if (options.maxSize) {
                    if (img.width > img.height) {
                        newWidth = options.maxSize;
                        newHeight = Math.round((img.height / img.width) * options.maxSize);
                    } else {
                        newHeight = options.maxSize;
                        newWidth = Math.round((img.width / img.height) * options.maxSize);
                    }
                } else if (options.keepAspectRatio) {
                    const ratio = Math.min(options.width / img.width, options.height / img.height);
                    newWidth = Math.round(img.width * ratio);
                    newHeight = Math.round(img.height * ratio);
                } else {
                    newWidth = options.width;
                    newHeight = options.height;
                }

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                if (file.type === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                let format = file.type;
                if (format === 'image/svg+xml') format = 'image/png';
                
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas toBlob failed'));
                }, format, 0.95);

                URL.revokeObjectURL(img.src);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
        });
    }
};

// --- 🖼️ CORNERS TOOL (Security + Preview 800px) ---
var cornersTool = {
    name: 'Corners Tool',
    icon: '🖼️',
    files: [],
    previewImg: null,

    render: function() {
        return '<div class="tool-header"><h2>🖼️ Corners Tool</h2><p>Round or cut photo corners</p></div>' +
            '<div class="upload-area" id="toolUpload"><input type="file" id="fileInput" multiple accept="image/*" style="display:none;"/><div class="upload-content"><span class="upload-icon">📤</span><h3>Drag & drop photos</h3><p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p></div>' +
            '<div class="options-panel" id="optionsPanel" style="display:none;">' +
            '<div class="option-group" style="margin-bottom:15px;"><label>Cut Style:</label><select id="cutStyle" style="width:100%;padding:8px;margin-top:5px;border-radius:6px;border:1px solid var(--border-color);"><option value="rounded">🔘 Rounded</option><option value="triangle">🔺 Triangle Cut</option></select></div>' +
            '<div class="option-group" style="margin-bottom:15px;"><label>Size: <span id="sizeVal">50px</span></label><input type="range" id="sizeSlider" min="0" max="500" value="50" style="width:100%;"/></div>' +
            '<div class="option-group" style="margin-bottom:15px;"><label style="font-weight:600;">👁️ Preview:</label>' +
            '<div id="previewWrapper" style="width:100%;margin:10px 0;background:var(--bg-secondary);border-radius:8px;overflow:hidden;border:1px solid var(--border-color);min-height:100px;">' +
            '<canvas id="previewCanvas" style="display:block;max-width:100%;"></canvas>' +
            '<span id="previewPlaceholder" style="display:block;padding:60px 20px;text-align:center;color:var(--text-secondary);">Upload image to preview</span>' +
            '</div></div>' +
            '<div id="fileList" style="margin-bottom:15px;font-size:0.9em;max-height:100px;overflow-y:auto;"></div>' +
            '<button class="btn-primary btn-large" id="processBtn" style="width:100%;">📥 Download ZIP</button>' +
            '</div><div id="resultArea"></div>';
    },

    init: function() {
        var self = this;
        var upload = document.getElementById('toolUpload');
        var input = document.getElementById('fileInput');
        var btn = document.getElementById('processBtn');
        var slider = document.getElementById('sizeSlider');
        var styleSelect = document.getElementById('cutStyle');

        if (!upload || !input || !btn) { console.error('cornersTool: init failed'); return; }

        upload.onclick = function() { input.click(); };
        input.onchange = function(e) { self.handleFiles(e.target.files); };

        upload.ondragover = function(e) { e.preventDefault(); upload.classList.add('dragover'); };
        upload.ondragleave = function() { upload.classList.remove('dragover'); };
        upload.ondrop = function(e) { e.preventDefault(); upload.classList.remove('dragover'); self.handleFiles(e.dataTransfer.files); };

        if (slider) {
            slider.oninput = function(e) {
                document.getElementById('sizeVal').textContent = e.target.value + 'px';
                self.updatePreview();
            };
        }
        
        if (styleSelect) {
            styleSelect.onchange = function() {
                self.updatePreview();
            };
        }

        btn.onclick = function() { self.process(); };
    },

    handleFiles: function(fileList) {
        var self = this;
        var rawFiles = Array.prototype.slice.call(fileList);
        this.files = [];
        var rejected = 0;
        
        for (var i = 0; i < rawFiles.length; i++) {
            var file = rawFiles[i];
            var check = SECURITY.isValidImage(file);
            if (check.valid) {
                this.files.push(file);
            } else {
                rejected++;
                console.warn('Blocked: ' + file.name);
            }
        }
        
        if (rejected > 0) { alert(rejected + ' file(s) skipped for security reasons'); }
        
        if (this.files.length > 0) {
            document.getElementById('optionsPanel').style.display = 'block';
            var list = document.getElementById('fileList');
            var html = '<b>Files (' + this.files.length + '):</b><br>';
            for (var j = 0; j < this.files.length; j++) {
                html += (j+1) + '. ' + this.files[j].name + '<br>';
            }
            list.innerHTML = html;
            self.loadPreview(this.files[0]);
        }
    },

    loadPreview: function(file) {
        var self = this;
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function() {
            self.previewImg = img;
            document.getElementById('previewPlaceholder').style.display = 'none';
            self.updatePreview();
        };
        img.onerror = function() {
            alert('Failed to load image: ' + file.name);
        };
    },

    updatePreview: function() {
        var self = this;
        if (!self.previewImg) return;

        var canvas = document.getElementById('previewCanvas');
        var ctx = canvas.getContext('2d');
        if (!canvas || !ctx) return;

        // BIGGER preview - max 800px
        var maxW = Math.min(800, window.innerWidth - 60);
        var scale = maxW / self.previewImg.width;
        canvas.width = self.previewImg.width * scale;
        canvas.height = self.previewImg.height * scale;

        var size = parseInt(document.getElementById('sizeSlider').value) * scale;
        var style = document.getElementById('cutStyle').value;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Checkerboard background (transparent indicator)
        var pattern = self.createCheckerboard(ctx, canvas.width, canvas.height);
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.beginPath();
        
        if (style === 'rounded') {
            ctx.moveTo(size, 0);
            ctx.lineTo(canvas.width - size, 0);
            ctx.quadraticCurveTo(canvas.width, 0, canvas.width, size);
            ctx.lineTo(canvas.width, canvas.height - size);
            ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - size, canvas.height);
            ctx.lineTo(size, canvas.height);
            ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - size);
            ctx.lineTo(0, size);
            ctx.quadraticCurveTo(0, 0, size, 0);
        } else {
            ctx.moveTo(size, 0);
            ctx.lineTo(canvas.width - size, 0);
            ctx.lineTo(canvas.width, size);
            ctx.lineTo(canvas.width, canvas.height - size);
            ctx.lineTo(canvas.width - size, canvas.height);
            ctx.lineTo(size, canvas.height);
            ctx.lineTo(0, canvas.height - size);
            ctx.lineTo(0, size);
        }
        
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(self.previewImg, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    },

    createCheckerboard: function(ctx, width, height) {
        var patternCanvas = document.createElement('canvas');
        patternCanvas.width = 20;
        patternCanvas.height = 20;
        var patternCtx = patternCanvas.getContext('2d');
        patternCtx.fillStyle = '#e0e0e0';
        patternCtx.fillRect(0, 0, 20, 20);
        patternCtx.fillStyle = '#f0f0f0';
        patternCtx.fillRect(0, 0, 10, 10);
        patternCtx.fillRect(10, 10, 10, 10);
        return ctx.createPattern(patternCanvas, 'repeat');
    },

    process: function() {
        var self = this;
        if (this.files.length === 0) { alert('Select files first!'); return; }
        
        var resultArea = document.getElementById('resultArea');
        resultArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary);border-radius:10px;height:24px;overflow:hidden;border:1px solid var(--border-color);"><div id="progressBar" style="background:var(--primary);height:100%;width:0%;transition:width 0.3s;"></div></div><p id="progressText" style="text-align:center;margin-top:8px;font-weight:600;">Processing 0 of ' + this.files.length + '...</p></div>';
        
        if (typeof JSZip === 'undefined') {
            resultArea.innerHTML = '<div style="color:red">Error: ZIP library not loaded</div>';
            return;
        }
        
        var size = parseInt(document.getElementById('sizeSlider').value);
        var style = document.getElementById('cutStyle').value;
        var zip = new JSZip();
        var count = 0;
        var idx = 0;
        var total = this.files.length;
        
        function next() {
            if (idx >= total) { finish(); return; }
            
            document.getElementById('progressText').textContent = 'Processing ' + (idx + 1) + ' of ' + total + '...';
            document.getElementById('progressBar').style.width = ((idx + 1) / total * 100) + '%';
            
            var file = self.files[idx];
            self.applyCorners(file, size, style).then(function(blob) {
                var name = file.name.split('.')[0] + '_corners.png';
                zip.file(name, blob);
                count++;
                idx++;
                setTimeout(next, 10);
            }).catch(function(err) {
                console.error('Error processing ' + file.name + ':', err);
                idx++;
                setTimeout(next, 10);
            });
        }
        
        function finish() {
            if (count === 0) { resultArea.innerHTML = '<div style="color:red">Failed to process files</div>'; return; }
            resultArea.innerHTML = '<div style="margin:20px 0;text-align:center;"><h4>✅ Complete!</h4><p>Creating ZIP file...</p></div>';
            zip.generateAsync({type:'blob'}).then(function(content) {
                var url = URL.createObjectURL(content);
                var a = document.createElement('a');
                a.href = url; a.download = 'corners_' + style + '_' + size + 'px.zip';
                document.body.appendChild(a); a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                resultArea.innerHTML = '<div class="results-success"><h4>✅ Complete!</h4><p>' + count + ' files processed</p><p>📥 ZIP downloaded</p></div>';
            }).catch(function(err) {
                console.error('ZIP error:', err);
                resultArea.innerHTML = '<div style="color:red">Error creating ZIP</div>';
            });
        }
        next();
    },

    applyCorners: function(file, size, style) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = function() {
                var c = document.createElement('canvas');
                var ctx = c.getContext('2d');
                c.width = img.width;
                c.height = img.height;
                
                ctx.beginPath();
                
                if (style === 'rounded') {
                    ctx.moveTo(size, 0);
                    ctx.lineTo(c.width - size, 0);
                    ctx.quadraticCurveTo(c.width, 0, c.width, size);
                    ctx.lineTo(c.width, c.height - size);
                    ctx.quadraticCurveTo(c.width, c.height, c.width - size, c.height);
                    ctx.lineTo(size, c.height);
                    ctx.quadraticCurveTo(0, c.height, 0, c.height - size);
                    ctx.lineTo(0, size);
                    ctx.quadraticCurveTo(0, 0, size, 0);
                } else {
                    ctx.moveTo(size, 0);
                    ctx.lineTo(c.width - size, 0);
                    ctx.lineTo(c.width, size);
                    ctx.lineTo(c.width, c.height - size);
                    ctx.lineTo(c.width - size, c.height);
                    ctx.lineTo(size, c.height);
                    ctx.lineTo(0, c.height - size);
                    ctx.lineTo(0, size);
                }
                
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, 0, 0);
                
                c.toBlob(function(blob) {
                    if (blob) resolve(blob);
                    else reject('Canvas to Blob failed');
                }, 'image/png');
                
                URL.revokeObjectURL(img.src);
            };
            img.onerror = function() {
                reject('Image load failed');
            };
        });
    }
};

// --- 💧 WATERMARK TOOL (Simplified & Fixed) ---
var watermarkTool = {
    name: 'Watermark Tool',
    icon: '💧',
    files: [],
    previewImg: null,
    watermarkX: 0,
    watermarkY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,

    render: function() {
        return '<div class="tool-header">' +
            '<h2>💧 Watermark Tool</h2>' +
            '<p>Add text watermark to your images</p>' +
            '</div>' +
            '<div class="upload-area" id="toolUpload">' +
            '<input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />' +
            '<div class="upload-content">' +
            '<span class="upload-icon">📤</span>' +
            '<h3>Drag & drop photos</h3>' +
            '<p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>' +
            '</div>' +
            '</div>' +
            '<div class="options-panel" id="optionsPanel" style="display:none;">' +
            
            // Text
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">💬 Text:</label>' +
            '<input type="text" id="wmText" value="© PixelCraft" style="width:100%; padding:8px; margin-top:5px; border-radius:6px; border:1px solid var(--border-color);" />' +
            '</div>' +

            // Font
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">🔤 Font:</label>' +
            '<select id="wmFont" style="width:100%; padding:8px; margin-top:5px; border-radius:6px; border:1px solid var(--border-color);">' +
            '<option value="Arial">Arial</option>' +
            '<option value="Roboto">Roboto</option>' +
            '<option value="Open Sans">Open Sans</option>' +
            '<option value="Montserrat">Montserrat</option>' +
            '<option value="Poppins">Poppins</option>' +
            '<option value="Playfair Display">Playfair Display</option>' +
            '<option value="Pacifico">Pacifico</option>' +
            '<option value="Oswald">Oswald</option>' +
            '<option value="Ubuntu">Ubuntu</option>' +
            '<option value="PT Sans">PT Sans</option>' +
            '</select>' +
            '</div>' +

            // Color
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">🎨 Color:</label>' +
            '<input type="color" id="wmColor" value="#ffffff" style="width:100%; height:40px; margin-top:5px; border-radius:6px; border:none;" />' +
            '</div>' +

            // Opacity
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">🔒 Opacity: <span id="wmOpacityVal">70%</span></label>' +
            '<input type="range" id="wmOpacity" min="5" max="100" value="70" style="width:100%; margin-top:5px;" />' +
            '</div>' +

            // Font Size
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">📏 Font Size: <span id="fontSizeVal">40px</span></label>' +
            '<input type="range" id="fontSize" min="10" max="150" value="40" style="width:100%; margin-top:5px;" />' +
            '</div>' +

            // Position Mode
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">📍 Position:</label>' +
            '<div style="display:flex; gap:10px; margin-top:5px;">' +
            '<label style="flex:1; padding:10px; border:2px solid var(--border-color); border-radius:6px; cursor:pointer; text-align:center;">' +
            '<input type="radio" name="wmMode" value="preset" checked style="margin-bottom:5px;" />' +
            '<div>📐 Preset</div>' +
            '</label>' +
            '<label style="flex:1; padding:10px; border:2px solid var(--border-color); border-radius:6px; cursor:pointer; text-align:center;">' +
            '<input type="radio" name="wmMode" value="manual" style="margin-bottom:5px;" />' +
            '<div>✋ Manual</div>' +
            '</label>' +
            '</div>' +
            '</div>' +

            '<div id="presetPositions" style="margin-bottom:15px;">' +
            '<select id="wmPosition" style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border-color);">' +
            '<option value="bottom-right">Bottom Right ↘</option>' +
            '<option value="bottom-left">Bottom Left ↙</option>' +
            '<option value="top-right">Top Right ↗</option>' +
            '<option value="top-left">Top Left ↖</option>' +
            '<option value="center">Center ⬤</option>' +
            '</select>' +
            '</div>' +

            '<div id="manualPosition" style="display:none; margin-bottom:15px; padding:10px; background:var(--bg-secondary); border-radius:6px;">' +
            '<small style="color:var(--primary);">💡 Click anywhere on preview to place watermark</small>' +
            '</div>' +

            // Live Preview - BIGGER, NO ZOOM
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">👁️ Preview:</label>' +
            '<div id="previewWrapper" style="width:100%; margin:10px 0; background:var(--bg-secondary); border-radius:8px; overflow:hidden; border:1px solid var(--border-color); min-height:100px;">' +
            '<canvas id="previewCanvas" style="display:block; max-width:100%; cursor:crosshair;"></canvas>' +
            '<span id="previewPlaceholder" style="display:block; padding:60px 20px; text-align:center; color:var(--text-secondary);">Upload image to preview</span>' +
            '</div>' +
            '</div>' +

            // File List
            '<div id="fileList" style="margin-bottom:15px; max-height:100px; overflow-y:auto; font-size:0.9em;"></div>' +
            
            '<button class="btn-primary btn-large" id="processBtn" style="width:100%;">💧 Apply & Download ZIP</button>' +
            '</div>' +
            '<div id="resultArea"></div>';
    },

    init: function() {
        var self = this;
        var upload = document.getElementById('toolUpload');
        var input = document.getElementById('fileInput');
        var btn = document.getElementById('processBtn');

        if (!upload || !input) { console.error('watermarkTool: init failed'); return; }

        self.loadGoogleFonts();

        // Upload
        upload.onclick = function() { input.click(); };
        input.onchange = function(e) { self.handleFiles(e.target.files); };
        upload.ondragover = function(e) { e.preventDefault(); upload.classList.add('dragover'); };
        upload.ondragleave = function() { upload.classList.remove('dragover'); };
        upload.ondrop = function(e) { e.preventDefault(); upload.classList.remove('dragover'); self.handleFiles(e.dataTransfer.files); };

        // Bind inputs
        var bindInput = function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.oninput = function(e) {
                    var val = e.target.value;
                    if (id === 'fontSize') document.getElementById('fontSizeVal').textContent = val + 'px';
                    if (id === 'wmOpacity') document.getElementById('wmOpacityVal').textContent = val + '%';
                    self.updatePreview();
                };
            }
        };

        bindInput('wmText'); bindInput('wmFont'); bindInput('fontSize');
        bindInput('wmPosition'); bindInput('wmColor'); bindInput('wmOpacity');

        // Mode switch
        document.querySelectorAll('input[name="wmMode"]').forEach(function(radio) {
            radio.onchange = function() {
                var isManual = this.value === 'manual';
                document.getElementById('presetPositions').style.display = isManual ? 'none' : 'block';
                document.getElementById('manualPosition').style.display = isManual ? 'block' : 'none';
                self.updatePreview();
            };
        });

        // Canvas click for manual position
        var canvas = document.getElementById('previewCanvas');
        if (canvas) {
            canvas.onclick = function(e) {
                var mode = document.querySelector('input[name="wmMode"]:checked');
                if (mode && mode.value === 'manual' && self.previewImg) {
                    var rect = canvas.getBoundingClientRect();
                    var scaleX = canvas.width / rect.width;
                    var scaleY = canvas.height / rect.height;
                    self.watermarkX = (e.clientX - rect.left) * scaleX;
                    self.watermarkY = (e.clientY - rect.top) * scaleY;
                    self.updatePreview();
                }
            };
        }

        if (btn) btn.onclick = function() { self.process(); };
    },

    loadGoogleFonts: function() {
        var fonts = 'Roboto|Open+Sans|Montserrat|Poppins|Playfair+Display|Pacifico|Oswald|Ubuntu|PT+Sans';
        if (!document.getElementById('google-fonts-link')) {
            var link = document.createElement('link');
            link.id = 'google-fonts-link';
            link.href = 'https://fonts.googleapis.com/css?family=' + fonts + '&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    },

    handleFiles: function(fileList) {
        var self = this;
        var rawFiles = Array.prototype.slice.call(fileList);
        this.files = [];
        var rejected = 0;

        for (var i = 0; i < rawFiles.length; i++) {
            var file = rawFiles[i];
            var check = SECURITY.isValidImage(file);
            if (check.valid) {
                this.files.push(file);
            } else {
                rejected++;
                console.warn('Blocked: ' + file.name);
            }
        }

        if (rejected > 0) alert(rejected + ' file(s) skipped');
        if (this.files.length > 0) {
            document.getElementById('optionsPanel').style.display = 'block';
            var list = document.getElementById('fileList');
            var html = '<b>Files (' + this.files.length + '):</b><br>';
            for (var j = 0; j < this.files.length; j++) html += (j+1) + '. ' + this.files[j].name + '<br>';
            list.innerHTML = html;
            self.loadPreview(this.files[0]);
        }
    },

    loadPreview: function(file) {
        var self = this;
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function() {
            self.previewImg = img;
            document.getElementById('previewPlaceholder').style.display = 'none';
            self.updatePreview();
        };
    },

    updatePreview: function() {
        var self = this;
        if (!self.previewImg) return;

        var canvas = document.getElementById('previewCanvas');
        var ctx = canvas.getContext('2d');
        if (!canvas || !ctx) return;

        // BIGGER preview - max 800px
        var maxW = Math.min(800, window.innerWidth - 60);
        var scale = maxW / self.previewImg.width;
        canvas.width = self.previewImg.width * scale;
        canvas.height = self.previewImg.height * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(self.previewImg, 0, 0, canvas.width, canvas.height);

        // Get settings
        var text = document.getElementById('wmText').value;
        var font = document.getElementById('wmFont').value;
        var fontSize = parseInt(document.getElementById('fontSize').value);
        var color = document.getElementById('wmColor').value;
        var opacity = parseInt(document.getElementById('wmOpacity').value) / 100;
        var mode = document.querySelector('input[name="wmMode"]:checked');
        var isManual = mode && mode.value === 'manual';

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = 'normal ' + fontSize + 'px "' + font + '", Arial';
        ctx.fillStyle = color;
        ctx.textBaseline = 'bottom';

        var metrics = ctx.measureText(text);
        var textW = metrics.width;
        var textH = fontSize;
        var pad = 20;

        var x, y;
        if (isManual) {
            // Use stored coordinates (already in canvas space)
            x = self.watermarkX;
            y = self.watermarkY;
        } else {
            var pos = document.getElementById('wmPosition').value;
            switch(pos) {
                case 'top-left': x = pad; y = pad + textH; break;
                case 'top-right': x = canvas.width - textW - pad; y = pad + textH; break;
                case 'bottom-left': x = pad; y = canvas.height - pad; break;
                case 'center': x = (canvas.width - textW)/2; y = (canvas.height + textH)/2; break;
                case 'bottom-right': default: x = canvas.width - textW - pad; y = canvas.height - pad;
            }
        }

        // Shadow for better visibility
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(text, x, y);
        ctx.restore();
    },

    process: function() {
        var self = this;
        if (self.files.length === 0) { alert('Select files first!'); return; }

        var resultArea = document.getElementById('resultArea');
        var text = document.getElementById('wmText').value;
        var font = document.getElementById('wmFont').value;
        var fontSize = parseInt(document.getElementById('fontSize').value);
        var color = document.getElementById('wmColor').value;
        var opacity = parseInt(document.getElementById('wmOpacity').value) / 100;
        var mode = document.querySelector('input[name="wmMode"]:checked');
        var isManual = mode && mode.value === 'manual';
        var pos = document.getElementById('wmPosition').value;

        if (typeof JSZip === 'undefined') {
            resultArea.innerHTML = '<div style="color:red">Error: ZIP library not loaded</div>';
            return;
        }

        var zip = new JSZip();
        var count = 0;
        var total = self.files.length;
        var idx = 0;

        // Progress UI
        resultArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden; border:1px solid var(--border-color);"><div id="progressBar" style="background:var(--primary); height:100%; width:0%; transition:width 0.3s;"></div></div><p id="progressText" style="text-align:center; margin-top:8px; font-weight:600;">Processing 0 of ' + total + '...</p></div>';

        function next() {
            if (idx >= total) { finish(); return; }
            
            document.getElementById('progressText').textContent = 'Processing ' + (idx + 1) + ' of ' + total + '...';
            document.getElementById('progressBar').style.width = ((idx + 1) / total * 100) + '%';

            var file = self.files[idx];
            self.applyWatermark(file, text, font, fontSize, color, opacity, isManual, pos, self.watermarkX, self.watermarkY)
                .then(function(blob) {
                    var name = file.name.split('.')[0] + '_watermarked.png';
                    zip.file(name, blob);
                    count++;
                    idx++;
                    setTimeout(next, 10);
                })
                .catch(function(err) {
                    console.error(err);
                    idx++;
                    setTimeout(next, 10);
                });
        }

        function finish() {
            if (count === 0) { resultArea.innerHTML = '<div style="color:red">Failed to process files</div>'; return; }
            
            resultArea.innerHTML = '<div style="margin:20px 0; text-align:center;"><h4>✅ Complete!</h4><p>Creating ZIP file...</p></div>';
            
            zip.generateAsync({type:'blob'}).then(function(content) {
                var url = URL.createObjectURL(content);
                var a = document.createElement('a');
                a.href = url; a.download = 'watermarked_images.zip';
                document.body.appendChild(a); a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                resultArea.innerHTML = '<div class="results-success"><h4>✅ Complete!</h4><p>' + count + ' files processed</p><p>📥 ZIP downloaded</p></div>';
            });
        }
        
        setTimeout(next, 50);
    },

    applyWatermark: function(file, text, font, fontSize, color, opacity, isManual, pos, manualX, manualY) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = function() {
                var c = document.createElement('canvas');
                var ctx = c.getContext('2d');
                c.width = img.width;
                c.height = img.height;

                // Draw original image
                ctx.drawImage(img, 0, 0);

                // Prepare watermark
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.font = 'normal ' + fontSize + 'px "' + font + '", Arial';
                ctx.fillStyle = color;
                ctx.textBaseline = 'bottom';

                var metrics = ctx.measureText(text);
                var textW = metrics.width;
                var textH = fontSize;
                var pad = 20;

                var x, y;
                if (isManual) {
                    // Scale coordinates from preview to full size
                    var previewCanvas = document.getElementById('previewCanvas');
                    if (previewCanvas && self.previewImg) {
                        var scaleX = img.width / previewCanvas.width;
                        var scaleY = img.height / previewCanvas.height;
                        x = manualX * scaleX;
                        y = manualY * scaleY;
                    } else {
                        x = img.width - textW - pad;
                        y = img.height - pad;
                    }
                } else {
                    // Preset positions
                    switch(pos) {
                        case 'top-left': x = pad; y = pad + textH; break;
                        case 'top-right': x = c.width - textW - pad; y = pad + textH; break;
                        case 'bottom-left': x = pad; y = c.height - pad; break;
                        case 'center': x = (c.width - textW)/2; y = (c.height + textH)/2; break;
                        case 'bottom-right': default: x = c.width - textW - pad; y = c.height - pad;
                    }
                }

                // Shadow
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillText(text, x, y);
                ctx.restore();

                // Export
                c.toBlob(function(blob) { 
                    if (blob) resolve(blob); 
                    else reject('Canvas to Blob failed'); 
                }, 'image/png');
                
                URL.revokeObjectURL(img.src);
            };
            img.onerror = function() { reject('Image load failed'); };
        });
    }
};

// --- 🙈 HIDE FACES TOOL (Fixed: WYSIWYG Mask Size) ---
var hideFacesTool = {
    name: 'Hide Faces',
    icon: '🙈',
    files: [],
    previewImg: null,
    faces: [], 
    dragIndex: -1,
    isDragging: false,

    render: function() {
        return '<div class="tool-header">' +
            '<h2>🙈 Hide Faces</h2>' +
            '<p>Click to add mask, Drag to move</p>' +
            '</div>' +
            '<div class="upload-area" id="toolUpload">' +
            '<input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />' +
            '<div class="upload-content">' +
            '<span class="upload-icon">📤</span>' +
            '<h3>Drag & drop photos</h3>' +
             '<p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>' +
            '</div>' +
            '</div>' +
            '<div class="options-panel" id="optionsPanel" style="display:none;">' +
            
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">⭕ Shape:</label>' +
            '<select id="maskShape" style="width:100%; padding:8px; margin-top:5px;">' +
            '<option value="circle">⭕ Circle</option>' +
            '<option value="square">⬜ Square</option>' +
            '<option value="rectangle">▬ Rectangle (16:9)</option>' +
            '<option value="rounded">🔲 Rounded</option>' +
            '</select>' +
            '</div>' +

            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">🔒 Effect:</label>' +
            '<select id="blurPreset" style="width:100%; padding:8px; margin-top:5px;">' +
            '<option value="medium" selected>🌫️ Standard Blur</option>' +
            '<option value="heavy">🌫️ Strong Blur</option>' +
            '<option value="pixelate">🔲 Cubic Blur (Mosaic)</option>' +
            '</select>' +
            '</div>' +

            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">📏 Size: <span id="faceSizeVal">150px</span></label>' +
            '<input type="range" id="faceSize" min="50" max="500" value="150" style="width:100%; margin-top:5px;" />' +
            '</div>' +

            '<div style="background:var(--bg-secondary); padding:10px; border-radius:6px; margin-bottom:15px; font-size:0.9em;">' +
            '💡 <b>How to use:</b><br>Click image to add mask.<br>Drag mask to move it.' +
            '</div>' +

            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">👁️ Preview:</label>' +
            '<div id="previewWrapper" style="width:100%; background:#eee; border-radius:8px; overflow:hidden; position:relative; cursor:crosshair; display:flex; justify-content:center;">' +
            '<canvas id="previewCanvas" style="display:block; max-width:100%; height:auto;"></canvas>' +
            '</div>' +
            '</div>' +

            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">📋 Active Masks:</label>' +
            '<div id="facesList" style="max-height:100px; overflow-y:auto; margin-top:5px;"></div>' +
            '</div>' +

            '<div id="fileList" style="margin-bottom:15px; max-height:100px; overflow-y:auto; font-size:0.9em;"></div>' +
            
            '<button class="btn-primary btn-large" id="processBtn" style="width:100%;">🙈 Process & Download ZIP</button>' +
            '</div>' +
            '<div id="resultArea"></div>';
    },

    init: function() {
        var self = this;
        var upload = document.getElementById('toolUpload');
        var input = document.getElementById('fileInput');
        var btn = document.getElementById('processBtn');

        if (!upload || !input) return;

        upload.onclick = function() { input.click(); };
        input.onchange = function(e) { self.handleFiles(e.target.files); };
        upload.ondragover = function(e) { e.preventDefault(); upload.classList.add('dragover'); };
        upload.ondragleave = function() { upload.classList.remove('dragover'); };
        upload.ondrop = function(e) { e.preventDefault(); upload.classList.remove('dragover'); self.handleFiles(e.dataTransfer.files); };

        document.getElementById('maskShape').onchange = function() { self.updatePreview(); };
        document.getElementById('blurPreset').onchange = function() { self.updatePreview(); };
        document.getElementById('faceSize').oninput = function(e) { 
            document.getElementById('faceSizeVal').textContent = e.target.value + 'px';
            self.updatePreview();
        };

        var canvas = document.getElementById('previewCanvas');
        
        canvas.onmousedown = function(e) {
            var pos = self.getMousePos(canvas, e);
            var hitIndex = self.hitTest(pos.x, pos.y);
            
            if (hitIndex >= 0) {
                self.dragIndex = hitIndex;
                self.isDragging = true;
            } else {
                self.addFace(pos.x, pos.y);
            }
        };

        window.onmousemove = function(e) {
            if (self.isDragging && self.dragIndex >= 0) {
                var rect = canvas.getBoundingClientRect();
                var scaleX = canvas.width / rect.width;
                var scaleY = canvas.height / rect.height;
                self.faces[self.dragIndex].x = (e.clientX - rect.left) * scaleX;
                self.faces[self.dragIndex].y = (e.clientY - rect.top) * scaleY;
                self.updatePreview();
            }
        };

        window.onmouseup = function() {
            self.isDragging = false;
            self.dragIndex = -1;
        };

        if (btn) btn.onclick = function() { self.process(); };
    },

    getMousePos: function(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    },

    hitTest: function(x, y) {
        // Виправлено: Використовуємо значення слайдера безпосередньо як візуальний розмір
        var size = parseInt(document.getElementById('faceSize').value);
        var shape = document.getElementById('maskShape').value;
        var radius = size / 2;

        for (var i = 0; i < this.faces.length; i++) {
            var f = this.faces[i];
            var inside = false;

            if (shape === 'circle' || shape === 'rounded') {
                var dist = Math.sqrt(Math.pow(x - f.x, 2) + Math.pow(y - f.y, 2));
                inside = dist < radius;
            } else {
                if (shape === 'rectangle') {
                    var w = size; var h = size * 0.5625; 
                    inside = (x >= f.x - w/2 && x <= f.x + w/2 && y >= f.y - h/2 && y <= f.y + h/2);
                } else {
                    inside = (Math.abs(x - f.x) < radius && Math.abs(y - f.y) < radius);
                }
            }
            if (inside) return i;
        }
        return -1;
    },

    addFace: function(x, y) {
        this.faces.push({ x: x, y: y });
        this.updateFacesList();
        this.updatePreview();
    },

    removeFace: function(index) {
        this.faces.splice(index, 1);
        this.updateFacesList();
        this.updatePreview();
    },

    updateFacesList: function() {
        var list = document.getElementById('facesList');
        if (this.faces.length === 0) {
            list.innerHTML = '<small>No masks</small>';
            return;
        }
        var html = '';
        for (var i = 0; i < this.faces.length; i++) {
            html += '<div style="display:flex; justify-content:space-between; padding:4px; background:var(--bg-secondary); margin-bottom:4px;">' +
                '<span>Mask ' + (i+1) + '</span>' +
                '<button onclick="hideFacesTool.removeFace(' + i + ')" style="background:#ef4444; color:white; border:none; border-radius:3px; cursor:pointer;">✕</button>' +
                '</div>';
        }
        list.innerHTML = html;
    },

    handleFiles: function(fileList) {
        var self = this;
        var rawFiles = Array.prototype.slice.call(fileList);
        this.files = [];
        var rejected = 0;

        for (var i = 0; i < rawFiles.length; i++) {
            var file = rawFiles[i];
            var check = SECURITY.isValidImage(file);
            if (check.valid) this.files.push(file);
            else rejected++;
        }

        if (rejected > 0) alert(rejected + ' file(s) skipped');
        
        if (this.files.length > 0) {
            document.getElementById('optionsPanel').style.display = 'block';
            var list = document.getElementById('fileList');
            var html = '<b>Files:</b><br>';
            for (var j = 0; j < this.files.length; j++) html += (j+1) + '. ' + this.files[j].name + '<br>';
            list.innerHTML = html;
            
            this.faces = [];
            this.loadPreview(this.files[0]);
        }
    },

    loadPreview: function(file) {
        var self = this;
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function() {
            self.previewImg = img;
            self.updatePreview();
            self.updateFacesList();
        };
    },

    drawRoundedRect: function(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },

    updatePreview: function() {
        var self = this;
        if (!self.previewImg) return;

        var canvas = document.getElementById('previewCanvas');
        var ctx = canvas.getContext('2d');
        
        var maxW = 800;
        var scale = Math.min(1, maxW / self.previewImg.width);
        canvas.width = self.previewImg.width * scale;
        canvas.height = self.previewImg.height * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(self.previewImg, 0, 0, canvas.width, canvas.height);

        // ✅ ВИПРАВЛЕНО: Використовуємо чисте значення слайдера для прев'ю
        var size = parseInt(document.getElementById('faceSize').value);
        var shape = document.getElementById('maskShape').value;
        var radius = size / 2;

        for (var i = 0; i < self.faces.length; i++) {
            var f = self.faces[i];
            
            ctx.save();
            ctx.beginPath();

            if (shape === 'circle') {
                ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
            } else if (shape === 'rounded') {
                self.drawRoundedRect(ctx, f.x - radius, f.y - radius, size, size, radius/3);
            } else if (shape === 'rectangle') {
                var w = size; var h = size * 0.5625; 
                ctx.rect(f.x - w/2, f.y - h/2, w, h);
            } else {
                ctx.rect(f.x - radius, f.y - radius, size, size);
            }
            ctx.closePath();
            ctx.clip();

            var preset = document.getElementById('blurPreset').value;
            if (preset === 'pixelate') {
                ctx.filter = 'blur(10px)'; 
            } else if (preset === 'heavy') {
                ctx.filter = 'blur(25px)';
            } else {
                ctx.filter = 'blur(15px)';
            }
            
            ctx.drawImage(self.previewImg, 0, 0, canvas.width, canvas.height);
            ctx.restore();

            // Border
            ctx.beginPath();
            if (shape === 'circle') ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
            else if (shape === 'rounded') self.drawRoundedRect(ctx, f.x - radius, f.y - radius, size, size, radius/3);
            else if (shape === 'rectangle') { var w = size; var h = size * 0.5625; ctx.rect(f.x - w/2, f.y - h/2, w, h); }
            else ctx.rect(f.x - radius, f.y - radius, size, size);
            
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    },

    process: function() {
        var self = this;
        if (self.files.length === 0) { alert('Select files first!'); return; }
        if (self.faces.length === 0) { alert('Add at least one mask!'); return; }

        var resultArea = document.getElementById('resultArea');
        var preset = document.getElementById('blurPreset').value;
        var shape = document.getElementById('maskShape').value;
        
        // ✅ ВИПРАВЛЕНО: Беремо чисте значення слайдера
        var size = parseInt(document.getElementById('faceSize').value);
        
        var previewCanvas = document.getElementById('previewCanvas');
        // Розраховуємо, у скільки разів оригінал більший за прев'ю
        var scaleFactor = self.previewImg.width / previewCanvas.width;

        if (typeof JSZip === 'undefined') {
            resultArea.innerHTML = '<div style="color:red">JSZip not loaded</div>'; return;
        }

        var zip = new JSZip();
        var count = 0;
        var total = self.files.length;
        var idx = 0;

        resultArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden;"><div id="progressBar" style="background:var(--primary); height:100%; width:0%;"></div></div><p id="progressText">Processing...</p></div>';

        function next() {
            if (idx >= total) { finish(); return; }
            
            document.getElementById('progressText').textContent = 'Processing ' + (idx + 1) + ' of ' + total;
            document.getElementById('progressBar').style.width = ((idx + 1) / total * 100) + '%';

            var file = self.files[idx];
            
            // Передаємо scaleFactor в функцію обробки
            self.applyMasks(file, preset, shape, size, scaleFactor)
                .then(function(blob) {
                    zip.file('hidden_' + file.name, blob);
                    count++; idx++; next();
                })
                .catch(function(err) { console.error(err); idx++; next(); });
        }

        function finish() {
            zip.generateAsync({type:'blob'}).then(function(content) {
                var url = URL.createObjectURL(content);
                var a = document.createElement('a');
                a.href = url; a.download = 'faces_hidden.zip';
                document.body.appendChild(a); a.click();
                document.body.removeChild(a);
                resultArea.innerHTML = '<div class="results-success"><h4>✅ Done!</h4><p>ZIP Downloaded</p></div>';
            });
        }
        next();
    },

    applyMasks: function(file, preset, shape, size, scaleFactor) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = function() {
                var c = document.createElement('canvas');
                var ctx = c.getContext('2d');
                c.width = img.width;
                c.height = img.height;
                
                ctx.drawImage(img, 0, 0);

                // ✅ ВИПРАВЛЕНО: Масштабуємо розмір маски до розміру оригіналу
                var scaledSize = size * scaleFactor;
                var scaledRadius = scaledSize / 2;

                self.faces.forEach(function(f) {
                    // Масштабуємо координати центру маски
                    var cx = f.x * scaleFactor;
                    var cy = f.y * scaleFactor;

                    // Створюємо тимчасовий canvas для вирізання
                    var tempC = document.createElement('canvas');
                    var tempCtx = tempC.getContext('2d');
                    
                    var cutW, cutH;
                    if (shape === 'rectangle') {
                        cutW = scaledSize;
                        cutH = scaledSize * 0.5625;
                    } else {
                        cutW = scaledSize;
                        cutH = scaledSize;
                    }

                    var startX = cx - cutW/2;
                    var startY = cy - cutH/2;

                    // Обмеження меж
                    if (startX < 0) { cutW += startX; startX = 0; }
                    if (startY < 0) { cutH += startY; startY = 0; }
                    if (startX + cutW > c.width) cutW = c.width - startX;
                    if (startY + cutH > c.height) cutH = c.height - startY;

                    tempC.width = cutW;
                    tempC.height = cutH;

                    // 1. Вирізаємо шматок
                    tempCtx.drawImage(c, startX, startY, cutW, cutH, 0, 0, cutW, cutH);

                    // 2. Обробляємо шматок
                    if (preset === 'pixelate') {
                        var blockSize = 10;
                        var w = tempC.width;
                        var h = tempC.height;
                        var scale = Math.max(0.1, blockSize / Math.max(w, h));
                        
                        tempCtx.drawImage(tempC, 0, 0, w * scale, h * scale);
                        tempCtx.imageSmoothingEnabled = false;
                        tempCtx.drawImage(tempC, 0, 0, w * scale, h * scale, 0, 0, w, h);
                    } else {
                        var amount = preset === 'heavy' ? 40 : 20;
                        tempCtx.filter = 'blur(' + amount + 'px)';
                        tempCtx.drawImage(tempC, 0, 0);
                        tempCtx.filter = 'none';
                    }

                    // 3. Вставляємо оброблений шматок назад з урахуванням форми (Clip)
                    ctx.save();
                    ctx.beginPath();
                    if (shape === 'circle') {
                        ctx.arc(cx, cy, scaledRadius, 0, Math.PI * 2);
                    } else if (shape === 'rounded') {
                        self.drawRoundedRect(ctx, cx - scaledRadius, cy - scaledRadius, scaledSize, scaledSize, scaledRadius/3);
                    } else if (shape === 'rectangle') {
                        var w = scaledSize; var h = scaledSize * 0.5625; 
                        ctx.rect(cx - w/2, cy - h/2, w, h);
                    } else {
                        ctx.rect(cx - scaledRadius, cy - scaledRadius, scaledSize, scaledSize);
                    }
                    ctx.closePath();
                    ctx.clip();
                    
                    ctx.drawImage(tempC, startX, startY);
                    ctx.restore();
                });

                c.toBlob(function(blob) { if(blob) resolve(blob); else reject('err'); }, 'image/jpeg', 0.9);
                URL.revokeObjectURL(img.src);
            };
            img.onerror = function() { reject('load fail'); };
        });
    }
};

// --- 🎥 IMAGE TO VIDEO (With Description) ---
var videoTool = {
    name: 'Image to Video',
    icon: '🎥',
    files: [],
    selectedFiles: [],
    settings: {
        aspectRatio: '16:9',
        resolution: '1080p',
        quality: 5000000,
        duration: 3000,
        transition: 'fade',
        outputFormat: 'mp4'
    },

    render: function() {
        return '<div class="tool-header">' +
            '<h2>🎥 Image to Video Pro</h2>' +
            '<p>Create professional videos from images</p>' +
            '</div>' +
            
            '<div class="upload-area" id="toolUpload">' +
            '<input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />' +
            '<div class="upload-content">' +
            '<span class="upload-icon">📤</span>' +
            '<h3>Drag & drop photos</h3>' +
            '<p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>' +
            '</div>' +
            '</div>' +
            '<div class="options-panel" id="optionsPanel" style="display:none;">' +

            // 1. Format & Resolution
            '<div class="grid-2" style="display:flex; gap:15px; margin-bottom:15px;">' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">📐 Format:</label>' +
            '<select id="aspectRatio" style="width:100%; padding:8px; margin-top:5px;">' +
            '<option value="16:9">📺 16:9 Landscape (YouTube)</option>' +
            '<option value="9:16">📱 9:16 Portrait (TikTok)</option>' +
            '<option value="1:1">⬜ 1:1 Square</option>' +
            '<option value="4:5">📷 4:5 Instagram</option>' +
            '</select>' +
            '</div>' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">📺 Resolution:</label>' +
            '<select id="resolution" style="width:100%; padding:8px; margin-top:5px;">' +
            '<option value="360p">360p (SD)</option>' +
            '<option value="480p">480p (SD)</option>' +
            '<option value="720p">720p (HD)</option>' +
            '<option value="1080p" selected>1080p (Full HD)</option>' +
            '<option value="1440p">1440p (2K QHD)</option>' +
            '<option value="2160p">2160p (4K UHD)</option>' +
            '</select>' +
            '</div>' +
            '</div>' +

            // 2. Output Format & Quality
            '<div class="grid-2" style="display:flex; gap:15px; margin-bottom:15px;">' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">💾 Container:</label>' +
            '<select id="outputFormat" style="width:100%; padding:8px; margin-top:5px;">' +
            '<option value="mp4">MP4 (H.264)</option>' +
            '<option value="webm">WebM (VP9)</option>' +
            '</select>' +
            '</div>' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">🎬 Quality: <span id="qualityVal">5 Mbps</span></label>' +
            '<input type="range" id="videoQuality" min="1000000" max="50000000" step="1000000" value="5000000" style="width:100%; margin-top:5px;" />' +
            '</div>' +
            '</div>' +

            // 3. Duration & Transition
            '<div class="grid-2" style="display:flex; gap:15px; margin-bottom:15px;">' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">⏱️ Duration: <span id="durVal">3.0s</span></label>' +
            '<input type="range" id="duration" min="1" max="10" step="0.5" value="3" style="width:100%;" />' +
            '</div>' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">✨ Transition:</label>' +
            '<select id="transition" style="width:100%; padding:8px; margin-top:5px;">' +
            '<option value="fade">Fade</option>' +
            '<option value="zoom">Zoom</option>' +
            '<option value="none">None</option>' +
            '</select>' +
            '</div>' +
            '</div>' +

            // 4. File List
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
            '<label style="font-weight:600;">📋 Images (<span id="imageCount">0</span>):</label>' +
            '<button id="selectAllBtn" style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.85em;">Select All</button>' +
            '</div>' +
            '<div id="fileList" style="max-height:200px; overflow-y:auto; background:var(--bg-secondary); border-radius:6px; padding:5px;"></div>' +
            '</div>' +
            
            '<button class="btn-primary btn-large" id="processBtn" style="width:100%;">🎥 Render Video</button>' +
            '</div>' +
            '<div id="resultArea"></div>';
    },

    init: function() {
        var self = this;
        var upload = document.getElementById('toolUpload');
        var input = document.getElementById('fileInput');
        var btn = document.getElementById('processBtn');

        if (!upload || !input) {
            console.error('videoTool: Elements not found');
            return;
        }

        // Upload handlers
        upload.onclick = function() { input.click(); };
        input.onchange = function(e) { self.handleFiles(e.target.files); };
        upload.ondragover = function(e) { e.preventDefault(); upload.classList.add('dragover'); };
        upload.ondragleave = function() { upload.classList.remove('dragover'); };
        upload.ondrop = function(e) { e.preventDefault(); upload.classList.remove('dragover'); self.handleFiles(e.dataTransfer.files); };

        // Bind settings
        var aspectRatioSelect = document.getElementById('aspectRatio');
        var resolutionSelect = document.getElementById('resolution');
        var outputFormatSelect = document.getElementById('outputFormat');
        var qualitySlider = document.getElementById('videoQuality');
        var durationSlider = document.getElementById('duration');
        var transitionSelect = document.getElementById('transition');

        if (aspectRatioSelect) aspectRatioSelect.onchange = function(e) { self.settings.aspectRatio = e.target.value; };
        if (resolutionSelect) resolutionSelect.onchange = function(e) { self.settings.resolution = e.target.value; };
        if (outputFormatSelect) outputFormatSelect.onchange = function(e) { self.settings.outputFormat = e.target.value; };
        
        if (qualitySlider) {
            qualitySlider.oninput = function(e) {
                var mbps = (parseInt(e.target.value) / 1000000).toFixed(1);
                document.getElementById('qualityVal').textContent = mbps + ' Mbps';
                self.settings.quality = parseInt(e.target.value);
            };
        }
        
        if (durationSlider) {
            durationSlider.oninput = function(e) {
                document.getElementById('durVal').textContent = parseFloat(e.target.value).toFixed(1) + 's';
                self.settings.duration = parseFloat(e.target.value) * 1000;
            };
        }
        if (transitionSelect) transitionSelect.onchange = function(e) { self.settings.transition = e.target.value; };

        // Select All button
        var selectAllBtn = document.getElementById('selectAllBtn');
        if (selectAllBtn) {
            selectAllBtn.onclick = function() {
                var checkboxes = document.querySelectorAll('.file-checkbox');
                var allChecked = Array.from(checkboxes).every(function(cb) { return cb.checked; });
                checkboxes.forEach(function(cb) { cb.checked = !allChecked; });
                self.updateSelectedFiles();
            };
        }

        // Process button
        if (btn) {
            btn.onclick = function() { 
                console.log('Render clicked');
                self.process(); 
            };
        }
    },

    handleFiles: function(fileList) {
        var self = this;
        var newFiles = Array.prototype.slice.call(fileList);
        var rejected = 0;

        newFiles.forEach(function(f) {
            if (typeof SECURITY !== 'undefined' && !SECURITY.isValidImage(f).valid) {
                rejected++;
            } else {
                self.files.push(f);
            }
        });

        if (rejected > 0) alert(rejected + ' file(s) skipped');
        
        if (this.files.length > 0) {
            document.getElementById('optionsPanel').style.display = 'block';
            this.renderFileList();
        }
    },

    renderFileList: function() {
        var self = this;
        var list = document.getElementById('fileList');
        var countLabel = document.getElementById('imageCount');
        
        if (!list) return;
        if (countLabel) countLabel.textContent = this.files.length;
        
        list.innerHTML = '';
        
        this.files.forEach(function(f, index) {
            var div = document.createElement('div');
            div.className = 'sortable-item';
            div.setAttribute('draggable', 'true');
            div.setAttribute('data-index', index);
            div.style.cssText = 'padding:6px; margin-bottom:4px; background:var(--bg-primary); border-radius:4px; display:flex; align-items:center; gap:8px; border:1px solid transparent; cursor:grab;';
            
            // Checkbox
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'file-checkbox';
            checkbox.checked = true;
            checkbox.onchange = function() { self.updateSelectedFiles(); };
            
            // Thumbnail
            var thumb = document.createElement('img');
            thumb.src = URL.createObjectURL(f);
            thumb.style.cssText = 'width:40px; height:40px; object-fit:cover; border-radius:4px; background:#000;';
            
            // Filename
            var name = document.createElement('span');
            name.textContent = f.name;
            name.style.cssText = 'flex:1; font-size:0.85em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
            
            // Delete Button
            var delBtn = document.createElement('button');
            delBtn.innerHTML = '✕';
            delBtn.style.cssText = 'background:#ef4444; color:white; border:none; border-radius:4px; width:24px; height:24px; cursor:pointer; font-size:0.8em;';
            delBtn.onclick = function() {
                self.files.splice(index, 1);
                self.renderFileList();
            };
            
            // Drag events
            div.ondragstart = function(e) {
                e.dataTransfer.setData('text/plain', index);
                div.style.opacity = '0.5';
            };
            div.ondragend = function() { div.style.opacity = '1'; div.style.borderColor = 'transparent'; };
            div.ondragover = function(e) { e.preventDefault(); div.style.borderColor = 'var(--primary)'; };
            div.ondragleave = function() { div.style.borderColor = 'transparent'; };
            div.ondrop = function(e) {
                e.preventDefault();
                var oldIndex = parseInt(e.dataTransfer.getData('text/plain'));
                var newIndex = parseInt(div.getAttribute('data-index'));
                var item = self.files.splice(oldIndex, 1)[0];
                self.files.splice(newIndex, 0, item);
                self.renderFileList();
            };
            
            div.appendChild(checkbox);
            div.appendChild(thumb);
            div.appendChild(name);
            div.appendChild(delBtn);
            list.appendChild(div);
        });
        
        this.updateSelectedFiles();
    },

    updateSelectedFiles: function() {
        var self = this;
        var checkboxes = document.querySelectorAll('.file-checkbox');
        this.selectedFiles = [];
        checkboxes.forEach(function(cb, i) {
            if (cb.checked && self.files[i]) {
                self.selectedFiles.push(self.files[i]);
            }
        });
    },

    process: function() {
        var self = this;
        var filesToProcess = self.selectedFiles.length > 0 ? self.selectedFiles : self.files;
        
        console.log('Starting process with', filesToProcess.length, 'files');
        
        if (filesToProcess.length < 1) { 
            alert('Select at least one image!'); 
            return; 
        }

        var btn = document.getElementById('processBtn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = '⏳ Rendering...';
        }
        
        var resultArea = document.getElementById('resultArea');
        if (resultArea) {
            resultArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden; border:1px solid var(--border-color);"><div id="progressBar" style="background:var(--primary); height:100%; width:0%; transition:width 0.3s;"></div></div><p id="progressText" style="text-align:center; margin-top:8px;">Preparing...</p></div>';
        }

        // Calculate Resolution based on settings
        var resMap = {
            '360p': 360,
            '480p': 480,
            '720p': 720,
            '1080p': 1080,
            '1440p': 1440,
            '2160p': 2160
        };
        
        var baseHeight = resMap[self.settings.resolution] || 1080;
        var ratio = self.settings.aspectRatio.split(':');
        var rW = parseInt(ratio[0]);
        var rH = parseInt(ratio[1]);
        
        var w, h;
        if (rW >= rH) {
            // Landscape or Square
            h = baseHeight;
            w = Math.round(baseHeight * (rW / rH));
        } else {
            // Portrait
            w = baseHeight;
            h = Math.round(baseHeight * (rH / rW));
        }

        console.log('Resolution:', w, 'x', h);

        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');

        // Determine codec
        var mime = 'video/webm;codecs=vp9';
        if (self.settings.outputFormat === 'mp4') {
            if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
                mime = 'video/mp4;codecs=h264';
            } else if (MediaRecorder.isTypeSupported('video/mp4')) {
                mime = 'video/mp4';
            }
        }
        
        if (!MediaRecorder.isTypeSupported(mime)) {
            mime = 'video/webm';
        }

        console.log('Using codec:', mime);

        var stream = canvas.captureStream(30);
        var recorder = new MediaRecorder(stream, { 
            mimeType: mime, 
            videoBitsPerSecond: self.settings.quality 
        });
        
        var chunks = [];
        recorder.ondataavailable = function(e) { 
            if (e.data.size > 0) {
                chunks.push(e.data); 
            }
        };
        
        recorder.onstop = function() {
            console.log('Recording stopped');
            var ext = mime.includes('mp4') ? 'mp4' : 'webm';
            var blob = new Blob(chunks, { type: mime });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'pixelcraft_' + Date.now() + '.' + ext;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            if (resultArea) {
                resultArea.innerHTML += '<div class="results-success"><h4>✅ Video Ready!</h4><p>Format: ' + ext.toUpperCase() + ' | Size: ' + (blob.size/1024/1024).toFixed(1) + ' MB</p></div>';
            }
            if (btn) {
                btn.disabled = false;
                btn.textContent = '🎥 Render Video';
            }
        };

        recorder.start();
        console.log('Recorder started');
        
        // Preload images
        var loadedImages = [];
        var loadPromises = filesToProcess.map(function(f, i) {
            return new Promise(function(resolve) {
                var img = new Image();
                img.onload = function() { 
                    loadedImages[i] = img; 
                    resolve(); 
                };
                img.onerror = function() {
                    console.error('Failed to load image', f.name);
                    resolve();
                };
                img.src = URL.createObjectURL(f);
            });
        });

        Promise.all(loadPromises).then(function() {
            console.log('All images loaded:', loadedImages.length);
            self.renderLoop(ctx, canvas, loadedImages, w, h, function(progress) {
                var progressBar = document.getElementById('progressBar');
                var progressText = document.getElementById('progressText');
                if (progressBar) progressBar.style.width = progress + '%';
                if (progressText) progressText.textContent = 'Rendering: ' + Math.round(progress) + '%';
            }, function() {
                console.log('Animation complete, stopping recorder');
                recorder.stop();
            });
        }).catch(function(err) {
            console.error('Error loading images:', err);
            if (resultArea) {
                resultArea.innerHTML = '<div style="color:red;">❌ Error: ' + err.message + '</div>';
            }
            if (btn) {
                btn.disabled = false;
                btn.textContent = '🎥 Render Video';
            }
        });
    },

    renderLoop: function(ctx, canvas, images, w, h, progressCallback, stopCallback) {
        var self = this;
        var slideTime = self.settings.duration;
        var transTime = 500;
        var totalImages = images.length;
        var startTime = performance.now();
        var totalDuration = (totalImages * slideTime) + transTime;

        console.log('Starting render loop with', totalImages, 'images');

        function drawImageCover(c, img, cw, ch, scale, alpha) {
            if (alpha <= 0 || !img) return;
            c.save();
            c.globalAlpha = alpha;
            
            var imgRatio = img.width / img.height;
            var canvasRatio = cw / ch;
            var drawW, drawH;
            
            if (imgRatio > canvasRatio) {
                drawH = ch;
                drawW = ch * imgRatio;
            } else {
                drawW = cw;
                drawH = cw / imgRatio;
            }
            
            drawW *= scale;
            drawH *= scale;
            
            var x = (cw - drawW) / 2;
            var y = (ch - drawH) / 2;
            
            c.drawImage(img, x, y, drawW, drawH);
            c.restore();
        }

        function animate(timestamp) {
            var elapsed = timestamp - startTime;
            var progress = Math.min(100, (elapsed / totalDuration) * 100);
            progressCallback(progress);
            
            var currentIdx = Math.floor(elapsed / slideTime);
            
            if (currentIdx >= totalImages) {
                console.log('All slides complete');
                stopCallback();
                return;
            }

            var imgCurrent = images[currentIdx];
            var imgNext = images[currentIdx + 1];
            var timeInSlide = elapsed % slideTime;
            var timeToNext = slideTime - timeInSlide;

            // Clear with black
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, w, h);

            var alphaCurrent = 1;
            var alphaNext = 0;
            var scaleCurrent = 1;
            var scaleNext = 1;

            var isTransitioning = (timeToNext < transTime) && imgNext;

            if (isTransitioning) {
                var tProgress = 1 - (timeToNext / transTime);
                alphaCurrent = 1 - tProgress;
                alphaNext = tProgress;
                
                if (self.settings.transition === 'zoom') {
                    scaleCurrent = 1 + (tProgress * 0.1);
                    scaleNext = 1 + (tProgress * 0.1);
                }
            } else {
                if (self.settings.transition === 'zoom') {
                    scaleCurrent = 1 + ((timeInSlide / slideTime) * 0.05);
                }
            }

            drawImageCover(ctx, imgCurrent, w, h, scaleCurrent, alphaCurrent);
            
            if (isTransitioning) {
                drawImageCover(ctx, imgNext, w, h, scaleNext, alphaNext);
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }
};

// --- 🔲 BLUR / PIXELATE TOOL (Full Fixed Version) ---
var blurTool = {
    name: 'Blur / Pixelate',
    icon: '🔲',
    files: [],
    selectedFiles: [],
    masks: [],
    currentTool: 'blur',
    currentShape: 'circle',
    
    // State for drawing & dragging
    isCreating: false,
    isDragging: false,
    dragIndex: -1,
    dragOffsetX: 0,
    dragOffsetY: 0,
    startX: 0,
    startY: 0,
    currentMask: null,
    previewImg: null,

    render: function() {
        return '<div class="tool-header">' +
            '<h2>🔲 Blur / Pixelate Tool</h2>' +
            '<p>Blur faces, license plates, or sensitive areas</p>' +
            '</div>' +
            
            '<div class="upload-area" id="toolUpload">' +
            '<input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />' +
            '<div class="upload-content">' +
            '<span class="upload-icon">📤</span>' +
            '<h3>Drag & drop photos</h3>' +
            '<p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>' +
            '</div>' +
            '</div>' +
            
            '<div class="options-panel" id="optionsPanel" style="display:none;">' +
            
            '<div class="grid-2" style="display:flex; gap:15px; margin-bottom:15px;">' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">🎨 Effect:</label>' +
            '<div style="display:flex; gap:8px; margin-top:5px;">' +
            '<button id="btnBlur" style="flex:1; padding:8px; background:var(--primary); color:white; border:none; border-radius:6px; cursor:pointer;">🌫️ Blur</button>' +
            '<button id="btnPixelate" style="flex:1; padding:8px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">🔲 Pixelate</button>' +
            '</div>' +
            '</div>' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">📐 Shape:</label>' +
            '<div style="display:flex; gap:8px; margin-top:5px;">' +
            '<button id="shapeCircle" style="flex:1; padding:8px; background:var(--primary); color:white; border:none; border-radius:6px; cursor:pointer;">⭕</button>' +
            '<button id="shapeSquare" style="flex:1; padding:8px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">⬜</button>' +
            '<button id="shapeRect" style="flex:1; padding:8px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">▭</button>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">📊 Intensity: <span id="intensityVal">30</span></label>' +
            '<input type="range" id="intensity" min="5" max="200" value="30" style="width:100%; margin-top:5px;" />' +
            '</div>' +

            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">👁️ Preview (Click to Draw / Drag Mask to Move):</label>' +
            '<div id="canvasContainer" style="margin-top:10px; background:#111; border-radius:8px; overflow:hidden; position:relative; text-align:center;">' +
            '<canvas id="previewCanvas" style="display:block; max-width:100%; height:auto; user-select:none;"></canvas>' +
            '<div id="canvasPlaceholder" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#888;">' +
            '<p style="font-size:1.2em;">📷 Upload an image to start</p>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="option-group" style="margin-bottom:15px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
            '<label style="font-weight:600;">📋 Active Masks (<span id="maskCount">0</span>):</label>' +
            '<button id="clearMasks" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.85em;">Clear All</button>' +
            '</div>' +
            '<div id="masksList" style="max-height:100px; overflow-y:auto; background:var(--bg-secondary); border-radius:6px; padding:5px;"></div>' +
            '</div>' +

            '<div class="option-group" style="margin-bottom:15px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
            '<label style="font-weight:600;">📋 Files (<span id="fileCount">0</span>):</label>' +
            '<button id="selectAllFiles" style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.85em;">Select All</button>' +
            '</div>' +
            '<div id="fileList" style="max-height:100px; overflow-y:auto; background:var(--bg-secondary); border-radius:6px; padding:5px;"></div>' +
            '</div>' +
            
            '<button class="btn-primary btn-large" id="processBtn" style="width:100%;">🔲 Apply & Download ZIP</button>' +
            '</div>' +
            '<div id="resultArea"></div>';
    },

    init: function() {
        var self = this;
        var upload = document.getElementById('toolUpload');
        var input = document.getElementById('fileInput');
        var btn = document.getElementById('processBtn');
        var canvas = document.getElementById('previewCanvas');

        if (!upload || !input || !canvas) { console.error('blurTool: init failed'); return; }

        // Upload
        upload.onclick = function() { input.click(); };
        input.onchange = function(e) { self.handleFiles(e.target.files); };
        upload.ondragover = function(e) { e.preventDefault(); upload.classList.add('dragover'); };
        upload.ondragleave = function() { upload.classList.remove('dragover'); };
        upload.ondrop = function(e) { e.preventDefault(); upload.classList.remove('dragover'); self.handleFiles(e.dataTransfer.files); };

        // Effect Buttons
        document.getElementById('btnBlur').onclick = function() {
            self.currentTool = 'blur';
            this.style.background = 'var(--primary)'; this.style.color = 'white';
            document.getElementById('btnPixelate').style.background = 'var(--bg-secondary)'; document.getElementById('btnPixelate').style.color = 'var(--text-primary)';
        };
        document.getElementById('btnPixelate').onclick = function() {
            self.currentTool = 'pixelate';
            this.style.background = 'var(--primary)'; this.style.color = 'white';
            document.getElementById('btnBlur').style.background = 'var(--bg-secondary)'; document.getElementById('btnBlur').style.color = 'var(--text-primary)';
        };

        // Shape Buttons
        var shapeBtns = ['shapeCircle', 'shapeSquare', 'shapeRect'];
        var shapeVals = ['circle', 'square', 'rectangle'];
        shapeBtns.forEach(function(id, i) {
            document.getElementById(id).onclick = function() {
                self.currentShape = shapeVals[i];
                shapeBtns.forEach(function(b) {
                    var el = document.getElementById(b);
                    el.style.background = 'var(--bg-secondary)'; el.style.color = 'var(--text-primary)';
                });
                this.style.background = 'var(--primary)'; this.style.color = 'white';
            };
        });

        // Intensity
        document.getElementById('intensity').oninput = function(e) {
            document.getElementById('intensityVal').textContent = e.target.value;
            self.updatePreview();
        };

        // Clear Masks
        document.getElementById('clearMasks').onclick = function() {
            self.masks = [];
            self.updatePreview();
            self.updateMasksList();
        };

        // Canvas interactions
        canvas.onmousedown = function(e) { self.onMouseDown(e); };
        window.onmousemove = function(e) { self.onMouseMove(e); };
        window.onmouseup = function(e) { self.onMouseUp(e); };
        canvas.ondragstart = function(e) { e.preventDefault(); }; // Prevent image drag

        // Process
        if (btn) btn.onclick = function() { self.process(); };
    },

    getCanvasCoords: function(e) {
        var canvas = document.getElementById('previewCanvas');
        var rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width),
            y: (e.clientY - rect.top) * (canvas.height / rect.height)
        };
    },

    getMaskAt: function(x, y) {
        for (var i = this.masks.length - 1; i >= 0; i--) {
            var m = this.masks[i];
            if (m.shape === 'circle') {
                var cx = m.x + m.w/2, cy = m.y + m.h/2;
                var r = Math.hypot(m.w, m.h) / 2;
                if (Math.hypot(x - cx, y - cy) <= r) return i;
            } else if (m.shape === 'square') {
                var s = Math.min(m.w, m.h);
                var sx = m.x + (m.w - s)/2, sy = m.y + (m.h - s)/2;
                if (x >= sx && x <= sx+s && y >= sy && y <= sy+s) return i;
            } else {
                if (x >= m.x && x <= m.x + m.w && y >= m.y && y <= m.y + m.h) return i;
            }
        }
        return -1;
    },

    onMouseDown: function(e) {
        e.preventDefault();
        var coords = this.getCanvasCoords(e);
        var canvas = document.getElementById('previewCanvas');
        var idx = this.getMaskAt(coords.x, coords.y);

        if (idx !== -1) {
            // Drag existing mask
            this.isDragging = true;
            this.dragIndex = idx;
            this.dragOffsetX = coords.x - this.masks[idx].x;
            this.dragOffsetY = coords.y - this.masks[idx].y;
            canvas.style.cursor = 'grabbing';
        } else {
            // Create new mask
            this.isCreating = true;
            this.startX = coords.x;
            this.startY = coords.y;
            this.currentMask = {
                x: this.startX, y: this.startY, w: 0, h: 0,
                shape: this.currentShape,
                effect: this.currentTool,
                intensity: parseInt(document.getElementById('intensity').value)
            };
            canvas.style.cursor = 'crosshair';
        }
    },

    onMouseMove: function(e) {
        var canvas = document.getElementById('previewCanvas');
        if (!canvas) return;
        var coords = this.getCanvasCoords(e);

        if (this.isDragging) {
            var m = this.masks[this.dragIndex];
            m.x = coords.x - this.dragOffsetX;
            m.y = coords.y - this.dragOffsetY;
            this.updatePreview();
        } else if (this.isCreating) {
            this.currentMask.w = coords.x - this.startX;
            this.currentMask.h = coords.y - this.startY;
            this.updatePreview();
        } else {
            var hoverIdx = this.getMaskAt(coords.x, coords.y);
            canvas.style.cursor = hoverIdx !== -1 ? 'move' : 'crosshair';
        }
    },

    onMouseUp: function(e) {
        var canvas = document.getElementById('previewCanvas');
        if (canvas) canvas.style.cursor = 'crosshair';

        if (this.isDragging) {
            this.isDragging = false;
            this.dragIndex = -1;
        } else if (this.isCreating && this.currentMask) {
            var m = this.currentMask;
            if (m.w < 0) { m.x = this.startX + m.w; m.w = Math.abs(m.w); }
            if (m.h < 0) { m.y = this.startY + m.h; m.h = Math.abs(m.h); }
            
            if (m.w > 5 && m.h > 5) {
                this.masks.push(m);
                this.updateMasksList();
            }
            this.isCreating = false;
            this.currentMask = null;
            this.updatePreview();
        }
    },

    handleFiles: function(fileList) {
        var self = this;
        var newFiles = Array.prototype.slice.call(fileList);
        var rejected = 0;
        newFiles.forEach(function(f) {
            if (typeof SECURITY !== 'undefined' && !SECURITY.isValidImage(f).valid) rejected++;
            else self.files.push(f);
        });
        if (rejected > 0) alert(rejected + ' file(s) skipped');
        
        if (this.files.length > 0) {
            document.getElementById('optionsPanel').style.display = 'block';
            document.getElementById('canvasPlaceholder').style.display = 'none';
            this.renderFileList();
            this.loadPreview(this.files[0]);
        }
    },

    loadPreview: function(file) {
        var self = this;
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function() {
            self.previewImg = img;
            var maxW = 800;
            var scale = Math.min(1, maxW / img.width);
            var canvas = document.getElementById('previewCanvas');
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            self.updatePreview();
        };
    },

    updatePreview: function() {
        var self = this;
        var canvas = document.getElementById('previewCanvas');
        var ctx = canvas.getContext('2d');
        if (!self.previewImg || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(self.previewImg, 0, 0, canvas.width, canvas.height);

        // Apply masks in order
        this.masks.forEach(function(m) { self.applyEffectPreview(ctx, m); });

        // Apply mask being drawn
        if (self.isCreating && self.currentMask) {
            var temp = JSON.parse(JSON.stringify(self.currentMask));
            if (temp.w < 0) { temp.x = self.startX + temp.w; temp.w = Math.abs(temp.w); }
            if (temp.h < 0) { temp.y = self.startY + temp.h; temp.h = Math.abs(temp.h); }
            self.applyEffectPreview(ctx, temp);
        }
    },

    applyEffectPreview: function(ctx, mask) {
        var x = mask.x, y = mask.y, w = mask.w, h = mask.h;
        if (w <= 0 || h <= 0) return;

        ctx.save();
        ctx.beginPath();
        if (mask.shape === 'circle') {
            var r = Math.hypot(w, h)/2;
            ctx.arc(x + w/2, y + h/2, r, 0, Math.PI*2);
        } else if (mask.shape === 'square') {
            var s = Math.min(w, h);
            ctx.rect(x + (w-s)/2, y + (h-s)/2, s, s);
        } else {
            ctx.rect(x, y, w, h);
        }
        ctx.closePath();
        ctx.clip();

        if (mask.effect === 'blur') {
            ctx.filter = 'blur(' + (mask.intensity / 3) + 'px)';
            ctx.drawImage(ctx.canvas, x, y, w, h, x, y, w, h);
            ctx.filter = 'none';
        } else {
            var pSize = Math.max(2, mask.intensity / 5);
            for (var py = 0; py < h; py += pSize) {
                for (var px = 0; px < w; px += pSize) {
                    var sw = Math.min(pSize, w - px);
                    var sh = Math.min(pSize, h - py);
                    var imgData = ctx.getImageData(x + px, y + py, sw, sh);
                    var d = imgData.data, r=0, g=0, b=0, c=0;
                    for (var i=0; i<d.length; i+=4) { r+=d[i]; g+=d[i+1]; b+=d[i+2]; c++; }
                    if(c > 0) {
                        r=Math.round(r/c); g=Math.round(g/c); b=Math.round(b/c);
                        for (var i=0; i<d.length; i+=4) { d[i]=r; d[i+1]=g; d[i+2]=b; }
                    }
                    ctx.putImageData(imgData, x + px, y + py);
                }
            }
        }

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    },

    updateMasksList: function() {
        var list = document.getElementById('masksList');
        var count = document.getElementById('maskCount');
        if (!list) return;
        if (count) count.textContent = this.masks.length;
        
        if (this.masks.length === 0) {
            list.innerHTML = '<small style="color:var(--text-secondary)">No masks</small>';
            return;
        }
        
        var self = this;
        list.innerHTML = this.masks.map(function(m, i) {
            var shapeName = m.shape === 'circle' ? '⭕' : m.shape === 'square' ? '⬜' : '▭';
            var effName = m.effect === 'blur' ? '🌫️' : '🔲';
            return '<div style="padding:6px; margin-bottom:4px; background:var(--bg-primary); border-radius:4px; display:flex; justify-content:space-between; align-items:center;">' +
                '<span>' + shapeName + ' ' + effName + ' (' + m.intensity + ')</span>' +
                '<button onclick="blurTool.removeMask(' + i + ')" style="background:#ef4444; color:white; border:none; border-radius:4px; width:24px; height:24px; cursor:pointer;">✕</button>' +
                '</div>';
        }).join('');
    },

    removeMask: function(index) {
        this.masks.splice(index, 1);
        this.updateMasksList();
        this.updatePreview();
    },

    renderFileList: function() {
        var self = this;
        var list = document.getElementById('fileList');
        var count = document.getElementById('fileCount');
        if (!list) return;
        if (count) count.textContent = this.files.length;
        
        list.innerHTML = this.files.map(function(f, i) {
            return '<div style="padding:6px; margin-bottom:4px; background:var(--bg-primary); border-radius:4px; display:flex; align-items:center; gap:8px;">' +
                '<input type="checkbox" checked class="file-cb" onchange="blurTool.updateSelectedFiles()">' +
                '<span style="flex:1; font-size:0.85em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + f.name + '</span></div>';
        }).join('');
        this.updateSelectedFiles();
    },

    updateSelectedFiles: function() {
        var cbs = document.querySelectorAll('.file-cb');
        this.selectedFiles = [];
        var self = this;
        cbs.forEach(function(cb, i) { if(cb.checked && self.files[i]) self.selectedFiles.push(self.files[i]); });
    },

    process: function() {
        var self = this;
        var files = this.selectedFiles.length > 0 ? this.selectedFiles : this.files;
        if (files.length === 0) { alert('Please upload files first!'); return; }
        if (this.masks.length === 0) { alert('Please add at least one mask!'); return; }

        var btn = document.getElementById('processBtn');
        if(btn) { btn.disabled = true; btn.textContent = '⏳ Processing...'; }
        var resArea = document.getElementById('resultArea');
        if(resArea) resArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden;"><div id="pBar" style="background:var(--primary); height:100%; width:0%;"></div></div><p id="pText" style="text-align:center; margin-top:8px;">Processing...</p></div>';

        if (typeof JSZip === 'undefined') { if(resArea) resArea.innerHTML = '<div style="color:red">JSZip not loaded</div>'; return; }

        var zip = new JSZip();
        var idx = 0, total = files.length;

        function next() {
            if (idx >= total) { finish(); return; }
            if(document.getElementById('pBar')) document.getElementById('pBar').style.width = ((idx+1)/total*100)+'%';
            if(document.getElementById('pText')) document.getElementById('pText').textContent = 'Processing '+(idx+1)+' of '+total+'...';
            
            self.applyMasksToFile(files[idx]).then(function(blob) {
                zip.file('blurred_' + files[idx].name, blob);
                idx++; next();
            }).catch(function(err) { 
                console.error('Error:', err);
                idx++; next(); 
            });
        }

        function finish() {
            zip.generateAsync({type:'blob'}).then(function(content) {
                var url = URL.createObjectURL(content);
                var a = document.createElement('a'); a.href = url; a.download = 'blurred_images.zip';
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                if(resArea) resArea.innerHTML = '<div class="results-success"><h4>✅ Complete!</h4><p>📥 ZIP downloaded</p></div>';
                if(btn) { btn.disabled = false; btn.textContent = '🔲 Apply & Download ZIP'; }
            });
        }
        next();
    },

    // ✅ ВИПРАВЛЕНО: Точне масштабування та накладання масок
    applyMasksToFile: function(file) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = function() {
                var c = document.createElement('canvas');
                c.width = img.width;
                c.height = img.height;
                var ctx = c.getContext('2d');
                
                // 1. Малюємо оригінал
                ctx.drawImage(img, 0, 0);
                
                // 2. Точний розрахунок масштабу (Використовуємо розмір CANVAS, а не картинки)
                var previewCanvas = document.getElementById('previewCanvas');
                if (!previewCanvas) { reject('No preview canvas'); return; }

                // Відношення розміру оригіналу до розміру прев'ю
                var scaleX = img.width / previewCanvas.width;
                var scaleY = img.height / previewCanvas.height;
                
                // 3. Застосовуємо кожну маску ПО ЧЕРЗІ (щоб накладатися одна на одну)
                self.masks.forEach(function(m) {
                    var scaledMask = {
                        x: Math.floor(m.x * scaleX),
                        y: Math.floor(m.y * scaleY),
                        w: Math.max(1, Math.floor(m.w * scaleX)),
                        h: Math.max(1, Math.floor(m.h * scaleY)),
                        shape: m.shape,
                        effect: m.effect,
                        // ЗБІЛЬШЕНА ІНТЕНСИВНІСТЬ (масштабується разом з картинкою)
                        intensity: Math.max(10, Math.floor(m.intensity * scaleX * 2))
                    };
                    
                    // Застосовуємо маску до canvas
                    self.applyMaskToImage(ctx, scaledMask);
                });
                
                c.toBlob(function(blob) {
                    if (blob) resolve(blob);
                    else reject('Failed to create blob');
                }, 'image/png');
                
                URL.revokeObjectURL(img.src);
            };
            img.onerror = function() { reject('Failed to load image'); };
        });
    },

    applyMaskToImage: function(ctx, mask) {
        var x = Math.floor(mask.x);
        var y = Math.floor(mask.y);
        var w = Math.max(1, Math.floor(mask.w));
        var h = Math.max(1, Math.floor(mask.h));
        
        if (w <= 0 || h <= 0) return;

        ctx.save();
        ctx.beginPath();
        
        // Створюємо clipping path
        if (mask.shape === 'circle') {
            var r = Math.hypot(w, h)/2;
            ctx.arc(x + w/2, y + h/2, r, 0, Math.PI*2);
        } else if (mask.shape === 'square') {
            var s = Math.min(w, h);
            ctx.rect(x + (w-s)/2, y + (h-s)/2, s, s);
        } else {
            ctx.rect(x, y, w, h);
        }
        ctx.closePath();
        ctx.clip();

        if (mask.effect === 'blur') {
            // ✅ ПРАВИЛЬНИЙ BLUR через фільтр canvas (швидко і надійно)
            ctx.filter = 'blur(' + mask.intensity + 'px)';
            // Малюємо весь canvas сам на себе всередині clip
            ctx.drawImage(ctx.canvas, 0, 0);
            ctx.filter = 'none';
        } else {
            // Pixelate
            var pSize = Math.max(2, Math.floor(mask.intensity / 5));
            
            for (var py = 0; py < h; py += pSize) {
                for (var px = 0; px < w; px += pSize) {
                    var sw = Math.min(pSize, w - px);
                    var sh = Math.min(pSize, h - py);
                    var imgData = ctx.getImageData(x + px, y + py, sw, sh);
                    var d = imgData.data;
                    var r=0, g=0, b=0, count=0;
                    
                    for (var i=0; i<d.length; i+=4) {
                        r += d[i];
                        g += d[i+1];
                        b += d[i+2];
                        count++;
                    }
                    
                    if (count > 0) {
                        r = Math.round(r/count);
                        g = Math.round(g/count);
                        b = Math.round(b/count);
                        
                        for (var i=0; i<d.length; i+=4) {
                            d[i] = r;
                            d[i+1] = g;
                            d[i+2] = b;
                        }
                    }
                    
                    ctx.putImageData(imgData, x + px, y + py);
                }
            }
        }

        ctx.restore();
    }
};

// --- ✂️ SMART CROP TOOL (Fixed + Live Dimensions) ---
var cropTool = {
    name: 'Smart Crop',
    icon: '✂️',
    files: [],
    selectedFiles: [],
    image: null,
    
    // Crop State
    crop: {
        x: 0, y: 0, w: 0, h: 0,
        active: false,
        isDragging: false,
        isResizing: false,
        handle: null // tl, tr, bl, br
    },
    
    settings: {
        ratio: 'free', // free, 1:1, 16:9, etc.
        ratioValue: 0
    },

    render: function() {
        return '<div class="tool-header">' +
            '<h2>✂️ Smart Crop</h2>' +
            '<p>Manually select area with aspect ratios</p>' +
            '</div>' +
            
            '<div class="upload-area" id="toolUpload">' +
            '<input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />' +
            '<div class="upload-content">' +
            '<span class="upload-icon">📤</span>' +
            '<h3>Drag & drop photos</h3>' +
            '<p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>' +
            '</div>' +
            '</div>' +
            
            '<div class="options-panel" id="optionsPanel" style="display:none;">' +
            
            // 1. Aspect Ratio Presets
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">📐 Aspect Ratio:</label>' +
            '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:5px;">' +
            '<button class="ratio-btn" data-ratio="free" style="padding:6px 10px; background:var(--primary); color:white; border:none; border-radius:4px; cursor:pointer; font-size:0.85em;">Free</button>' +
            '<button class="ratio-btn" data-ratio="1:1" style="padding:6px 10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:4px; cursor:pointer; font-size:0.85em;">1:1</button>' +
            '<button class="ratio-btn" data-ratio="16:9" style="padding:6px 10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:4px; cursor:pointer; font-size:0.85em;">16:9</button>' +
            '<button class="ratio-btn" data-ratio="9:16" style="padding:6px 10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:4px; cursor:pointer; font-size:0.85em;">9:16</button>' +
            '<button class="ratio-btn" data-ratio="4:3" style="padding:6px 10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:4px; cursor:pointer; font-size:0.85em;">4:3</button>' +
            '<button class="ratio-btn" data-ratio="3:4" style="padding:6px 10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:4px; cursor:pointer; font-size:0.85em;">3:4</button>' +
            '</div>' +
            '</div>' +

            // 2. Canvas Preview
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">👁️ Selection Area:</label>' +
            '<div id="cropContainer" style="margin-top:10px; background:#111; border-radius:8px; overflow:hidden; position:relative; text-align:center; cursor:crosshair;">' +
            '<canvas id="cropCanvas" style="display:block; max-width:100%; max-height:400px;"></canvas>' +
            '<div id="cropPlaceholder" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#888;">' +
            '<p>📷 Upload an image</p>' +
            '</div>' +
            '</div>' +
            '<p id="cropDimensions" style="text-align:center; margin-top:8px; font-size:1.1em; font-weight:bold; color:var(--primary);">Width: 0px | Height: 0px</p>' +
            '</div>' +

            // 3. Controls
            '<div class="grid-2" style="display:flex; gap:10px; margin-bottom:15px;">' +
            '<button id="centerBtn" style="flex:1; padding:8px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">🎯 Center Selection</button>' +
            '<button id="resetBtn" style="flex:1; padding:8px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">🔄 Select All</button>' +
            '</div>' +

            // 4. File List
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
            '<label style="font-weight:600;">📋 Files (<span id="fileCount">0</span>):</label>' +
            '<button id="selectAllFiles" style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.85em;">Select All</button>' +
            '</div>' +
            '<div id="fileList" style="max-height:100px; overflow-y:auto; background:var(--bg-secondary); border-radius:6px; padding:5px;"></div>' +
            '</div>' +
            
            '<button class="btn-primary btn-large" id="processBtn" style="width:100%;">✂️ Crop & Download ZIP</button>' +
            '</div>' +
            '<div id="resultArea"></div>';
    },

    init: function() {
        var self = this;
        var upload = document.getElementById('toolUpload');
        var input = document.getElementById('fileInput');
        var btn = document.getElementById('processBtn');
        var canvas = document.getElementById('cropCanvas');

        if (!upload || !input || !canvas) return;

        // Upload
        upload.onclick = function() { input.click(); };
        input.onchange = function(e) { self.handleFiles(e.target.files); };
        upload.ondragover = function(e) { e.preventDefault(); upload.classList.add('dragover'); };
        upload.ondragleave = function() { upload.classList.remove('dragover'); };
        upload.ondrop = function(e) { e.preventDefault(); upload.classList.remove('dragover'); self.handleFiles(e.dataTransfer.files); };

        // Aspect Ratios
        document.querySelectorAll('.ratio-btn').forEach(function(b) {
            b.onclick = function() {
                document.querySelectorAll('.ratio-btn').forEach(function(btn) { 
                    btn.style.background = 'var(--bg-secondary)'; 
                    btn.style.color = 'var(--text-primary)';
                });
                this.style.background = 'var(--primary)';
                this.style.color = 'white';
                
                var ratio = this.getAttribute('data-ratio');
                self.setAspectRatio(ratio);
            };
        });

        // Controls
        document.getElementById('centerBtn').onclick = function() { self.centerCrop(); };
        document.getElementById('resetBtn').onclick = function() { self.resetCrop(); };

        // Canvas Interaction
        canvas.onmousedown = function(e) { self.onMouseDown(e); };
        window.onmousemove = function(e) { self.onMouseMove(e); };
        window.onmouseup = function(e) { self.onMouseUp(e); };
        canvas.ondragstart = function(e) { e.preventDefault(); };

        if (btn) btn.onclick = function() { self.process(); };
    },

    getCanvasCoords: function(e) {
        var canvas = document.getElementById('cropCanvas');
        var rect = canvas.getBoundingClientRect();
        // Scale coordinates based on actual canvas resolution vs display size
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    },

    setAspectRatio: function(ratio) {
        this.settings.ratio = ratio;
        if (ratio === 'free') {
            this.settings.ratioValue = 0;
        } else {
            var parts = ratio.split(':');
            this.settings.ratioValue = parseFloat(parts[0]) / parseFloat(parts[1]);
        }
        // If a crop exists, try to fit it
        if (this.crop.w > 0 && this.crop.h > 0 && ratio !== 'free') {
            this.fitCropToRatio();
        }
        this.drawPreview();
    },

    fitCropToRatio: function() {
        var r = this.settings.ratioValue;
        if (r <= 0) return;
        
        // Keep current width, adjust height
        var currentW = this.crop.w;
        var newH = currentW / r;
        
        // If height goes out of bounds, adjust width
        if (this.crop.y + newH > this.image.height) { // Note: using canvas height logic implicitly via image height scale
             // Actually simpler: just fit within current box bounds
             if (newH > this.crop.h) {
                 this.crop.h = newH; 
                 // If it exceeds canvas, we clamp later in draw or move
             }
        } else {
            this.crop.h = newH;
        }
        this.drawPreview();
    },

    handleFiles: function(fileList) {
        var self = this;
        var newFiles = Array.prototype.slice.call(fileList);
        var rejected = 0;
        newFiles.forEach(function(f) {
            if (typeof SECURITY !== 'undefined' && !SECURITY.isValidImage(f).valid) rejected++;
            else self.files.push(f);
        });
        if (rejected > 0) alert(rejected + ' file(s) skipped');
        
        if (this.files.length > 0) {
            document.getElementById('optionsPanel').style.display = 'block';
            document.getElementById('cropPlaceholder').style.display = 'none';
            this.renderFileList();
            this.loadPreview(this.files[0]);
        }
    },

    loadPreview: function(file) {
        var self = this;
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function() {
            self.image = img;
            var canvas = document.getElementById('cropCanvas');
            
            // Set canvas resolution to match image (or scaled down if too huge)
            var maxW = 800;
            var scale = Math.min(1, maxW / img.width);
            canvas.width = Math.floor(img.width * scale);
            canvas.height = Math.floor(img.height * scale);
            
            // Initial selection: 80% of center
            var initW = canvas.width * 0.8;
            var initH = canvas.height * 0.8;
            self.crop = { 
                x: (canvas.width - initW) / 2, 
                y: (canvas.height - initH) / 2, 
                w: initW, 
                h: initH,
                active: true 
            };
            
            self.drawPreview();
            self.updateDimensions();
        };
    },

    drawPreview: function() {
        if (!this.image) return;
        var canvas = document.getElementById('cropCanvas');
        var ctx = canvas.getContext('2d');
        
        // 1. Clear & Draw Image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
        
        // 2. Draw Dark Overlay outside crop
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        // Top
        ctx.rect(0, 0, canvas.width, this.crop.y);
        // Bottom
        ctx.rect(0, this.crop.y + this.crop.h, canvas.width, canvas.height - (this.crop.y + this.crop.h));
        // Left
        ctx.rect(0, this.crop.y, this.crop.x, this.crop.h);
        // Right
        ctx.rect(this.crop.x + this.crop.w, this.crop.y, canvas.width - (this.crop.x + this.crop.w), this.crop.h);
        ctx.fill();
        
        // 3. Draw Crop Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.crop.x, this.crop.y, this.crop.w, this.crop.h);
        
        // 4. Draw Handles (Corners)
        var handles = [
            {x: this.crop.x, y: this.crop.y}, // TL
            {x: this.crop.x + this.crop.w, y: this.crop.y}, // TR
            {x: this.crop.x + this.crop.w, y: this.crop.y + this.crop.h}, // BR
            {x: this.crop.x, y: this.crop.y + this.crop.h} // BL
        ];
        
        ctx.fillStyle = '#6366f1'; // Primary color
        handles.forEach(function(h) {
            ctx.beginPath();
            ctx.arc(h.x, h.y, 5, 0, Math.PI*2);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    },

    // Helper to detect if mouse is on a handle
    getHandleAt: function(x, y) {
        var r = 10; // Hit area radius
        var c = this.crop;
        // TL
        if (Math.abs(x - c.x) < r && Math.abs(y - c.y) < r) return 'tl';
        // TR
        if (Math.abs(x - (c.x + c.w)) < r && Math.abs(y - c.y) < r) return 'tr';
        // BR
        if (Math.abs(x - (c.x + c.w)) < r && Math.abs(y - (c.y + c.h)) < r) return 'br';
        // BL
        if (Math.abs(x - c.x) < r && Math.abs(y - (c.y + c.h)) < r) return 'bl';
        return null;
    },

    onMouseDown: function(e) {
        if (!this.image) return;
        var coords = this.getCanvasCoords(e);
        var canvas = document.getElementById('cropCanvas');
        
        // Check handle
        var handle = this.getHandleAt(coords.x, coords.y);
        
        // Check inside
        var inside = coords.x >= this.crop.x && coords.x <= this.crop.x + this.crop.w &&
                     coords.y >= this.crop.y && coords.y <= this.crop.y + this.crop.h;

        if (handle) {
            this.crop.isResizing = true;
            this.crop.handle = handle;
            document.getElementById('cropCanvas').style.cursor = handle + '-resize';
        } else if (inside) {
            this.crop.isDragging = true;
            document.getElementById('cropCanvas').style.cursor = 'move';
        } else {
            // Click outside: Start new selection from this point
            this.crop.x = coords.x;
            this.crop.y = coords.y;
            this.crop.w = 0;
            this.crop.h = 0;
            this.crop.isResizing = true; // Act like resizing BR
            this.crop.handle = 'br';
        }
        
        this.crop.startX = coords.x;
        this.crop.startY = coords.y;
        this.crop.startCrop = { x: this.crop.x, y: this.crop.y, w: this.crop.w, h: this.crop.h };
    },

    onMouseMove: function(e) {
        if (!this.image) return;
        var coords = this.getCanvasCoords(e);
        var canvas = document.getElementById('cropCanvas');
        
        // Cursor logic when not dragging
        if (!this.crop.isDragging && !this.crop.isResizing) {
            var handle = this.getHandleAt(coords.x, coords.y);
            var inside = coords.x >= this.crop.x && coords.x <= this.crop.x + this.crop.w &&
                         coords.y >= this.crop.y && coords.y <= this.crop.y + this.crop.h;
            if (handle) canvas.style.cursor = handle + '-resize';
            else if (inside) canvas.style.cursor = 'move';
            else canvas.style.cursor = 'crosshair';
            return;
        }

        var dx = coords.x - this.crop.startX;
        var dy = coords.y - this.crop.startY;
        var sc = this.crop.startCrop;
        var r = this.settings.ratioValue;

        if (this.crop.isResizing) {
            // Resize Logic
            var newX = sc.x, newY = sc.y, newW = sc.w, newH = sc.h;
            
            if (this.crop.handle === 'br') {
                newW = Math.max(10, sc.w + dx);
                newH = Math.max(10, sc.h + dy);
            } else if (this.crop.handle === 'bl') {
                newX = sc.x + dx;
                newW = Math.max(10, sc.w - dx);
                newH = Math.max(10, sc.h + dy);
            } else if (this.crop.handle === 'tr') {
                newY = sc.y + dy;
                newW = Math.max(10, sc.w + dx);
                newH = Math.max(10, sc.h - dy);
            } else if (this.crop.handle === 'tl') {
                newX = sc.x + dx;
                newY = sc.y + dy;
                newW = Math.max(10, sc.w - dx);
                newH = Math.max(10, sc.h - dy);
            }
            
            // Apply Aspect Ratio
            if (r > 0) {
                // Force ratio based on width
                newH = newW / r;
                // Adjust Y if top handles moving
                if (this.crop.handle === 'tl' || this.crop.handle === 'tr') {
                    newY = sc.y + (sc.h - newH);
                }
            }

            // Boundary Checks
            if (newX < 0) { newW += newX; newX = 0; }
            if (newY < 0) { newH += newY; newY = 0; }
            if (newX + newW > canvas.width) newW = canvas.width - newX;
            if (newY + newH > canvas.height) newH = canvas.height - newY;

            this.crop.x = newX;
            this.crop.y = newY;
            this.crop.w = newW;
            this.crop.h = newH;

        } else if (this.crop.isDragging) {
            this.crop.x = Math.max(0, Math.min(canvas.width - this.crop.w, sc.x + dx));
            this.crop.y = Math.max(0, Math.min(canvas.height - this.crop.h, sc.y + dy));
        }
        
        this.drawPreview();
        this.updateDimensions();
    },

    onMouseUp: function() {
        this.crop.isDragging = false;
        this.crop.isResizing = false;
        this.crop.handle = null;
        document.getElementById('cropCanvas').style.cursor = 'crosshair';
    },

    centerCrop: function() {
        if (!this.image) return;
        var canvas = document.getElementById('cropCanvas');
        // Center current size
        this.crop.x = (canvas.width - this.crop.w) / 2;
        this.crop.y = (canvas.height - this.crop.h) / 2;
        // Clamp
        if (this.crop.x < 0) this.crop.x = 0;
        if (this.crop.y < 0) this.crop.y = 0;
        this.drawPreview();
    },

    resetCrop: function() {
        if (!this.image) return;
        var canvas = document.getElementById('cropCanvas');
        this.crop = { x: 0, y: 0, w: canvas.width, h: canvas.height, active: true };
        this.drawPreview();
        this.updateDimensions();
    },

    updateDimensions: function() {
        if (!this.image) return;
        var canvas = document.getElementById('cropCanvas');
        // Calculate ratio between real image and canvas
        var scaleX = this.image.width / canvas.width;
        var scaleY = this.image.height / canvas.height;
        
        var realW = Math.round(this.crop.w * scaleX);
        var realH = Math.round(this.crop.h * scaleY);
        
        document.getElementById('cropDimensions').textContent = 'Width: ' + realW + 'px | Height: ' + realH + 'px';
    },

    updateSelectedFiles: function() {
        var cbs = document.querySelectorAll('.file-cb');
        this.selectedFiles = [];
        var self = this;
        cbs.forEach(function(cb, i) { if(cb.checked && self.files[i]) self.selectedFiles.push(self.files[i]); });
    },

    renderFileList: function() {
        var self = this;
        var list = document.getElementById('fileList');
        var count = document.getElementById('fileCount');
        if (!list) return;
        if (count) count.textContent = this.files.length;
        
        list.innerHTML = this.files.map(function(f, i) {
            return '<div style="padding:6px; margin-bottom:4px; background:var(--bg-primary); border-radius:4px; display:flex; align-items:center; gap:8px;">' +
                '<input type="checkbox" checked class="file-cb" onchange="cropTool.updateSelectedFiles()">' +
                '<span style="flex:1; font-size:0.85em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + f.name + '</span></div>';
        }).join('');
        this.updateSelectedFiles();
    },

    process: function() {
        var self = this;
        var files = this.selectedFiles.length > 0 ? this.selectedFiles : this.files;
        if (files.length === 0) { alert('Please upload files first!'); return; }
        if (!this.image || this.crop.w < 10) { alert('Please select a crop area!'); return; }

        var btn = document.getElementById('processBtn');
        if(btn) { btn.disabled = true; btn.textContent = '⏳ Processing...'; }
        var resArea = document.getElementById('resultArea');
        if(resArea) resArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden;"><div id="pBar" style="background:var(--primary); height:100%; width:0%;"></div></div><p id="pText" style="text-align:center; margin-top:8px;">Processing...</p></div>';

        if (typeof JSZip === 'undefined') { if(resArea) resArea.innerHTML = '<div style="color:red">JSZip not loaded</div>'; return; }

        var zip = new JSZip();
        var idx = 0, total = files.length;

        // Calculate relative crop box (0.0 to 1.0)
        var canvas = document.getElementById('cropCanvas');
        var relX = this.crop.x / canvas.width;
        var relY = this.crop.y / canvas.height;
        var relW = this.crop.w / canvas.width;
        var relH = this.crop.h / canvas.height;

        function next() {
            if (idx >= total) { finish(); return; }
            if(document.getElementById('pBar')) document.getElementById('pBar').style.width = ((idx+1)/total*100)+'%';
            if(document.getElementById('pText')) document.getElementById('pText').textContent = 'Cropping '+(idx+1)+' of '+total+'...';
            
            self.applyCrop(files[idx], relX, relY, relW, relH).then(function(blob) {
                zip.file('cropped_' + files[idx].name, blob);
                idx++; next();
            }).catch(function(err) { console.error(err); idx++; next(); });
        }

        function finish() {
            zip.generateAsync({type:'blob'}).then(function(content) {
                var url = URL.createObjectURL(content);
                var a = document.createElement('a'); a.href = url; a.download = 'cropped_images.zip';
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                if(resArea) resArea.innerHTML = '<div class="results-success"><h4>✅ Complete!</h4><p>📥 ZIP downloaded</p></div>';
                if(btn) { btn.disabled = false; btn.textContent = '✂️ Crop & Download ZIP'; }
            });
        }
        next();
    },

    applyCrop: function(file, relX, relY, relW, relH) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = function() {
                // Map relative coordinates to full resolution image
                var sx = img.width * relX;
                var sy = img.height * relY;
                var sw = img.width * relW;
                var sh = img.height * relH;
                
                var c = document.createElement('canvas');
                c.width = sw;
                c.height = sh;
                var ctx = c.getContext('2d');
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
                
                c.toBlob(function(blob) { if(blob) resolve(blob); else reject('err'); }, 'image/png');
                URL.revokeObjectURL(img.src);
            };
            img.onerror = function() { reject('load fail'); };
        });
    }
};

// --- 🔄 ROTATE & FLIP (Fixed + Security + English) ---
var rotateTool = {
    name: 'Rotate & Flip',
    icon: '🔄',
    files: [],
    processedFiles: [], // Array of objects { file, url }
    originalFiles: [], // Store originals for reset
    
    render: function() {
        return '<div class="tool-header">' +
            '<h2>🔄 Rotate & Flip</h2>' +
            '<p>Rotate or mirror images</p>' +
            '</div>' +
            
            '<div class="upload-area" id="toolUpload">' +
            '<input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />' +
            '<div class="upload-content">' +
            '<span class="upload-icon">📤</span>' +
            '<h3>Drag & drop photos</h3>' +
            '<p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>' +
            '</div>' +
            '</div>' +
            
            '<div id="previewArea" style="display:none; margin: 20px 0;">' +
            '<h3 style="margin-bottom: 15px;">📸 Preview (<span id="previewCount">0</span> photos)</h3>' +
            '<div id="previewGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;"></div>' +
            '</div>' +
            
            '<div class="options-panel" id="optionsPanel" style="display:none;">' +
            '<h3 style="margin-bottom: 15px;">🎨 Tools:</h3>' +
            '<div class="button-group" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 20px;">' +
            '<button class="btn-action" id="btnRotateLeft" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer; font-weight: bold; font-size: 1em;">↺ Rotate Left</button>' +
            '<button class="btn-action" id="btnRotateRight" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer; font-weight: bold; font-size: 1em;">↻ Rotate Right</button>' +
            '<button class="btn-action" id="btnFlipH" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer; font-weight: bold; font-size: 1em;">↔ Flip Horizontal</button>' +
            '<button class="btn-action" id="btnFlipV" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer; font-weight: bold; font-size: 1em;">↕ Flip Vertical</button>' +
            '<button class="btn-action" id="btnReset" style="background: #6c757d; color: white; padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer; font-weight: bold; font-size: 1em;">🔄 Reset</button>' +
            '</div>' +
            
            '<button class="btn-primary btn-large" id="btnDownload" style="width: 100%; padding: 16px; font-size: 1.2em; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">' +
            '📥 Download ZIP' +
            '</button>' +
            '</div>' +
            '<div id="resultArea" class="results-area"></div>';
    },
    
    init: function() {
        var self = this;
        var uploadArea = document.getElementById('toolUpload');
        var fileInput = document.getElementById('fileInput');
        
        if (!uploadArea || !fileInput) return;
        
        // Click on upload area
        uploadArea.addEventListener('click', function(e) {
            if (e.target === uploadArea || e.target.closest('.upload-content')) {
                fileInput.click();
            }
        });
        
        // File selection
        fileInput.addEventListener('change', function(e) {
            self.loadFiles(Array.from(e.target.files));
        });
        
        // Drag & Drop
        ['dragover', 'dragenter'].forEach(function(evt) {
            uploadArea.addEventListener(evt, function(e) { 
                e.preventDefault(); 
                uploadArea.classList.add('dragover'); 
            });
        });
        ['dragleave', 'drop'].forEach(function(evt) {
            uploadArea.addEventListener(evt, function() {
                uploadArea.classList.remove('dragover');
            });
        });
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            self.loadFiles(Array.from(e.dataTransfer.files));
        });
        
        // Transform buttons
        document.getElementById('btnRotateLeft').addEventListener('click', function() { self.applyTransform('rotateLeft'); });
        document.getElementById('btnRotateRight').addEventListener('click', function() { self.applyTransform('rotateRight'); });
        document.getElementById('btnFlipH').addEventListener('click', function() { self.applyTransform('flipH'); });
        document.getElementById('btnFlipV').addEventListener('click', function() { self.applyTransform('flipV'); });
        document.getElementById('btnReset').addEventListener('click', function() { self.reset(); });
        document.getElementById('btnDownload').addEventListener('click', function() { self.download(); });
    },
    
    // 🔒 SECURITY: Load files with validation
    loadFiles: function(fileList) {
        var self = this;
        if (!fileList.length) return;
        
        // Revoke old URLs
        this.processedFiles.forEach(function(item) { URL.revokeObjectURL(item.url); });
        
        // Filter files through SECURITY
        var rawFiles = Array.from(fileList);
        var validFiles = [];
        var rejectedCount = 0;
        
        rawFiles.forEach(function(file) {
            if (typeof SECURITY !== 'undefined') {
                var check = SECURITY.isValidImage(file);
                if (check.valid) {
                    validFiles.push(file);
                } else {
                    rejectedCount++;
                    console.warn('🚫 Blocked: ' + file.name + ' - ' + check.reason);
                }
            } else {
                validFiles.push(file);
            }
        });
        
        if (rejectedCount > 0) {
            alert('⚠️ ' + rejectedCount + ' file(s) skipped: invalid format or too large.');
        }
        
        if (validFiles.length === 0) return;
        
        // Store originals for reset
        this.originalFiles = validFiles.map(function(file) {
            return {
                file: file,
                url: URL.createObjectURL(file),
                name: file.name
            };
        });
        
        // Create processed files copy
        this.processedFiles = this.originalFiles.map(function(item) {
            return {
                file: item.file,
                url: item.url,
                name: item.name
            };
        });
        
        document.getElementById('optionsPanel').style.display = 'block';
        document.getElementById('previewArea').style.display = 'block';
        document.getElementById('previewCount').textContent = this.processedFiles.length;
        document.getElementById('btnDownload').textContent = '📥 Download ZIP (' + this.processedFiles.length + ' photos)';
        
        this.showPreview();
    },
    
    // Update preview
    showPreview: function() {
        var self = this;
        var previewGrid = document.getElementById('previewGrid');
        previewGrid.innerHTML = '';
        
        this.processedFiles.forEach(function(item) {
            var card = document.createElement('div');
            card.className = 'preview-card';
            card.style.cssText = 'background: var(--bg-secondary); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column;';
            
            var img = document.createElement('img');
            img.src = item.url;
            img.style.cssText = 'width: 100%; height: 150px; object-fit: contain; background: #f0f0f0;';
            
            var info = document.createElement('div');
            info.style.cssText = 'padding: 8px; font-size: 0.8em; color: var(--text-secondary); text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
            info.textContent = item.name;
            
            card.appendChild(img);
            card.appendChild(info);
            previewGrid.appendChild(card);
        });
    },
    
    // Apply transformation
    applyTransform: function(action) {
        var self = this;
        if (!self.processedFiles.length) return;
        
        // Show loading
        var btnId = '';
        if (action === 'rotateLeft') btnId = 'btnRotateLeft';
        else if (action === 'rotateRight') btnId = 'btnRotateRight';
        else if (action === 'flipH') btnId = 'btnFlipH';
        else btnId = 'btnFlipV';
        
        var btn = document.getElementById(btnId);
        var originalText = btn.textContent;
        btn.textContent = '⏳ Processing...';
        btn.disabled = true;
        
        // Process files sequentially
        var index = 0;
        
        function processNext() {
            if (index >= self.processedFiles.length) {
                finish();
                return;
            }
            
            var item = self.processedFiles[index];
            
            var img = new Image();
            img.src = item.url;
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                
                var w = img.width;
                var h = img.height;
                
                // Canvas dimensions
                if (action === 'rotateLeft' || action === 'rotateRight') {
                    canvas.width = h;
                    canvas.height = w;
                } else {
                    canvas.width = w;
                    canvas.height = h;
                }
                
                // Transformation logic
                if (action === 'rotateLeft') {
                    ctx.translate(0, canvas.height);
                    ctx.rotate(-Math.PI / 2);
                } else if (action === 'rotateRight') {
                    ctx.translate(canvas.width, 0);
                    ctx.rotate(Math.PI / 2);
                } else if (action === 'flipH') {
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                } else if (action === 'flipV') {
                    ctx.translate(0, canvas.height);
                    ctx.scale(1, -1);
                }
                
                ctx.drawImage(img, 0, 0);
                
                // Convert to Blob
                canvas.toBlob(function(blob) {
                    if (blob) {
                        var newName = item.name.replace(/\.[^/.]+$/, "") + ".png";
                        var newFile = new File([blob], newName, { type: 'image/png' });
                        
                        // Revoke old URL
                        URL.revokeObjectURL(item.url);
                        
                        // Update file
                        self.processedFiles[index] = {
                            file: newFile,
                            url: URL.createObjectURL(blob),
                            name: newName
                        };
                        
                        index++;
                        processNext();
                    } else {
                        console.error('Failed to create blob');
                        index++;
                        processNext();
                    }
                }, 'image/png');
            };
            
            img.onerror = function() {
                console.error('Failed to load image');
                index++;
                processNext();
            };
        }
        
        function finish() {
            self.showPreview();
            btn.textContent = originalText;
            btn.disabled = false;
        }
        
        processNext();
    },
    
    // Reset to originals
    reset: function() {
        if (!this.originalFiles.length) return;
        
        // Revoke current URLs
        this.processedFiles.forEach(function(item) { URL.revokeObjectURL(item.url); });
        
        // Restore originals
        this.processedFiles = this.originalFiles.map(function(item) {
            return {
                file: item.file,
                url: URL.createObjectURL(item.url),
                name: item.name
            };
        });
        
        this.showPreview();
    },
    
    // Download ZIP
    download: function() {
        var self = this;
        if (!self.processedFiles.length) return;
        
        document.getElementById('resultArea').innerHTML = '<div class="loading">📦 Packing ZIP...</div>';
        
        if (typeof JSZip === 'undefined') {
            document.getElementById('resultArea').innerHTML = '<div style="color:red; padding:15px;">❌ JSZip not loaded!</div>';
            return;
        }
        
        var zip = new JSZip();
        var index = 0;
        var total = self.processedFiles.length;
        
        function addNext() {
            if (index >= total) {
                finishZip();
                return;
            }
            
            var item = self.processedFiles[index];
            zip.file(item.name, item.file);
            index++;
            addNext();
        }
        
        function finishZip() {
            zip.generateAsync({type: 'blob'}).then(function(content) {
                var url = URL.createObjectURL(content);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'pixelcraft_edited.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                document.getElementById('resultArea').innerHTML = 
                    '<div class="results-success">' +
                    '<h4>✅ Complete!</h4>' +
                    '<p style="color:var(--primary); font-weight:600;">📥 ZIP downloaded!</p>' +
                    '</div>';
            });
        }
        
        addNext();
    }
};

// --- 👤 FACE EXTRACTOR (Complete Fixed: 600px + Sync + Circular Crop) ---
var faceExtractTool = {
    name: 'Face Extractor',
    icon: '👤',
    files: [],
    selectedFiles: [],
    image: null,
    settings: {
        outputSize: '512',
        circularCrop: false
    },
    face: {
        x: 0, y: 0, w: 0, h: 0,
        isDragging: false,
        isResizing: false,
        handle: null
    },
    scale: 1,

    render: function() {
        return '<div class="tool-header">' +
            '<h2>👤 Face Extractor</h2>' +
            '<p>Extract and crop faces from photos</p>' +
            '</div>' +
            
            '<div class="upload-area" id="toolUpload">' +
            '<input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />' +
            '<div class="upload-content">' +
            '<span class="upload-icon">📤</span>' +
            '<h3>Drag & drop photos</h3>' +
            '<p>Supports: JPEG, JPG, PNG, GIF, WebP, BMP</p>' +
            '</div>' +
            '</div>' +
            
            '<div class="options-panel" id="optionsPanel" style="display:none;">' +
            
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">👁️ Select Face Area:</label>' +
            '<div id="faceContainer" style="margin-top:10px; background:#111; border-radius:8px; overflow:auto; position:relative; text-align:center;">' +
            '<canvas id="faceCanvas" style="display:block; max-width:100%; cursor:crosshair;"></canvas>' +
            '<div id="facePlaceholder" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#888; width:100%;">' +
            '<p>📷 Upload an image</p>' +
            '</div>' +
            '</div>' +
            '<p id="faceDimensions" style="text-align:center; margin-top:8px; font-size:1.1em; font-weight:bold; color:var(--primary);">Width: 0px | Height: 0px</p>' +
            '</div>' +

            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">📐 Output Size:</label>' +
            '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:5px;">' +
            '<button class="size-btn" data-size="256" style="padding:6px 10px; background:var(--primary); color:white; border:none; border-radius:4px; cursor:pointer; font-size:0.85em;">256×256</button>' +
            '<button class="size-btn" data-size="512" style="padding:6px 10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:4px; cursor:pointer; font-size:0.85em;">512×512</button>' +
            '<button class="size-btn" data-size="1024" style="padding:6px 10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:4px; cursor:pointer; font-size:0.85em;">1024×1024</button>' +
            '<button class="size-btn" data-size="original" style="padding:6px 10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:4px; cursor:pointer; font-size:0.85em;">Original</button>' +
            '<button class="size-btn" data-size="circular" style="padding:6px 10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:4px; cursor:pointer; font-size:0.85em;">⭕ Circle</button>' +
            '</div>' +
            '</div>' +

            '<div class="grid-2" style="display:flex; gap:10px; margin-bottom:15px;">' +
            '<button id="centerFaceBtn" style="flex:1; padding:8px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">🎯 Center</button>' +
            '<button id="detectFaceBtn" style="flex:1; padding:8px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">🔍 Auto</button>' +
            '</div>' +

            '<div class="option-group" style="margin-bottom:15px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
            '<label style="font-weight:600;">📋 Files (<span id="fileCount">0</span>):</label>' +
            '<button id="selectAllFiles" style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:4px 8px; border-radius:4px; cursor:pointer;">Select All</button>' +
            '</div>' +
            '<div id="fileList" style="max-height:100px; overflow-y:auto; background:var(--bg-secondary); border-radius:6px; padding:5px;"></div>' +
            '</div>' +
            
            '<button class="btn-primary btn-large" id="processBtn" style="width:100%;">👤 Extract & Download ZIP</button>' +
            '</div>' +
            '<div id="resultArea"></div>';
    },

    init: function() {
        var self = this;
        var upload = document.getElementById('toolUpload');
        var input = document.getElementById('fileInput');
        var btn = document.getElementById('processBtn');
        var canvas = document.getElementById('faceCanvas');

        if (!upload || !input || !canvas) return;

        upload.onclick = function() { input.click(); };
        input.onchange = function(e) { self.handleFiles(e.target.files); };
        upload.ondragover = function(e) { e.preventDefault(); upload.classList.add('dragover'); };
        upload.ondragleave = function() { upload.classList.remove('dragover'); };
        upload.ondrop = function(e) { e.preventDefault(); upload.classList.remove('dragover'); self.handleFiles(e.dataTransfer.files); };

        var sizeBtns = document.querySelectorAll('.size-btn');
        sizeBtns.forEach(function(b) {
            b.onclick = function() {
                sizeBtns.forEach(function(btn) { 
                    btn.style.background = 'var(--bg-secondary)'; 
                    btn.style.color = 'var(--text-primary)';
                });
                this.style.background = 'var(--primary)';
                this.style.color = 'white';
                
                var size = this.getAttribute('data-size');
                if (size === 'circular') {
                    self.settings.outputSize = '512';
                    self.settings.circularCrop = true;
                } else {
                    self.settings.outputSize = size;
                    self.settings.circularCrop = false;
                }
            };
        });

        document.getElementById('centerFaceBtn').onclick = function() { self.centerFace(); };
        document.getElementById('detectFaceBtn').onclick = function() { self.autoDetectFace(); };

        canvas.onmousedown = function(e) { self.onMouseDown(e); };
        window.onmousemove = function(e) { self.onMouseMove(e); };
        window.onmouseup = function(e) { self.onMouseUp(e); };
        canvas.ondragstart = function(e) { e.preventDefault(); };

        if (btn) btn.onclick = function() { self.process(); };
    },

    getCanvasCoords: function(e) {
        var canvas = document.getElementById('faceCanvas');
        if (!canvas) return { x: 0, y: 0 };
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    },

    handleFiles: function(fileList) {
        var self = this;
        var newFiles = Array.prototype.slice.call(fileList);
        var rejected = 0;
        
        newFiles.forEach(function(f) {
            if (typeof SECURITY !== 'undefined' && !SECURITY.isValidImage(f).valid) {
                rejected++;
            } else {
                self.files.push(f);
            }
        });
        
        if (rejected > 0) alert(rejected + ' file(s) skipped');
        
        if (this.files.length > 0) {
            document.getElementById('optionsPanel').style.display = 'block';
            document.getElementById('facePlaceholder').style.display = 'none';
            this.renderFileList();
            this.loadPreview(this.files[0]);
        }
    },

    loadPreview: function(file) {
        var self = this;
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function() {
            self.image = img;
            var canvas = document.getElementById('faceCanvas');
            
            var maxW = 800;
            var maxH = 600;
            var scale = Math.min(1, maxW / img.width, maxH / img.height);
            canvas.width = Math.floor(img.width * scale);
            canvas.height = Math.floor(img.height * scale);
            
            self.scale = img.width / canvas.width;
            
            var initW = canvas.width * 0.4;
            var initH = canvas.height * 0.5;
            self.face = { 
                x: (canvas.width - initW) / 2, 
                y: (canvas.height - initH) / 3,
                w: initW, 
                h: initH,
                isDragging: false,
                isResizing: false,
                handle: null
            };
            
            self.drawPreview();
            self.updateDimensions();
        };
    },

    drawPreview: function() {
        if (!this.image) return;
        var canvas = document.getElementById('faceCanvas');
        var ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, this.face.y);
        ctx.rect(0, this.face.y + this.face.h, canvas.width, canvas.height - (this.face.y + this.face.h));
        ctx.rect(0, this.face.y, this.face.x, this.face.h);
        ctx.rect(this.face.x + this.face.w, this.face.y, canvas.width - (this.face.x + this.face.w), this.face.h);
        ctx.fill();
        
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.face.x, this.face.y, this.face.w, this.face.h);
        
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.ellipse(this.face.x + this.face.w/2, this.face.y + this.face.h/2, this.face.w/2.5, this.face.h/3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        var handles = [
            {x: this.face.x, y: this.face.y},
            {x: this.face.x + this.face.w, y: this.face.y},
            {x: this.face.x + this.face.w, y: this.face.y + this.face.h},
            {x: this.face.x, y: this.face.y + this.face.h}
        ];
        
        ctx.fillStyle = '#6366f1';
        handles.forEach(function(h) {
            ctx.beginPath();
            ctx.arc(h.x, h.y, 6, 0, Math.PI*2);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    },

    getHandleAt: function(x, y) {
        var r = 15;
        var f = this.face;
        if (Math.abs(x - f.x) < r && Math.abs(y - f.y) < r) return 'tl';
        if (Math.abs(x - (f.x + f.w)) < r && Math.abs(y - f.y) < r) return 'tr';
        if (Math.abs(x - (f.x + f.w)) < r && Math.abs(y - (f.y + f.h)) < r) return 'br';
        if (Math.abs(x - f.x) < r && Math.abs(y - (f.y + f.h)) < r) return 'bl';
        return null;
    },

    onMouseDown: function(e) {
        if (!this.image) return;
        var coords = this.getCanvasCoords(e);
        var canvas = document.getElementById('faceCanvas');
        
        var handle = this.getHandleAt(coords.x, coords.y);
        var inside = coords.x >= this.face.x && coords.x <= this.face.x + this.face.w &&
                     coords.y >= this.face.y && coords.y <= this.face.y + this.face.h;

        if (handle) {
            this.face.isResizing = true;
            this.face.handle = handle;
            if (canvas) canvas.style.cursor = handle + '-resize';
        } else if (inside) {
            this.face.isDragging = true;
            if (canvas) canvas.style.cursor = 'move';
        } else {
            this.face.x = coords.x;
            this.face.y = coords.y;
            this.face.w = 0;
            this.face.h = 0;
            this.face.isResizing = true;
            this.face.handle = 'br';
        }
        
        this.face.startX = coords.x;
        this.face.startY = coords.y;
        this.face.startFace = { x: this.face.x, y: this.face.y, w: this.face.w, h: this.face.h };
    },

    onMouseMove: function(e) {
        if (!this.image) return;
        var coords = this.getCanvasCoords(e);
        var canvas = document.getElementById('faceCanvas');
        
        if (!this.face.isDragging && !this.face.isResizing) {
            var handle = this.getHandleAt(coords.x, coords.y);
            var inside = coords.x >= this.face.x && coords.x <= this.face.x + this.face.w &&
                         coords.y >= this.face.y && coords.y <= this.face.y + this.face.h;
            if (canvas) {
                if (handle) canvas.style.cursor = handle + '-resize';
                else if (inside) canvas.style.cursor = 'move';
                else canvas.style.cursor = 'crosshair';
            }
            return;
        }

        var dx = coords.x - this.face.startX;
        var dy = coords.y - this.face.startY;
        var sf = this.face.startFace;

        if (this.face.isResizing) {
            var newX = sf.x, newY = sf.y, newW = sf.w, newH = sf.h;
            
            if (this.face.handle === 'br') {
                newW = Math.max(50, sf.w + dx);
                newH = Math.max(50, sf.h + dy);
            } else if (this.face.handle === 'bl') {
                newX = sf.x + dx;
                newW = Math.max(50, sf.w - dx);
                newH = Math.max(50, sf.h + dy);
            } else if (this.face.handle === 'tr') {
                newY = sf.y + dy;
                newW = Math.max(50, sf.w + dx);
                newH = Math.max(50, sf.h - dy);
            } else if (this.face.handle === 'tl') {
                newX = sf.x + dx;
                newY = sf.y + dy;
                newW = Math.max(50, sf.w - dx);
                newH = Math.max(50, sf.h - dy);
            }

            if (newX < 0) { newW += newX; newX = 0; }
            if (newY < 0) { newH += newY; newY = 0; }
            if (canvas && newX + newW > canvas.width) newW = canvas.width - newX;
            if (canvas && newY + newH > canvas.height) newH = canvas.height - newY;

            this.face.x = newX;
            this.face.y = newY;
            this.face.w = newW;
            this.face.h = newH;

        } else if (this.face.isDragging && canvas) {
            this.face.x = Math.max(0, Math.min(canvas.width - this.face.w, sf.x + dx));
            this.face.y = Math.max(0, Math.min(canvas.height - this.face.h, sf.y + dy));
        }
        
        this.drawPreview();
        this.updateDimensions();
    },

    onMouseUp: function() {
        this.face.isDragging = false;
        this.face.isResizing = false;
        this.face.handle = null;
        var canvas = document.getElementById('faceCanvas');
        if (canvas) canvas.style.cursor = 'crosshair';
    },

    centerFace: function() {
        if (!this.image) return;
        var canvas = document.getElementById('faceCanvas');
        if (!canvas) return;
        this.face.x = (canvas.width - this.face.w) / 2;
        this.face.y = (canvas.height - this.face.h) / 2;
        if (this.face.x < 0) this.face.x = 0;
        if (this.face.y < 0) this.face.y = 0;
        this.drawPreview();
    },

    autoDetectFace: function() {
        if (!this.image) return;
        var canvas = document.getElementById('faceCanvas');
        if (!canvas) return;
        this.face.w = canvas.width * 0.35;
        this.face.h = canvas.height * 0.45;
        this.face.x = (canvas.width - this.face.w) / 2;
        this.face.y = canvas.height * 0.15;
        this.drawPreview();
        this.updateDimensions();
    },

    updateDimensions: function() {
        if (!this.image) return;
        var canvas = document.getElementById('faceCanvas');
        if (!canvas) return;
        var realW = Math.round(this.face.w * this.scale);
        var realH = Math.round(this.face.h * this.scale);
        var dimEl = document.getElementById('faceDimensions');
        if (dimEl) dimEl.textContent = 'Width: ' + realW + 'px | Height: ' + realH + 'px';
    },

    updateSelectedFiles: function() {
        var cbs = document.querySelectorAll('.file-cb');
        this.selectedFiles = [];
        var self = this;
        cbs.forEach(function(cb, i) { if(cb.checked && self.files[i]) self.selectedFiles.push(self.files[i]); });
    },

    renderFileList: function() {
        var self = this;
        var list = document.getElementById('fileList');
        var count = document.getElementById('fileCount');
        if (!list) return;
        if (count) count.textContent = this.files.length;
        list.innerHTML = this.files.map(function(f, i) {
            return '<div style="padding:6px; margin-bottom:4px; background:var(--bg-primary); border-radius:4px; display:flex; align-items:center; gap:8px;">' +
                '<input type="checkbox" checked class="file-cb" onchange="faceExtractTool.updateSelectedFiles()">' +
                '<span style="flex:1; font-size:0.85em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + f.name + '</span></div>';
        }).join('');
        this.updateSelectedFiles();
    },

    process: function() {
        var self = this;
        var files = this.selectedFiles.length > 0 ? this.selectedFiles : this.files;
        
        if (files.length === 0) { alert('Please upload files first!'); return; }
        if (!this.image || this.face.w < 50) { alert('Please select a face area!'); return; }

        var btn = document.getElementById('processBtn');
        if(btn) { btn.disabled = true; btn.textContent = '⏳ Processing...'; }
        
        var resArea = document.getElementById('resultArea');
        if(resArea) resArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden;"><div id="pBar" style="background:var(--primary); height:100%; width:0%;"></div></div><p id="pText" style="text-align:center; margin-top:8px;">Processing...</p></div>';

        if (typeof JSZip === 'undefined') { 
            if(resArea) resArea.innerHTML = '<div style="color:red">JSZip not loaded</div>'; 
            if(btn) { btn.disabled = false; btn.textContent = '👤 Extract & Download ZIP'; }
            return; 
        }

        var zip = new JSZip();
        var idx = 0;
        var total = files.length;
        var successCount = 0;
        
        var canvas = document.getElementById('faceCanvas');
        if (!canvas) { alert('Canvas not found'); if(btn) { btn.disabled = false; btn.textContent = '👤 Extract & Download ZIP'; } return; }
        
        var relX = this.face.x / canvas.width;
        var relY = this.face.y / canvas.height;
        var relW = this.face.w / canvas.width;
        var relH = this.face.h / canvas.height;
        var outputSize = this.settings.outputSize || '512';

        function processNext() {
            if (idx >= total) { finishZip(); return; }
            var file = files[idx];
            var pBar = document.getElementById('pBar');
            var pText = document.getElementById('pText');
            if(pBar) pBar.style.width = ((idx + 1) / total * 100) + '%';
            if(pText) pText.textContent = 'Extracting ' + (idx + 1) + ' of ' + total;
            
            var processFunc = self.settings.circularCrop ? self.extractFaceCircular : self.extractFace;
            
            processFunc.call(self, file, relX, relY, relW, relH, outputSize)
                .then(function(blob) {
                    if (blob && blob.size > 0) {
                        var ext = self.settings.circularCrop ? '_circle' : '';
                        var fileName = 'face_' + file.name.split('.')[0] + ext + '.png';
                        zip.file(fileName, blob);
                        successCount++;
                    }
                    idx++;
                    setTimeout(processNext, 10);
                })
                .catch(function(err) { console.error('Error:', err); idx++; setTimeout(processNext, 10); });
        }

        function finishZip() {
            if (successCount === 0) {
                if(resArea) resArea.innerHTML = '<div style="color:red; padding:15px;">❌ No faces extracted</div>';
                if(btn) { btn.disabled = false; btn.textContent = '👤 Extract & Download ZIP'; }
                return;
            }
            if(resArea) resArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden;"><div id="pBar" style="background:var(--primary); height:100%; width:100%;"></div></div><p id="pText" style="text-align:center; margin-top:8px;">Packing ZIP...</p></div>';
            
            zip.generateAsync({type: 'blob', compression: 'DEFLATE'}).then(function(content) {
                var url = URL.createObjectURL(content);
                var a = document.createElement('a');
                a.href = url; a.download = 'extracted_faces.zip';
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                setTimeout(function() { URL.revokeObjectURL(url); }, 100);
                if(resArea) resArea.innerHTML = '<div class="results-success"><h4>✅ Complete!</h4><p>Extracted ' + successCount + ' faces</p><p style="color:var(--primary); font-weight:600;">📥 ZIP downloaded!</p></div>';
                if(btn) { btn.disabled = false; btn.textContent = '👤 Extract & Download ZIP'; }
            }).catch(function(err) { console.error('ZIP error:', err); if(resArea) resArea.innerHTML = '<div style="color:red; padding:15px;">❌ ZIP error</div>'; if(btn) { btn.disabled = false; btn.textContent = '👤 Extract & Download ZIP'; } });
        }
        processNext();
    },

    extractFace: function(file, relX, relY, relW, relH, outputSize) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() {
                var sx = Math.floor(img.width * relX);
                var sy = Math.floor(img.height * relY);
                var sw = Math.floor(img.width * relW);
                var sh = Math.floor(img.height * relH);
                if (sx < 0) sx = 0; if (sy < 0) sy = 0;
                if (sx + sw > img.width) sw = img.width - sx;
                if (sy + sh > img.height) sh = img.height - sy;
                
                var c = document.createElement('canvas');
                var ctx = c.getContext('2d');
                if (!ctx) { reject('No context'); return; }
                
                if (outputSize === 'original') {
                    c.width = sw; c.height = sh;
                } else {
                    var size = parseInt(outputSize);
                    var aspectRatio = sw / sh;
                    if (aspectRatio > 1) { c.width = size; c.height = Math.round(size / aspectRatio); }
                    else { c.width = Math.round(size * aspectRatio); c.height = size; }
                }
                
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
                c.toBlob(function(blob) { if (blob) resolve(blob); else reject('toBlob failed'); }, 'image/png', 0.95);
            };
            img.onerror = function() { reject('Failed to load image'); };
            try { img.src = URL.createObjectURL(file); } catch (e) { reject('Cannot create URL'); }
        });
    },

    extractFaceCircular: function(file, relX, relY, relW, relH, outputSize) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.extractFace(file, relX, relY, relW, relH, outputSize).then(function(rectBlob) {
                var img = new Image();
                img.src = URL.createObjectURL(rectBlob);
                img.onload = function() {
                    var c = document.createElement('canvas');
                    var ctx = c.getContext('2d');
                    var size = Math.min(img.width, img.height);
                    c.width = size; c.height = size;
                    ctx.clearRect(0, 0, size, size);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    var x = (size - img.width) / 2;
                    var y = (size - img.height) / 2;
                    ctx.drawImage(img, x, y);
                    ctx.restore();
                    c.toBlob(function(blob) { if (blob) resolve(blob); else reject('circular failed'); }, 'image/png', 0.95);
                };
                img.onerror = function() { reject('circular load fail'); };
            }).catch(reject);
        });
    }
};

// --- 🔒 PROTECT IMAGES (Professional Protection Tool) ---
var protectTool = {
    name: 'Protect Images',
    icon: '🔒',
    files: [],
    selectedFiles: [],
    previewImg: null,
    watermarkText: '© Protected',
    
    settings: {
        watermarkEnabled: true,
        watermarkText: '© Your Name',
        watermarkOpacity: 0.3,
        watermarkPosition: 'bottom-right',
        watermarkSize: 24,
        watermarkColor: '#ffffff',
        quality: 85,
        maxWidth: 0,
        maxHeight: 0,
        addMetadata: true,
        copyright: ''
    },

    render: function() {
        return '<div class="tool-header">' +
            '<h2>🔒 Protect Images</h2>' +
            '<p>Add watermarks and protect your photos</p>' +
            '</div>' +
            
            '<div class="upload-area" id="toolUpload">' +
            '<input type="file" id="fileInput" multiple accept="image/*" style="display:none;" />' +
            '<div class="upload-content">' +
            '<span class="upload-icon">📤</span>' +
            '<h3>Drag & drop photos</h3>' +
            '<p>Supports: JPEG, JPG, PNG, GIF, Web, SVG, BMP</p>' +
            '</div>' +
            '</div>' +
            
            '<div class="options-panel" id="optionsPanel" style="display:none;">' +
            
            // Watermark Settings
            '<div class="option-group" style="margin-bottom:20px;">' +
            '<h3 style="margin-bottom:15px; color:var(--primary);">💧 Watermark Settings</h3>' +
            
            '<div style="margin-bottom:15px;">' +
            '<label style="display:flex; align-items:center; gap:10px; cursor:pointer;">' +
            '<input type="checkbox" id="wmEnabled" checked style="width:18px; height:18px;" />' +
            '<span style="font-weight:600;">Enable Watermark</span>' +
            '</label>' +
            '</div>' +
            
            '<div id="watermarkOptions">' +
            '<div style="margin-bottom:12px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">Text:</label>' +
            '<input type="text" id="wmText" value="© Your Name" style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border-color);" />' +
            '</div>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">Position:</label>' +
            '<select id="wmPosition" style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border-color);">' +
            '<option value="top-left">Top Left ↖</option>' +
            '<option value="top-right">Top Right ↗</option>' +
            '<option value="bottom-left">Bottom Left ↙</option>' +
            '<option value="bottom-right" selected>Bottom Right ↘</option>' +
            '<option value="center">Center ⬤</option>' +
            '</select>' +
            '</div>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">Opacity: <span id="wmOpacityVal">30%</span></label>' +
            '<input type="range" id="wmOpacity" min="5" max="100" value="30" style="width:100%;" />' +
            '</div>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">Size: <span id="wmSizeVal">24px</span></label>' +
            '<input type="range" id="wmSize" min="12" max="72" value="24" style="width:100%;" />' +
            '</div>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">Color:</label>' +
            '<input type="color" id="wmColor" value="#ffffff" style="width:100%; height:40px; border-radius:6px; border:none;" />' +
            '</div>' +
            '</div>' +
            '</div>' +

            // Quality & Size Settings
            '<div class="option-group" style="margin-bottom:20px;">' +
            '<h3 style="margin-bottom:15px; color:var(--primary);">📊 Quality & Size</h3>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">JPEG Quality: <span id="qualityVal">85%</span></label>' +
            '<input type="range" id="quality" min="10" max="100" value="85" style="width:100%;" />' +
            '</div>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">Max Width (px):</label>' +
            '<input type="number" id="maxWidth" value="0" placeholder="0 = no limit" style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border-color);" />' +
            '<small style="color:var(--text-secondary); display:block; margin-top:4px;">0 = keep original</small>' +
            '</div>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">Max Height (px):</label>' +
            '<input type="number" id="maxHeight" value="0" placeholder="0 = no limit" style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border-color);" />' +
            '</div>' +
            '</div>' +

            // Copyright Metadata
            '<div class="option-group" style="margin-bottom:20px;">' +
            '<h3 style="margin-bottom:15px; color:var(--primary);">ℹ️ Copyright Metadata</h3>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="display:flex; align-items:center; gap:10px; cursor:pointer;">' +
            '<input type="checkbox" id="addMetadata" checked style="width:18px; height:18px;" />' +
            '<span style="font-weight:600;">Add Copyright Info</span>' +
            '</label>' +
            '</div>' +
            
            '<div>' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">Copyright Text:</label>' +
            '<input type="text" id="copyrightText" value="© 2024 Your Name" style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border-color);" />' +
            '</div>' +
            '</div>' +

            // Preview
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">👁️ Preview:</label>' +
            '<div id="previewContainer" style="margin-top:10px; background:#111; border-radius:8px; overflow:hidden; position:relative; text-align:center;">' +
            '<canvas id="previewCanvas" style="display:block; max-width:100%; max-height:300px;"></canvas>' +
            '<div id="previewPlaceholder" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#888;">' +
            '<p>📷 Upload an image</p>' +
            '</div>' +
            '</div>' +
            '</div>' +

            // File List
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
            '<label style="font-weight:600;">📋 Files (<span id="fileCount">0</span>):</label>' +
            '<button id="selectAllFiles" style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:4px 8px; border-radius:4px; cursor:pointer;">Select All</button>' +
            '</div>' +
            '<div id="fileList" style="max-height:100px; overflow-y:auto; background:var(--bg-secondary); border-radius:6px; padding:5px;"></div>' +
            '</div>' +
            
            '<button class="btn-primary btn-large" id="processBtn" style="width:100%;">🔒 Protect & Download ZIP</button>' +
            '</div>' +
            '<div id="resultArea"></div>';
    },

    init: function() {
        var self = this;
        var upload = document.getElementById('toolUpload');
        var input = document.getElementById('fileInput');
        var btn = document.getElementById('processBtn');

        if (!upload || !input) return;

        // Upload handlers
        upload.onclick = function() { input.click(); };
        input.onchange = function(e) { self.handleFiles(e.target.files); };
        upload.ondragover = function(e) { e.preventDefault(); upload.classList.add('dragover'); };
        upload.ondragleave = function() { upload.classList.remove('dragover'); };
        upload.ondrop = function(e) { e.preventDefault(); upload.classList.remove('dragover'); self.handleFiles(e.dataTransfer.files); };

        // Watermark toggle
        var wmEnabled = document.getElementById('wmEnabled');
        var wmOptions = document.getElementById('watermarkOptions');
        if (wmEnabled && wmOptions) {
            wmEnabled.onchange = function() {
                wmOptions.style.display = this.checked ? 'block' : 'none';
                self.updateSettings();
                self.updatePreview();
            };
        }

        // Watermark inputs
        var wmInputs = ['wmText', 'wmPosition', 'wmOpacity', 'wmSize', 'wmColor'];
        wmInputs.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.oninput = el.onchange = function() {
                    self.updateSettings();
                    self.updatePreview();
                };
            }
        });

        // Quality & size inputs
        var qualityInput = document.getElementById('quality');
        if (qualityInput) {
            qualityInput.oninput = function() {
                document.getElementById('qualityVal').textContent = this.value + '%';
                self.updateSettings();
            };
        }

        var maxWidthInput = document.getElementById('maxWidth');
        var maxHeightInput = document.getElementById('maxHeight');
        if (maxWidthInput) maxWidthInput.onchange = function() { self.updateSettings(); };
        if (maxHeightInput) maxHeightInput.onchange = function() { self.updateSettings(); };

        // Metadata
        var addMetadata = document.getElementById('addMetadata');
        var copyrightText = document.getElementById('copyrightText');
        if (addMetadata) addMetadata.onchange = function() { self.updateSettings(); };
        if (copyrightText) copyrightText.oninput = function() { self.updateSettings(); };

        // Select all
        var selectAllBtn = document.getElementById('selectAllFiles');
        if (selectAllBtn) {
            selectAllBtn.onclick = function() {
                var cbs = document.querySelectorAll('.file-cb');
                var allChecked = Array.from(cbs).every(function(cb) { return cb.checked; });
                cbs.forEach(function(cb) { cb.checked = !allChecked; });
                self.updateSelectedFiles();
            };
        }

        if (btn) btn.onclick = function() { self.process(); };
    },

    updateSettings: function() {
        var self = this;
        self.settings.watermarkEnabled = document.getElementById('wmEnabled').checked;
        self.settings.watermarkText = document.getElementById('wmText').value;
        self.settings.watermarkPosition = document.getElementById('wmPosition').value;
        self.settings.watermarkOpacity = parseInt(document.getElementById('wmOpacity').value) / 100;
        self.settings.watermarkSize = parseInt(document.getElementById('wmSize').value);
        self.settings.watermarkColor = document.getElementById('wmColor').value;
        self.settings.quality = parseInt(document.getElementById('quality').value);
        self.settings.maxWidth = parseInt(document.getElementById('maxWidth').value) || 0;
        self.settings.maxHeight = parseInt(document.getElementById('maxHeight').value) || 0;
        self.settings.addMetadata = document.getElementById('addMetadata').checked;
        self.settings.copyright = document.getElementById('copyrightText').value;
        
        // Update display values
        document.getElementById('wmOpacityVal').textContent = document.getElementById('wmOpacity').value + '%';
        document.getElementById('wmSizeVal').textContent = document.getElementById('wmSize').value + 'px';
    },

    handleFiles: function(fileList) {
        var self = this;
        var newFiles = Array.prototype.slice.call(fileList);
        var rejected = 0;
        
        newFiles.forEach(function(f) {
            if (typeof SECURITY !== 'undefined' && !SECURITY.isValidImage(f).valid) {
                rejected++;
            } else {
                self.files.push(f);
            }
        });
        
        if (rejected > 0) alert(rejected + ' file(s) skipped');
        
        if (this.files.length > 0) {
            document.getElementById('optionsPanel').style.display = 'block';
            this.renderFileList();
            this.loadPreview(this.files[0]);
        }
    },

    loadPreview: function(file) {
        var self = this;
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function() {
            self.previewImg = img;
            document.getElementById('previewPlaceholder').style.display = 'none';
            self.updatePreview();
        };
    },

    updatePreview: function() {
        if (!this.previewImg) return;
        
        var canvas = document.getElementById('previewCanvas');
        var ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        var maxW = 800;
        var scale = Math.min(1, maxW / this.previewImg.width);
        canvas.width = this.previewImg.width * scale;
        canvas.height = this.previewImg.height * scale;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.previewImg, 0, 0, canvas.width, canvas.height);
        
        if (this.settings.watermarkEnabled) {
            this.applyWatermark(ctx, canvas.width, canvas.height, scale);
        }
    },

    applyWatermark: function(ctx, width, height, scale) {
        var text = this.settings.watermarkText;
        var fontSize = this.settings.watermarkSize * scale;
        var opacity = this.settings.watermarkOpacity;
        var position = this.settings.watermarkPosition;
        var color = this.settings.watermarkColor;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = 'bold ' + fontSize + 'px Arial';
        ctx.fillStyle = color;
        ctx.textBaseline = 'bottom';
        
        var metrics = ctx.measureText(text);
        var textWidth = metrics.width;
        var textHeight = fontSize;
        var padding = 10 * scale;
        
        var x, y;
        switch(position) {
            case 'top-left':
                x = padding;
                y = padding + textHeight;
                break;
            case 'top-right':
                x = width - textWidth - padding;
                y = padding + textHeight;
                break;
            case 'bottom-left':
                x = padding;
                y = height - padding;
                break;
            case 'center':
                x = (width - textWidth) / 2;
                y = (height + textHeight) / 2;
                break;
            case 'bottom-right':
            default:
                x = width - textWidth - padding;
                y = height - padding;
        }
        
        // Shadow for better visibility
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(text, x, y);
        ctx.restore();
    },

    updateSelectedFiles: function() {
        var cbs = document.querySelectorAll('.file-cb');
        this.selectedFiles = [];
        var self = this;
        cbs.forEach(function(cb, i) { if(cb.checked && self.files[i]) self.selectedFiles.push(self.files[i]); });
    },

    renderFileList: function() {
        var self = this;
        var list = document.getElementById('fileList');
        var count = document.getElementById('fileCount');
        if (!list) return;
        if (count) count.textContent = this.files.length;
        
        list.innerHTML = this.files.map(function(f, i) {
            return '<div style="padding:6px; margin-bottom:4px; background:var(--bg-primary); border-radius:4px; display:flex; align-items:center; gap:8px;">' +
                '<input type="checkbox" checked class="file-cb" onchange="protectTool.updateSelectedFiles()">' +
                '<span style="flex:1; font-size:0.85em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + f.name + '</span></div>';
        }).join('');
        this.updateSelectedFiles();
    },

    process: function() {
        var self = this;
        var files = this.selectedFiles.length > 0 ? this.selectedFiles : this.files;
        
        if (files.length === 0) { 
            alert('Please upload files first!'); 
            return; 
        }

        var btn = document.getElementById('processBtn');
        if(btn) { btn.disabled = true; btn.textContent = '⏳ Processing...'; }
        
        var resArea = document.getElementById('resultArea');
        if(resArea) resArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden;"><div id="pBar" style="background:var(--primary); height:100%; width:0%;"></div></div><p id="pText" style="text-align:center; margin-top:8px;">Processing...</p></div>';

        if (typeof JSZip === 'undefined') { 
            if(resArea) resArea.innerHTML = '<div style="color:red">JSZip not loaded</div>'; 
            if(btn) { btn.disabled = false; btn.textContent = '🔒 Protect & Download ZIP'; }
            return; 
        }

        var zip = new JSZip();
        var idx = 0;
        var total = files.length;
        var successCount = 0;

        function processNext() {
            if (idx >= total) {
                finishZip();
                return;
            }
            
            var file = files[idx];
            var pBar = document.getElementById('pBar');
            var pText = document.getElementById('pText');
            
            if(pBar) pBar.style.width = ((idx + 1) / total * 100) + '%';
            if(pText) pText.textContent = 'Protecting ' + (idx + 1) + ' of ' + total;
            
            self.protectImage(file)
                .then(function(result) {
                    zip.file(result.name, result.blob);
                    successCount++;
                    idx++;
                    setTimeout(processNext, 10);
                })
                .catch(function(err) {
                    console.error('Error:', err);
                    idx++;
                    setTimeout(processNext, 10);
                });
        }

        function finishZip() {
            if (successCount === 0) {
                if(resArea) resArea.innerHTML = '<div style="color:red; padding:15px;">❌ No files processed</div>';
                if(btn) { btn.disabled = false; btn.textContent = '🔒 Protect & Download ZIP'; }
                return;
            }
            
            if(resArea) resArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden;"><div id="pBar" style="background:var(--primary); height:100%; width:100%;"></div></div><p id="pText" style="text-align:center; margin-top:8px;">Packing ZIP...</p></div>';
            
            zip.generateAsync({type: 'blob', compression: 'DEFLATE'})
                .then(function(content) {
                    var url = URL.createObjectURL(content);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = 'protected_images.zip';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    setTimeout(function() {
                        URL.revokeObjectURL(url);
                    }, 100);
                    
                    if(resArea) {
                        resArea.innerHTML = '<div class="results-success"><h4>✅ Complete!</h4><p>Protected ' + successCount + ' images</p><p style="color:var(--primary); font-weight:600;">📥 ZIP downloaded!</p></div>';
                    }
                    if(btn) { btn.disabled = false; btn.textContent = '🔒 Protect & Download ZIP'; }
                })
                .catch(function(err) {
                    console.error('ZIP error:', err);
                    if(resArea) resArea.innerHTML = '<div style="color:red; padding:15px;">❌ ZIP error</div>';
                    if(btn) { btn.disabled = false; btn.textContent = '🔒 Protect & Download ZIP'; }
                });
        }
        
        processNext();
    },

    protectImage: function(file) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var img = new Image();
            
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                
                // Calculate dimensions
                var width = img.width;
                var height = img.height;
                
                // Resize if needed
                if (self.settings.maxWidth > 0 || self.settings.maxHeight > 0) {
                    var scale = 1;
                    if (self.settings.maxWidth > 0 && width > self.settings.maxWidth) {
                        scale = self.settings.maxWidth / width;
                    }
                    if (self.settings.maxHeight > 0 && height * scale > self.settings.maxHeight) {
                        scale = self.settings.maxHeight / height;
                    }
                    width = Math.floor(width * scale);
                    height = Math.floor(height * scale);
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw image
                ctx.drawImage(img, 0, 0, width, height);
                
                // Apply watermark
                if (self.settings.watermarkEnabled) {
                    self.applyWatermark(ctx, width, height, 1);
                }
                
                // Convert to blob
                canvas.toBlob(function(blob) {
                    if (blob) {
                        var name = 'protected_' + file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                        resolve({ name: name, blob: blob });
                    } else {
                        reject('toBlob failed');
                    }
                }, 'image/jpeg', self.settings.quality / 100);
            };
            
            img.onerror = function() {
                reject('Failed to load image');
            };
            
            try {
                img.src = URL.createObjectURL(file);
            } catch (e) {
                reject('Cannot create URL');
            }
        });
    }
};

// --- 🎬 EXTRACT GIF FRAMES (Professional GIF Tool) ---
var gifExtractTool = {
    name: 'Extract GIFs',
    icon: '🎬',
    files: [],
    selectedFiles: [],
    gifData: null,
    frames: [],
    selectedFrames: [],

    render: function() {
        return '<div class="tool-header">' +
            '<h2>🎬 Extract GIF Frames</h2>' +
            '<p>Extract frames from GIF animations</p>' +
            '</div>' +
            
            '<div class="upload-area" id="toolUpload">' +
            '<input type="file" id="fileInput" accept="image/gif" style="display:none;" />' +
            '<div class="upload-content">' +
            '<span class="upload-icon">📤</span>' +
            '<h3>Drag & drop GIF</h3>' +
            '<p>Supports: GIF files only</p>' +
            '</div>' +
            '</div>' +
            
            '<div class="options-panel" id="optionsPanel" style="display:none;">' +
            
            // GIF Info
            '<div class="option-group" style="margin-bottom:20px;">' +
            '<h3 style="margin-bottom:15px; color:var(--primary);">📊 GIF Information</h3>' +
            '<div id="gifInfo" style="background:var(--bg-secondary); padding:15px; border-radius:8px; display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:10px;">' +
            '<div><strong>Width:</strong> <span id="gifWidth">-</span>px</div>' +
            '<div><strong>Height:</strong> <span id="gifHeight">-</span>px</div>' +
            '<div><strong>Frames:</strong> <span id="gifFrames">-</span></div>' +
            '<div><strong>Duration:</strong> <span id="gifDuration">-</span>s</div>' +
            '</div>' +
            '</div>' +

            // Frame Preview
            '<div class="option-group" style="margin-bottom:20px;">' +
            '<h3 style="margin-bottom:15px; color:var(--primary);">🎞️ Frame Preview</h3>' +
            '<div id="framePreview" style="background:#111; border-radius:8px; padding:15px; text-align:center; min-height:200px;">' +
            '<canvas id="frameCanvas" style="max-width:100%; max-height:400px; border-radius:4px;"></canvas>' +
            '<div id="framePlaceholder" style="color:#888; padding:40px;">Select a frame to preview</div>' +
            '</div>' +
            '<div id="frameControls" style="display:none; margin-top:15px; display:flex; gap:10px; justify-content:center; align-items:center;">' +
            '<button id="prevFrame" style="padding:8px 15px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">◀ Prev</button>' +
            '<span style="font-weight:600;">Frame <span id="currentFrame">0</span> of <span id="totalFrames">0</span></span>' +
            '<button id="nextFrame" style="padding:8px 15px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">Next ▶</button>' +
            '</div>' +
            '</div>' +

            // Export Options
            '<div class="option-group" style="margin-bottom:20px;">' +
            '<h3 style="margin-bottom:15px; color:var(--primary);">📥 Export Options</h3>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">Format:</label>' +
            '<select id="exportFormat" style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border-color);">' +
            '<option value="png">PNG (Best Quality)</option>' +
            '<option value="jpg">JPEG (Smaller Size)</option>' +
            '<option value="webp">WebP (Modern)</option>' +
            '</select>' +
            '</div>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">Quality: <span id="exportQualityVal">90%</span></label>' +
            '<input type="range" id="exportQuality" min="10" max="100" value="90" style="width:100%;" />' +
            '</div>' +
            
            '<div style="margin-bottom:12px;">' +
            '<label style="display:flex; align-items:center; gap:10px; cursor:pointer;">' +
            '<input type="checkbox" id="selectAllFrames" checked style="width:18px; height:18px;" />' +
            '<span style="font-weight:600;">Select All Frames</span>' +
            '</label>' +
            '</div>' +
            '</div>' +

            // Frame List
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
            '<label style="font-weight:600;">🎞️ Frames (<span id="frameCount">0</span>):</label>' +
            '<button id="selectVisibleFrames" style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.85em;">Select Visible</button>' +
            '</div>' +
            '<div id="frameList" style="max-height:200px; overflow-y:auto; background:var(--bg-secondary); border-radius:6px; padding:5px;"></div>' +
            '</div>' +
            
            '<button class="btn-primary btn-large" id="exportBtn" style="width:100%;">📥 Export Frames as ZIP</button>' +
            '</div>' +
            '<div id="resultArea"></div>';
    },

    init: function() {
        var self = this;
        var upload = document.getElementById('toolUpload');
        var input = document.getElementById('fileInput');
        var btn = document.getElementById('exportBtn');

        if (!upload || !input) return;

        // Upload handlers
        upload.onclick = function() { input.click(); };
        input.onchange = function(e) { self.handleFiles(e.target.files); };
        upload.ondragover = function(e) { e.preventDefault(); upload.classList.add('dragover'); };
        upload.ondragleave = function() { upload.classList.remove('dragover'); };
        upload.ondrop = function(e) { e.preventDefault(); upload.classList.remove('dragover'); self.handleFiles(e.dataTransfer.files); };

        // Frame controls
        var prevBtn = document.getElementById('prevFrame');
        var nextBtn = document.getElementById('nextFrame');
        if (prevBtn) prevBtn.onclick = function() { self.prevFrame(); };
        if (nextBtn) nextBtn.onclick = function() { self.nextFrame(); };

        // Export quality
        var qualityInput = document.getElementById('exportQuality');
        if (qualityInput) {
            qualityInput.oninput = function() {
                document.getElementById('exportQualityVal').textContent = this.value + '%';
            };
        }

        // Select all frames
        var selectAll = document.getElementById('selectAllFrames');
        if (selectAll) {
            selectAll.onchange = function() {
                var checkboxes = document.querySelectorAll('.frame-cb');
                checkboxes.forEach(function(cb) { cb.checked = selectAll.checked; });
                self.updateSelectedFrames();
            };
        }

        // Export button
        if (btn) btn.onclick = function() { self.exportFrames(); };
    },

    handleFiles: function(fileList) {
        var self = this;
        var file = fileList[0];
        
        if (!file) return;
        
        // Check if GIF
        if (file.type !== 'image/gif' && !file.name.toLowerCase().endsWith('.gif')) {
            alert('Please upload a GIF file!');
            return;
        }
        
        if (typeof SECURITY !== 'undefined') {
            var check = SECURITY.isValidImage(file);
            if (!check.valid) {
                alert('Invalid file: ' + check.reason);
                return;
            }
        }
        
        this.files = [file];
        this.loadGIF(file);
    },

    loadGIF: function(file) {
        var self = this;
        var url = URL.createObjectURL(file);
        
        // Create image to get basic info
        var img = new Image();
        img.onload = function() {
            self.gifData = {
                width: img.width,
                height: img.height,
                file: file
            };
            
            // Update info
            document.getElementById('gifWidth').textContent = img.width;
            document.getElementById('gifHeight').textContent = img.height;
            document.getElementById('gifFrames').textContent = '1'; // Will update with actual frames
            document.getElementById('gifDuration').textContent = '-';
            
            // For now, treat as single frame
            self.frames = [{
                index: 0,
                canvas: self.createFrameCanvas(img),
                duration: 0
            }];
            
            self.selectedFrames = [0];
            self.currentFrameIndex = 0;
            
            document.getElementById('optionsPanel').style.display = 'block';
            self.renderFrameList();
            self.showFrame(0);
            
            URL.revokeObjectURL(url);
        };
        img.src = url;
    },

    createFrameCanvas: function(img) {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return canvas;
    },

    renderFrameList: function() {
        var self = this;
        var list = document.getElementById('frameList');
        var count = document.getElementById('frameCount');
        if (!list) return;
        if (count) count.textContent = this.frames.length;
        
        list.innerHTML = this.frames.map(function(frame, i) {
            return '<div style="padding:6px; margin-bottom:4px; background:var(--bg-primary); border-radius:4px; display:flex; align-items:center; gap:8px;">' +
                '<input type="checkbox" class="frame-cb" ' + (self.selectedFrames.indexOf(i) >= 0 ? 'checked' : '') + ' onchange="gifExtractTool.updateSelectedFrames()" data-index="' + i + '">' +
                '<span style="flex:1; font-size:0.85em;">Frame ' + (i + 1) + '</span>' +
                '<span style="font-size:0.75em; color:var(--text-secondary);">' + (frame.duration / 1000).toFixed(2) + 's</span>' +
                '</div>';
        }).join('');
    },

    updateSelectedFrames: function() {
        var checkboxes = document.querySelectorAll('.frame-cb');
        this.selectedFrames = [];
        checkboxes.forEach(function(cb) {
            if (cb.checked) {
                this.selectedFrames.push(parseInt(cb.getAttribute('data-index')));
            }
        }, this);
    },

    showFrame: function(index) {
        if (index < 0 || index >= this.frames.length) return;
        
        this.currentFrameIndex = index;
        var frame = this.frames[index];
        
        var canvas = document.getElementById('frameCanvas');
        var placeholder = document.getElementById('framePlaceholder');
        var controls = document.getElementById('frameControls');
        
        if (canvas && frame.canvas) {
            canvas.width = frame.canvas.width;
            canvas.height = frame.canvas.height;
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(frame.canvas, 0, 0);
            
            if (placeholder) placeholder.style.display = 'none';
            if (controls) controls.style.display = 'flex';
            
            document.getElementById('currentFrame').textContent = index + 1;
            document.getElementById('totalFrames').textContent = this.frames.length;
        }
    },

    prevFrame: function() {
        if (this.currentFrameIndex > 0) {
            this.showFrame(this.currentFrameIndex - 1);
        }
    },

    nextFrame: function() {
        if (this.currentFrameIndex < this.frames.length - 1) {
            this.showFrame(this.currentFrameIndex + 1);
        }
    },

    exportFrames: function() {
        var self = this;
        
        if (this.selectedFrames.length === 0) {
            alert('Please select at least one frame!');
            return;
        }
        
        var btn = document.getElementById('exportBtn');
        if(btn) { btn.disabled = true; btn.textContent = '⏳ Exporting...'; }
        
        var resArea = document.getElementById('resultArea');
        if(resArea) resArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden;"><div id="pBar" style="background:var(--primary); height:100%; width:0%;"></div></div><p id="pText" style="text-align:center; margin-top:8px;">Exporting...</p></div>';

        if (typeof JSZip === 'undefined') { 
            if(resArea) resArea.innerHTML = '<div style="color:red">JSZip not loaded</div>'; 
            if(btn) { btn.disabled = false; btn.textContent = '📥 Export Frames as ZIP'; }
            return; 
        }

        var zip = new JSZip();
        var format = document.getElementById('exportFormat').value;
        var quality = parseInt(document.getElementById('exportQuality').value) / 100;
        var idx = 0;
        var total = this.selectedFrames.length;

        function exportNext() {
            if (idx >= total) {
                finishZip();
                return;
            }
            
            var frameIndex = self.selectedFrames[idx];
            var frame = self.frames[frameIndex];
            var pBar = document.getElementById('pBar');
            var pText = document.getElementById('pText');
            
            if(pBar) pBar.style.width = ((idx + 1) / total * 100) + '%';
            if(pText) pText.textContent = 'Exporting frame ' + (idx + 1) + ' of ' + total;
            
            // Export frame
            var mimeType = 'image/' + format;
            var extension = format;
            
            frame.canvas.toBlob(function(blob) {
                if (blob) {
                    var fileName = 'frame_' + String(frameIndex + 1).padStart(4, '0') + '.' + extension;
                    zip.file(fileName, blob);
                }
                idx++;
                setTimeout(exportNext, 10);
            }, mimeType, quality);
        }

        function finishZip() {
            if(resArea) resArea.innerHTML = '<div style="margin:20px 0;"><div style="background:var(--bg-secondary); border-radius:10px; height:24px; overflow:hidden;"><div id="pBar" style="background:var(--primary); height:100%; width:100%;"></div></div><p id="pText" style="text-align:center; margin-top:8px;">Packing ZIP...</p></div>';
            
            zip.generateAsync({type: 'blob', compression: 'DEFLATE'})
                .then(function(content) {
                    var url = URL.createObjectURL(content);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = 'gif_frames.zip';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    setTimeout(function() {
                        URL.revokeObjectURL(url);
                    }, 100);
                    
                    if(resArea) {
                        resArea.innerHTML = '<div class="results-success"><h4>✅ Complete!</h4><p>Exported ' + total + ' frames</p><p style="color:var(--primary); font-weight:600;">📥 ZIP downloaded!</p></div>';
                    }
                    if(btn) { btn.disabled = false; btn.textContent = '📥 Export Frames as ZIP'; }
                })
                .catch(function(err) {
                    console.error('ZIP error:', err);
                    if(resArea) resArea.innerHTML = '<div style="color:red; padding:15px;">❌ ZIP error</div>';
                    if(btn) { btn.disabled = false; btn.textContent = '📥 Export Frames as ZIP'; }
                });
        }
        
        exportNext();
    }
};

// --- 🔤 FONT GENERATOR (Pro: 50 Fonts + Canvas Presets 360-6K) ---
var fontGeneratorTool = {
    name: 'Font Generator',
    icon: '🔤',
    
    // Canvas Size Presets
    presets: [
        // Social Media
        { name: '📱 Instagram Post (1080×1080)', w: 1080, h: 1080 },
        { name: '📱 Instagram Story (1080×1920)', w: 1080, h: 1920 },
        { name: '📘 Facebook Post (1200×630)', w: 1200, h: 630 },
        { name: '🐦 Twitter Post (1200×675)', w: 1200, h: 675 },
        { name: '📌 Pinterest Pin (1000×1500)', w: 1000, h: 1500 },
        
        // Video
        { name: '🎬 YouTube Thumbnail (1280×720)', w: 1280, h: 720 },
        { name: '🎥 YouTube Video (1920×1080)', w: 1920, h: 1080 },
        { name: '🎞️ TikTok (1080×1920)', w: 1080, h: 1920 },
        
        // Web
        { name: '️ Web Banner (1920×400)', w: 1920, h: 400 },
        { name: '📱 Mobile Banner (750×200)', w: 750, h: 200 },
        
        // Small (360px+)
        { name: '📲 Small Square (360×360)', w: 360, h: 360 },
        { name: '📲 Small Portrait (360×640)', w: 360, h: 640 },
        { name: '📲 Small Landscape (640×360)', w: 640, h: 360 },
        
        // Medium
        { name: '💻 HD (1280×720)', w: 1280, h: 720 },
        { name: '💻 Full HD (1920×1080)', w: 1920, h: 1080 },
        
        // Large (2K-6K)
        { name: '🖼️ 2K (2560×1440)', w: 2560, h: 1440 },
        { name: '🖼️ 4K (3840×2160)', w: 3840, h: 2160 },
        { name: '🖼️ 5K (5120×2880)', w: 5120, h: 2880 },
        { name: '🖼️ 6K (6144×3456)', w: 6144, h: 3456 },
        
        // Custom
        { name: '⚙️ Custom (Manual)', w: 0, h: 0 }
    ],
    
    // 50 Premium Google Fonts
    fonts: [
        'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Raleway', 'Playfair Display', 
        'Merriweather', 'Pacifico', 'Oswald', 'Ubuntu', 'Nunito', 'PT Sans', 'Rubik', 'Fira Sans', 
        'Work Sans', 'Inter', 'Quicksand', 'Arvo', 'Lora', 'Cormorant Garamond', 'Inconsolata', 
        'Dosis', 'Yanone Kaffeesatz', 'Bitter', 'Bree Serif', 'Cabin', 'Josefin Sans', 'Lobster', 
        'Montserrat Alternates', 'Nunito Sans', 'Patua One', 'Philosopher', 'Roboto Condensed', 
        'Roboto Slab', 'Satisfy', 'Share Tech Mono', 'Sigmar One', 'Slabo 27px', 'Source Sans Pro', 
        'Space Mono', 'Tenor Sans', 'Ubuntu Condensed', 'Varela Round', 'Vollkorn', 'Zilla Slab',
        'Barlow', 'Chivo', 'Exo 2', 'Heebo'
    ],

    render: function() {
        return '<div class="tool-header">' +
            '<h2>🔤 Font Generator</h2>' +
            '<p>Create beautiful text graphics with 50+ fonts & presets</p>' +
            '</div>' +
            
            '<div class="options-panel" style="display:block; margin-top: 20px;">' +
            
            // Canvas Size Presets
            '<div class="option-group" style="margin-bottom:15px; background:var(--bg-secondary); padding:15px; border-radius:8px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:8px;">📐 Canvas Size:</label>' +
            '<select id="canvasPreset" style="width:100%; padding:10px; margin-bottom:10px; border-radius:6px; border:1px solid var(--border-color); font-size:1em;">' +
            '<option value="custom">⚙️ Custom Size...</option>' +
            '</select>' +
            
            '<div class="grid-2" style="display:flex; gap:10px;">' +
            '<div style="flex:1;">' +
            '<label style="font-size:0.85em; color:var(--text-secondary);">Width (px)</label>' +
            '<input type="number" id="canvasWidth" value="1080" min="100" max="8192" style="width:100%; padding:8px; border-radius:4px; border:1px solid var(--border-color);">' +
            '</div>' +
            '<div style="flex:1;">' +
            '<label style="font-size:0.85em; color:var(--text-secondary);">Height (px)</label>' +
            '<input type="number" id="canvasHeight" value="1080" min="100" max="8192" style="width:100%; padding:8px; border-radius:4px; border:1px solid var(--border-color);">' +
            '</div>' +
            '</div>' +
            '</div>' +
            
            // Text Input
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">📝 Text:</label>' +
            '<textarea id="genText" rows="3" style="width:100%; padding:10px; margin-top:5px; border-radius:6px; border:1px solid var(--border-color); font-size:1.1em;">HELLO WORLD</textarea>' +
            '</div>' +

            // Font Selection
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">🔤 Font Family (50+):</label>' +
            '<select id="genFont" style="width:100%; padding:10px; margin-top:5px; border-radius:6px; border:1px solid var(--border-color); font-size:1.1em;"></select>' +
            '</div>' +

            // Size & Alignment
            '<div class="grid-2" style="display:flex; gap:15px; margin-bottom:15px;">' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">📏 Font Size: <span id="genSizeVal">80px</span></label>' +
            '<input type="range" id="genSize" min="10" max="500" value="80" style="width:100%; margin-top:5px;" />' +
            '</div>' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">📐 Alignment:</label>' +
            '<select id="genAlign" style="width:100%; padding:8px; margin-top:5px; border-radius:6px; border:1px solid var(--border-color);">' +
            '<option value="left">Left</option>' +
            '<option value="center" selected>Center</option>' +
            '<option value="right">Right</option>' +
            '</select>' +
            '</div>' +
            '</div>' +

            // Colors
            '<div class="grid-2" style="display:flex; gap:15px; margin-bottom:15px;">' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">🎨 Text Color:</label>' +
            '<input type="color" id="genColor" value="#ffffff" style="width:100%; height:40px; margin-top:5px; border:none; border-radius:6px;" />' +
            '</div>' +
            '<div class="option-group" style="flex:1;">' +
            '<label style="font-weight:600;">🖼️ Background:</label>' +
            '<input type="color" id="genBgColor" value="#6366f1" style="width:100%; height:40px; margin-top:5px; border:none; border-radius:6px;" />' +
            '<label style="display:flex; align-items:center; gap:5px; margin-top:5px; font-size:0.9em;"><input type="checkbox" id="genTransparent"> Transparent</label>' +
            '</div>' +
            '</div>' +

            // Advanced: Stroke
            '<div class="option-group" style="margin-bottom:15px; background:var(--bg-secondary); padding:10px; border-radius:8px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">✏️ Outline (Stroke):</label>' +
            '<div class="grid-2" style="display:flex; gap:10px;">' +
            '<div style="flex:1;"><input type="number" id="genStrokeWidth" value="0" min="0" max="20" style="width:100%; padding:5px; border-radius:4px; border:1px solid var(--border-color);" placeholder="Width"></div>' +
            '<div style="flex:1;"><input type="color" id="genStrokeColor" value="#000000" style="width:100%; height:30px; border:none;"></div>' +
            '</div>' +
            '</div>' +

            // Advanced: Shadow
            '<div class="option-group" style="margin-bottom:15px; background:var(--bg-secondary); padding:10px; border-radius:8px;">' +
            '<label style="font-weight:600; display:block; margin-bottom:5px;">🌑 Text Shadow:</label>' +
            '<div class="grid-2" style="display:flex; gap:10px;">' +
            '<div style="flex:1;"><input type="number" id="genShadowBlur" value="0" min="0" max="50" style="width:100%; padding:5px; border-radius:4px; border:1px solid var(--border-color);" placeholder="Blur"></div>' +
            '<div style="flex:1;"><input type="color" id="genShadowColor" value="#000000" style="width:100%; height:30px; border:none;"></div>' +
            '</div>' +
            '</div>' +

            // Letter Spacing
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">↔️ Letter Spacing: <span id="genSpacingVal">0px</span></label>' +
            '<input type="range" id="genSpacing" min="-5" max="50" value="0" style="width:100%; margin-top:5px;" />' +
            '</div>' +

            // Preview Canvas
            '<div class="option-group" style="margin-bottom:15px;">' +
            '<label style="font-weight:600;">👁️ Live Preview:</label>' +
            '<div id="canvasWrapper" style="margin-top:10px; background:var(--bg-secondary); border-radius:8px; overflow:auto; text-align:center; padding:15px; max-height:600px;">' +
            '<canvas id="genCanvas" style="box-shadow:0 4px 10px rgba(0,0,0,0.2); max-width:100%;"></canvas>' +
            '</div>' +
            '</div>' +
            
            '<button class="btn-primary btn-large" id="downloadBtn" style="width:100%;">📥 Download PNG</button>' +
            '</div>' +
            '<div id="resultArea"></div>';
    },

    init: function() {
        var self = this;
        
        // Populate Canvas Presets
        var presetSelect = document.getElementById('canvasPreset');
        if (presetSelect) {
            self.presets.forEach(function(preset, index) {
                var opt = document.createElement('option');
                opt.value = index;
                opt.textContent = preset.name;
                presetSelect.appendChild(opt);
            });
            
            presetSelect.onchange = function() {
                var idx = parseInt(this.value);
                var preset = self.presets[idx];
                if (preset && preset.w > 0) {
                    document.getElementById('canvasWidth').value = preset.w;
                    document.getElementById('canvasHeight').value = preset.h;
                    self.draw();
                }
            };
        }
        
        // Manual size inputs
        var widthInput = document.getElementById('canvasWidth');
        var heightInput = document.getElementById('canvasHeight');
        if (widthInput) widthInput.onchange = function() { self.draw(); };
        if (heightInput) heightInput.onchange = function() { self.draw(); };

        // Populate 50 Fonts
        var select = document.getElementById('genFont');
        if (select) {
            this.fonts.forEach(function(f) {
                var opt = document.createElement('option');
                opt.value = f;
                opt.textContent = f;
                if (f === 'Montserrat') opt.selected = true;
                select.appendChild(opt);
            });
        }

        // Load Google Fonts
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=' + this.fonts.join(':wght@400;700&family=') + ':wght@400;700&display=swap';
        document.head.appendChild(link);

        // Bind Inputs
        var inputs = ['genText', 'genFont', 'genSize', 'genAlign', 'genColor', 'genBgColor', 'genStrokeWidth', 'genStrokeColor', 'genShadowBlur', 'genShadowColor', 'genSpacing'];
        var checkboxes = ['genTransparent'];

        inputs.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.oninput = el.onchange = function() {
                    if (id === 'genSize') document.getElementById('genSizeVal').textContent = this.value + 'px';
                    if (id === 'genSpacing') document.getElementById('genSpacingVal').textContent = this.value + 'px';
                    self.draw();
                };
            }
        });

        checkboxes.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.onchange = function() { self.draw(); };
        });

        document.getElementById('downloadBtn').onclick = function() { self.download(); };
        
        // Initial draw
        setTimeout(function() { self.draw(); }, 500);
    },

    draw: function() {
        var canvas = document.getElementById('genCanvas');
        var ctx = canvas.getContext('2d');
        if (!canvas || !ctx) return;

        // Get Canvas Size
        var width = parseInt(document.getElementById('canvasWidth').value) || 1080;
        var height = parseInt(document.getElementById('canvasHeight').value) || 1080;
        
        canvas.width = width;
        canvas.height = height;

        // Get Values
        var text = document.getElementById('genText').value;
        var font = document.getElementById('genFont').value;
        var size = parseInt(document.getElementById('genSize').value);
        var align = document.getElementById('genAlign').value;
        var color = document.getElementById('genColor').value;
        var bgColor = document.getElementById('genBgColor').value;
        var transparent = document.getElementById('genTransparent').checked;
        var strokeW = parseInt(document.getElementById('genStrokeWidth').value) || 0;
        var strokeC = document.getElementById('genStrokeColor').value;
        var shadowBlur = parseInt(document.getElementById('genShadowBlur').value) || 0;
        var shadowC = document.getElementById('genShadowColor').value;
        var spacing = parseInt(document.getElementById('genSpacing').value);

        // Draw Background
        if (!transparent) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            // Checkerboard for transparent
            var pattern = this.createCheckerboard(ctx, canvas.width, canvas.height);
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Text Settings
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        ctx.font = 'bold ' + size + 'px "' + font + '", sans-serif';
        ctx.fillStyle = color;
        
        // Shadow
        if (shadowBlur > 0) {
            ctx.shadowColor = shadowC;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        // Position
        var x = 20;
        if (align === 'center') x = canvas.width / 2;
        if (align === 'right') x = canvas.width - 20;
        var y = canvas.height / 2;

        // Handle new lines
        var lines = text.split('\n');
        var lineHeight = size * 1.2;
        var startY = y - ((lines.length - 1) * lineHeight) / 2;

        // Letter Spacing
        if (spacing !== 0) {
            ctx.letterSpacing = spacing + 'px';
        }

        // Draw Lines
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var lineY = startY + (i * lineHeight);

            // Stroke
            if (strokeW > 0) {
                ctx.strokeStyle = strokeC;
                ctx.lineWidth = strokeW;
                ctx.lineJoin = 'round';
                ctx.strokeText(line, x, lineY);
            }

            ctx.fillText(line, x, lineY);
        }
    },
    
    createCheckerboard: function(ctx, width, height) {
        var patternCanvas = document.createElement('canvas');
        patternCanvas.width = 20;
        patternCanvas.height = 20;
        var patternCtx = patternCanvas.getContext('2d');
        patternCtx.fillStyle = '#e0e0e0';
        patternCtx.fillRect(0, 0, 20, 20);
        patternCtx.fillStyle = '#f0f0f0';
        patternCtx.fillRect(0, 0, 10, 10);
        patternCtx.fillRect(10, 10, 10, 10);
        return ctx.createPattern(patternCanvas, 'repeat');
    },

    download: function() {
        var canvas = document.getElementById('genCanvas');
        var width = parseInt(document.getElementById('canvasWidth').value) || 1080;
        var height = parseInt(document.getElementById('canvasHeight').value) || 1080;
        
        var url = canvas.toDataURL('image/png');
        var a = document.createElement('a');
        a.href = url;
        a.download = 'pixelcraft_font_' + width + 'x' + height + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

// ============================================
// 📋 ГОЛОВНЕ МЕНЮ (Всі 15 інструментів)
// ============================================
const tools = {
    rename: smartRenamerTool,
    compress: compressTool,
    convert: converterTool,
    resize: resizerTool,
    corners: cornersTool,
    watermark: watermarkTool,
    faces: hideFacesTool,
    video: videoTool,
    blur: blurTool,
    crop: cropTool,
    rotate: rotateTool,
    faceExtract: faceExtractTool,
    protect: protectTool,
    gif: gifExtractTool,
    font: fontGeneratorTool
};
