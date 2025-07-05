"use client";

import * as React from "react";
import { notFound } from "next/navigation";

import { Facebook, Twitter, Share2, Clock, User, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const documents = {
  "prevention-guide": {
    title: "Các bệnh thường gặp ở trẻ mùa tựu trường",
    description: "Các biện pháp phòng ngừa bệnh tật trong năm học mới",
    image: "/resources/benh-ngay-tuutruong-o-tre-vi_0007667_710.png",
    author: "https://careplusvn.com/vi/cac-benh-thuong-gap-o-tre-mua-tuu-truong",
    content: `
          <div class="lead-paragraph mb-6 text-lg text-gray-700">
        Để đảm bảo sức khỏe cho học sinh trong mùa học mới, phụ huynh và nhà trường cần chú ý một số biện pháp phòng ngừa quan trọng sau.
      </div>

      <!-- Nguyên nhân -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">Nguyên nhân trẻ dễ mắc bệnh mùa tựu trường</h2>
        <p class="mb-4 text-gray-700">
          Trẻ đi học tiếp xúc nhiều với bạn bè, dễ gặp mầm bệnh trong môi trường đông đúc. Thời tiết giao mùa mưa nắng thất thường tạo điều kiện cho vi rút, vi khuẩn phát triển. Hệ miễn dịch chưa hoàn thiện của trẻ, cùng với các thói quen như mút tay, cắn móng tay, bốc thức ăn, làm tăng nguy cơ lây nhiễm.
        </p>
      </section>

      <!-- Các bệnh thường gặp -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">Các bệnh thường gặp</h2>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Cảm cúm</strong>: Triệu chứng gồm sốt cao, ho, đau họng, nhức đầu. Tiêm vắc xin cúm hàng năm giúp giảm biến chứng.</li>
          <li><strong>Bệnh đường tiêu hóa</strong>: Do không rửa tay hoặc ăn quà vặt không an toàn, dẫn đến ngộ độc thực phẩm, rối loạn tiêu hóa.</li>
          <li><strong>Viêm mũi họng</strong>: Thời tiết thay đổi làm tăng nguy cơ viêm mũi họng, viêm phổi, hoặc COVID-19.</li>
          <li><strong>Tay chân miệng</strong>: Thường gặp ở trẻ dưới 5 tuổi, dễ lây lan vào tháng 3-5 và 9-11, có thể gây biến chứng nặng.</li>
          <li><strong>Sốt xuất huyết</strong>: Dấu hiệu như sốt, ói, đau bụng, chảy máu cần được theo dõi và điều trị kịp thời.</li>
        </ul>
      </section>

      <!-- Biện pháp phòng ngừa -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">Biện pháp phòng ngừa</h2>

        <h3 class="text-xl font-semibold mb-2">1. Vệ sinh cá nhân</h3>
        <p class="mb-4 text-gray-700">Rửa tay thường xuyên bằng xà phòng, đặc biệt trước khi ăn và sau khi đi vệ sinh. Giữ móng tay sạch sẽ và cắt gọn gàng.</p>

        <h3 class="text-xl font-semibold mb-2">2. Môi trường học tập</h3>
        <p class="mb-4 text-gray-700">Đảm bảo phòng học thông thoáng, ánh sáng đầy đủ. Vệ sinh bàn ghế, đồ dùng học tập thường xuyên.</p>

        <h3 class="text-xl font-semibold mb-2">3. Chế độ dinh dưỡng</h3>
        <p class="mb-4 text-gray-700">Ăn uống đầy đủ các nhóm chất, tăng cường rau xanh và trái cây. Uống đủ nước mỗi ngày.</p>

        <h3 class="text-xl font-semibold mb-2">4. Tiêm vắc xin</h3>
        <p class="mb-4 text-gray-700">Kiểm tra sổ tiêm chủng để đảm bảo trẻ được tiêm các mũi nhắc như cúm, bạch hầu, ho gà, sởi, thủy đậu, MMR.</p>

        <h3 class="text-xl font-semibold mb-2">5. Phòng ngừa muỗi đốt</h3>
        <p class="mb-4 text-gray-700">Mặc quần áo dài tay, dùng xịt đuổi muỗi an toàn, dọn dẹp vật chứa nước để diệt lăng quăng, phòng sốt xuất huyết.</p>

        <div class="bg-blue-50 p-6 rounded-lg my-6">
          <h3 class="text-xl font-bold mb-3">Lưu ý quan trọng:</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-700">
            <li>Đeo khẩu trang khi có triệu chứng ho, sốt.</li>
            <li>Không dùng chung đồ dùng cá nhân.</li>
            <li>Thông báo ngay cho giáo viên khi có biểu hiện bệnh.</li>
            <li>Chuẩn bị gel rửa tay khô, khăn giấy, bình nước riêng.</li>
            <li>Rèn giờ giấc sinh hoạt ổn định, ngủ đủ giấc, tránh thức khuya.</li>
          </ul>
        </div>
      </section>
    `,
    relatedDocs: [
      {
        title: "Một số thực phẩm tốt cho hệ hô hấp",
        href: "/documents/school-nutrition",
        image: "/resources/TL1.jpg"
      },
      {
        title: "Sức khỏe tâm thần và tâm lý xã hội học của học sinh hiện nay",
        href: "/documents/mental-health",
        image: "/resources/1-1.jpg"
      },
      {
        title: "8 Nguyên tắc phòng tránh điện giật cho trẻ em khi vui chơi nghỉ hè",
        href: "/documents/electrical-safety",
        image: "/resources/2-1.png"
      },
      {
        title: "Báo động trầm cảm học đường",
        href: "/documents/tram-cam-hoc-duong",
        image: "/resources/3-1.webp"
      }
    ]
  },
  "school-nutrition": {
    title: "Một số thực phẩm tốt cho hệ hô hấp",
    description: "Vitamin và Khoáng Chất Cho Sức Khỏe Học Đường",
    image: "/resources/TL1.jpg",
    author: "https://bvnguyentriphuong.com.vn/dinh-duong/mot-so-thuc-pham-tot-cho-he-ho-hap",
    content: `
      
      <div class="lead-paragraph mb-6 text-lg text-gray-700">
        Các vitamin và khoáng chất như Vitamin C, D, A, E, Magie, Omega-3 và Kẽm đóng vai trò quan trọng trong việc tăng cường hệ miễn dịch, bảo vệ sức khỏe phổi và hỗ trợ sự phát triển toàn diện của học sinh. Dưới đây là thông tin chi tiết về vai trò, nguồn thực phẩm và liều lượng khuyến nghị để đảm bảo sức khỏe học đường.
      </div>

      <!-- Vitamin C -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">1. Vitamin C</h2>
        <p class="mb-4 text-gray-700">
          Vitamin C là chất chống oxi hóa mạnh, giúp ngăn ngừa tổn thương tế bào, giảm co thắt phế quản do tập luyện, kháng viêm và điều hòa miễn dịch. Nó hỗ trợ sức khỏe phổi, phòng ngừa bệnh COPD và hen suyễn, đồng thời giảm nguy cơ nhiễm trùng đường hô hấp. Người hút thuốc cần bổ sung nhiều Vitamin C để cải thiện chức năng phổi.
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Liều lượng khuyến nghị</strong>: Nam giới: 90 mg/ngày; Nữ giới: 75 mg/ngày; Phụ nữ mang thai: 85 mg; Phụ nữ cho con bú: 120 mg.</li>
          <li><strong>Nguồn thực phẩm</strong>: Ổi, bông cải xanh, cam, chanh, đu đủ, dâu tây.</li>
        </ul>
      </section>

      <!-- Vitamin D -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">2. Vitamin D</h2>
        <p class="mb-4 text-gray-700">
          Vitamin D cải thiện sức khỏe phổi, giảm triệu chứng hen suyễn và COPD, đồng thời tăng cường sức khỏe xương, răng. Thiếu Vitamin D làm tăng nguy cơ viêm phế quản, hen suyễn, và nhiễm trùng đường hô hấp, đặc biệt là COVID-19 (nguy cơ nặng hơn và thời gian mắc bệnh lâu hơn).
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Nguồn cung cấp</strong>: Ánh nắng mặt trời, lòng đỏ trứng, cá hồi, cá ngừ, hàu.</li>
        </ul>
      </section>

      <!-- Vitamin A -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">3. Vitamin A</h2>
        <p class="mb-4 text-gray-700">
          Vitamin A hỗ trợ chức năng phổi bằng cách tái tạo niêm mạc phổi, bảo vệ khỏi tác nhân gây bệnh trong không khí, và tăng cường hệ miễn dịch. Tuy nhiên, không nên bổ sung Vitamin A quá mức vì có thể gây hại cho xương và gan.
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Nguồn thực phẩm</strong>: Cá dầu, gan, phô mai, bơ.</li>
          <li><strong>Lưu ý</strong>: Hấp thụ đủ từ chế độ ăn, tránh dùng thực phẩm bổ sung trừ khi có chỉ định.</li>
        </ul>
      </section>

      <!-- Vitamin E -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">4. Vitamin E</h2>
        <p class="mb-4 text-gray-700">
          Vitamin E là chất chống oxi hóa, bảo vệ tế bào phổi khỏi gốc tự do, giảm viêm và cải thiện triệu chứng hen suyễn, COPD ở trẻ em và người lớn. Bổ sung Vitamin E qua thực phẩm giúp cải thiện chức năng phổi.
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Nguồn thực phẩm</strong>: Dầu mầm lúa mì, dầu đậu nành, hạt hướng dương, đậu phộng, bơ đậu phộng, rau củ cải đường.</li>
        </ul>
      </section>

      <!-- Magie -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">5. Magie</h2>
        <p class="mb-4 text-gray-700">
          Magie giúp giãn cơ phế quản, giảm viêm phổi, hỗ trợ bệnh nhân hen suyễn, COPD và ung thư phổi. Thiếu Magie làm suy giảm chức năng phổi đáng kể.
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Liều lượng khuyến nghị</strong>: Nam giới: 400-420 mg/ngày; Nữ giới: 310-320 mg/ngày.</li>
          <li><strong>Nguồn thực phẩm</strong>: Sô cô la đen, bơ, hạnh nhân, hạt điều, đậu lăng, đậu xanh, đậu nành.</li>
        </ul>
      </section>

      <!-- Omega-3 -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">6. Omega-3</h2>
        <p class="mb-4 text-gray-700">
          Omega-3 (EPA, DHA) có khả năng chống viêm, giảm nguy cơ hen suyễn và COPD. Chế độ ăn thiếu Omega-3 làm tăng nguy cơ bệnh hô hấp ở trẻ em và người lớn.
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Nguồn thực phẩm</strong>: Cá hồi, cá thu, cá ngừ, cá mòi, hạt lanh, hạt chia, quả óc chó, dầu đậu nành, dầu canola.</li>
        </ul>
      </section>

      <!-- Kẽm -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">7. Kẽm (Zinc)</h2>
        <p class="mb-4 text-gray-700">
          Kẽm có tác dụng kháng viêm, chống oxi hóa, bảo vệ phổi khỏi tổn thương và giảm triệu chứng nhiễm trùng đường hô hấp (ho, đau họng). Bổ sung Kẽm giúp rút ngắn thời gian mắc bệnh.
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Liều lượng khuyến nghị</strong>: Nam giới: 11 mg/ngày; Nữ giới: 8 mg/ngày.</li>
          <li><strong>Nguồn thực phẩm</strong>: Hàu, thịt đỏ, hạt bí, đậu lăng (không liệt kê cụ thể trong tài liệu gốc, nhưng phổ biến).</li>
        </ul>
      </section>

      <!-- Khuyến nghị tổng hợp -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4">Khuyến Nghị Cho Học Đường</h2>
        <p class="mb-4 text-gray-700">
          Các vitamin và khoáng chất trên có thể được hấp thụ đủ qua chế độ ăn đa dạng, đặc biệt với học sinh khỏe mạnh. Đối với trẻ có nguy cơ thiếu hụt hoặc mắc bệnh hô hấp (hen suyễn, COPD), phụ huynh nên:
        </p>
        <div class="bg-blue-50 p-6 rounded-lg my-6">
          <h3 class="text-xl font-bold mb-3">Lưu ý quan trọng:</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-700">
            <li>Phối hợp với nhà trường để cung cấp bữa ăn học đường giàu rau xanh, trái cây, cá béo, và các loại hạt.</li>
            <li>Khuyến khích trẻ tiếp xúc với ánh nắng mặt trời (10-15 phút/ngày) để tăng cường Vitamin D.</li>
            <li>Tham khảo ý kiến bác sĩ trước khi bổ sung thực phẩm chức năng, đặc biệt với Vitamin A và Magie.</li>
            <li>Theo dõi sức khỏe định kỳ để phát hiện sớm thiếu hụt dinh dưỡng hoặc bệnh hô hấp.</li>
          </ul>
        </div>
      </section>
    `,
    relatedDocs: [
      {
        title: "Các bệnh thường gặp ở trẻ mùa tựu trường",
        href: "/documents/prevention-guide",
        image: "/resources/benh-ngay-tuutruong-o-tre-vi_0007667_710.png"
      },
      {
        title: "Sức khỏe tâm thần và tâm lý xã hội học của học sinh hiện nay",
        href: "/documents/mental-health",
        image: "/resources/1-1.jpg"
      },
      {
        title: "8 Nguyên tắc phòng tránh điện giật cho trẻ em khi vui chơi nghỉ hè",
        href: "/documents/electrical-safety",
        image: "/resources/2-1.png"
      },
      {
        title: "Báo động trầm cảm học đường",
        href: "/documents/tram-cam-hoc-duong",
        image: "/resources/3-1.webp"
      }
    ]
  },
  "mental-health": {
    title: "Sức khỏe tâm thần và tâm lý xã hội học của học sinh hiện nay",
    description: "Sức khỏe tâm thần học sinh: những con số báo động",
    image: "/resources/1-1.jpg",
    author: "https://tamlygiaoduc.com.vn/suc-khoe-tam-than-va-tam-ly-xa-hoi-hoc-cua-hoc-sinh-hien-nay/",
    content: `
      

            <!-- Main content -->
            <div class="prose max-w-none">
              <div class="lead-paragraph mb-6 text-lg text-gray-700">
                Trong bối cảnh hiện nay, học sinh đang chịu áp lực từ học tập, mối quan hệ xã hội, và lối sống không lành mạnh, dẫn đến các vấn đề sức khỏe tâm thần (SKTT) nghiêm trọng như trầm cảm, lo âu, và tự tử. Nếu không được phát hiện và hỗ trợ kịp thời, các rối loạn tâm thần có thể ảnh hưởng lâu dài đến sự phát triển của trẻ.
              </div>

              <!-- Thực trạng và số liệu -->
              <section class="mb-6">
                <h2 class="text-2xl font-bold mb-4">1. Thực Trạng và Những Con Số Báo Động</h2>
                <p class="mb-4 text-gray-700">
                  Theo khảo sát sức khỏe tâm thần vị thành niên quốc gia năm 2022 (UNICEF), 21,7% trẻ từ 10-17 tuổi tại Việt Nam gặp vấn đề về SKTT, với 3,3% đáp ứng tiêu chí rối loạn tâm thần. Các số liệu đáng chú ý bao gồm:
                </p>
                <ul class="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Lo âu</strong>: 18,6%, phổ biến nhất ở học sinh.</li>
                  <li><strong>Trầm cảm</strong>: 4,3%, với nguy cơ tự tử (2,3% tổng ca tử vong ở vị thành niên).</li>
                  <li><strong>Rối loạn tâm thần chung</strong>: 8-29% trẻ em và vị thành niên.</li>
                </ul>
                <p class="mb-4 text-gray-700">
                  Bộ Giáo dục và Đào tạo báo cáo khoảng 50% học sinh vị thành niên có vấn đề SKTT, tăng 3-5 lần so với bình thường. Tổng đài 111 ghi nhận số cuộc gọi từ học sinh tăng đáng kể năm 2023, với 2.580 cuộc từ nhóm 11-14 tuổi (+0,3%) và 1.986 cuộc từ nhóm 16-18 tuổi (+5,3%), chủ yếu liên quan đến áp lực học tập, mối quan hệ, và tâm lý.
                </p>
              </section>

              <!-- Nguyên nhân -->
              <section class="mb-6">
                <h2 class="text-2xl font-bold mb-4">2. Nguyên Nhân Gây Rối Loạn Tâm Lý</h2>
                <p class="mb-4 text-gray-700">
                  Các yếu tố chính dẫn đến vấn đề SKTT ở học sinh bao gồm:
                </p>
                <ul class="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Áp lực học tập</strong>: Đặc biệt vào mùa thi, kỳ vọng từ cha mẹ và giáo viên gây căng thẳng.</li>
                  <li><strong>Thiếu kết nối xã hội</strong>: Bắt nạt học đường, cô lập, xung đột gia đình (ly hôn) làm tăng nguy cơ trầm cảm, lo âu.</li>
                  <li><strong>Lối sống không lành mạnh</strong>: Thức khuya, nghiện game, mạng xã hội, hút thuốc, uống rượu bia ảnh hưởng đến giấc ngủ và tâm trạng.</li>
                  <li><strong>Hậu COVID-19</strong>: Gián đoạn học tập và xã hội làm gia tăng lo âu, đặc biệt ở học sinh THPT.</li>
                </ul>
              </section>

              <!-- Dấu hiệu nhận biết -->
              <section class="mb-6">
                <h2 class="text-2xl font-bold mb-4">3. Dấu Hiệu Nhận Biết</h2>
                <p class="mb-4 text-gray-700">
                  Phụ huynh và giáo viên cần chú ý các biểu hiện bất thường sau:
                </p>
                <ul class="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Mất ngủ (ngủ dưới 4-5 giờ/ngày), khó ngủ, hoặc ngủ quá nhiều.</li>
                  <li>Lo âu quá mức, mệt mỏi vô cớ, cáu gắt, biếng ăn.</li>
                  <li>Chán nản, bi quan, cảm giác không đáp ứng kỳ vọng gia đình.</li>
                  <li>Sợ đi học, thu mình, hoặc nhắc đến ý định tự tử.</li>
                </ul>
                <p class="mb-4 text-gray-700">
                  Chỉ 8,4% học sinh có vấn đề SKTT tiếp cận dịch vụ hỗ trợ, và 5,1% cha mẹ nhận biết con cần giúp đỡ. Do đó, cần hành động sớm để ngăn ngừa hậu quả nghiêm trọng.
                </p>
              </section>

              <!-- Những trường hợp đau lòng -->
              <section class="mb-6">
                <h2 class="text-2xl font-bold mb-4">4. Những Trường Hợp Đau Lòng</h2>
                <p class="mb-4 text-gray-700">
                  Nhiều vụ việc đau lòng đã xảy ra, minh chứng cho sự nghiêm trọng của vấn đề SKTT:
                </p>
                <ul class="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>2022, TP.HCM</strong>: Một học sinh lớp 10 Trường THPT Nguyễn Hữu Thọ (Quận 4) nhảy từ tầng 3 tự tử, có dấu hiệu trầm cảm trước đó.</li>
                  <li><strong>2022, Hà Nội</strong>: Nam sinh 16 tuổi Trường THPT chuyên Hà Nội – Amsterdam gieo mình từ tầng 28, để lại thư tuyệt mệnh bế tắc.</li>
                  <li><strong>2023, Nghệ An</strong>: Nữ sinh lớp 10 Trường THPT Chuyên ĐH Vinh tự tử tại nhà sau thời gian bị bạn học cô lập, đả kích.</li>
                  <li><strong>2024, TP.HCM</strong>: Nam sinh lớp 10 Trường THPT Lý Thường Kiệt (Hóc Môn) nhảy từ lầu 3 trong trường, tử vong.</li>
                  <li><strong>2022-2024, Thanh Hóa</strong>: 6 học sinh từ tiểu học đến THPT tự tử do suy nghĩ tiêu cực, thiếu sự chia sẻ.</li>
                </ul>
                <p class="mb-4 text-gray-700">
                  Các trường hợp này cho thấy sự thiếu hụt hỗ trợ tâm lý kịp thời và nhu cầu cấp thiết của các dịch vụ chăm sóc SKTT học đường.
                </p>
              </section>

              <!-- Giải pháp hỗ trợ -->
              <section class="mb-6">
                <h2 class="text-2xl font-bold mb-4">5. Giải Pháp Hỗ trợ Sức Khỏe Tâm Lý</h2>
                <h3 class="text-xl font-semibold mb-2">5.1. Vai trò của nhà trường</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Tăng cường phòng tư vấn tâm lý học đường, như mô hình tại quận 3, TP.HCM (45.000 học sinh được tư vấn trực tuyến).</li>
                  <li>Giảm áp lực học tập bằng lịch học hợp lý, tổ chức hoạt động ngoại khóa, thể thao.</li>
                  <li>Đào tạo giáo viên nhận biết dấu hiệu tâm lý bất thường và kỹ năng lắng nghe.</li>
                  <li>Xây dựng môi trường học đường an toàn, thân thiện, chống bắt nạt.</li>
                </ul>

                <h3 class="text-xl font-semibold mb-2">5.2. Vai trò của phụ huynh</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Lắng nghe, chia sẻ, tránh đặt kỳ vọng quá cao hoặc so sánh.</li>
                  <li>Khuyến khích con vận động thể chất (30 phút/ngày) và ngủ đủ giấc (8-10 giờ).</li>
                  <li>Đưa con đến chuyên gia tâm lý hoặc bệnh viện tâm thần nếu có dấu hiệu bất thường.</li>
                </ul>

                <h3 class="text-xl font-semibold mb-2">5.3. Dinh dưỡng và lối sống</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Bổ sung thực phẩm giàu Vitamin C (cam, ổi, 75-90 mg/ngày), Vitamin D (cá hồi, ánh nắng), Omega-3 (hạt chia, cá béo) để cải thiện tâm trạng và sức khỏe não bộ.</li>
                  <li>Hạn chế thức khuya, nghiện game, mạng xã hội; tránh rượu bia, thuốc lá.</li>
                  <li>Ăn uống lành mạnh, ưu tiên rau xanh, trái cây, và thực phẩm giàu Magie (hạnh nhân, sô cô la đen).</li>
                </ul>

                <h3 class="text-xl font-semibold mb-2">5.4. Hệ thống hỗ trợ cộng đồng</h3>
                <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Tăng cường dịch vụ tư vấn qua tổng đài 111, đặc biệt vào khung giờ 22-24h khi học sinh hay gọi.</li>
                  <li>Phổ biến tài liệu truyền thông SKTT của Bộ Giáo dục và Đào tạo để nâng cao nhận thức.</li>
                  <li>Đầu tư nguồn nhân lực bác sĩ tâm thần, chuyên gia tâm lý tại trường học và bệnh viện.</li>
                </ul>

                <div class="bg-blue-50 p-6 rounded-lg my-6">
                  <h3 class="text-xl font-bold mb-3">Lưu ý quan trọng:</h3>
                  <ul class="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Liên hệ tổng đài 111 để được tư vấn khẩn cấp về SKTT (24/7).</li>
                    <li>Phối hợp gia đình-nhà trường để nhận biết và hỗ trợ học sinh sớm.</li>
                    <li>Giảm kỳ thị về SKTT bằng giáo dục cộng đồng, khuyến khích học sinh chia sẻ.</li>
                    <li>Kiểm tra sức khỏe tâm lý định kỳ, đặc biệt vào mùa thi và sau kỳ nghỉ dài.</li>
                  </ul>
                </div>
              </section>

              <!-- Kết luận -->
              <section class="mb-6">
                <h2 class="text-2xl font-bold mb-4">Kết Luận</h2>
                <p class="mb-4 text-gray-700">
                  Sức khỏe tâm lý học sinh là vấn đề cấp bách, đòi hỏi sự phối hợp chặt chẽ giữa gia đình, nhà trường, và xã hội. Các con số báo động (21,7% trẻ gặp vấn đề SKTT, 50% học sinh có rối loạn tâm lý) và những vụ việc đau lòng (tự tử tại TP.HCM, Hà Nội, Nghệ An) là lời cảnh báo về sự thiếu hụt hỗ trợ tâm lý. Bằng cách xây dựng môi trường học đường thân thiện, cung cấp dinh dưỡng lành mạnh, và tăng cường tư vấn tâm lý, chúng ta có thể giúp học sinh vượt qua áp lực và phát triển toàn diện.
                </p>
              </section>
            </div>
    `,
    relatedDocs: [
      {
        title: "Các bệnh thường gặp ở trẻ mùa tựu trường",
        href: "/documents/prevention-guide",
        image: "/resources/benh-ngay-tuutruong-o-tre-vi_0007667_710.png"
      },
      {
        title: "Một số thực phẩm tốt cho hệ hô hấp",
        href: "/documents/school-nutrition",
        image: "/resources/TL1.jpg"
      },
      {
        title: "8 Nguyên tắc phòng tránh điện giật cho trẻ em khi vui chơi nghỉ hè",
        href: "/documents/electrical-safety",
        image: "/resources/2-1.png"
      },
      {
        title: "Báo động trầm cảm học đường",
        href: "/documents/tram-cam-hoc-duong",
        image: "/resources/3-1.webp"
      }
    ]
  },
  "electrical-safety": {
    title: "8 Nguyên tắc phòng tránh điện giật cho trẻ em khi vui chơi nghỉ hè",
    description: "Hướng dẫn chi tiết cho phụ huynh và giáo viên về cách bảo vệ trẻ khỏi tai nạn điện giật",
    image: "/resources/2-1.png",
    author: "https://suckhoehocduong.edu.vn/8-nguyen-tac-phong-tranh-dien-giat-cho-tre-em-khi-vui-choi-nghi-he/",
    content: `
      <div class="lead-paragraph mb-6 text-lg text-gray-700">
        Trong thời gian nghỉ hè, trẻ em thường có nhiều thời gian vui chơi và có thể gặp các nguy cơ về điện giật. Dưới đây là 8 nguyên tắc quan trọng để phòng tránh tai nạn điện giật cho trẻ.
      </div>

      <h2 class="text-2xl font-bold mb-4">1. Giáo dục trẻ về nguy hiểm của điện</h2>
      <p class="mb-4">Cần giải thích cho trẻ hiểu về sự nguy hiểm của điện và tại sao không được chơi đùa với các thiết bị điện. Dạy trẻ nhận biết các biển cảnh báo nguy hiểm về điện.</p>

      <h2 class="text-2xl font-bold mb-4">2. Kiểm tra an toàn điện trong nhà</h2>
      <p class="mb-4">Thường xuyên kiểm tra các ổ cắm, dây điện, đảm bảo không có dây điện bị hở, ổ cắm bị lỏng. Lắp đặt nắp che ổ điện để bảo vệ trẻ nhỏ.</p>

      <div class="bg-blue-50 p-6 rounded-lg my-6">
        <h3 class="text-xl font-bold mb-3">Các biện pháp phòng ngừa cụ thể:</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>Không để dây điện, ổ cắm tiếp xúc với nước</li>
          <li>Dạy trẻ không chạm vào ổ điện khi tay ướt</li>
          <li>Không để thiết bị điện gần khu vực trẻ chơi đùa</li>
          <li>Lắp đặt cầu dao chống giật</li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-4">3. Khu vực vui chơi an toàn</h2>
      <p class="mb-4">Xác định và giới hạn khu vực vui chơi an toàn cho trẻ, tránh xa các thiết bị điện và đường dây điện.</p>

      <h2 class="text-2xl font-bold mb-4">4. Hướng dẫn sử dụng thiết bị điện</h2>
      <p class="mb-4">Dạy trẻ cách sử dụng các thiết bị điện một cách an toàn và luôn có sự giám sát của người lớn.</p>

      <h2 class="text-2xl font-bold mb-4">5. Quy tắc ứng phó khẩn cấp</h2>
      <p class="mb-4">Hướng dẫn trẻ các bước cần làm khi phát hiện tình huống nguy hiểm về điện và cách gọi người lớn giúp đỡ.</p>

      <div class="bg-yellow-50 p-6 rounded-lg my-6">
        <h3 class="text-xl font-bold mb-3 text-yellow-800">Lưu ý quan trọng:</h3>
        <p class="text-yellow-800">Trong trường hợp xảy ra tai nạn điện giật, cần:</p>
        <ul class="list-disc pl-6 space-y-2 text-yellow-800">
          <li>Ngắt nguồn điện ngay lập tức</li>
          <li>Gọi cấp cứu</li>
          <li>Không chạm vào nạn nhân khi chưa ngắt điện</li>
        </ul>
      </div>
    `,
    relatedDocs: [
      {
        title: "Các bệnh thường gặp ở trẻ mùa tựu trường",
        href: "/documents/prevention-guide",
        image: "/resources/benh-ngay-tuutruong-o-tre-vi_0007667_710.png"
      },
      {
        title: "Một số thực phẩm tốt cho hệ hô hấp",
        href: "/documents/school-nutrition",
        image: "/resources/TL1.jpg"
      },
      {
        title: "Sức khỏe tâm thần và tâm lý xã hội học của học sinh hiện nay",
        href: "/documents/mental-health",
        image: "/resources/1-1.jpg"
      },
      {
        title: "Báo động trầm cảm học đường",
        href: "/documents/tram-cam-hoc-duong",
        image: "/resources/3-1.webp"
      }
    ]
  },
  "tram-cam-hoc-duong": {
    title: "Báo động trầm cảm học đường",
    description: "Một nghiên cứu gần đây cho thấy có đến 1/4 số học sinh có vấn đề về sức khỏe tâm thần do nhiều áp lực như học hành, thành tích, mục tiêu áp đặt từ gia đình",
    image: "/resources/3-1.webp",
    author: "https://nld.com.vn/bao-dong-tram-cam-hoc-duong-196250321221508141.htm",
    content: `
     
   
    <!-- Đoạn mở đầu -->
    <div class="lead-paragraph mb-6 text-lg text-gray-700 ">
        Một nghiên cứu gần đây cho thấy có đến 1/4 số học sinh có vấn đề về sức khỏe tâm thần do áp lực học hành, thành tích và kỳ vọng từ gia đình. Trầm cảm học đường đang trở thành vấn đề đáng báo động, đòi hỏi sự phối hợp giữa gia đình, nhà trường và xã hội để hỗ trợ học sinh.
    </div>

    <!-- Nguyên nhân -->
    <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Nguyên nhân gây trầm cảm học đường</h2>
        <p class="mb-4 text-gray-700  ">
            Áp lực học tập, kỳ vọng thành tích từ gia đình và xã hội, cùng với thiếu sự gắn kết giữa phụ huynh và con cái là những nguyên nhân chính. Nhiều học sinh cảm thấy cô đơn, hụt hẫng khi không đạt được mục tiêu. Ngoài ra, việc tiếp xúc với thông tin tiêu cực trên mạng xã hội cũng làm gia tăng nguy cơ suy nghĩ tiêu cực.
        </p>
    </section>

    <!-- Dấu hiệu trầm cảm -->
    <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Dấu hiệu trầm cảm ở học sinh</h2>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
            <li><strong>Giảm hứng thú</strong>: Mất quan tâm đến các hoạt động từng yêu thích, như thể thao, âm nhạc hoặc giao lưu bạn bè.</li>
            <li><strong>Khí sắc giảm sút</strong>: Thường xuyên buồn bã, chán nản, hoặc dễ cáu gắt mà không rõ lý do.</li>
            <li><strong>Suy nghĩ tiêu cực</strong>: Thể hiện qua việc chia sẻ nội dung buồn bã trên mạng xã hội hoặc có ý định tự làm hại bản thân.</li>
            <li><strong>Hành vi tách biệt</strong>: Tránh giao tiếp, tự cô lập khỏi gia đình và bạn bè.</li>
            <li><strong>Suy nghĩ tự sát</strong>: Biểu hiện qua lời nói hoặc hành động ám chỉ mong muốn "giải thoát" hoặc chán sống.</li>
        </ul>
    </section>

    <!-- Biện pháp phòng ngừa và hỗ trợ -->
    <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Biện pháp phòng ngừa và hỗ trợ</h2>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">1. Lắng nghe và đồng hành</h3>
        <p class="mb-4 text-gray-700  ">
            Phụ huynh cần dành thời gian trò chuyện, hỏi han con về cảm xúc, như: "Con có ổn không?" hoặc "Hôm nay có gì vui không?". Một cái ôm ấm áp cũng có thể là điểm tựa lớn cho trẻ.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">2. Tạo môi trường an toàn tại trường</h3>
        <p class="mb-4 text-gray-700  ">
            Nhà trường nên mở các phòng tư vấn tâm lý, tạo không gian để học sinh chia sẻ qua đối thoại trực tiếp, tin nhắn hoặc email. Giáo viên cần chủ động quan sát biểu cảm và hành vi của học sinh.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">3. Giáo dục về sức khỏe tâm thần</h3>
        <p class="mb-4 text-gray-700  ">
            Tổ chức các buổi học về cách nhận biết và quản lý cảm xúc, giúp học sinh hiểu rằng tìm kiếm sự hỗ trợ tâm lý là điều bình thường và cần thiết.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">4. Giảm áp lực học tập</h3>
        <p class="mb-4 text-gray-700  ">
            Phụ huynh và nhà trường cần tránh đặt kỳ vọng quá cao về thành tích. Khuyến khích trẻ tham gia các hoạt động thể thao, nghệ thuật để cân bằng tâm lý.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">5. Can thiệp sớm</h3>
        <p class="mb-4 text-gray-700  ">
            Khi phát hiện dấu hiệu trầm cảm, cần kết nối với chuyên gia tâm lý hoặc bác sĩ. Tránh phán xét hoặc tạo thêm áp lực cho trẻ.
        </p>

        <div class="bg-blue-50 p-6 rounded-lg my-6">
            <h3 class="text-xl font-bold mb-3 text-gray-800  ">Lưu ý quan trọng:</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
                <li>Quan tâm cảm xúc của trẻ nhưng không giám sát hay áp đặt.</li>
                <li>Khuyến khích trẻ chia sẻ với người lớn đáng tin cậy khi gặp khó khăn.</li>
                <li>Theo dõi các hành vi bất thường như tự cô lập hoặc tự gây thương tích.</li>
                <li>Cộng đồng cần cởi mở hơn về sức khỏe tâm thần, tránh kỳ thị.</li>
                <li>Liên hệ chuyên gia tâm lý ngay nếu trẻ có dấu hiệu suy nghĩ tự sát.</li>
            </ul>
        </div>
    </section>

 
    


    `,
    relatedDocs: [
      {
        title: "Các bệnh thường gặp ở trẻ mùa tựu trường",
        href: "/documents/prevention-guide",
        image: "/resources/benh-ngay-tuutruong-o-tre-vi_0007667_710.png"
      },
      {
        title: "Một số thực phẩm tốt cho hệ hô hấp",
        href: "/documents/school-nutrition",
        image: "/resources/TL1.jpg"
      },
      {
        title: "Sức khỏe tâm thần và tâm lý xã hội học của học sinh hiện nay",
        href: "/documents/mental-health",
        image: "/resources/1-1.jpg"
      },
      {
        title: "8 Nguyên tắc phòng tránh điện giật cho trẻ em khi vui chơi nghỉ hè",
        href: "/documents/electrical-safety",
        image: "/resources/2-1.png"
      }
    ]
  }
};

type DocumentSlug = keyof typeof documents;

type Params = {
  params: Promise<{ slug: DocumentSlug }>
};

export default function DocumentPage({ params }: Params) {
  const { slug } = React.use(params) as { slug: DocumentSlug };
  const document = documents[slug];

  if (!document) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
     
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/documents" className="hover:text-blue-600">Tài liệu</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{document.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main content */}
            <div className="lg:col-span-8">
              <article className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-3xl font-bold mb-6">{document.title}</h1>
                
                {/* Meta information */}
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <Link 
                      href={document.author} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Nguồn tham khảo
                    </Link>
                  </div>
                </div>

                {/* Featured image */}
                <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                  <Image
                    src={document.image}
                    alt={document.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-6">
                  {document.description}
                </p>

                {/* Social sharing */}
                <div className="flex items-center gap-4 mb-8">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Facebook className="h-4 w-4" />
                    Chia sẻ
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Twitter className="h-4 w-4" />
                    Tweet
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Chia sẻ
                  </Button>
                </div>

                {/* Main content */}
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: document.content }}
                />
              </article>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle>Bài viết liên quan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {document.relatedDocs?.map((doc: { title: string; href: string; image: string }, index: number) => (
                      <Link href={doc.href} key={index} className="block group">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                            <Image
                              src={doc.image}
                              alt={doc.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>

    
    </div>
  );
}
