import crypto from 'crypto';

/**
 * @description Tạo một chuỗi token ngẫu nhiên, độc nhất.
 * @returns {string} - Chuỗi token Base64 (dài khoảng 43 ký tự).
 */
export const generateVerifyToken = (): string => {
    // Tạo 32 byte dữ liệu ngẫu nhiên và mã hóa nó thành chuỗi Base64
    return crypto.randomBytes(32).toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
};

/**
 * @description Tính toán thời điểm hết hạn (24 giờ kể từ bây giờ).
 * @returns {Date} - Đối tượng Date đại diện cho thời điểm hết hạn.
 */
    export const getExpirationDate = (): Date => {
        const expirationTimeMs = 24 * 60 * 60 * 1000; // 24 giờ tính bằng mili giây
        return new Date(Date.now() + expirationTimeMs);
    };