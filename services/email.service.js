// services/email.service.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // .env 파일 로드

// Nodemailer transporter 설정 (한 번만 생성)
const transporter = nodemailer.createTransport({
    service: 'gmail', // 또는 사용하시는 서비스
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
// 문의 메일 발송 함수
async function sendInquiryEmail(inquiryData) {
    const { name, phone, contact_person, email, message, privacy_agreed } = inquiryData;
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    console.log('Attempting to send email with data:', inquiryData); // 로그 추가

    const mailOptions = {
        from: `"고객문의 (${name})" <${process.env.EMAIL_USER}>`, // 보내는 사람 (개선 제안 적용 시)
        to: recipientEmail,     // ★★★ 메일은 여기에 지정된 주소로 전송됩니다.
        replyTo: email,         // ★★★ 답장 시 받는 사람은 '사용자 이메일'이 됩니다. (편의 기능)
        subject: `[웹사이트 문의] ${name}님 (${email})`,
        text: `새로운 문의가 도착했습니다.\n\n` +
              `성함: ${name}\n` +
              `연락처: ${phone}\n` +
              (contact_person ? `담당자명: ${contact_person}\n` : '') +
              `이메일: ${email}\n\n` +  // ★★★ 사용자 이메일이 본문 텍스트로 포함됩니다.
              `문의 내용:\n${message}\n\n` +
              `개인정보 동의: ${privacy_agreed ? '동의함' : '동의안함'}`,
        html: `<h2>새로운 웹사이트 문의</h2>
               <p><strong>성함:</strong> ${name}</p>
               <p><strong>연락처:</strong> ${phone}</p>
               ${contact_person ? `<p><strong>담당자명:</strong> ${contact_person}</p>` : ''}
               <p><strong>이메일:</strong> <a href="mailto:${email}">${email}</a></p> 
               <hr>
               <p><strong>문의 내용:</strong></p>
               <p style="white-space: pre-wrap;">${message}</p>
               <hr>
               <p><strong>개인정보 취급방침 동의:</strong> ${privacy_agreed ? '✔️ 동의함' : '❌ 동의 안함'}</p>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info; // 성공 정보 반환
    } catch (error) {
        console.error('Error sending email in service:', error);
        // 여기서 에러를 다시 던져서 컨트롤러에서 처리하도록 함
        throw new Error('이메일 발송 서비스 오류: ' + error.message);
    }
}

module.exports = {
    sendInquiryEmail
};