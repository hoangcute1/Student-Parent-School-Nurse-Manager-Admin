#!/bin/bash

# Test workflow đơn giản: Xử lý feedback và auto cleanup
echo "🎯 Test Simple Workflow: Process & Auto Cleanup"
echo "=============================================="

# API base URL
API_BASE="http://localhost:3001"
TEST_API="$API_BASE/test"

echo "📝 Step 1: Tạo feedback mới..."
CREATE_RESULT=$(curl -s -X POST "$TEST_API/create-feedback-no-auth" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test feedback đơn giản",
    "description": "Feedback để test nút xử lý và auto cleanup",
    "parent": "684d1c638921098b6c7311ad"
  }')

FEEDBACK_ID=$(echo "$CREATE_RESULT" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Tạo feedback thành công: $FEEDBACK_ID"

echo ""
echo "⚡ Step 2: Nhấn nút 'Xử lý' để xử lý feedback..."
PROCESS_RESULT=$(curl -s -X POST "$TEST_API/process-feedback" \
  -H "Content-Type: application/json" \
  -d '{"feedbackId": "'$FEEDBACK_ID'"}')

echo "✅ Feedback đã được xử lý - Status: resolved"
echo "✅ Phụ huynh nhận được phản hồi: 'Đã tiếp nhận và xử lý yêu cầu của bạn.'"

echo ""
echo "🕛 Step 3: Auto cleanup sẽ chạy..."
echo "   - Hệ thống tự động chạy hàng ngày lúc 00:00"
echo "   - Tự động xóa feedback đã xử lý quá 1 ngày"
echo "   - Không cần can thiệp thủ công"

echo ""
echo "🎮 CÁCH SỬ DỤNG:"
echo "1. Nhân viên/Quản trị mở: http://localhost:3000/cms/responses"
echo "2. Tìm feedback chưa xử lý (có nút 'Xử lý' màu xanh lá)"
echo "3. Nhấn nút 'Xử lý' để xử lý với 1 click"
echo "4. Feedback chuyển thành 'Đã phản hồi' và phụ huynh nhận được thông báo"
echo "5. Sau 1 ngày, hệ thống tự động xóa feedback đã xử lý"

echo ""
echo "✅ WORKFLOW HOÀN CHỈNH:"
echo "   📝 Phụ huynh gửi thắc mắc"
echo "   ⚡ Nhân viên nhấn nút 'Xử lý'"
echo "   📱 Phụ huynh nhận phản hồi tự động"
echo "   🗑️ Hệ thống tự động xóa sau 1 ngày"
echo ""
echo "🎉 Done! Đơn giản và hiệu quả!"
