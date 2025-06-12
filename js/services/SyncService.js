// 同步服務類別
class SyncService {
    constructor() {
        console.log('🔄 初始化同步服務...');
        this.isInitialized = true;
    }

    connect(chatComponent, editorWrapper) {
        console.log('🔗 連接聊天和編輯器同步...');
        this.chatComponent = chatComponent;
        this.editorWrapper = editorWrapper;
    }

    syncChatToEditor(message) {
        console.log('📝 同步聊天到編輯器:', message);
        // 模擬同步邏輯
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyncService;
} else {
    window.SyncService = SyncService;
} 