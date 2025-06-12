/**
 * AI 回應資料和邏輯
 * 提供智慧回應生成功能
 */

/**
 * 預設回應範本
 */
const AI_RESPONSE_TEMPLATES = {
    // 歡迎訊息
    welcome: [
        "歡迎使用 AI手冊孵化器！我是您的專業助手，將協助您撰寫高品質的專案需求建議書。",
        "您好！我是 AI手冊孵化器，專門協助政府機關和企業撰寫專業的專案需求建議書。",
        "歡迎來到 AI手冊孵化器！讓我們一起打造符合數位發展部標準的專案需求建議書。"
    ],

    // 功能介紹
    features: [
        "我可以協助您：\n• 📄 生成專業的專案需求建議書\n• 🎯 提供以人為中心的設計建議\n• ⚖️ 智慧引用相關法規條文\n• 📊 進行影響力預測分析\n• 🎓 提供專家級的回饋意見",
        "以下是我的主要功能：\n• 文件範本生成與客製化\n• 需求分析與規格撰寫\n• 風險評估與管控建議\n• 技術架構設計指導\n• 專案時程規劃協助"
    ],

    // 引導提示
    guidance: [
        "您可以：\n1. 使用左側的引導按鈕快速開始\n2. 直接告訴我您的專案需求\n3. 上傳現有文件讓我協助改善\n4. 詢問任何關於專案規劃的問題",
        "建議您可以從以下方式開始：\n• 點擊「文件上傳」匯入現有資料\n• 選擇「以人為中心」進行需求分析\n• 使用「法規智慧引用」確保合規性\n• 透過「影響力預測分析」評估專案效益"
    ],

    // 錯誤處理
    error: [
        "抱歉，我遇到了一些技術問題。請稍後再試，或者重新描述您的需求。",
        "系統暫時無法處理您的請求，請檢查網路連線或稍後重試。",
        "很抱歉發生錯誤，請重新整理頁面或聯繫技術支援。"
    ],

    // 無法理解
    unclear: [
        "我不太理解您的需求，能否請您提供更多詳細資訊？",
        "請您再詳細說明一下，這樣我能更好地協助您。",
        "為了提供更精確的協助，請您具體描述您想要達成的目標。"
    ],

    // 感謝回應
    thanks: [
        "很高興能協助您！如果還有其他問題，隨時告訴我。",
        "不客氣！我隨時準備協助您完善專案需求建議書。",
        "這是我的職責！有任何需要改進的地方，請隨時提出。"
    ]
};

/**
 * 關鍵字對應回應
 */
const KEYWORD_RESPONSES = {
    // 專案相關
    '專案': {
        keywords: ['專案', '計畫', 'project'],
        responses: [
            "關於專案規劃，我建議您先明確定義專案目標和範圍。您希望這個專案解決什麼問題？",
            "讓我們從專案的核心需求開始。請告訴我這個專案的主要目標是什麼？",
            "專案成功的關鍵在於清楚的需求定義。您能描述一下專案的背景和預期成果嗎？"
        ]
    },

    // 需求分析
    '需求': {
        keywords: ['需求', '要求', 'requirement'],
        responses: [
            "需求分析是專案成功的基礎。我建議將需求分為功能需求和非功能需求兩大類來分析。",
            "讓我協助您進行需求分析。請先告訴我主要的業務需求是什麼？",
            "好的需求分析應該包含：使用者需求、系統需求、效能需求和安全需求。您想從哪個方面開始？"
        ]
    },

    // 技術架構
    '技術': {
        keywords: ['技術', '架構', '系統', 'technology', 'architecture'],
        responses: [
            "技術架構設計需要考慮可擴展性、可維護性和安全性。您的專案有特定的技術限制嗎？",
            "讓我們討論技術選型。您的團隊對哪些技術比較熟悉？預算和時程有什麼限制？",
            "技術架構應該支援業務需求。請告訴我系統需要處理多少使用者和資料量？"
        ]
    },

    // 預算成本
    '預算': {
        keywords: ['預算', '成本', '費用', 'budget', 'cost'],
        responses: [
            "預算規劃需要考慮人力成本、設備成本、軟體授權和維護費用。您有初步的預算範圍嗎？",
            "成本估算應該包含開發、測試、部署和維護各階段。讓我協助您分析各項成本。",
            "建議您考慮總體擁有成本(TCO)，包含初期投資和長期營運成本。"
        ]
    },

    // 時程規劃
    '時程': {
        keywords: ['時程', '時間', '進度', 'schedule', 'timeline'],
        responses: [
            "時程規劃建議採用里程碑管理方式。您希望專案在什麼時候完成？",
            "讓我們制定實際可行的時程。請告訴我專案的關鍵截止日期和重要里程碑。",
            "時程規劃需要考慮風險緩衝時間。您的專案有哪些可能的風險因素？"
        ]
    },

    // 風險管理
    '風險': {
        keywords: ['風險', '問題', 'risk', 'issue'],
        responses: [
            "風險管理很重要。常見風險包括技術風險、時程風險、資源風險和外部風險。",
            "讓我們識別潛在風險並制定應對策略。您認為這個專案最大的風險是什麼？",
            "建議建立風險登記表，定期評估和更新風險狀態。"
        ]
    }
};

/**
 * AI 回應生成器
 */
class AIResponseGenerator {
    constructor() {
        console.log('🤖 初始化 AI 回應生成器...');
        this.templates = AI_RESPONSE_TEMPLATES;
        this.keywordResponses = KEYWORD_RESPONSES;
        this.conversationHistory = [];
        this.currentContext = null;
    }

    /**
     * 生成回應
     */
    generateResponse(userMessage, context = null) {
        console.log('🤖 生成回應，使用者訊息:', userMessage);
        console.log('🤖 上下文:', context);

        // 記錄對話歷史
        this.conversationHistory.push({
            type: 'user',
            message: userMessage,
            timestamp: new Date(),
            context: context
        });

        let response;

        // 根據上下文和關鍵字生成回應
        if (context) {
            response = this.generateContextualResponse(userMessage, context);
        } else {
            response = this.generateKeywordResponse(userMessage);
        }

        // 如果沒有找到合適的回應，使用預設回應
        if (!response) {
            response = this.getRandomResponse('unclear');
        }

        // 記錄 AI 回應
        this.conversationHistory.push({
            type: 'ai',
            message: response,
            timestamp: new Date(),
            context: context
        });

        console.log('🤖 生成的回應:', response);
        return response;
    }

    /**
     * 根據上下文生成回應
     */
    generateContextualResponse(userMessage, context) {
        console.log('🤖 根據上下文生成回應:', context);

        switch (context) {
            case 'upload':
                return "我已經準備好協助您分析上傳的文件。請上傳您的文件，我會幫您：\n• 分析現有內容結構\n• 識別缺失的重要章節\n• 提供改善建議\n• 協助完善文件內容";

            case 'userCentered':
                return "以人為中心的設計非常重要！讓我們從使用者角度來分析：\n• 誰是主要使用者？\n• 他們的需求和痛點是什麼？\n• 如何改善使用者體驗？\n• 無障礙設計考量\n\n請告訴我您的目標使用者群體。";

            case 'legal':
                return "法規遵循是專案成功的關鍵。我會協助您：\n• 識別相關法規要求\n• 引用適當的法條\n• 確保合規性\n• 提供法規更新提醒\n\n請告訴我您的專案領域，我會提供相關的法規建議。";

            case 'impact':
                return "影響力預測分析可以幫助評估專案價值。我們來分析：\n• 量化效益（成本節省、效率提升）\n• 質化效益（使用者滿意度、品牌形象）\n• 社會影響（就業、環境、創新）\n• 風險評估\n\n請描述您希望達成的主要目標。";

            case 'expert':
                return "我會提供專家級的回饋意見：\n• 業界最佳實務\n• 技術趨勢分析\n• 創新解決方案\n• 品質改善建議\n\n請告訴我您需要哪個領域的專家建議？";

            default:
                return null;
        }
    }

    /**
     * 根據關鍵字生成回應
     */
    generateKeywordResponse(userMessage) {
        console.log('🤖 根據關鍵字生成回應');
        const lowerMessage = userMessage.toLowerCase();

        for (const [category, data] of Object.entries(this.keywordResponses)) {
            for (const keyword of data.keywords) {
                if (lowerMessage.includes(keyword.toLowerCase())) {
                    console.log('🤖 找到關鍵字:', keyword, '分類:', category);
                    return this.getRandomResponse(data.responses);
                }
            }
        }

        return null;
    }

    /**
     * 獲取隨機回應
     */
    getRandomResponse(responses) {
        if (Array.isArray(responses)) {
            const randomIndex = Math.floor(Math.random() * responses.length);
            return responses[randomIndex];
        } else if (typeof responses === 'string' && this.templates[responses]) {
            const templateResponses = this.templates[responses];
            const randomIndex = Math.floor(Math.random() * templateResponses.length);
            return templateResponses[randomIndex];
        }
        return responses;
    }

    /**
     * 獲取歡迎訊息
     */
    getWelcomeMessage() {
        console.log('🤖 獲取歡迎訊息');
        const welcome = this.getRandomResponse('welcome');
        const features = this.getRandomResponse('features');
        const guidance = this.getRandomResponse('guidance');

        return `${welcome}\n\n${features}\n\n${guidance}`;
    }

    /**
     * 獲取功能介紹
     */
    getFeaturesMessage() {
        console.log('🤖 獲取功能介紹');
        return this.getRandomResponse('features');
    }

    /**
     * 獲取錯誤訊息
     */
    getErrorMessage() {
        console.log('🤖 獲取錯誤訊息');
        return this.getRandomResponse('error');
    }

    /**
     * 獲取感謝回應
     */
    getThanksMessage() {
        console.log('🤖 獲取感謝回應');
        return this.getRandomResponse('thanks');
    }

    /**
     * 清除對話歷史
     */
    clearHistory() {
        console.log('🤖 清除對話歷史');
        this.conversationHistory = [];
        this.currentContext = null;
    }

    /**
     * 獲取對話歷史
     */
    getHistory() {
        console.log('🤖 獲取對話歷史，共', this.conversationHistory.length, '條');
        return this.conversationHistory;
    }

    /**
     * 設定當前上下文
     */
    setContext(context) {
        console.log('🤖 設定上下文:', context);
        this.currentContext = context;
    }

    /**
     * 獲取當前上下文
     */
    getContext() {
        console.log('🤖 獲取當前上下文:', this.currentContext);
        return this.currentContext;
    }

    /**
     * 分析使用者意圖
     */
    analyzeIntent(userMessage) {
        console.log('🤖 分析使用者意圖:', userMessage);
        const lowerMessage = userMessage.toLowerCase();

        // 簡單的意圖分析
        if (lowerMessage.includes('謝謝') || lowerMessage.includes('感謝')) {
            return 'thanks';
        }

        if (lowerMessage.includes('你好') || lowerMessage.includes('哈囉')) {
            return 'greeting';
        }

        if (lowerMessage.includes('幫助') || lowerMessage.includes('協助')) {
            return 'help';
        }

        if (lowerMessage.includes('範本') || lowerMessage.includes('模板')) {
            return 'template';
        }

        return 'general';
    }

    /**
     * 生成建議問題
     */
    generateSuggestedQuestions(context = null) {
        console.log('🤖 生成建議問題，上下文:', context);

        const generalQuestions = [
            "如何開始撰寫專案需求建議書？",
            "有哪些範本可以使用？",
            "如何進行需求分析？",
            "專案風險評估怎麼做？",
            "技術架構設計的重點是什麼？"
        ];

        if (context) {
            switch (context) {
                case 'upload':
                    return [
                        "支援哪些檔案格式？",
                        "如何分析現有文件？",
                        "文件結構有什麼建議？"
                    ];
                case 'userCentered':
                    return [
                        "如何識別目標使用者？",
                        "使用者體驗設計原則？",
                        "無障礙設計要注意什麼？"
                    ];
                case 'legal':
                    return [
                        "有哪些相關法規？",
                        "如何確保合規性？",
                        "法規更新如何追蹤？"
                    ];
                default:
                    return generalQuestions;
            }
        }

        return generalQuestions;
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AI_RESPONSE_TEMPLATES, KEYWORD_RESPONSES, AIResponseGenerator };
} else {
    window.AI_RESPONSE_TEMPLATES = AI_RESPONSE_TEMPLATES;
    window.KEYWORD_RESPONSES = KEYWORD_RESPONSES;
    window.AIResponseGenerator = AIResponseGenerator;
} 