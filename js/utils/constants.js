// AI Playbook 應用程式常數定義

// 應用程式配置
const APP_CONFIG = {
    name: 'AI Playbook',
    version: '1.0.0',
    author: '數位發展部',

    // 聊天配置
    chat: {
        maxMessages: 1000,
        typingDelay: 1000,
        responseDelay: 1500,
        maxInputLength: 2000
    },

    // 編輯器配置
    editor: {
        autoSave: true,
        autoSaveInterval: 30000, // 30秒
        maxUndoSteps: 50,
        syncDelay: 500 // 同步延遲
    },

    // 檔案配置
    file: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['.pdf', '.doc', '.docx', '.txt'],
        uploadTimeout: 30000
    }
};

// 訊息類型
const MESSAGE_TYPES = {
    USER: 'user',
    AI: 'ai',
    SYSTEM: 'system',
    ERROR: 'error',
    SUCCESS: 'success'
};

// 引導按鈕動作
const GUIDANCE_ACTIONS = {
    UPLOAD: 'upload',
    USER_CENTERED: 'userCentered',
    LEGAL: 'legal',
    IMPACT: 'impact',
    EXPERT: 'expert'
};

// 通知類型
const NOTIFICATION_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
};

// 編輯器狀態
const EDITOR_STATES = {
    LOADING: 'loading',
    READY: 'ready',
    SYNCING: 'syncing',
    ERROR: 'error'
};

// 同步狀態
const SYNC_STATES = {
    SYNCED: 'synced',
    SYNCING: 'syncing',
    ERROR: 'error',
    PENDING: 'pending'
};

// RFP 章節
const RFP_SECTIONS = {
    OVERVIEW: 'overview',
    REQUIREMENTS: 'requirements',
    TECHNICAL: 'technical',
    BENEFITS: 'benefits',
    TIMELINE: 'timeline',
    BUDGET: 'budget',
    EVALUATION: 'evaluation',
    LEGAL: 'legal'
};

// 專家類型
const EXPERT_TYPES = {
    TECHNICAL: 'technical',
    LEGAL: 'legal',
    BUSINESS: 'business'
};

// 事件類型
const EVENT_TYPES = {
    // 聊天事件
    CHAT_MESSAGE_SENT: 'chat:message:sent',
    CHAT_MESSAGE_RECEIVED: 'chat:message:received',
    CHAT_TYPING_START: 'chat:typing:start',
    CHAT_TYPING_END: 'chat:typing:end',
    CHAT_CLEAR: 'chat:clear',

    // 編輯器事件
    EDITOR_READY: 'editor:ready',
    EDITOR_CONTENT_CHANGED: 'editor:content:changed',
    EDITOR_SAVE: 'editor:save',
    EDITOR_LOAD_TEMPLATE: 'editor:load:template',

    // 同步事件
    SYNC_START: 'sync:start',
    SYNC_COMPLETE: 'sync:complete',
    SYNC_ERROR: 'sync:error',

    // 引導按鈕事件
    GUIDANCE_UPLOAD: 'guidance:upload',
    GUIDANCE_USER_CENTERED: 'guidance:userCentered',
    GUIDANCE_LEGAL: 'guidance:legal',
    GUIDANCE_IMPACT: 'guidance:impact',
    GUIDANCE_EXPERT: 'guidance:expert',

    // 檔案事件
    FILE_UPLOAD_START: 'file:upload:start',
    FILE_UPLOAD_PROGRESS: 'file:upload:progress',
    FILE_UPLOAD_COMPLETE: 'file:upload:complete',
    FILE_UPLOAD_ERROR: 'file:upload:error',

    // 通知事件
    NOTIFICATION_SHOW: 'notification:show',
    NOTIFICATION_HIDE: 'notification:hide'
};

// API 端點（模擬用）
const API_ENDPOINTS = {
    CHAT: '/api/chat',
    UPLOAD: '/api/upload',
    SAVE: '/api/save',
    EXPORT: '/api/export',
    TEMPLATES: '/api/templates'
};

// 錯誤訊息
const ERROR_MESSAGES = {
    NETWORK_ERROR: '網路連線錯誤，請檢查您的網路連線',
    FILE_TOO_LARGE: '檔案大小超過限制（最大 10MB）',
    FILE_TYPE_NOT_SUPPORTED: '不支援的檔案類型',
    UPLOAD_FAILED: '檔案上傳失敗，請重試',
    SAVE_FAILED: '儲存失敗，請重試',
    EDITOR_LOAD_FAILED: '編輯器載入失敗',
    CHAT_ERROR: '聊天服務暫時無法使用',
    SYNC_ERROR: '同步失敗，請檢查網路連線'
};

// 成功訊息
const SUCCESS_MESSAGES = {
    FILE_UPLOADED: '檔案上傳成功',
    CONTENT_SAVED: '內容已儲存',
    TEMPLATE_LOADED: '範本載入成功',
    EXPORT_COMPLETE: '文件匯出完成',
    SYNC_COMPLETE: '同步完成'
};

// 預設設定
const DEFAULT_SETTINGS = {
    theme: 'light',
    language: 'zh-TW',
    autoSave: true,
    notifications: true,
    soundEnabled: false,
    fontSize: 'medium',
    editorMode: 'wysiwyg'
};

// 鍵盤快捷鍵
const KEYBOARD_SHORTCUTS = {
    SEND_MESSAGE: 'Enter',
    NEW_LINE: 'Shift+Enter',
    SAVE: 'Ctrl+S',
    UNDO: 'Ctrl+Z',
    REDO: 'Ctrl+Y',
    EXPORT: 'Ctrl+E',
    CLEAR_CHAT: 'Ctrl+L'
};

// 動畫持續時間
const ANIMATION_DURATIONS = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    NOTIFICATION: 3000,
    TYPING_INDICATOR: 1000
};

// 本地儲存鍵值
const STORAGE_KEYS = {
    CHAT_HISTORY: 'ai_playbook_chat_history',
    EDITOR_CONTENT: 'ai_playbook_editor_content',
    USER_SETTINGS: 'ai_playbook_user_settings',
    LAST_SAVE: 'ai_playbook_last_save',
    SESSION_ID: 'ai_playbook_session_id'
};

// 正規表達式
const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[\+]?[0-9\-\(\)\s]+$/,
    URL: /^https?:\/\/.+/,
    CHINESE: /[\u4e00-\u9fff]/,
    ENGLISH: /[a-zA-Z]/,
    NUMBER: /^\d+$/
};

// 匯出所有常數
if (typeof module !== 'undefined' && module.exports) {
    // Node.js 環境
    module.exports = {
        APP_CONFIG,
        MESSAGE_TYPES,
        GUIDANCE_ACTIONS,
        NOTIFICATION_TYPES,
        EDITOR_STATES,
        SYNC_STATES,
        RFP_SECTIONS,
        EXPERT_TYPES,
        EVENT_TYPES,
        API_ENDPOINTS,
        ERROR_MESSAGES,
        SUCCESS_MESSAGES,
        DEFAULT_SETTINGS,
        KEYBOARD_SHORTCUTS,
        ANIMATION_DURATIONS,
        STORAGE_KEYS,
        REGEX_PATTERNS
    };
} else {
    // 瀏覽器環境
    window.APP_CONFIG = APP_CONFIG;
    window.MESSAGE_TYPES = MESSAGE_TYPES;
    window.GUIDANCE_ACTIONS = GUIDANCE_ACTIONS;
    window.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
    window.EDITOR_STATES = EDITOR_STATES;
    window.SYNC_STATES = SYNC_STATES;
    window.RFP_SECTIONS = RFP_SECTIONS;
    window.EXPERT_TYPES = EXPERT_TYPES;
    window.EVENT_TYPES = EVENT_TYPES;
    window.API_ENDPOINTS = API_ENDPOINTS;
    window.ERROR_MESSAGES = ERROR_MESSAGES;
    window.SUCCESS_MESSAGES = SUCCESS_MESSAGES;
    window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
    window.KEYBOARD_SHORTCUTS = KEYBOARD_SHORTCUTS;
    window.ANIMATION_DURATIONS = ANIMATION_DURATIONS;
    window.STORAGE_KEYS = STORAGE_KEYS;
    window.REGEX_PATTERNS = REGEX_PATTERNS;
} 