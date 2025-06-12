/**
 * 驗證工具類別
 * 提供各種表單和資料驗證功能
 */
class Validators {
    /**
     * 驗證電子郵件格式
     */
    static validateEmail(email) {
        console.log('📧 驗證電子郵件:', email);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        console.log('📧 電子郵件驗證結果:', isValid);
        return isValid;
    }

    /**
     * 驗證必填欄位
     */
    static validateRequired(value) {
        console.log('✅ 驗證必填欄位:', value);
        const isValid = value !== null && value !== undefined && value.toString().trim() !== '';
        console.log('✅ 必填欄位驗證結果:', isValid);
        return isValid;
    }

    /**
     * 驗證字串長度
     */
    static validateLength(value, minLength = 0, maxLength = Infinity) {
        console.log('📏 驗證字串長度:', { value, minLength, maxLength });
        if (!value) {
            console.log('📏 字串為空，長度驗證失敗');
            return false;
        }
        const length = value.toString().length;
        const isValid = length >= minLength && length <= maxLength;
        console.log('📏 字串長度驗證結果:', { length, isValid });
        return isValid;
    }

    /**
     * 驗證數字範圍
     */
    static validateNumberRange(value, min = -Infinity, max = Infinity) {
        console.log('🔢 驗證數字範圍:', { value, min, max });
        const num = parseFloat(value);
        if (isNaN(num)) {
            console.log('🔢 不是有效數字');
            return false;
        }
        const isValid = num >= min && num <= max;
        console.log('🔢 數字範圍驗證結果:', { num, isValid });
        return isValid;
    }

    /**
     * 驗證檔案類型
     */
    static validateFileType(file, allowedTypes = []) {
        console.log('📁 驗證檔案類型:', { fileName: file.name, fileType: file.type, allowedTypes });
        if (!file || !file.type) {
            console.log('📁 檔案無效');
            return false;
        }
        const isValid = allowedTypes.length === 0 || allowedTypes.includes(file.type);
        console.log('📁 檔案類型驗證結果:', isValid);
        return isValid;
    }

    /**
     * 驗證檔案大小
     */
    static validateFileSize(file, maxSizeInMB = 10) {
        console.log('📊 驗證檔案大小:', { fileName: file.name, fileSize: file.size, maxSizeInMB });
        if (!file) {
            console.log('📊 檔案無效');
            return false;
        }
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        const isValid = file.size <= maxSizeInBytes;
        console.log('📊 檔案大小驗證結果:', { fileSizeMB: (file.size / 1024 / 1024).toFixed(2), isValid });
        return isValid;
    }

    /**
     * 驗證 URL 格式
     */
    static validateURL(url) {
        console.log('🔗 驗證 URL:', url);
        try {
            new URL(url);
            console.log('🔗 URL 驗證成功');
            return true;
        } catch (error) {
            console.log('🔗 URL 驗證失敗:', error.message);
            return false;
        }
    }

    /**
     * 驗證表單資料
     */
    static validateForm(formData, rules) {
        console.log('📋 開始表單驗證:', { formData, rules });
        const errors = {};

        for (const [field, fieldRules] of Object.entries(rules)) {
            console.log(`📋 驗證欄位: ${field}`);
            const value = formData[field];

            for (const rule of fieldRules) {
                console.log(`📋 應用規則: ${rule.type} 到欄位 ${field}`);

                switch (rule.type) {
                    case 'required':
                        if (!this.validateRequired(value)) {
                            errors[field] = rule.message || `${field} 為必填欄位`;
                        }
                        break;
                    case 'email':
                        if (value && !this.validateEmail(value)) {
                            errors[field] = rule.message || `${field} 格式不正確`;
                        }
                        break;
                    case 'length':
                        if (value && !this.validateLength(value, rule.min, rule.max)) {
                            errors[field] = rule.message || `${field} 長度必須在 ${rule.min} 到 ${rule.max} 之間`;
                        }
                        break;
                    case 'number':
                        if (value && !this.validateNumberRange(value, rule.min, rule.max)) {
                            errors[field] = rule.message || `${field} 必須在 ${rule.min} 到 ${rule.max} 之間`;
                        }
                        break;
                }

                // 如果已有錯誤，跳過後續規則
                if (errors[field]) {
                    console.log(`📋 欄位 ${field} 驗證失敗:`, errors[field]);
                    break;
                }
            }
        }

        const isValid = Object.keys(errors).length === 0;
        console.log('📋 表單驗證結果:', { isValid, errors });

        return {
            isValid,
            errors
        };
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validators;
} else {
    window.Validators = Validators;
} 