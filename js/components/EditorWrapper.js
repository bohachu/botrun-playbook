// 編輯器包裝器類別
class EditorWrapper {
    constructor(editor) {
        console.log('📝 初始化編輯器包裝器...');
        this.editor = editor;
        this.isInitialized = true;
    }

    async getContent() {
        if (this.editor && this.editor.getData) {
            return this.editor.getData();
        }
        return '';
    }

    async setContent(content) {
        if (this.editor && this.editor.setData) {
            this.editor.setData(content);
        }
    }

    insertContent(content) {
        if (this.editor && this.editor.model) {
            this.editor.model.change(writer => {
                const insertPosition = this.editor.model.document.selection.getFirstPosition();
                writer.insertText(content, insertPosition);
            });
        }
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EditorWrapper;
} else {
    window.EditorWrapper = EditorWrapper;
} 