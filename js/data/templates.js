/**
 * 文件範本資料
 * 提供各種專案需求建議書範本
 */
const DOCUMENT_TEMPLATES = {
    // 基本專案需求建議書範本
    basic: {
        id: 'basic',
        name: '基本專案需求建議書',
        description: '適用於一般專案的基本範本',
        category: 'general',
        content: `
# 專案需求建議書

## 1. 專案概述
### 1.1 專案名稱
[請填入專案名稱]

### 1.2 專案目標
[請描述專案的主要目標和預期成果]

### 1.3 專案背景
[請說明專案的背景和必要性]

## 2. 需求分析
### 2.1 功能需求
- [功能需求 1]
- [功能需求 2]
- [功能需求 3]

### 2.2 非功能需求
- **效能需求**: [描述效能要求]
- **安全需求**: [描述安全要求]
- **可用性需求**: [描述可用性要求]

## 3. 技術規格
### 3.1 系統架構
[描述系統整體架構]

### 3.2 技術選型
- **前端技術**: [技術選擇]
- **後端技術**: [技術選擇]
- **資料庫**: [資料庫選擇]

## 4. 專案時程
### 4.1 里程碑
| 階段 | 預計完成時間 | 主要交付物 |
|------|-------------|-----------|
| 需求分析 | [日期] | 需求規格書 |
| 系統設計 | [日期] | 系統設計文件 |
| 開發實作 | [日期] | 系統原型 |
| 測試驗收 | [日期] | 測試報告 |

## 5. 預算評估
### 5.1 人力成本
[描述人力需求和成本]

### 5.2 設備成本
[描述設備需求和成本]

## 6. 風險評估
### 6.1 技術風險
[識別並評估技術風險]

### 6.2 時程風險
[識別並評估時程風險]

## 7. 結論
[總結專案的重要性和建議]
        `.trim(),
        tags: ['基本', '通用', '專案管理'],
        lastModified: new Date('2024-01-01'),
        usage: 0
    },

    // 數位轉型專案範本
    digitalTransformation: {
        id: 'digitalTransformation',
        name: '數位轉型專案需求建議書',
        description: '專為數位轉型專案設計的範本',
        category: 'digital',
        content: `
# 數位轉型專案需求建議書

## 1. 轉型願景與目標
### 1.1 轉型願景
[描述組織數位轉型的願景]

### 1.2 轉型目標
- **短期目標** (6個月內): [具體目標]
- **中期目標** (1-2年): [具體目標]
- **長期目標** (3-5年): [具體目標]

### 1.3 成功指標
- [KPI 指標 1]
- [KPI 指標 2]
- [KPI 指標 3]

## 2. 現況分析
### 2.1 數位成熟度評估
[評估組織目前的數位化程度]

### 2.2 痛點識別
- [痛點 1]
- [痛點 2]
- [痛點 3]

### 2.3 機會分析
[識別數位轉型帶來的機會]

## 3. 解決方案架構
### 3.1 技術架構
[描述數位轉型的技術架構]

### 3.2 資料架構
[描述資料整合和管理架構]

### 3.3 應用架構
[描述應用系統架構]

## 4. 實施策略
### 4.1 分階段實施計畫
| 階段 | 時程 | 重點工作 | 預期成果 |
|------|------|----------|----------|
| 第一階段 | [時程] | [工作內容] | [成果] |
| 第二階段 | [時程] | [工作內容] | [成果] |
| 第三階段 | [時程] | [工作內容] | [成果] |

### 4.2 變革管理
[描述組織變革管理策略]

## 5. 資源需求
### 5.1 人力資源
- **專案經理**: [需求描述]
- **技術團隊**: [需求描述]
- **業務團隊**: [需求描述]

### 5.2 技術資源
- **硬體設備**: [需求清單]
- **軟體授權**: [需求清單]
- **雲端服務**: [需求清單]

## 6. 風險管控
### 6.1 技術風險
[識別技術相關風險及應對策略]

### 6.2 組織風險
[識別組織變革風險及應對策略]

### 6.3 財務風險
[識別財務風險及應對策略]

## 7. 效益評估
### 7.1 量化效益
- **成本節省**: [具體數字]
- **效率提升**: [具體數字]
- **收入增加**: [具體數字]

### 7.2 質化效益
- [效益描述 1]
- [效益描述 2]
- [效益描述 3]

## 8. 建議與結論
[提出具體建議和結論]
        `.trim(),
        tags: ['數位轉型', '創新', '策略'],
        lastModified: new Date('2024-01-01'),
        usage: 0
    },

    // AI 專案範本
    aiProject: {
        id: 'aiProject',
        name: 'AI 專案需求建議書',
        description: '專為 AI 和機器學習專案設計的範本',
        category: 'ai',
        content: `
# AI 專案需求建議書

## 1. AI 專案概述
### 1.1 專案名稱
[AI 專案名稱]

### 1.2 業務問題
[描述要解決的業務問題]

### 1.3 AI 解決方案概述
[描述 AI 解決方案的概念]

## 2. 資料需求分析
### 2.1 資料來源
- **內部資料**: [描述內部資料來源]
- **外部資料**: [描述外部資料來源]
- **即時資料**: [描述即時資料需求]

### 2.2 資料品質要求
- **完整性**: [要求描述]
- **準確性**: [要求描述]
- **時效性**: [要求描述]

### 2.3 資料隱私與合規
[描述資料隱私保護和法規遵循要求]

## 3. AI 模型設計
### 3.1 模型類型
[選擇的 AI 模型類型，如分類、回歸、聚類等]

### 3.2 演算法選擇
- **候選演算法**: [列出候選演算法]
- **評估標準**: [模型評估標準]
- **基準模型**: [基準模型描述]

### 3.3 模型效能指標
- **準確率**: [目標準確率]
- **召回率**: [目標召回率]
- **F1 分數**: [目標 F1 分數]

## 4. 技術架構
### 4.1 開發環境
- **程式語言**: [選擇的程式語言]
- **機器學習框架**: [如 TensorFlow, PyTorch]
- **開發工具**: [開發工具清單]

### 4.2 部署架構
- **雲端平台**: [選擇的雲端平台]
- **容器化**: [容器化策略]
- **API 設計**: [API 介面設計]

### 4.3 監控與維護
[描述模型監控和維護策略]

## 5. 實施計畫
### 5.1 專案階段
| 階段 | 時程 | 主要工作 | 交付物 |
|------|------|----------|--------|
| 資料準備 | [時程] | 資料收集、清理、標註 | 訓練資料集 |
| 模型開發 | [時程] | 模型訓練、調優 | 訓練好的模型 |
| 系統整合 | [時程] | API 開發、系統整合 | 完整系統 |
| 測試驗證 | [時程] | 功能測試、效能測試 | 測試報告 |

### 5.2 團隊組成
- **資料科學家**: [角色職責]
- **機器學習工程師**: [角色職責]
- **軟體工程師**: [角色職責]

## 6. 風險評估
### 6.1 技術風險
- **資料品質風險**: [風險描述及應對]
- **模型效能風險**: [風險描述及應對]
- **技術可行性風險**: [風險描述及應對]

### 6.2 業務風險
- **使用者接受度**: [風險描述及應對]
- **法規合規風險**: [風險描述及應對]

## 7. 成本效益分析
### 7.1 開發成本
- **人力成本**: [成本估算]
- **基礎設施成本**: [成本估算]
- **第三方服務成本**: [成本估算]

### 7.2 預期效益
- **效率提升**: [量化效益]
- **成本節省**: [量化效益]
- **收入增加**: [量化效益]

## 8. 倫理與責任
### 8.1 AI 倫理考量
[描述 AI 倫理相關考量]

### 8.2 可解釋性
[描述模型可解釋性要求]

### 8.3 公平性與偏見
[描述公平性和偏見防範措施]

## 9. 建議與下一步
[提出具體建議和後續行動計畫]
        `.trim(),
        tags: ['AI', '機器學習', '資料科學'],
        lastModified: new Date('2024-01-01'),
        usage: 0
    }
};

/**
 * 範本管理工具
 */
class TemplateManager {
    constructor() {
        console.log('📄 初始化範本管理器...');
        this.templates = DOCUMENT_TEMPLATES;
        this.currentTemplate = null;
    }

    /**
     * 獲取所有範本
     */
    getAllTemplates() {
        console.log('📄 獲取所有範本，共', Object.keys(this.templates).length, '個');
        return Object.values(this.templates);
    }

    /**
     * 根據 ID 獲取範本
     */
    getTemplateById(id) {
        console.log('📄 獲取範本:', id);
        const template = this.templates[id];
        if (template) {
            console.log('📄 找到範本:', template.name);
            // 增加使用次數
            template.usage++;
        } else {
            console.log('📄 範本不存在:', id);
        }
        return template;
    }

    /**
     * 根據分類獲取範本
     */
    getTemplatesByCategory(category) {
        console.log('📄 獲取分類範本:', category);
        const templates = Object.values(this.templates).filter(
            template => template.category === category
        );
        console.log('📄 找到', templates.length, '個範本');
        return templates;
    }

    /**
     * 搜尋範本
     */
    searchTemplates(query) {
        console.log('📄 搜尋範本:', query);
        const lowerQuery = query.toLowerCase();
        const results = Object.values(this.templates).filter(template =>
            template.name.toLowerCase().includes(lowerQuery) ||
            template.description.toLowerCase().includes(lowerQuery) ||
            template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
        console.log('📄 搜尋結果:', results.length, '個範本');
        return results;
    }

    /**
     * 獲取熱門範本
     */
    getPopularTemplates(limit = 5) {
        console.log('📄 獲取熱門範本，限制', limit, '個');
        const popular = Object.values(this.templates)
            .sort((a, b) => b.usage - a.usage)
            .slice(0, limit);
        console.log('📄 熱門範本:', popular.map(t => t.name));
        return popular;
    }

    /**
     * 設定當前範本
     */
    setCurrentTemplate(templateId) {
        console.log('📄 設定當前範本:', templateId);
        this.currentTemplate = this.getTemplateById(templateId);
        if (this.currentTemplate) {
            console.log('📄 當前範本設定成功:', this.currentTemplate.name);
        }
        return this.currentTemplate;
    }

    /**
     * 獲取當前範本
     */
    getCurrentTemplate() {
        console.log('📄 獲取當前範本:', this.currentTemplate?.name || '無');
        return this.currentTemplate;
    }

    /**
     * 新增自訂範本
     */
    addCustomTemplate(template) {
        console.log('📄 新增自訂範本:', template.name);
        const id = `custom_${Date.now()}`;
        this.templates[id] = {
            ...template,
            id,
            category: 'custom',
            lastModified: new Date(),
            usage: 0
        };
        console.log('📄 自訂範本新增成功，ID:', id);
        return id;
    }

    /**
     * 刪除自訂範本
     */
    deleteCustomTemplate(id) {
        console.log('📄 刪除自訂範本:', id);
        if (this.templates[id] && this.templates[id].category === 'custom') {
            delete this.templates[id];
            console.log('📄 自訂範本刪除成功');
            return true;
        }
        console.log('📄 無法刪除範本（不存在或非自訂範本）');
        return false;
    }

    /**
     * 匯出範本
     */
    exportTemplate(id) {
        console.log('📄 匯出範本:', id);
        const template = this.getTemplateById(id);
        if (template) {
            const exportData = {
                ...template,
                exportDate: new Date().toISOString()
            };
            console.log('📄 範本匯出成功');
            return exportData;
        }
        console.log('📄 範本匯出失敗');
        return null;
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DOCUMENT_TEMPLATES, TemplateManager };
} else {
    window.DOCUMENT_TEMPLATES = DOCUMENT_TEMPLATES;
    window.TemplateManager = TemplateManager;
} 