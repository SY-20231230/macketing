// controllers/email.controller.js
const emailService = require('../services/email.service');

async function handleSendEmail(req, res) {
    // 1. 요청 본문(body)에서 데이터 추출
    const inquiryData = req.body;
    const { name, phone, email, message, privacy_agreed } = inquiryData;

    // 2. 서버 측 유효성 검사
    if (!name || !phone || !email || !message) {
        console.warn('Validation failed: Missing required fields', inquiryData);
        return res.status(400).json({ message: '필수 입력 항목(*)이 누락되었습니다.' });
    }
    if (privacy_agreed !== true) {
         console.warn('Validation failed: Privacy not agreed', inquiryData);
         return res.status(400).json({ message: '개인정보 취급방침 동의가 필요합니다.' });
    }

    // 3. 서비스 계층 함수 호출
    try {
        const result = await emailService.sendInquiryEmail(inquiryData);
        // 4. 성공 응답 전송
        console.log('Email processed successfully by controller, messageId:', result.messageId);
        res.status(200).json({ message: '메일이 성공적으로 발송되었습니다!' });
    } catch (error) {
        // 5. 에러 처리 및 실패 응답 전송
        console.error('Error in email controller:', error.message);
        // 실제 운영 환경에서는 에러 스택 전체를 노출하지 않는 것이 좋습니다.
        res.status(500).json({ message: error.message || '메일 발송 중 서버 오류가 발생했습니다.' });
    }
}

module.exports = {
    handleSendEmail
};