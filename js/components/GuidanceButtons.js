// 引導按鈕元件類別
class GuidanceButtons {
    constructor(container) {
        console.log('🎯 初始化引導按鈕元件...');

        // DOM 元素
        this.container = container;
        this.buttons = new Map();

        // 狀態
        this.activeButton = null;
        this.isProcessing = false;

        // 初始化
        this.init();
    }

    /**
     * 初始化引導按鈕元件
     */
    init() {
        this.findButtons();
        this.setupEventListeners();
        console.log('✅ 引導按鈕元件初始化完成');
    }

    /**
     * 找到所有引導按鈕
     */
    findButtons() {
        const buttonElements = DOMUtils.$$('.guidance-btn', this.container);

        buttonElements.forEach(button => {
            const action = button.dataset.action;
            if (action) {
                this.buttons.set(action, button);
            }
        });

        console.log(`🔍 找到 ${this.buttons.size} 個引導按鈕`);
    }

    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        this.buttons.forEach((button, action) => {
            EventUtils.on(button, 'click', (event) => {
                this.handleButtonClick(action, event);
            });

            // 添加鍵盤支援
            EventUtils.on(button, 'keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.handleButtonClick(action, event);
                }
            });
        });
    }

    /**
     * 處理按鈕點擊
     */
    async handleButtonClick(action, event) {
        console.log(`🎯 點擊引導按鈕: ${action}`);

        if (this.isProcessing) {
            console.log('⏳ 正在處理中，忽略點擊');
            return;
        }

        try {
            // 設定處理狀態
            this.setProcessing(true);

            // 更新按鈕狀態
            this.setActiveButton(action);

            // 觸發對應的事件
            await this.triggerGuidanceAction(action);

            // 顯示成功回饋
            this.showButtonFeedback(action, 'success');

        } catch (error) {
            console.error(`❌ 引導按鈕 ${action} 處理失敗:`, error);
            this.showButtonFeedback(action, 'error');
        } finally {
            // 重置處理狀態
            this.setProcessing(false);

            // 延遲重置按鈕狀態
            setTimeout(() => {
                this.resetActiveButton();
            }, 2000);
        }
    }

    /**
     * 觸發引導動作
     */
    async triggerGuidanceAction(action) {
        const eventMap = {
            [GUIDANCE_ACTIONS.UPLOAD]: EVENT_TYPES.GUIDANCE_UPLOAD,
            [GUIDANCE_ACTIONS.USER_CENTERED]: EVENT_TYPES.GUIDANCE_USER_CENTERED,
            [GUIDANCE_ACTIONS.LEGAL]: EVENT_TYPES.GUIDANCE_LEGAL,
            [GUIDANCE_ACTIONS.IMPACT]: EVENT_TYPES.GUIDANCE_IMPACT,
            [GUIDANCE_ACTIONS.EXPERT]: EVENT_TYPES.GUIDANCE_EXPERT
        };

        const eventType = eventMap[action];
        if (eventType) {
            EventUtils.trigger(document, eventType, {
                action: action,
                timestamp: new Date()
            });
        } else {
            throw new Error(`未知的引導動作: ${action}`);
        }
    }

    /**
     * 設定處理狀態
     */
    setProcessing(isProcessing) {
        this.isProcessing = isProcessing;

        this.buttons.forEach(button => {
            if (isProcessing) {
                button.disabled = true;
                DOMUtils.addClass(button, 'processing');
            } else {
                button.disabled = false;
                DOMUtils.removeClass(button, 'processing');
            }
        });
    }

    /**
     * 設定活躍按鈕
     */
    setActiveButton(action) {
        // 重置所有按鈕
        this.resetActiveButton();

        // 設定新的活躍按鈕
        const button = this.buttons.get(action);
        if (button) {
            DOMUtils.addClass(button, 'active');
            this.activeButton = action;
        }
    }

    /**
     * 重置活躍按鈕
     */
    resetActiveButton() {
        this.buttons.forEach(button => {
            DOMUtils.removeClass(button, 'active');
            DOMUtils.removeClass(button, 'success');
            DOMUtils.removeClass(button, 'error');
        });
        this.activeButton = null;
    }

    /**
     * 顯示按鈕回饋
     */
    showButtonFeedback(action, type) {
        const button = this.buttons.get(action);
        if (!button) return;

        // 添加回饋樣式
        DOMUtils.addClass(button, type);

        // 添加視覺回饋
        this.addVisualFeedback(button, type);
    }

    /**
     * 添加視覺回饋
     */
    addVisualFeedback(button, type) {
        const icon = button.querySelector('.btn-icon');
        if (!icon) return;

        const originalIcon = icon.textContent;

        // 暫時更改圖示
        const feedbackIcons = {
            success: '✅',
            error: '❌',
            processing: '⏳'
        };

        if (feedbackIcons[type]) {
            icon.textContent = feedbackIcons[type];

            // 2秒後恢復原圖示
            setTimeout(() => {
                icon.textContent = originalIcon;
            }, 2000);
        }
    }

    /**
     * 獲取按鈕狀態
     */
    getButtonState(action) {
        const button = this.buttons.get(action);
        if (!button) return null;

        return {
            action: action,
            isActive: DOMUtils.hasClass(button, 'active'),
            isProcessing: DOMUtils.hasClass(button, 'processing'),
            isDisabled: button.disabled
        };
    }

    /**
     * 獲取所有按鈕狀態
     */
    getAllButtonStates() {
        const states = {};
        this.buttons.forEach((button, action) => {
            states[action] = this.getButtonState(action);
        });
        return states;
    }

    /**
     * 啟用按鈕
     */
    enableButton(action) {
        const button = this.buttons.get(action);
        if (button) {
            button.disabled = false;
            DOMUtils.removeClass(button, 'disabled');
        }
    }

    /**
     * 停用按鈕
     */
    disableButton(action) {
        const button = this.buttons.get(action);
        if (button) {
            button.disabled = true;
            DOMUtils.addClass(button, 'disabled');
        }
    }

    /**
     * 啟用所有按鈕
     */
    enableAllButtons() {
        this.buttons.forEach((button, action) => {
            this.enableButton(action);
        });
    }

    /**
     * 停用所有按鈕
     */
    disableAllButtons() {
        this.buttons.forEach((button, action) => {
            this.disableButton(action);
        });
    }

    /**
     * 添加工具提示
     */
    addTooltip(action, text) {
        const button = this.buttons.get(action);
        if (!button) return;

        button.setAttribute('title', text);
        button.setAttribute('aria-label', text);
    }

    /**
     * 設定按鈕計數器
     */
    setButtonCounter(action, count) {
        const button = this.buttons.get(action);
        if (!button) return;

        // 移除現有計數器
        const existingCounter = button.querySelector('.btn-counter');
        if (existingCounter) {
            existingCounter.remove();
        }

        // 添加新計數器
        if (count > 0) {
            const counter = DOMUtils.createElement('span', {
                className: 'btn-counter'
            }, count.toString());

            button.appendChild(counter);
        }
    }

    /**
     * 更新按鈕文字
     */
    updateButtonText(action, text) {
        const button = this.buttons.get(action);
        if (!button) return;

        const textElement = button.querySelector('.btn-text');
        if (textElement) {
            textElement.textContent = text;
        }
    }

    /**
     * 更新按鈕圖示
     */
    updateButtonIcon(action, icon) {
        const button = this.buttons.get(action);
        if (!button) return;

        const iconElement = button.querySelector('.btn-icon');
        if (iconElement) {
            iconElement.textContent = icon;
        }
    }

    /**
     * 添加按鈕動畫
     */
    animateButton(action, animationType = 'pulse') {
        const button = this.buttons.get(action);
        if (!button) return;

        DOMUtils.addClass(button, `animate-${animationType}`);

        // 動畫結束後移除類別
        setTimeout(() => {
            DOMUtils.removeClass(button, `animate-${animationType}`);
        }, 1000);
    }

    /**
     * 重置所有按鈕狀態
     */
    resetAllButtons() {
        this.buttons.forEach((button, action) => {
            // 移除所有狀態類別
            DOMUtils.removeClass(button, ['active', 'processing', 'success', 'error', 'disabled']);

            // 啟用按鈕
            button.disabled = false;

            // 移除計數器
            const counter = button.querySelector('.btn-counter');
            if (counter) {
                counter.remove();
            }
        });

        this.activeButton = null;
        this.isProcessing = false;

        console.log('🔄 所有引導按鈕已重置');
    }

    /**
     * 獲取使用統計
     */
    getUsageStats() {
        // 從本地儲存獲取使用統計
        const stats = StorageUtils.get('guidance_button_stats', {});

        return {
            totalClicks: Object.values(stats).reduce((sum, count) => sum + count, 0),
            buttonStats: stats,
            mostUsed: Object.entries(stats).reduce((max, [action, count]) =>
                count > (max.count || 0) ? { action, count } : max, {}
            )
        };
    }

    /**
     * 記錄按鈕使用
     */
    recordButtonUsage(action) {
        const stats = StorageUtils.get('guidance_button_stats', {});
        stats[action] = (stats[action] || 0) + 1;
        StorageUtils.set('guidance_button_stats', stats);
    }

    /**
     * 銷毀元件
     */
    destroy() {
        // 移除事件監聽器
        this.buttons.forEach((button, action) => {
            EventUtils.off(button, 'click');
            EventUtils.off(button, 'keydown');
        });

        // 清除狀態
        this.buttons.clear();
        this.activeButton = null;
        this.isProcessing = false;

        console.log('🗑️ 引導按鈕元件已銷毀');
    }
}

// 匯出引導按鈕元件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GuidanceButtons;
} else {
    window.GuidanceButtons = GuidanceButtons;
} 