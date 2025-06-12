// 範本服務類別
class TemplateService {
    constructor() {
        console.log('📋 初始化範本服務...');
        this.isInitialized = true;
    }

    getTemplate(type = 'basic') {
        return rfpTemplates[type] || rfpTemplates.basic;
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateService;
} else {
    window.TemplateService = TemplateService;
} 