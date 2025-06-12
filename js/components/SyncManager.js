// 同步管理器類別
class SyncManager {
    constructor(chatComponent, editorWrapper, syncService) {
        console.log('🔄 初始化同步管理器...');
        this.chatComponent = chatComponent;
        this.editorWrapper = editorWrapper;
        this.syncService = syncService;
        this.isInitialized = true;
        this.isSyncing = false;
        this.syncInterval = null;
        this.lastSyncTime = null;

        console.log('🔄 同步管理器初始化完成');
    }

    /**
     * 開始同步
     */
    startSync() {
        console.log('🔗 開始同步...');
        this.isSyncing = true;

        // 設定定期同步
        this.syncInterval = setInterval(() => {
            this.performSync();
        }, 30000); // 每30秒同步一次

        console.log('🔗 同步已啟動，每30秒執行一次');
    }

    /**
     * 停止同步
     */
    stopSync() {
        console.log('⏹️ 停止同步...');
        this.isSyncing = false;

        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }

        console.log('⏹️ 同步已停止');
    }

    /**
     * 同步內容 - 主要的同步方法
     */
    syncContent(content, source = 'editor') {
        console.log('🔄 同步內容，來源:', source);
        console.log('🔄 內容長度:', content ? content.length : 0);

        if (!content) {
            console.log('🔄 內容為空，跳過同步');
            return;
        }

        try {
            // 根據來源執行不同的同步邏輯
            switch (source) {
                case 'editor':
                    this.syncFromEditor(content);
                    break;
                case 'chat':
                    this.syncFromChat(content);
                    break;
                case 'template':
                    this.syncFromTemplate(content);
                    break;
                default:
                    console.log('🔄 未知的同步來源:', source);
            }

            // 更新最後同步時間
            this.lastSyncTime = new Date();
            this.updateSyncStatus('已同步');

            console.log('🔄 內容同步完成');

        } catch (error) {
            console.error('❌ 內容同步失敗:', error);
            this.updateSyncStatus('同步失敗');
        }
    }

    /**
     * 從編輯器同步內容
     */
    syncFromEditor(content) {
        console.log('📝 從編輯器同步內容');

        // 儲存到本地儲存
        if (typeof StorageUtils !== 'undefined') {
            StorageUtils.set('editor_content', content);
            console.log('📝 編輯器內容已儲存到本地');
        }

        // 更新字數統計
        this.updateWordCount(content);

        // 觸發同步事件
        if (typeof EventUtils !== 'undefined') {
            EventUtils.trigger(document, 'editor:content:synced', {
                content: content,
                timestamp: new Date()
            });
        }
    }

    /**
     * 從聊天同步內容
     */
    syncFromChat(content) {
        console.log('💬 從聊天同步內容');

        // 如果編輯器存在，將聊天內容插入編輯器
        if (this.editorWrapper && this.editorWrapper.editor) {
            try {
                const currentContent = this.editorWrapper.getContent();
                const newContent = currentContent + '\n\n' + content;
                this.editorWrapper.setContent(newContent);
                console.log('💬 聊天內容已同步到編輯器');
            } catch (error) {
                console.error('❌ 聊天內容同步到編輯器失敗:', error);
            }
        }
    }

    /**
     * 從範本同步內容
     */
    syncFromTemplate(content) {
        console.log('📄 從範本同步內容');

        // 將範本內容載入編輯器
        if (this.editorWrapper && this.editorWrapper.editor) {
            try {
                this.editorWrapper.setContent(content);
                console.log('📄 範本內容已同步到編輯器');
            } catch (error) {
                console.error('❌ 範本內容同步到編輯器失敗:', error);
            }
        }
    }

    /**
     * 執行同步操作
     */
    performSync() {
        if (!this.isSyncing) {
            return;
        }

        console.log('🔄 執行定期同步...');

        try {
            // 獲取編輯器內容並同步
            if (this.editorWrapper && this.editorWrapper.editor) {
                const content = this.editorWrapper.getContent();
                if (content) {
                    this.syncContent(content, 'editor');
                }
            }

            // 同步聊天記錄
            if (this.chatComponent) {
                const chatHistory = this.chatComponent.getHistory();
                if (chatHistory && chatHistory.length > 0) {
                    if (typeof StorageUtils !== 'undefined') {
                        StorageUtils.set('chat_history', chatHistory);
                        console.log('🔄 聊天記錄已同步');
                    }
                }
            }

        } catch (error) {
            console.error('❌ 定期同步失敗:', error);
            this.updateSyncStatus('同步錯誤');
        }
    }

    /**
     * 更新字數統計
     */
    updateWordCount(content) {
        if (!content) return;

        // 移除 HTML 標籤並計算字數
        const textContent = content.replace(/<[^>]*>/g, '');
        const wordCount = textContent.length;

        // 更新 UI 中的字數顯示
        const wordCountElement = document.getElementById('wordCount');
        if (wordCountElement) {
            wordCountElement.textContent = wordCount;
        }

        console.log('📊 字數統計更新:', wordCount);
    }

    /**
     * 更新同步狀態
     */
    updateSyncStatus(status) {
        console.log('🔄 更新同步狀態:', status);

        // 更新 UI 中的同步狀態
        const syncStatusElement = document.getElementById('syncStatus');
        if (syncStatusElement) {
            syncStatusElement.textContent = status;

            // 根據狀態設定樣式
            syncStatusElement.className = 'status-item sync-status';
            if (status.includes('失敗') || status.includes('錯誤')) {
                syncStatusElement.classList.add('error');
            } else if (status.includes('同步中')) {
                syncStatusElement.classList.add('syncing');
            } else {
                syncStatusElement.classList.add('success');
            }
        }

        // 更新最後更新時間
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement && this.lastSyncTime) {
            const timeString = this.lastSyncTime.toLocaleTimeString('zh-TW');
            lastUpdateElement.textContent = timeString;
        }
    }

    /**
     * 手動觸發同步
     */
    triggerSync(content, source = 'manual') {
        console.log('🔄 手動觸發同步，來源:', source);
        this.updateSyncStatus('同步中...');

        setTimeout(() => {
            this.syncContent(content, source);
        }, 100);
    }

    /**
     * 獲取同步狀態
     */
    getSyncStatus() {
        return {
            isInitialized: this.isInitialized,
            isSyncing: this.isSyncing,
            lastSyncTime: this.lastSyncTime,
            hasInterval: !!this.syncInterval
        };
    }

    /**
     * 重置同步管理器
     */
    reset() {
        console.log('🔄 重置同步管理器...');

        this.stopSync();
        this.lastSyncTime = null;
        this.updateSyncStatus('未同步');

        console.log('🔄 同步管理器已重置');
    }

    /**
     * 銷毀同步管理器
     */
    destroy() {
        console.log('🗑️ 銷毀同步管理器...');

        this.stopSync();
        this.chatComponent = null;
        this.editorWrapper = null;
        this.syncService = null;
        this.isInitialized = false;

        console.log('🗑️ 同步管理器已銷毀');
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyncManager;
} else {
    window.SyncManager = SyncManager;
} 