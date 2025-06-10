"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { Facebook, Twitter, Share2, User, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const blogs = {
  "vision-care": {
    title: "Những dấu hiệu nhận biết trẻ bị cận thị",
    description: "Tình trạng cận thị ở trẻ em đang gia tăng, nhưng nhiều phụ huynh chưa chú trọng khám mắt định kỳ. Phát hiện sớm các dấu hiệu suy giảm thị lực giúp điều trị kịp thời, ngăn ngừa nguy cơ nhược thị và ảnh hưởng đến sự phát triển trí tuệ của trẻ.",
    image: "/blog/4-1.webp",
    author: "https://www.matsaigon.com/a-z/dau-hieu-nhan-biet-tre-bi-can-thi/",
    content: `
      
    

    <!-- Nguyên nhân -->
    <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Nguyên nhân trẻ dễ bị cận thị</h2>
        <p class="mb-4 text-gray-700  ">
            Cận thị ở trẻ em thường do di truyền, sử dụng thiết bị điện tử quá nhiều, thiếu ánh sáng khi học tập, hoặc thói quen đọc sách ở cự ly gần. Thời tiết, dinh dưỡng thiếu vitamin A, và áp lực học tập cũng góp phần làm tăng nguy cơ suy giảm thị lực.
        </p>
    </section>

    <!-- Các dấu hiệu cận thị -->
    <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Các dấu hiệu nhận biết cận thị</h2>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
            <li><strong>Xem tivi hoặc đọc sách ở khoảng cách gần</strong>: Trẻ thường ngồi gần tivi hoặc cúi sát khi đọc sách, học bài.</li>
            <li><strong>Thường xuyên dụi mắt</strong>: Trẻ hay giơ tay dụi mắt khi tập trung nhìn lâu hoặc khi vui chơi.</li>
            <li><strong>Lạc chỗ khi đọc</strong>: Trẻ phải dùng ngón tay để hướng dẫn mắt khi đọc hoặc dễ bị lạc dòng.</li>
            <li><strong>Nhạy cảm với ánh sáng</strong>: Trẻ nheo mắt, che mắt hoặc chảy nước mắt khi tiếp xúc với ánh sáng mạnh, đôi khi kèm đau đầu, buồn nôn.</li>
            <li><strong>Nhắm một mắt</strong>: Trẻ nhắm một mắt khi đọc sách hoặc xem tivi, cho thấy khả năng phối hợp hai mắt bị rối loạn.</li>
            <li><strong>Nheo mắt hoặc nghiêng đầu</strong>: Trẻ nheo mắt hoặc nghiêng đầu để nhìn rõ bảng trong lớp.</li>
            <li><strong>Kết quả học tập giảm sút</strong>: Trẻ không nhìn rõ chữ trên bảng, dẫn đến học tập sa sút không rõ lý do.</li>
            <li><strong>Đau mỏi mắt</strong>: Trẻ kêu mỏi mắt khi dùng máy tính hoặc thiết bị điện tử lâu.</li>
        </ul>
    </section>

    <!-- Biện pháp phòng ngừa và hỗ trợ -->
    <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Biện pháp phòng ngừa và hỗ trợ</h2>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">1. Khám mắt định kỳ</h3>
        <p class="mb-4 text-gray-700  ">
            Đưa trẻ đi khám mắt 6 tháng/lần để phát hiện sớm các tật khúc xạ. Nếu phát hiện cận thị, đeo kính đúng độ giúp ngăn bệnh tiến triển.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">2. Điều chỉnh thói quen học tập</h3>
        <p class="mb-4 text-gray-700  ">
            Đảm bảo trẻ ngồi học với khoảng cách 30-40 cm đến sách vở, bàn ghế phù hợp chiều cao, và ánh sáng đầy đủ. Hạn chế đọc sách chữ nhỏ hoặc học trong điều kiện thiếu sáng.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">3. Hạn chế sử dụng thiết bị điện tử</h3>
        <p class="mb-4 text-gray-700  ">
            Giới hạn thời gian sử dụng máy tính, điện thoại dưới 2 giờ/ngày. Áp dụng quy tắc 20-20-20: cứ sau 20 phút, nhìn xa 20 giây ở khoảng cách 6m.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">4. Tăng cường dinh dưỡng</h3>
        <p class="mb-4 text-gray-700  ">
            Bổ sung thực phẩm giàu vitamin A (cà rốt, bí đỏ, gan động vật), omega-3 (cá hồi, cá thu), và kẽm (hạt óc chó, ngũ cốc) để hỗ trợ sức khỏe mắt.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">5. Khuyến khích hoạt động ngoài trời</h3>
        <p class="mb-4 text-gray-700  ">
            Cho trẻ chơi ngoài trời 1-2 giờ/ngày để mắt tiếp xúc với ánh sáng tự nhiên, giúp giảm nguy cơ cận thị.
        </p>

        <div class="bg-blue-50 p-6 rounded-lg my-6">
            <h3 class="text-xl font-bold mb-3 text-gray-800  ">Lưu ý quan trọng:</h3>
            <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
                <li>Chuyển trẻ ngồi gần bảng nếu có dấu hiệu nheo mắt hoặc nghiêng đầu.</li>
                <li>Quan sát kết quả học tập và hành vi của trẻ để phát hiện sớm vấn đề thị lực.</li>
                <li>Không để trẻ tự ý sử dụng kính cận không đúng độ.</li>
                <li>Khuyến khích trẻ chia sẻ khi cảm thấy khó khăn trong việc nhìn rõ.</li>
                <li>Tư vấn bác sĩ chuyên khoa mắt nếu trẻ có dấu hiệu nhạy cảm ánh sáng hoặc đau đầu thường xuyên.</li>
            </ul>
        </div>
    </section>


</div>
    `,
    relatedPosts: [
      
      {
        title: "Nguyên tắc ăn uống khoa học, giúp đẩy lùi mọi bệnh tật",
        href: "/blog/2-1.jpg",
        image: "/blog/an-uong-khoa-hoc"
      },
      {
        title: "8 cách để giảm stress cho học sinh hiệu quả, giúp tăng sự tập trung",
        href: "/blog/5-1.webp",
        image: "/blog/stress-management"
      },
      {
        title: "8 kỹ năng sơ cứu cần thiết cho các bậc cha mẹ",
        href: "/blog/6-1.webp",
        image: "/blog/first-aid"
      },
      {
        title: "Tháp dinh dưỡng cho học sinh tiểu học",
        href: "/blog/8-1.jpg",
        image: "/blog/dinh-duong-tieu-hoc"
      }
      // ...other related posts
    ]
  },
  "an-uong-khoa-hoc": {
    title: "Nguyên tắc ăn uống khoa học, giúp đẩy lùi mọi bệnh tật",
    description: "Việc tuân thủ và áp dụng nguyên tắc ăn uống khoa học không chỉ mang đến một cơ thể khỏe mạnh mà còn giúp bạn phòng tránh và đẩy lùi mọi bệnh tật.",
    image: "/blog/2-1.jpg",
    author: "https://medlatec.vn/tin-tuc/nguyen-tac-an-uong-khoa-hoc-giup-day-lui-moi-benh-tat-s51-n22903",
    content: `
     <!-- Nguyên nhân -->
    <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">1. Tầm quan trọng của việc ăn uống khoa học</h2>
        <p class="mb-4 text-gray-700  ">
          Xây dựng và duy trì chế độ ăn uống hợp lý cũng như tuân thủ các nguyên tắc ăn uống khoa học sẽ mang đến những lợi ích tuyệt vời sau:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li><strong>Giảm nguy cơ mắc bệnh ung thư và đẩy lùi mọi bệnh tật</strong>: Ăn đủ chất và đảm bảo an toàn thực phẩm tăng cường hệ miễn dịch, giúp chống lại vi khuẩn và vi rút gây bệnh.</li>
          <li><strong>Không cần bổ sung thuốc bổ hay thực phẩm chức năng</strong>: Cân bằng dinh dưỡng từ thực phẩm sạch, tươi ngon giúp bạn không cần bổ sung thuốc bổ hay thực phẩm chức năng.</li>
          <li><strong>Giúp hệ tiêu hóa luôn khỏe mạnh</strong>: Ăn chín uống sôi, bổ sung nhiều trái cây và rau xanh giúp tăng cường hệ tiêu hóa, phòng chống táo bón hiệu quả.</li>
          <li><strong>Tốt cho vóc dáng và làn da</strong>: Chế độ ăn lành mạnh kết hợp với luyện tập hợp lý mang lại vóc dáng lý tưởng và làn da đẹp.</li>
        </ul>
        
      </section>

      <!-- Nguyên tắc ăn uống khoa học -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">2. Nguyên tắc ăn uống khoa học, tốt cho sức khỏe</h2>
        
        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Ăn theo nhu cầu dinh dưỡng của cơ thể</h3>
        <p class="mb-4 text-gray-700  ">
          Nhu cầu dinh dưỡng khác nhau tùy thuộc vào độ tuổi, giới tính, sức khỏe, nghề nghiệp, sở thích,… Hãy ăn theo nhu cầu của bản thân để cung cấp đủ năng lượng và dưỡng chất, hỗ trợ sự phát triển và duy trì hoạt động hàng ngày.
        </p>
       

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Ăn đầy đủ nhóm chất dinh dưỡng</h3>
        <p class="mb-4 text-gray-700  ">
          Một bữa ăn đầy đủ dinh dưỡng cần phối hợp 4 nhóm chất:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li><strong>Tinh bột</strong>: Cung cấp năng lượng chính (gạo, bắp, khoai, mì,…).</li>
          <li><strong>Chất đạm</strong> Từ động vật (thịt, cá, trứng, sữa,…) hoặc thực vật (hạt, đậu, ngũ cốc,…).</li>
          <li><strong>Chất béo</strong>: Mỡ động vật hoặc dầu thực vật.</li>
          <li><strong>Vitamin và khoáng chất</strong>: Trái cây, rau xanh, các loại củ.</li>
        </ul>
        <p class="mb-4 text-gray-700  ">
          Đảm bảo 3 bữa chính mỗi ngày, có thể bổ sung 1-2 bữa phụ. Không bỏ bữa sáng và tránh ăn quá no vào bữa tối.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Không nên ăn mặn</h3>
        <p class="mb-4 text-gray-700  ">
          Người trưởng thành chỉ cần 6-8g muối/ngày. Ăn mặn tăng nguy cơ tim mạch, huyết áp. Trẻ dưới 1 tuổi không nêm muối, trẻ 1-2 tuổi chỉ cần 0,3-2,3g/ngày. Tránh thực phẩm nhiều muối như dưa muối, mắm, đồ đóng hộp.
        </p>
       

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Hạn chế ăn đường</h3>
        <p class="mb-4 text-gray-700  ">
          Quá nhiều đường gây suy giảm miễn dịch, béo phì, tiểu đường, tim mạch. Hạn chế đường để duy trì sức khỏe.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Ăn béo vừa phải</h3>
        <p class="mb-4 text-gray-700  ">
          Chỉ dùng khoảng 600g chất béo/tháng, ưu tiên chất béo thực vật để tránh béo phì, tim mạch, huyết áp.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Ăn nhiều rau, củ, quả</h3>
        <p class="mb-4 text-gray-700  ">
          Rau, củ, quả chứa vitamin, khoáng chất, chất xơ, tốt cho tiêu hóa và thanh lọc cơ thể. Rau lá xanh và củ, quả màu vàng chứa beta-caroten, phòng chống ung thư.
        </p>
        

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Uống đủ nước mỗi ngày</h3>
        <p class="mb-4 text-gray-700  ">
          Uống 1,5-2 lít nước/ngày để giữ tinh thần tỉnh táo, cải thiện tuần hoàn máu, phòng táo bón, giữ ẩm da.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Đảm bảo vệ sinh an toàn thực phẩm</h3>
        <p class="mb-4 text-gray-700  ">
          Dùng thực phẩm tươi, có nguồn gốc rõ ràng, chế biến và bảo quản đúng cách. Rửa tay sạch trước khi chế biến và ăn uống.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Không hút thuốc và hạn chế bia, rượu</h3>
        <p class="mb-4 text-gray-700  ">
          Tránh thuốc lá, rượu, bia. Luyện tập thể dục 30 phút/ngày để duy trì sức khỏe và tinh thần.
        </p>

        <div class="bg-blue-50  p-6 rounded-lg my-6">
          <h3 class="text-xl font-bold mb-3 text-gray-800  ">Lưu ý quan trọng:</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
            <li>Ăn theo nhu cầu dinh dưỡng cá nhân, không áp dụng chung cho mọi người.</li>
            <li>Ưu tiên thực phẩm tươi, sạch, có nguồn gốc rõ ràng.</li>
            <li>Hạn chế muối, đường, chất béo động vật để giảm nguy cơ bệnh tim mạch, tiểu đường.</li>
            <li>Bổ sung rau, củ, quả và uống đủ nước mỗi ngày.</li>
            <li>Kết hợp luyện tập thể dục để tăng cường sức khỏe.</li>
          </ul>
        </div>
      </section>
    `,
    relatedPosts: [
      {
        title: "Những dấu hiệu nhận biết trẻ bị cận thị",
        href: "/blog/4-1.webp",
        image: "/blog/vision-care"
      },
      {
        title: "8 cách để giảm stress cho học sinh hiệu quả, giúp tăng sự tập trung",
        href: "/blog/5-1.webp",
        image: "/blog/stress-management"
      },
      {
        title: "8 kỹ năng sơ cứu cần thiết cho các bậc cha mẹ",
        href: "/blog/6-1.webp",
        image: "/blog/first-aid"
      },
      {
        title: "Tháp dinh dưỡng cho học sinh tiểu học",
        href: "/blog/8-1.jpg",
        image: "/blog/dinh-duong-tieu-hoc"
      }
      // ...other related posts
    ]
  },
  "stress-management": {
    title: "8 cách để giảm stress cho học sinh hiệu quả, giúp tăng sự tập trung",
    description: "Lứa tuổi học sinh rất dễ bị stress vì áp lực bài vở và những biến đổi của tuổi dậy thì. Vậy làm sao để giảm stress, nâng cao sức khỏe tinh thần cho các bạn học sinh, sinh viên?",
    image: "/blog/5-1.webp",
    author: "https://www.docosan.com/blog/nhi/8-cach-de-giam-stress-cho-hoc-sinh/",
    content: `
      <div class="lead-paragraph mb-6 text-lg text-gray-700  ">
        Thế hệ Gen Z hiện nay chịu nhiều áp lực hơn so với các thế hệ trước, chủ yếu từ việc học, môi trường học đường, và các gánh nặng tài chính, đặc biệt sau đại dịch. Stress kéo dài có thể dẫn đến căng thẳng mạn tính, ảnh hưởng đến sức khỏe tâm thần. Bài viết này sẽ phân tích nguyên nhân gây stress ở học sinh và gợi ý các phương pháp giảm stress hiệu quả.
      </div>

      <!-- Nguyên nhân gây stress -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Nguyên nhân gây stress ở học sinh</h2>
        <p class="mb-4 text-gray-700  ">
          Theo nhiều nghiên cứu, học sinh Gen Z đối mặt với nhiều áp lực hơn các thế hệ trước. Các nguyên nhân chính bao gồm:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li><strong>Áp lực học tập</strong>: Kỳ vọng về điểm số, thi cử và thành tích học tập từ gia đình, nhà trường.</li>
          <li><strong>Môi trường học đường</strong>: Cạnh tranh giữa bạn bè, bắt nạt học đường, hoặc thiếu sự hỗ trợ từ giáo viên.</li>
          <li><strong>Gánh nặng tài chính</strong>: Lo lắng về chi phí học tập, đặc biệt ở các gia đình khó khăn sau đại dịch.</li>
          <li><strong>Ảnh hưởng của mạng xã hội</strong>: So sánh bản thân với người khác trên mạng, tiếp xúc với thông tin tiêu cực.</li>
        </ul>
        <p class="mb-4 text-gray-700  ">
          Stress kéo dài có thể gây mất tập trung, giảm hiệu suất học tập và ảnh hưởng nghiêm trọng đến sức khỏe tâm thần.
        </p>
       
      </section>

      <!-- Cách giảm stress -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Cách giảm stress hiệu quả cho học sinh</h2>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">1. Hít thở sâu khi gặp căng thẳng</h3>
        <p class="mb-4 text-gray-700  ">
          Khi căng thẳng, học sinh thường thở gấp, ảnh hưởng đến quá trình trao đổi oxy. Thực hiện bài tập hít thở sâu giúp giảm căng thẳng nhanh chóng:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li>Ngồi hoặc nằm thoải mái, đặt một tay lên ngực, một tay lên bụng.</li>
          <li>Hít sâu bằng mũi, để bụng phình đẩy tay ra ngoài.</li>
          <li>Thở ra nhẹ nhàng qua miệng, để bụng xẹp dần.</li>
          <li>Lặp lại 3-10 lần.</li>
        </ul>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">2. Ưu tiên sử dụng hình ảnh trong học tập</h3>
        <p class="mb-4 text-gray-700  ">
          Tưởng tượng hình ảnh yên bình hoặc học qua biểu đồ, màu sắc giúp giảm căng thẳng và cải thiện trí nhớ. Hãy nhắm mắt, nghĩ về một khung cảnh thư giãn (bãi biển, rừng cây) trong vài phút.
        </p>
       

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">3. Xây dựng chế độ ăn uống lành mạnh</h3>
        <p class="mb-4 text-gray-700  ">
          Chế độ ăn uống bổ dưỡng hỗ trợ sức khỏe tinh thần và trí não. Một số gợi ý:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li>Ăn đủ 3 bữa/ngày, không bỏ bữa.</li>
          <li>Uống đủ nước, mang theo thức ăn nhẹ như hạt, trái cây.</li>
          <li>Tránh rượu, bia, cà phê.</li>
          <li>Bổ sung vitamin B qua thực phẩm hoặc viên uống để hỗ trợ hệ thần kinh.</li>
        </ul>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">4. Ngủ đủ giấc</h3>
        <p class="mb-4 text-gray-700  ">
          Ngủ 6-8 tiếng/ngày giúp tinh thần sảng khoái, cải thiện tập trung và giảm căng thẳng. Mất ngủ kéo dài có thể gây cáu gắt và bất ổn tâm trạng.
        </p>
        

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">5. Tập thể dục thường xuyên</h3>
        <p class="mb-4 text-gray-700  ">
          Học sinh tập thể dục có tỷ lệ stress thấp hơn. Một số cách đơn giản:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li>Tập thể dục buổi sáng trước khi đến trường.</li>
          <li>Đi bộ hoặc đi xe đạp thay vì xe máy.</li>
          <li>Chơi các môn thể thao như bơi lội, chạy bộ, cầu lông.</li>
        </ul>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">6. Nghe nhạc</h3>
        <p class="mb-4 text-gray-700  ">
          Âm nhạc giúp giải tỏa căng thẳng, tạm quên áp lực học tập. Nghe nhạc vui tươi hoặc chơi nhạc cụ có thể giảm lo âu nhanh chóng.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">7. Xây dựng các mối quan hệ</h3>
        <p class="mb-4 text-gray-700  ">
          Bạn bè, gia đình, thầy cô có thể là nguồn động viên tinh thần. Tham gia câu lạc bộ, nhóm học tập để xây dựng mối quan hệ mới, tạo động lực vượt qua khó khăn.
        </p>
        

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">8. Tìm ra vấn đề gây căng thẳng</h3>
        <p class="mb-4 text-gray-700  ">
          Loại bỏ nguyên nhân gây stress là cách hiệu quả nhất. Nghỉ ngơi, đánh giá lại các hoạt động không cần thiết và loại bỏ chúng nếu không mang lại lợi ích.
        </p>

        <div class="bg-blue-50  p-6 rounded-lg my-6">
          <h3 class="text-xl font-bold mb-3 text-gray-800  ">Lưu ý quan trọng:</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
            <li>Thực hiện các bài tập hít thở hoặc thư giãn ngay khi cảm thấy căng thẳng.</li>
            <li>Duy trì chế độ ăn uống lành mạnh và ngủ đủ giấc để hỗ trợ sức khỏe tinh thần.</li>
            <li>Tăng cường hoạt động thể chất và xây dựng các mối quan hệ tích cực.</li>
            <li>Nếu stress kéo dài, hãy tìm đến chuyên gia tâm lý để được hỗ trợ.</li>
          </ul>
        </div>
      </section>
    `,
    relatedPosts: [
      {
        title: "Những dấu hiệu nhận biết trẻ bị cận thị",
        href: "/blog/4-1.webp",
        image: "/blog/vision-care"
      },
      {
        title: "Nguyên tắc ăn uống khoa học, giúp đẩy lùi mọi bệnh tật",
        href: "/blog/2-1.jpg",
        image: "/blog/an-uong-khoa-hoc"
      },
      
      {
        title: "8 kỹ năng sơ cứu cần thiết cho các bậc cha mẹ",
        href: "/blog/6-1.webp",
        image: "/blog/first-aid"
      },
      {
        title: "Tháp dinh dưỡng cho học sinh tiểu học",
        href: "/blog/8-1.jpg",
        image: "/blog/dinh-duong-tieu-hoc"
      }
    ]
  },
  "first-aid": {
    title: "8 kỹ năng sơ cứu cần thiết cho các bậc cha mẹ",
    description: "Bạn có nhớ những lúc bản thân bị thương khi còn nhỏ? Dường như lúc nào cha mẹ bạn cũng biết phải xử lý như thế nào - họ hoặc là bình tĩnh băng vết thương hoặc đem bạn đến bệnh viện ngay lập tức.",
    image: "/blog/6-1.webp",
    author: "https://www.gleneagles.com.sg/vi/health-plus/article/first-aid-skills-parents",
    content: `
      <div class="lead-paragraph mb-6 text-lg text-gray-700  ">
        Trẻ em thường dễ gặp các tình huống khẩn cấp như trầy xước, dị ứng, bỏng, nghẹt thở, gãy xương, chấn thương đầu, ngộ độc, hoặc co giật do sốt. Bài viết này cung cấp hướng dẫn chi tiết cách xử lý các tình huống này và các biện pháp phòng ngừa để bảo vệ trẻ.
      </div>

      <!-- Các tình huống khẩn cấp -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Cách xử lý các tình huống khẩn cấp ở trẻ em</h2>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">1. Trầy xước, vết cắt, và vết thương hở</h3>
        <p class="mb-4 text-gray-700  ">
          Rửa sạch vết thương bằng nước sạch. Cầm máu bằng cách nâng cao phần bị thương hơn vị trí tim và ấn chắc liên tục. Thoa kem hoặc xịt sát trùng lên vết thương. Nếu vết cắt to hoặc sâu, đưa trẻ đến phòng khám Đa khoa (GP) hoặc Trung tâm Chăm sóc Cấp cứu (UCC) để khâu.
        </p>
        

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">2. Dị ứng</h3>
        <p class="mb-4 text-gray-700  ">
          Nhận biết các dấu hiệu dị ứng nghiêm trọng: khó thở, sưng lưỡi/cổ họng, mắt ngứa/sưng, nổi mẩn, hốt hoảng, hoặc sốc. Loại bỏ chất gây dị ứng, đưa trẻ ra khỏi khu vực nguy hiểm, và đỡ trẻ ngồi thoải mái, hơi ngả về trước để hỗ trợ thở. Nếu triệu chứng nặng, sử dụng bút tiêm Epipen theo hướng dẫn và gọi cấp cứu.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">3. Bỏng</h3>
        <p class="mb-4 text-gray-700  ">
          Với bỏng nhẹ, ngâm vùng bỏng trong nước lạnh hoặc đặt dưới vòi nước chảy. Rửa sạch bằng sát trùng, phủ băng gạc khô không dính. Không bôi kem đánh răng, bột, hoặc thạch vì có thể gây nhiễm trùng. Với bỏng nặng, quấn vùng bỏng bằng drap sạch và chăn, đưa trẻ đến UCC.
        </p>
        

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">4. Nghẹt thở</h3>
        <p class="mb-4 text-gray-700  ">
          Với trẻ trên 1 tuổi, thực hiện thủ thuật Heimlich:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li>Đặt nắm tay hơi cao hơn rốn, tay kia nắm chặt.</li>
          <li>Đẩy mạnh vào trong và lên trên vùng bụng, lặp lại đến khi vật nghẹn được đẩy ra.</li>
          <li>Tìm hỗ trợ y tế.</li>
        </ul>
        <p class="mb-4 text-gray-700  ">
          Với trẻ dưới 1 tuổi:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li>Đặt trẻ nằm sấp trên cẳng tay, giữ đầu thấp hơn thân.</li>
          <li>Vỗ 5 cái vào giữa hai xương bả vai bằng gót tay.</li>
          <li>Nếu chưa hiệu quả, lật trẻ nằm ngửa, ấn 5 lần vào xương ngực (dưới đường núm vú) với lực sâu khoảng 3.8cm.</li>
          <li>Lặp lại đến khi vật nghẹn ra hoặc trẻ mất phản ứng, rồi tìm hỗ trợ y tế.</li>
        </ul>
        

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">5. Gãy xương</h3>
        <p class="mb-4 text-gray-700  ">
          Chườm lạnh để giảm sưng đau. Cố định vùng bị thương ở vị trí ban đầu và đưa trẻ đến UCC.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">6. Chấn thương đầu</h3>
        <p class="mb-4 text-gray-700  ">
          Chườm lạnh để giảm sưng. Theo dõi trẻ, nếu có dấu hiệu thở bất thường, nôn mửa, chảy máu tai/mũi, lờ đờ, hoặc mất ý thức, đưa ngay đến UCC.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">7. Ngộ độc</h3>
        <p class="mb-4 text-gray-700  ">
          Tìm hỗ trợ y tế ngay. Nếu trẻ mất ý thức, đặt trẻ nằm sấp để tránh sặc khi nôn. Không dùng thuốc giải độc hoặc móc họng. Mang chất độc (trong lọ gốc) đến UCC để bác sĩ đánh giá.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">8. Co giật do sốt</h3>
        <p class="mb-4 text-gray-700  ">
          Dọn đồ vật xung quanh để tránh thương tích. Hạ nhiệt độ cơ thể bằng quạt, điều hòa, hoặc mở cửa sổ (tránh chăn ướt gây sốc). Khi cơn co giật dừng, đặt trẻ nằm nghiêng, đầu ngửa ra sau.
        </p>

        <div class="bg-blue-50  p-6 rounded-lg my-6">
          <h3 class="text-xl font-bold mb-3 text-gray-800  ">Lưu ý quan trọng khi xử lý tình huống khẩn cấp:</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
            <li>Luôn giữ bình tĩnh để xử lý hiệu quả.</li>
            <li>Gọi cấp cứu hoặc đưa trẻ đến UCC nếu tình trạng nghiêm trọng.</li>
            <li>Không sử dụng các biện pháp dân gian hoặc thuốc không rõ nguồn gốc.</li>
            <li>Học trước các kỹ năng sơ cứu như Heimlich hoặc xử lý vết thương.</li>
          </ul>
        </div>
      </section>

      <!-- Phòng ngừa thương tích -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Phòng ngừa thương tích ở trẻ em</h2>
        <p class="mb-4 text-gray-700  ">
          Đa số thương tích ở trẻ có thể phòng ngừa bằng các biện pháp sau:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li>Đặt các vật nguy hiểm ngoài tầm với của trẻ.</li>
          <li>Lắp đặt cửa chặn, lưới chắn cửa sổ, miếng bảo vệ cạnh cửa, và bọc góc nhọn.</li>
          <li>Giám sát trẻ cẩn thận, đặc biệt khi chơi ngoài trời.</li>
          <li>Cho trẻ chơi các trò chơi phù hợp với độ tuổi.</li>
        </ul>
        <p class="mb-4 text-gray-700  ">
          Dù có các biện pháp phòng ngừa, tai nạn vẫn có thể xảy ra. Cha mẹ nên trang bị kiến thức sơ cứu để xử lý kịp thời trước khi đưa trẻ đến cơ sở y tế.
        </p>
        
      </section>
    `,
    relatedPosts: [
      {
        title: "Những dấu hiệu nhận biết trẻ bị cận thị",
        href: "/blog/4-1.webp",
        image: "/blog/vision-care"
      },
      {
        title: "Nguyên tắc ăn uống khoa học, giúp đẩy lùi mọi bệnh tật",
        href: "/blog/2-1.jpg",
        image: "/blog/an-uong-khoa-hoc"
      },
      {
        title: "8 cách để giảm stress cho học sinh hiệu quả, giúp tăng sự tập trung",
        href: "/blog/5-1.webp",
        image: "/blog/stress-management"
      },
      {
        title: "Tháp dinh dưỡng cho học sinh tiểu học",
        href: "/blog/8-1.jpg",
        image: "/blog/dinh-duong-tieu-hoc"
      }
    ]
  },
  "dinh-duong-tieu-hoc": {
    title: "Tháp dinh dưỡng cho học sinh tiểu học",
    description: "Từ 6 tuổi trở đi trẻ bắt đầu đi học, lúc này trẻ không chỉ vui chơi mà còn phải học tập, tiếp thu những kiến thức trên lớp vì vậy cha mẹ cần xây dựng chế độ dinh dưỡng hợp lý sẽ giúp trẻ thông minh, khỏe mạnh hơn hơn.",
    image: "/blog/8-1.jpg",
    author: "https://www.vinmec.com/vie/bai-viet/thap-dinh-duong-cho-hoc-sinh-tieu-hoc-vi",
    content: `
      <!-- Nhu cầu dinh dưỡng -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">1. Nhu cầu dinh dưỡng của học sinh tiểu học</h2>
        <p class="mb-4 text-gray-700  ">
          Trẻ từ 6-11 tuổi có nhu cầu năng lượng và chất đạm khác nhau tùy theo độ tuổi, theo khuyến nghị của Viện Dinh dưỡng Quốc gia:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li><strong>6 tuổi</strong>: Năng lượng 1600 kcal/ngày, chất đạm 36g/ngày.</li>
          <li><strong>7-9 tuổi</strong>: Năng lượng 1800 kcal/ngày, chất đạm 40g/ngày.</li>
          <li><strong>10-12 tuổi</strong>: Năng lượng 2100-2200 kcal/ngày, chất đạm 50g/ngày.</li>
        </ul>
        <p class="mb-4 text-gray-700  ">
          Cha mẹ cần điều chỉnh khẩu phần ăn để đảm bảo trẻ nhận đủ năng lượng và dưỡng chất, tránh thiếu hụt dẫn đến suy dinh dưỡng hoặc thừa cân, béo phì.
        </p>
      </section>

      <!-- Tháp dinh dưỡng -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">2. Tháp dinh dưỡng cho học sinh tiểu học</h2>
        <p class="mb-4 text-gray-700  ">
          Tháp dinh dưỡng là mô hình kim tự tháp chia thành 6 tầng, thể hiện mức độ ưu tiên của các nhóm thực phẩm cho trẻ 6-11 tuổi. Tầng đáy (rộng nhất) là nhóm cần tiêu thụ nhiều, còn tầng đỉnh (hẹp nhất) là nhóm cần hạn chế.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Nhóm 1: Tinh bột (ngũ cốc, khoai củ, gạo)</h3>
        <p class="mb-4 text-gray-700  ">
          Tinh bột cung cấp năng lượng chính cho hoạt động học tập và vui chơi. Trẻ nên ăn cơm, mì, khoai, sắn, bắp, hoặc ngũ cốc mỗi ngày. Ví dụ: Một bát cơm hoặc 1 lát bánh mì cung cấp khoảng 150-200 kcal.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Nhóm 2: Chất xơ, vitamin (rau củ, trái cây)</h3>
        <p class="mb-4 text-gray-700  ">
          Rau củ và trái cây giàu chất xơ, vitamin A (cà rốt, bí đỏ, đu đủ), và vitamin C (cam, chanh, bưởi), giúp tăng cường miễn dịch và hỗ trợ tiêu hóa. Trẻ cần ăn 300-400g rau và 200-300g trái cây mỗi ngày.
        </p>
  

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Nhóm 3: Đạm, protein, canxi (thịt, hải sản, sữa, hạt)</h3>
        <p class="mb-4 text-gray-700  ">
          Chất đạm từ thịt, cá, tôm, trứng, đậu, hoặc sữa giúp xây dựng cơ bắp và xương. Trẻ nên uống 1-2 ly sữa/ngày và ăn 100-150g thịt/cá. Các loại hạt như đậu phộng, hạnh nhân cũng là nguồn đạm tốt.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Nhóm 4: Chất béo (dầu, mỡ)</h3>
        <p class="mb-4 text-gray-700  ">
          Chất béo hỗ trợ hấp thu vitamin và tăng vị ngon. Cha mẹ nên dùng dầu thực vật (dầu ô liu, dầu đậu nành) thay vì mỡ động vật, với lượng khoảng 30-40g/ngày cho trẻ.
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Nhóm 5: Đường, đồ ngọt</h3>
        <p class="mb-4 text-gray-700  ">
          Bánh kẹo, nước ngọt nên hạn chế vì dễ gây béo phì, sâu răng. Trẻ chỉ nên ăn dưới 20g đường/ngày (tương đương 1-2 viên kẹo nhỏ).
        </p>

        <h3 class="text-xl font-semibold mb-2 text-gray-800  ">Nhóm 6: Muối</h3>
        <p class="mb-4 text-gray-700  ">
          Muối iốt cần thiết nhưng chỉ nên dùng 3-5g/ngày. Cha mẹ nên nấu ăn nhạt để bảo vệ thận và tim mạch của trẻ.
        </p>
      </section>

      <!-- Lưu ý dinh dưỡng -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">3. Lưu ý khi xây dựng chế độ dinh dưỡng cho học sinh</h2>
        <p class="mb-4 text-gray-700  ">
          Cha mẹ cần lưu ý các điểm sau để đảm bảo trẻ ăn uống khoa học và phát triển toàn diện:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
          <li><strong>Bữa sáng đầy đủ</strong>: Cho trẻ ăn no vào buổi sáng với cơm, bánh mì, hoặc cháo để có năng lượng học tập.</li>
          <li><strong>Đa dạng món ăn</strong>: Thay đổi cách chế biến (luộc, hấp, nướng) để kích thích vị giác, giúp trẻ ăn ngon hơn.</li>
          <li><strong>Tăng cường rau củ</strong>: Bổ sung rau xanh và trái cây để tránh táo bón và cung cấp vitamin.</li>
          <li><strong>Ăn đúng giờ</strong>: Tạo thói quen ăn 3 bữa chính và 1-2 bữa phụ, không cho ăn bánh kẹo trước bữa chính.</li>
          <li><strong>Hạn chế đồ ngọt, đồ chiên</li>: Giảm bánh kẹo, nước ngọt, đồ ăn nhanh để tránh sâu răng và béo phì.</li>
          <li><strong>Giám sát quà vặt</strong>: Chọn quà vặt lành mạnh như sữa chua, trái cây khô thay vì bim bim, nước ngọt.</li>
        </ul>
        <div class="bg-blue-50  p-6 rounded-lg my-6">
          <h3 class="text-xl font-bold mb-3 text-gray-800  ">Lưu ý quan trọng:</h3>
          <ul class="list-disc pl-6 space-y-2 text-gray-700  ">
            <li>Điều chỉnh khẩu phần ăn theo độ tuổi và mức độ hoạt động của trẻ.</li>
            <li>Tham khảo ý kiến bác sĩ dinh dưỡng nếu trẻ có dấu hiệu suy dinh dưỡng hoặc thừa cân.</li>
            <li>Kết hợp dinh dưỡng với vận động (chơi thể thao, chạy bộ) để trẻ phát triển cân đối.</li>
            <li>Khuyến khích trẻ tham gia chuẩn bị bữa ăn để hiểu giá trị dinh dưỡng.</li>
          </ul>
        </div>
      </section>

      <!-- Kết luận -->
      <section class="mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800  ">Kết luận</h2>
        <p class="mb-4 text-gray-700  ">
          Một chế độ dinh dưỡng khoa học giúp học sinh tiểu học phát triển toàn diện, từ thể chất đến trí tuệ. Cha mẹ cần hiểu rõ nhu cầu dinh dưỡng, áp dụng tháp dinh dưỡng, và duy trì thói quen ăn uống lành mạnh để trẻ lớn lên khỏe mạnh, học tập hiệu quả.
        </p>
        <p class="mb-4 text-gray-700  ">
          Để đặt lịch khám dinh dưỡng cho trẻ, quý phụ huynh có thể liên hệ qua <a href="https://www.vinmec.com" class="text-blue-600 dark:text-blue-400 hover:underline">HOTLINE Vinmec</a> hoặc tải ứng dụng MyVinmec để quản lý lịch khám.
        </p>
      </section>
    `,
    relatedPosts: [
      {
        title: "Những dấu hiệu nhận biết trẻ bị cận thị",
        href: "/blog/4-1.webp",
        image: "/blog/vision-care"
      },
      {
        title: "Nguyên tắc ăn uống khoa học, giúp đẩy lùi mọi bệnh tật",
        href: "/blog/2-1.jpg",
        image: "/blog/an-uong-khoa-hoc"
      },
      {
        title: "8 cách để giảm stress cho học sinh hiệu quả, giúp tăng sự tập trung",
        href: "/blog/5-1.webp",
        image: "/blog/stress-management"
      },
      {
        title: "8 kỹ năng sơ cứu cần thiết cho các bậc cha mẹ",
        href: "/blog/6-1.webp",
        image: "/blog/first-aid"
      }
    ]
  }

};

type BlogSlug = keyof typeof blogs;

type Params = {
  params: Promise<{ slug: BlogSlug }>;
};

export default function BlogDetailPage({ params }: Params) {
  const { slug } = React.use(params) as { slug: BlogSlug };
  const post = blogs[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
        <ChevronRight className="h-4 w-4" />
        <span>{post.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-8">
          <article className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
            
            {/* Meta information */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <Link 
                  href={post.author} 
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
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-6">{post.description}</p>

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
              dangerouslySetInnerHTML={{ __html: post.content }}
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
                {post.relatedPosts?.map((relatedPost, index) => (
                  <Link href={relatedPost.href} key={index} className="block group">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                          {relatedPost.title}
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
  );
}