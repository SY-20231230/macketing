// routes/api/email.routes.js
const express = require('express');
const emailController = require('../controllers/email.controller'); // 경로 수정

const router = express.Router();

// POST /api/send-email 요청을 emailController의 handleSendEmail 함수로 연결
router.post('/send-email', emailController.handleSendEmail);

module.exports = router;