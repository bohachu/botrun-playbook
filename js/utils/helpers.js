// AI Playbook 工具函數庫

/**
 * 日期時間工具
 */
const DateUtils = {
    /**
     * 格式化時間戳為可讀格式
     * @param {Date|number} timestamp - 時間戳
     * @param {string} format - 格式類型 ('time', 'date', 'datetime', 'relative')
     * @returns {string} 格式化後的時間字串
     */
    formatTime(timestamp, format = 'time') {
        const date = new Date(timestamp);
        const now = new Date();

        switch (format) {
            case 'time':
                return date.toLocaleTimeString('zh-TW', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

            case 'date':
                return date.toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });

            case 'datetime':
                return date.toLocaleString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });

            case 'relative':
                const diff = now - date;
                const seconds = Math.floor(diff / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);

                if (seconds < 60) return '剛剛';
                if (minutes < 60) return `${minutes} 分鐘前`;
                if (hours < 24) return `${hours} 小時前`;
                if (days < 7) return `${days} 天前`;
                return this.formatTime(timestamp, 'date');

            default:
                return date.toLocaleString('zh-TW');
        }
    },

    /**
     * 生成唯一的時間戳 ID
     * @returns {string} 唯一 ID
     */
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};

/**
 * DOM 操作工具
 */
const DOMUtils = {
    /**
     * 安全地獲取 DOM 元素
     * @param {string} selector - CSS 選擇器
     * @param {Element} parent - 父元素（可選）
     * @returns {Element|null} DOM 元素
     */
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },

    /**
     * 獲取多個 DOM 元素
     * @param {string} selector - CSS 選擇器
     * @param {Element} parent - 父元素（可選）
     * @returns {NodeList} DOM 元素列表
     */
    $$(selector, parent = document) {
        return parent.querySelectorAll(selector);
    },

    /**
     * 創建 DOM 元素
     * @param {string} tag - 標籤名
     * @param {Object} attributes - 屬性對象
     * @param {string|Element} content - 內容
     * @returns {Element} 創建的元素
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (content instanceof Element) {
            element.appendChild(content);
        }

        return element;
    },

    /**
     * 添加 CSS 類別
     * @param {Element} element - DOM 元素
     * @param {string|Array} classes - 類別名稱
     */
    addClass(element, classes) {
        if (!element) return;
        const classList = Array.isArray(classes) ? classes : [classes];
        element.classList.add(...classList);
    },

    /**
     * 移除 CSS 類別
     * @param {Element} element - DOM 元素
     * @param {string|Array} classes - 類別名稱
     */
    removeClass(element, classes) {
        if (!element) return;
        const classList = Array.isArray(classes) ? classes : [classes];
        element.classList.remove(...classList);
    },

    /**
     * 切換 CSS 類別
     * @param {Element} element - DOM 元素
     * @param {string} className - 類別名稱
     * @returns {boolean} 是否添加了類別
     */
    toggleClass(element, className) {
        if (!element) return false;
        return element.classList.toggle(className);
    },

    /**
     * 滾動到元素位置
     * @param {Element} element - 目標元素
     * @param {Object} options - 滾動選項
     */
    scrollToElement(element, options = {}) {
        if (!element) return;

        const defaultOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        };

        element.scrollIntoView({ ...defaultOptions, ...options });
    }
};

/**
 * 事件處理工具
 */
const EventUtils = {
    /**
     * 添加事件監聽器
     * @param {Element} element - DOM 元素
     * @param {string} event - 事件類型
     * @param {Function} handler - 事件處理函數
     * @param {Object} options - 選項
     */
    on(element, event, handler, options = {}) {
        if (!element || !event || !handler) return;
        element.addEventListener(event, handler, options);
    },

    /**
     * 移除事件監聽器
     * @param {Element} element - DOM 元素
     * @param {string} event - 事件類型
     * @param {Function} handler - 事件處理函數
     */
    off(element, event, handler) {
        if (!element || !event || !handler) return;
        element.removeEventListener(event, handler);
    },

    /**
     * 觸發自定義事件
     * @param {Element} element - DOM 元素
     * @param {string} eventType - 事件類型
     * @param {Object} detail - 事件詳情
     */
    trigger(element, eventType, detail = {}) {
        if (!element || !eventType) return;

        const event = new CustomEvent(eventType, {
            detail,
            bubbles: true,
            cancelable: true
        });

        element.dispatchEvent(event);
    },

    /**
     * 防抖函數
     * @param {Function} func - 要防抖的函數
     * @param {number} delay - 延遲時間（毫秒）
     * @returns {Function} 防抖後的函數
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * 節流函數
     * @param {Function} func - 要節流的函數
     * @param {number} delay - 延遲時間（毫秒）
     * @returns {Function} 節流後的函數
     */
    throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }
};

/**
 * 本地儲存工具
 */
const StorageUtils = {
    /**
     * 設定本地儲存項目
     * @param {string} key - 鍵值
     * @param {*} value - 值
     * @returns {boolean} 是否成功
     */
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('儲存失敗:', error);
            return false;
        }
    },

    /**
     * 獲取本地儲存項目
     * @param {string} key - 鍵值
     * @param {*} defaultValue - 預設值
     * @returns {*} 儲存的值或預設值
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('讀取失敗:', error);
            return defaultValue;
        }
    },

    /**
     * 移除本地儲存項目
     * @param {string} key - 鍵值
     * @returns {boolean} 是否成功
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('移除失敗:', error);
            return false;
        }
    },

    /**
     * 清空本地儲存
     * @returns {boolean} 是否成功
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('清空失敗:', error);
            return false;
        }
    }
};

/**
 * 字串工具
 */
const StringUtils = {
    /**
     * 截斷字串
     * @param {string} str - 原字串
     * @param {number} length - 最大長度
     * @param {string} suffix - 後綴
     * @returns {string} 截斷後的字串
     */
    truncate(str, length, suffix = '...') {
        if (!str || str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },

    /**
     * 轉換為標題格式
     * @param {string} str - 原字串
     * @returns {string} 標題格式字串
     */
    toTitleCase(str) {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    /**
     * 移除 HTML 標籤
     * @param {string} html - HTML 字串
     * @returns {string} 純文字
     */
    stripHtml(html) {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    },

    /**
     * 計算字數
     * @param {string} text - 文字內容
     * @returns {number} 字數
     */
    countWords(text) {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    },

    /**
     * 生成隨機字串
     * @param {number} length - 長度
     * @returns {string} 隨機字串
     */
    randomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

/**
 * 檔案工具
 */
const FileUtils = {
    /**
     * 格式化檔案大小
     * @param {number} bytes - 位元組數
     * @returns {string} 格式化後的大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * 獲取檔案副檔名
     * @param {string} filename - 檔案名稱
     * @returns {string} 副檔名
     */
    getFileExtension(filename) {
        if (!filename) return '';
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    },

    /**
     * 驗證檔案類型
     * @param {File} file - 檔案對象
     * @param {Array} allowedTypes - 允許的類型
     * @returns {boolean} 是否有效
     */
    validateFileType(file, allowedTypes) {
        if (!file || !allowedTypes) return false;

        const extension = '.' + this.getFileExtension(file.name).toLowerCase();
        return allowedTypes.includes(extension);
    },

    /**
     * 讀取檔案內容
     * @param {File} file - 檔案對象
     * @param {string} readAs - 讀取方式 ('text', 'dataURL', 'arrayBuffer')
     * @returns {Promise} 檔案內容
     */
    readFile(file, readAs = 'text') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);

            switch (readAs) {
                case 'text':
                    reader.readAsText(file);
                    break;
                case 'dataURL':
                    reader.readAsDataURL(file);
                    break;
                case 'arrayBuffer':
                    reader.readAsArrayBuffer(file);
                    break;
                default:
                    reader.readAsText(file);
            }
        });
    }
};

/**
 * 動畫工具
 */
const AnimationUtils = {
    /**
     * 淡入動畫
     * @param {Element} element - DOM 元素
     * @param {number} duration - 持續時間
     * @returns {Promise} 動畫完成 Promise
     */
    fadeIn(element, duration = ANIMATION_DURATIONS.NORMAL) {
        return new Promise((resolve) => {
            element.style.opacity = '0';
            element.style.display = 'block';

            const start = performance.now();

            function animate(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                element.style.opacity = progress;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            }

            requestAnimationFrame(animate);
        });
    },

    /**
     * 淡出動畫
     * @param {Element} element - DOM 元素
     * @param {number} duration - 持續時間
     * @returns {Promise} 動畫完成 Promise
     */
    fadeOut(element, duration = ANIMATION_DURATIONS.NORMAL) {
        return new Promise((resolve) => {
            const start = performance.now();
            const startOpacity = parseFloat(getComputedStyle(element).opacity);

            function animate(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                element.style.opacity = startOpacity * (1 - progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    resolve();
                }
            }

            requestAnimationFrame(animate);
        });
    },

    /**
     * 滑動動畫
     * @param {Element} element - DOM 元素
     * @param {string} direction - 方向 ('up', 'down', 'left', 'right')
     * @param {number} duration - 持續時間
     * @returns {Promise} 動畫完成 Promise
     */
    slide(element, direction = 'down', duration = ANIMATION_DURATIONS.NORMAL) {
        return new Promise((resolve) => {
            const start = performance.now();
            const rect = element.getBoundingClientRect();

            let startX = 0, startY = 0, endX = 0, endY = 0;

            switch (direction) {
                case 'up':
                    startY = rect.height;
                    break;
                case 'down':
                    startY = -rect.height;
                    break;
                case 'left':
                    startX = rect.width;
                    break;
                case 'right':
                    startX = -rect.width;
                    break;
            }

            element.style.transform = `translate(${startX}px, ${startY}px)`;

            function animate(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                const currentX = startX + (endX - startX) * progress;
                const currentY = startY + (endY - startY) * progress;

                element.style.transform = `translate(${currentX}px, ${currentY}px)`;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = '';
                    resolve();
                }
            }

            requestAnimationFrame(animate);
        });
    }
};

// 匯出工具函數
if (typeof module !== 'undefined' && module.exports) {
    // Node.js 環境
    module.exports = {
        DateUtils,
        DOMUtils,
        EventUtils,
        StorageUtils,
        StringUtils,
        FileUtils,
        AnimationUtils
    };
} else {
    // 瀏覽器環境
    window.DateUtils = DateUtils;
    window.DOMUtils = DOMUtils;
    window.EventUtils = EventUtils;
    window.StorageUtils = StorageUtils;
    window.StringUtils = StringUtils;
    window.FileUtils = FileUtils;
    window.AnimationUtils = AnimationUtils;
} 