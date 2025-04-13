// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors'); // ★★★ cors 패키지 불러오기 ★★★
// 라우터 가져오기
const emailApiRoutes = require('./routes/email.routes');

const app = express();
const port = process.env.PORT || 5500;

// --- 미들웨어 설정 ---
// JSON 요청 본문 파싱
app.use(express.json());
// URL-encoded 요청 본문 파싱
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    // origin: 'http://127.0.0.1:5501', // 운영 환경에서는 특정 출처 지정 권장
    origin: '*', // 개발 중 모든 출처 허용 ( '*' 사용 시 주의)
    optionsSuccessStatus: 200
};
// (선택) public 폴더의 정적 파일(HTML, CSS, JS) 제공 설정
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
// --- 기본 HTML 페이지 제공 라우트 ---
// 루트 경로 요청 시 문의하기 HTML 페이지 제공 (파일 경로는 실제 위치에 맞게 조정)

// --- API 라우트 연결 ---
// '/api' 경로로 들어오는 요청은 emailApiRoutes에서 처리하도록 설정
app.use('/api', emailApiRoutes);

// --- 기본 에러 핸들링 (선택 사항) ---
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).send('Something broke!');
});

// --- 서버 시작 ---
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    console.log(`API 엔드포인트는 /api 접두사 뒤에 정의됩니다 (예: /api/send-email)`);
});