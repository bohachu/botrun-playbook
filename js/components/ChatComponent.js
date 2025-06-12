// 聊天元件類別
class ChatComponent {
    constructor(messagesContainer, inputElement, sendButton) {
        console.log('💬 初始化聊天元件...');

        // DOM 元素
        this.messagesContainer = messagesContainer;
        this.inputElement = inputElement;
        this.sendButton = sendButton;

        // 狀態
        this.messages = [];
        this.isTyping = false;
        this.typingTimeout = null;

        // 初始化
        this.init();
    }

    /**
     * 初始化聊天元件
     */
    init() {
        this.setupEventListeners();
        this.loadChatHistory();
        console.log('✅ 聊天元件初始化完成');
    }

    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // 發送按鈕點擊事件
        EventUtils.on(this.sendButton, 'click', this.handleSendMessage.bind(this));

        // 輸入框事件
        EventUtils.on(this.inputElement, 'keydown', this.handleKeyDown.bind(this));
        EventUtils.on(this.inputElement, 'input', this.handleInput.bind(this));
        EventUtils.on(this.inputElement, 'paste', this.handlePaste.bind(this));

        // 自動調整輸入框高度
        EventUtils.on(this.inputElement, 'input', this.autoResizeInput.bind(this));
    }

    /**
     * 處理鍵盤事件
     */
    handleKeyDown(event) {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // Shift + Enter 換行
                return;
            } else {
                // Enter 發送訊息
                event.preventDefault();
                this.handleSendMessage();
            }
        }
    }

    /**
     * 處理輸入事件
     */
    handleInput(event) {
        const message = event.target.value.trim();

        // 更新發送按鈕狀態
        this.updateSendButtonState(message.length > 0);

        // 檢查訊息長度
        if (message.length > APP_CONFIG.chat.maxInputLength) {
            this.showInputError(`訊息長度不能超過 ${APP_CONFIG.chat.maxInputLength} 字元`);
        } else {
            this.clearInputError();
        }
    }

    /**
     * 處理貼上事件
     */
    handlePaste(event) {
        // 延遲處理，確保內容已貼上
        setTimeout(() => {
            this.autoResizeInput();
            this.handleInput(event);
        }, 0);
    }

    /**
     * 自動調整輸入框高度
     */
    autoResizeInput() {
        const input = this.inputElement;
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }

    /**
     * 處理發送訊息
     */
    async handleSendMessage() {
        const messageText = this.inputElement.value.trim();

        if (!messageText) {
            return;
        }

        if (messageText.length > APP_CONFIG.chat.maxInputLength) {
            this.showInputError(`訊息長度不能超過 ${APP_CONFIG.chat.maxInputLength} 字元`);
            return;
        }

        try {
            // 創建使用者訊息
            const userMessage = {
                id: DateUtils.generateId(),
                type: MESSAGE_TYPES.USER,
                content: messageText,
                timestamp: new Date()
            };

            // 添加使用者訊息
            this.addMessage(userMessage);

            // 清空輸入框
            this.clearInput();

            // 觸發訊息發送事件
            EventUtils.trigger(document, EVENT_TYPES.CHAT_MESSAGE_SENT, {
                message: messageText,
                messageObject: userMessage
            });

            // 顯示打字指示器
            this.showTypingIndicator();

        } catch (error) {
            console.error('❌ 發送訊息失敗:', error);
            this.showError('訊息發送失敗，請重試');
        }
    }

    /**
     * 添加訊息到聊天記錄
     */
    addMessage(message) {
        console.log('📝 添加訊息:', message);

        // 添加到訊息陣列
        this.messages.push(message);

        // 創建訊息元素
        const messageElement = this.createMessageElement(message);

        // 添加到 DOM
        this.messagesContainer.appendChild(messageElement);

        // 滾動到底部
        this.scrollToBottom();

        // 儲存聊天記錄
        this.saveChatHistory();

        // 觸發訊息接收事件
        if (message.type === MESSAGE_TYPES.AI) {
            EventUtils.trigger(document, EVENT_TYPES.CHAT_MESSAGE_RECEIVED, {
                message: message.content,
                messageObject: message
            });
        }
    }

    /**
     * 創建訊息元素
     */
    createMessageElement(message) {
        const messageClass = message.type === MESSAGE_TYPES.USER ? 'user-message' : 'ai-message';
        const avatar = message.type === MESSAGE_TYPES.USER ? '👤' : '🤖';

        const messageElement = DOMUtils.createElement('div', {
            className: `message ${messageClass}`,
            dataset: { messageId: message.id }
        });

        // 訊息頭像
        const avatarElement = DOMUtils.createElement('div', {
            className: 'message-avatar'
        }, avatar);

        // 訊息內容容器
        const contentContainer = DOMUtils.createElement('div', {
            className: 'message-content'
        });

        // 訊息文字
        const textElement = DOMUtils.createElement('div', {
            className: 'message-text'
        });

        // 處理訊息內容（支援 Markdown 格式）
        textElement.innerHTML = this.formatMessageContent(message.content);

        // 訊息時間
        const timeElement = DOMUtils.createElement('div', {
            className: 'message-time'
        }, DateUtils.formatTime(message.timestamp, 'relative'));

        // 組裝元素
        contentContainer.appendChild(textElement);
        contentContainer.appendChild(timeElement);
        messageElement.appendChild(avatarElement);
        messageElement.appendChild(contentContainer);

        return messageElement;
    }

    /**
     * 格式化訊息內容
     */
    formatMessageContent(content) {
        console.log('🎨 格式化訊息內容:', content);

        if (!content) {
            console.log('🎨 內容為空，返回空字串');
            return '';
        }

        // 簡單的 Markdown 格式支援
        let formatted = content.toString();

        try {
            // 粗體 **text**
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // 斜體 *text*
            formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

            // 程式碼 `code`
            formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');

            // 換行
            formatted = formatted.replace(/\n/g, '<br>');

            // 連結 [text](url)
            formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

            // 列表項目 • item
            formatted = formatted.replace(/^• (.+)$/gm, '<li>$1</li>');
            formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

            console.log('🎨 格式化完成，結果長度:', formatted.length);
            return formatted;

        } catch (error) {
            console.error('❌ 格式化訊息內容失敗:', error);
            return content.toString(); // 返回原始內容
        }
    }

    /**
     * 顯示打字指示器
     */
    showTypingIndicator() {
        if (this.isTyping) return;

        this.isTyping = true;

        const typingElement = DOMUtils.createElement('div', {
            className: 'message ai-message typing-indicator',
            id: 'typing-indicator'
        }, `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text">
                    AI 正在輸入
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `);

        this.messagesContainer.appendChild(typingElement);
        this.scrollToBottom();

        // 觸發打字開始事件
        EventUtils.trigger(document, EVENT_TYPES.CHAT_TYPING_START);
    }

    /**
     * 隱藏打字指示器
     */
    hideTypingIndicator() {
        if (!this.isTyping) return;

        this.isTyping = false;

        const typingElement = DOMUtils.$('#typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }

        // 觸發打字結束事件
        EventUtils.trigger(document, EVENT_TYPES.CHAT_TYPING_END);
    }

    /**
     * 滾動到底部
     */
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    /**
     * 清空輸入框
     */
    clearInput() {
        this.inputElement.value = '';
        this.autoResizeInput();
        this.updateSendButtonState(false);
        this.clearInputError();
    }

    /**
     * 更新發送按鈕狀態
     */
    updateSendButtonState(enabled) {
        if (enabled) {
            this.sendButton.disabled = false;
            DOMUtils.removeClass(this.sendButton, 'disabled');
        } else {
            this.sendButton.disabled = true;
            DOMUtils.addClass(this.sendButton, 'disabled');
        }
    }

    /**
     * 顯示輸入錯誤
     */
    showInputError(message) {
        // 移除現有錯誤訊息
        this.clearInputError();

        const errorElement = DOMUtils.createElement('div', {
            className: 'input-error',
            id: 'chat-input-error'
        }, message);

        this.inputElement.parentNode.appendChild(errorElement);
        DOMUtils.addClass(this.inputElement, 'error');
    }

    /**
     * 清除輸入錯誤
     */
    clearInputError() {
        const errorElement = DOMUtils.$('#chat-input-error');
        if (errorElement) {
            errorElement.remove();
        }
        DOMUtils.removeClass(this.inputElement, 'error');
    }

    /**
     * 顯示錯誤訊息
     */
    showError(message) {
        this.addMessage({
            id: DateUtils.generateId(),
            type: MESSAGE_TYPES.ERROR,
            content: message,
            timestamp: new Date()
        });
    }

    /**
     * 清除所有訊息
     */
    clearMessages() {
        this.messages = [];
        this.messagesContainer.innerHTML = '';
        this.saveChatHistory();

        // 觸發清除事件
        EventUtils.trigger(document, EVENT_TYPES.CHAT_CLEAR);

        console.log('🗑️ 聊天記錄已清除');
    }

    /**
     * 獲取聊天記錄
     */
    getHistory() {
        return this.messages;
    }

    /**
     * 設定聊天記錄
     */
    setHistory(messages) {
        this.messages = messages || [];
        this.renderMessages();
    }

    /**
     * 渲染所有訊息
     */
    renderMessages() {
        console.log('🎨 渲染訊息，訊息數量:', this.messages.length);
        console.log('🎨 messagesContainer 狀態:', !!this.messagesContainer);

        if (!this.messagesContainer) {
            console.error('❌ messagesContainer 未定義，無法渲染訊息');
            return;
        }

        this.messagesContainer.innerHTML = '';

        this.messages.forEach(message => {
            try {
                const messageElement = this.createMessageElement(message);
                this.messagesContainer.appendChild(messageElement);
            } catch (error) {
                console.error('❌ 渲染訊息失敗:', error, message);
            }
        });

        this.scrollToBottom();
    }

    /**
     * 儲存聊天記錄到本地儲存
     */
    saveChatHistory() {
        try {
            StorageUtils.set(STORAGE_KEYS.CHAT_HISTORY, this.messages);
        } catch (error) {
            console.error('❌ 儲存聊天記錄失敗:', error);
        }
    }

    /**
     * 從本地儲存載入聊天記錄
     */
    loadChatHistory() {
        try {
            const savedMessages = StorageUtils.get(STORAGE_KEYS.CHAT_HISTORY, []);

            // 轉換時間戳為 Date 對象
            const messages = savedMessages.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));

            this.setHistory(messages);

            console.log(`📚 載入了 ${messages.length} 條聊天記錄`);

        } catch (error) {
            console.error('❌ 載入聊天記錄失敗:', error);
        }
    }

    /**
     * 添加系統訊息
     */
    addSystemMessage(content) {
        this.addMessage({
            id: DateUtils.generateId(),
            type: MESSAGE_TYPES.SYSTEM,
            content: content,
            timestamp: new Date()
        });
    }

    /**
     * 添加成功訊息
     */
    addSuccessMessage(content) {
        this.addMessage({
            id: DateUtils.generateId(),
            type: MESSAGE_TYPES.SUCCESS,
            content: content,
            timestamp: new Date()
        });
    }

    /**
     * 模擬 AI 回應（帶延遲）
     */
    async simulateAIResponse(content, delay = APP_CONFIG.chat.responseDelay) {
        this.showTypingIndicator();

        await new Promise(resolve => setTimeout(resolve, delay));

        this.hideTypingIndicator();

        this.addMessage({
            id: DateUtils.generateId(),
            type: MESSAGE_TYPES.AI,
            content: content,
            timestamp: new Date()
        });
    }

    /**
     * 獲取最後一條訊息
     */
    getLastMessage() {
        return this.messages[this.messages.length - 1] || null;
    }

    /**
     * 獲取使用者訊息數量
     */
    getUserMessageCount() {
        return this.messages.filter(msg => msg.type === MESSAGE_TYPES.USER).length;
    }

    /**
     * 搜尋訊息
     */
    searchMessages(query) {
        const lowerQuery = query.toLowerCase();
        return this.messages.filter(msg =>
            msg.content.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * 匯出聊天記錄
     */
    exportHistory() {
        const exportData = {
            timestamp: new Date().toISOString(),
            messageCount: this.messages.length,
            messages: this.messages
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat_history_${DateUtils.formatTime(new Date(), 'date')}.json`;
        a.click();

        URL.revokeObjectURL(url);

        console.log('📤 聊天記錄已匯出');
    }

    /**
     * 銷毀元件
     */
    destroy() {
        // 移除事件監聽器
        EventUtils.off(this.sendButton, 'click', this.handleSendMessage);
        EventUtils.off(this.inputElement, 'keydown', this.handleKeyDown);
        EventUtils.off(this.inputElement, 'input', this.handleInput);

        // 清除狀態
        this.messages = [];
        this.isTyping = false;

        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        console.log('🗑️ 聊天元件已銷毀');
    }
}

// 匯出聊天元件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatComponent;
} else {
    window.ChatComponent = ChatComponent;
} 