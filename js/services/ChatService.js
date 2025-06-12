/**
 * 聊天服務類別
 * 提供聊天相關的業務邏輯和 API 呼叫
 */
class ChatService {
    constructor() {
        console.log('💬 初始化聊天服務...');
        this.apiEndpoint = '/api/chat';
        this.responseGenerator = new AIResponseGenerator();
        this.isInitialized = true;
        console.log('💬 聊天服務初始化完成');
    }

    /**
     * 發送訊息到 AI
     */
    async sendMessage(message, context = null) {
        console.log('💬 發送訊息到 AI:', { message, context });

        try {
            // 模擬 API 呼叫延遲
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            // 使用 AI 回應生成器生成回應
            const response = this.responseGenerator.generateResponse(message, context);

            console.log('💬 AI 回應生成完成:', response);

            return {
                success: true,
                data: {
                    id: this.generateMessageId(),
                    content: response,
                    timestamp: new Date(),
                    type: 'ai'
                }
            };

        } catch (error) {
            console.error('❌ 發送訊息失敗:', error);
            return {
                success: false,
                error: error.message,
                data: {
                    id: this.generateMessageId(),
                    content: this.responseGenerator.getErrorMessage(),
                    timestamp: new Date(),
                    type: 'error'
                }
            };
        }
    }

    /**
     * 處理引導按鈕點擊
     */
    async handleGuidanceAction(action, additionalData = null) {
        console.log('💬 處理引導動作:', { action, additionalData });

        try {
            let response;

            switch (action) {
                case 'upload':
                    response = await this.handleFileUpload(additionalData);
                    break;
                case 'userCentered':
                    response = await this.handleUserCenteredDesign(additionalData);
                    break;
                case 'legal':
                    response = await this.handleLegalGuidance(additionalData);
                    break;
                case 'impact':
                    response = await this.handleImpactAnalysis(additionalData);
                    break;
                case 'expert':
                    response = await this.handleExpertFeedback(additionalData);
                    break;
                default:
                    response = '抱歉，我不理解這個動作。請重新選擇。';
            }

            return {
                success: true,
                data: {
                    id: this.generateMessageId(),
                    content: response,
                    timestamp: new Date(),
                    type: 'ai',
                    context: action
                }
            };

        } catch (error) {
            console.error('❌ 處理引導動作失敗:', error);
            return {
                success: false,
                error: error.message,
                data: {
                    id: this.generateMessageId(),
                    content: this.responseGenerator.getErrorMessage(),
                    timestamp: new Date(),
                    type: 'error'
                }
            };
        }
    }

    /**
     * 處理檔案上傳
     */
    async handleFileUpload(fileData) {
        console.log('📄 處理檔案上傳:', fileData);

        // 模擬檔案處理
        await new Promise(resolve => setTimeout(resolve, 2000));

        return this.responseGenerator.generateContextualResponse('', 'upload');
    }

    /**
     * 處理以人為中心設計
     */
    async handleUserCenteredDesign(data) {
        console.log('👥 處理以人為中心設計:', data);

        await new Promise(resolve => setTimeout(resolve, 1500));

        return this.responseGenerator.generateContextualResponse('', 'userCentered');
    }

    /**
     * 處理法規引導
     */
    async handleLegalGuidance(data) {
        console.log('⚖️ 處理法規引導:', data);

        await new Promise(resolve => setTimeout(resolve, 1800));

        return this.responseGenerator.generateContextualResponse('', 'legal');
    }

    /**
     * 處理影響力分析
     */
    async handleImpactAnalysis(data) {
        console.log('📊 處理影響力分析:', data);

        await new Promise(resolve => setTimeout(resolve, 2200));

        return this.responseGenerator.generateContextualResponse('', 'impact');
    }

    /**
     * 處理專家回饋
     */
    async handleExpertFeedback(data) {
        console.log('🎓 處理專家回饋:', data);

        await new Promise(resolve => setTimeout(resolve, 1600));

        return this.responseGenerator.generateContextualResponse('', 'expert');
    }

    /**
     * 獲取歡迎訊息
     */
    getWelcomeMessage() {
        console.log('💬 獲取歡迎訊息');
        return {
            id: this.generateMessageId(),
            content: this.responseGenerator.getWelcomeMessage(),
            timestamp: new Date(),
            type: 'ai'
        };
    }

    /**
     * 獲取建議問題
     */
    getSuggestedQuestions(context = null) {
        console.log('💬 獲取建議問題，上下文:', context);
        return this.responseGenerator.generateSuggestedQuestions(context);
    }

    /**
     * 分析使用者意圖
     */
    analyzeUserIntent(message) {
        console.log('💬 分析使用者意圖:', message);
        return this.responseGenerator.analyzeIntent(message);
    }

    /**
     * 生成訊息 ID
     */
    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 清除對話歷史
     */
    clearHistory() {
        console.log('💬 清除對話歷史');
        this.responseGenerator.clearHistory();
    }

    /**
     * 獲取對話歷史
     */
    getHistory() {
        console.log('💬 獲取對話歷史');
        return this.responseGenerator.getHistory();
    }

    /**
     * 設定上下文
     */
    setContext(context) {
        console.log('💬 設定上下文:', context);
        this.responseGenerator.setContext(context);
    }

    /**
     * 獲取服務狀態
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            apiEndpoint: this.apiEndpoint,
            hasResponseGenerator: !!this.responseGenerator
        };
    }

    /**
     * 銷毀服務
     */
    destroy() {
        console.log('🗑️ 銷毀聊天服務...');

        if (this.responseGenerator) {
            this.responseGenerator.clearHistory();
            this.responseGenerator = null;
        }

        this.isInitialized = false;
        console.log('🗑️ 聊天服務已銷毀');
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatService;
} else {
    window.ChatService = ChatService;
} 