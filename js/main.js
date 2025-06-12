// AI手冊孵化器主程式
class AIManualIncubator {
    constructor() {
        console.log('🚀 啟動 AI手冊孵化器...');
        this.editor = null;
        this.editorWrapper = null;
        this.chatComponent = null;
        this.guidanceButtons = null;
        this.syncManager = null;
        this.isInitialized = false;

        this.init();
    }

    async init() {
        try {
            console.log('📋 初始化應用程式...');

            // 等待DOM載入完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                await this.initializeComponents();
            }
        } catch (error) {
            console.error('❌ 初始化失敗:', error);
            this.showError('系統初始化失敗，請重新整理頁面');
        }
    }

    async initializeComponents() {
        try {
            // 1. 初始化CKEditor
            await this.initializeEditor();

            // 2. 初始化聊天元件
            this.initializeChatComponent();

            // 3. 初始化引導按鈕
            this.initializeGuidanceButtons();

            // 4. 初始化同步管理器
            this.initializeSyncManager();

            // 5. 載入預設範本
            await this.loadDefaultTemplate();

            // 6. 綁定事件監聽器
            this.bindEventListeners();

            // 7. 顯示歡迎訊息
            this.showWelcomeMessage();

            this.isInitialized = true;
            console.log('✅ AI手冊孵化器初始化完成');

        } catch (error) {
            console.error('❌ 元件初始化失敗:', error);
            this.showError('元件初始化失敗，請重新整理頁面');
        }
    }

    async initializeEditor() {
        console.log('📝 初始化CKEditor...');

        try {
            // 檢查CKEditor是否已載入
            if (typeof ClassicEditor === 'undefined') {
                throw new Error('CKEditor未載入');
            }

            // 創建編輯器實例
            this.editor = await ClassicEditor.create(document.querySelector('#editor'), {
                toolbar: {
                    items: [
                        'heading', '|',
                        'bold', 'italic', 'underline', '|',
                        'bulletedList', 'numberedList', '|',
                        'outdent', 'indent', '|',
                        'blockQuote', 'insertTable', '|',
                        'undo', 'redo', '|',
                        'link', 'imageUpload'
                    ]
                },
                heading: {
                    options: [
                        { model: 'paragraph', title: '段落', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: '標題 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: '標題 2', class: 'ck-heading_heading2' },
                        { model: 'heading3', view: 'h3', title: '標題 3', class: 'ck-heading_heading3' }
                    ]
                },
                language: 'zh',
                placeholder: '開始撰寫您的專案需求建議書...'
            });

            // 創建編輯器包裝器
            this.editorWrapper = new EditorWrapper(this.editor);

            // 監聽編輯器變更事件
            this.editor.model.document.on('change:data', () => {
                this.updateWordCount();
                this.updateLastModified();
                this.triggerSync();
            });

            console.log('✅ CKEditor初始化完成');

        } catch (error) {
            console.error('❌ CKEditor初始化失敗:', error);
            throw error;
        }
    }

    initializeChatComponent() {
        console.log('💬 初始化聊天元件...');

        try {
            // 獲取聊天相關的 DOM 元素
            const messagesContainer = document.getElementById('chatMessages');
            const inputElement = document.getElementById('chatInput');
            const sendButton = document.getElementById('sendBtn');

            console.log('💬 檢查 DOM 元素:', {
                messagesContainer: !!messagesContainer,
                inputElement: !!inputElement,
                sendButton: !!sendButton
            });

            if (!messagesContainer || !inputElement || !sendButton) {
                throw new Error('找不到必要的聊天 DOM 元素');
            }

            this.chatComponent = new ChatComponent(messagesContainer, inputElement, sendButton);
            console.log('✅ 聊天元件初始化完成');
        } catch (error) {
            console.error('❌ 聊天元件初始化失敗:', error);
            throw error;
        }
    }

    initializeGuidanceButtons() {
        console.log('🎯 初始化引導按鈕...');

        try {
            this.guidanceButtons = new GuidanceButtons();
            console.log('✅ 引導按鈕初始化完成');
        } catch (error) {
            console.error('❌ 引導按鈕初始化失敗:', error);
            throw error;
        }
    }

    initializeSyncManager() {
        console.log('🔄 初始化同步管理器...');

        try {
            this.syncManager = new SyncManager(this.chatComponent, this.editorWrapper, null);
            console.log('✅ 同步管理器初始化完成');
        } catch (error) {
            console.error('❌ 同步管理器初始化失敗:', error);
            throw error;
        }
    }

    async loadDefaultTemplate() {
        console.log('📄 載入預設範本...');

        try {
            // 載入法務部全國法規資料庫專案範本
            if (window.rfpTemplates && window.rfpTemplates.lawDatabase) {
                const template = window.rfpTemplates.lawDatabase;
                await this.editorWrapper.setContent(template.content);

                console.log('✅ 法務部範本載入完成');

                // 顯示範本載入通知
                this.showNotification('已載入法務部全國法規資料庫專案需求建議書範本', 'success');
            } else {
                console.warn('⚠️ 找不到法務部範本，載入基礎範本');
                if (window.rfpTemplates && window.rfpTemplates.basic) {
                    await this.editorWrapper.setContent(window.rfpTemplates.basic.content);
                }
            }
        } catch (error) {
            console.error('❌ 範本載入失敗:', error);
            this.showError('範本載入失敗');
        }
    }

    bindEventListeners() {
        console.log('🔗 綁定事件監聽器...');

        // 儲存按鈕
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveProgress());
        }

        // 匯出按鈕
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportDocument());
        }

        // 範本按鈕
        const templateBtn = document.getElementById('templateBtn');
        if (templateBtn) {
            templateBtn.addEventListener('click', () => this.showTemplateSelector());
        }

        // 復原/重做按鈕
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');

        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                this.editor.execute('undo');
            });
        }

        if (redoBtn) {
            redoBtn.addEventListener('click', () => {
                this.editor.execute('redo');
            });
        }

        // 清除對話按鈕
        const clearChatBtn = document.getElementById('clearChatBtn');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                if (this.chatComponent) {
                    this.chatComponent.clearMessages();
                }
            });
        }

        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveProgress();
                        break;
                    case 'z':
                        if (!e.shiftKey) {
                            e.preventDefault();
                            this.editor.execute('undo');
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        this.editor.execute('redo');
                        break;
                }
            }
        });

        console.log('✅ 事件監聽器綁定完成');
    }

    showWelcomeMessage() {
        console.log('👋 顯示歡迎訊息...');

        if (this.chatComponent) {
            // 延遲顯示歡迎訊息，讓使用者看到載入過程
            setTimeout(() => {
                const welcomeMessage = {
                    id: `msg_${Date.now()}`,
                    type: 'ai',
                    content: '歡迎使用 AI手冊孵化器！我是您的 AI孵化器，將協助您撰寫專業的專案需求建議書。請選擇下方的引導功能開始，或直接與我對話描述您的需求。',
                    timestamp: new Date()
                };

                console.log('👋 添加歡迎訊息:', welcomeMessage);
                this.chatComponent.addMessage(welcomeMessage);
            }, 1000);
        }
    }

    updateWordCount() {
        const wordCountElement = document.getElementById('wordCount');
        if (wordCountElement && this.editor) {
            const content = this.editor.getData();
            const textContent = content.replace(/<[^>]*>/g, ''); // 移除HTML標籤
            const wordCount = textContent.length;
            wordCountElement.textContent = wordCount.toLocaleString();
        }
    }

    updateLastModified() {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            const now = new Date();
            lastUpdateElement.textContent = now.toLocaleTimeString();
        }
    }

    triggerSync() {
        if (this.syncManager && this.editor) {
            const content = this.editor.getData();
            this.syncManager.syncContent(content, 'editor');
        }

        // 更新同步狀態指示器
        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.classList.add('syncing');
            setTimeout(() => {
                syncStatus.classList.remove('syncing');
            }, 500);
        }
    }

    async saveProgress() {
        console.log('💾 儲存進度...');

        try {
            const content = await this.editorWrapper.getContent();
            const chatHistory = this.chatComponent ? this.chatComponent.getMessages() : [];

            const saveData = {
                content,
                chatHistory,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };

            // 儲存到本地儲存
            localStorage.setItem('aiManualIncubator_save', JSON.stringify(saveData));

            this.showNotification('進度已儲存', 'success');
            console.log('✅ 進度儲存完成');

        } catch (error) {
            console.error('❌ 儲存失敗:', error);
            this.showError('儲存失敗');
        }
    }

    async loadProgress() {
        console.log('📂 載入進度...');

        try {
            const saveData = localStorage.getItem('aiManualIncubator_save');
            if (saveData) {
                const data = JSON.parse(saveData);

                // 載入編輯器內容
                if (data.content && this.editorWrapper) {
                    await this.editorWrapper.setContent(data.content);
                }

                // 載入聊天歷史
                if (data.chatHistory && this.chatComponent) {
                    this.chatComponent.loadMessages(data.chatHistory);
                }

                this.showNotification('進度已載入', 'success');
                console.log('✅ 進度載入完成');

                return true;
            }
        } catch (error) {
            console.error('❌ 載入失敗:', error);
            this.showError('載入失敗');
        }

        return false;
    }

    exportDocument() {
        console.log('📤 匯出文件...');

        try {
            if (!this.editor) {
                throw new Error('編輯器未初始化');
            }

            const content = this.editor.getData();
            const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `專案需求建議書_${new Date().toISOString().split('T')[0]}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('文件已匯出', 'success');
            console.log('✅ 文件匯出完成');

        } catch (error) {
            console.error('❌ 匯出失敗:', error);
            this.showError('匯出失敗');
        }
    }

    showTemplateSelector() {
        console.log('📋 顯示範本選擇器...');

        // 創建範本選擇對話框
        const modal = document.createElement('div');
        modal.className = 'template-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>選擇範本</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="template-list">
                            <div class="template-item" data-template="lawDatabase">
                                <h4>法務部全國法規資料庫</h4>
                                <p>智慧入口平台專案需求建議書</p>
                            </div>
                            <div class="template-item" data-template="basic">
                                <h4>基礎範本</h4>
                                <p>通用AI專案需求建議書範本</p>
                            </div>
                            <div class="template-item" data-template="advanced">
                                <h4>進階範本</h4>
                                <p>詳細的AI專案需求建議書範本</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 綁定事件
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-overlay')) {
                document.body.removeChild(modal);
            }
        });

        modal.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', async () => {
                const templateKey = item.dataset.template;
                if (window.rfpTemplates && window.rfpTemplates[templateKey]) {
                    await this.editorWrapper.setContent(window.rfpTemplates[templateKey].content);
                    this.showNotification(`已載入${window.rfpTemplates[templateKey].title}`, 'success');
                }
                document.body.removeChild(modal);
            });
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 動畫顯示
        setTimeout(() => notification.classList.add('show'), 100);

        // 自動隱藏
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    // 公開方法供其他元件使用
    getEditor() {
        return this.editor;
    }

    getEditorWrapper() {
        return this.editorWrapper;
    }

    getChatComponent() {
        return this.chatComponent;
    }

    isReady() {
        return this.isInitialized;
    }
}

// 全域變數
let app;

// 啟動應用程式
document.addEventListener('DOMContentLoaded', () => {
    app = new AIManualIncubator();
});

// 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIManualIncubator;
} else {
    window.AIManualIncubator = AIManualIncubator;
    window.app = app;
} 