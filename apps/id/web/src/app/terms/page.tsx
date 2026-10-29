import type { Metadata } from "next";
import {
  type LegalAccent,
  LegalSection,
  LegalShell,
} from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description:
    "Điều khoản sử dụng dịch vụ VNTEZ ID và hệ sinh thái dịch vụ kỹ thuật số VNTEZ.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Điều khoản sử dụng | VNTEZ ID",
    description: "Điều khoản sử dụng dịch vụ VNTEZ ID và hệ sinh thái dịch vụ kỹ thuật số VNTEZ.",
    url: "/terms",
  },
  twitter: {
    card: "summary",
    title: "Điều khoản sử dụng | VNTEZ ID",
    description: "Điều khoản sử dụng dịch vụ VNTEZ ID và hệ sinh thái dịch vụ kỹ thuật số VNTEZ.",
  },
};

export default function TermsPage() {
  const accent: LegalAccent = "primary";
  return (
    <LegalShell
      title="Điều Khoản Sử Dụng"
      updatedAt="15/10/2026"
      badge="Legal"
      accent={accent}
      backHref="/login"
      footerLink={{ href: "/privacy", label: "Chính sách bảo mật →" }}
    >
      <LegalSection n={1} title="Giới thiệu chung" accent={accent}>
        <p>
          Chào mừng bạn đến với dịch vụ của VNTEZ Cloud. Bằng việc truy cập hoặc
          sử dụng bất kỳ phần nào của hệ sinh thái VNTEZ, bao gồm nhưng không
          giới hạn ở Pomoduo, Bonsai Reader và các công cụ API liên quan, bạn
          đồng ý tuân thủ các điều khoản dưới đây.
        </p>
        <p>
          Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng
          dịch vụ.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Tài khoản người dùng" accent={accent}>
        <ul>
          <li>
            Bạn cam kết cung cấp thông tin đăng ký chính xác, đầy đủ và hiện
            tại.
          </li>
          <li>
            Bạn chịu trách nhiệm bảo mật thông tin đăng nhập, bao gồm Magic
            Links, phiên OAuth và các thiết bị được ủy quyền.
          </li>
          <li>
            Mọi hoạt động phát sinh từ tài khoản của bạn đều do bạn chịu trách
            nhiệm, trừ khi lỗi thuộc về hệ thống của VNTEZ Cloud.
          </li>
          <li>
            Không được chia sẻ tài khoản, bán lại quyền truy cập hoặc sử dụng
            tài khoản cho mục đích trái phép.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={3} title="Sở hữu trí tuệ" accent={accent}>
        <p>
          Tất cả nội dung, tính năng, chức năng, thiết kế giao diện, logo, tên
          miền, tài liệu và mã nguồn thuộc về VNTEZ Cloud hoặc các bên cấp phép
          tương ứng.
        </p>
        <p>
          Bạn không được sao chép, sửa đổi, phân phối, thương mại hóa, đảo ngược
          kỹ thuật hoặc khai thác bất kỳ phần nào của dịch vụ khi chưa có sự cho
          phép bằng văn bản.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Hành vi bị cấm" accent={accent}>
        <p>Bạn đồng ý không sử dụng dịch vụ để:</p>
        <ul>
          <li>
            Vi phạm pháp luật hoặc xâm phạm quyền riêng tư của người khác.
          </li>
          <li>
            Phát tán virus, malware, ransomware hoặc mã độc gây hại cho hệ
            thống.
          </li>
          <li>Tự động hóa thu thập dữ liệu, crawling, scraping trái phép.</li>
          <li>
            Gây tải nặng, tấn công từ chối dịch vụ hoặc làm suy giảm hạ tầng của
            VNTEZ.
          </li>
          <li>Giả mạo danh tính hoặc lợi dụng dịch vụ cho mục đích lừa đảo.</li>
          <li>Lưu trữ, phát tán nội dung trái pháp luật.</li>
        </ul>
      </LegalSection>

      <LegalSection n={5} title="Nội dung do người dùng tạo" accent={accent}>
        <p>
          Bạn giữ quyền sở hữu đối với nội dung do bạn tạo ra trong quá trình sử
          dụng dịch vụ, ví dụ ghi chú, cài đặt, lịch sử học tập hoặc tài liệu cá
          nhân.
        </p>
        <p>
          Bằng việc sử dụng dịch vụ, bạn cấp cho VNTEZ Cloud giấy phép giới hạn,
          không độc quyền, có thể thu hồi, nhằm lưu trữ, xử lý, đồng bộ và hiển
          thị nội dung đó để vận hành dịch vụ theo đúng mục bạn đã yêu cầu.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Miễn trừ trách nhiệm" accent={accent}>
        <p>
          Dịch vụ được cung cấp theo nguyên trạng và như hiện có. Đến mức tối đa
          mà pháp luật cho phép, VNTEZ Cloud từ chối các bảo đảm ngầm định, bao
          gồm nhưng không giới hạn ở khả năng bán hàng, sự phù hợp cho mục đích
          cụ thể, tính không vi phạm và độ tin cậy tuyệt đối của dịch vụ.
        </p>
        <p>
          Chúng tôi không cam kết rằng dịch vụ sẽ luôn liên tục, an toàn tuyệt
          đối, không có lỗi hoặc không bị gián đoạn do sự kiện bất khả kháng,
          tấn công mạng hoặc lỗi nhà cung cấp hạ tầng.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Giới hạn trách nhiệm" accent={accent}>
        <p>
          Trừ khi pháp luật cấm, VNTEZ Cloud không chịu trách nhiệm đối với các
          thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hậu quả hoặc thiệt hại về
          lợi nhuận, dữ liệu, uy tín phát sinh từ việc sử dụng hoặc không thể sử
          dụng dịch vụ.
        </p>
        <p>
          Tổng trách nhiệm của VNTEZ Cloud, nếu có, sẽ không vượt quá số tiền
          bạn đã thanh toán trực tiếp cho dịch vụ liên quan trong vòng 12 tháng
          trước thời điểm phát sinh yêu cầu bồi thường.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Chấm dứt sử dụng" accent={accent}>
        <p>
          Bạn có thể ngừng sử dụng dịch vụ và yêu cầu xóa tài khoản bất kỳ lúc
          nào theo Chính sách bảo mật.
        </p>
        <p>
          VNTEZ Cloud có quyền tạm khóa hoặc chấm dứt quyền truy cập nếu phát
          hiện hành vi vi phạm điều khoản, lạm dụng dịch vụ, gây rủi ro bảo mật
          hoặc theo yêu cầu hợp pháp của cơ quan có thẩm quyền.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Thay đổi điều khoản" accent={accent}>
        <p>
          Chúng tôi có thể cập nhật điều khoản này theo thời gian. Khi có thay
          đổi đáng kể, chúng tôi sẽ thông báo qua email, trong ứng dụng hoặc cập
          nhật ngày hiệu lực ở đầu trang.
        </p>
        <p>
          Việc bạn tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật
          đồng nghĩa với việc bạn chấp nhận phiên bản mới.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Luật áp dụng" accent={accent}>
        <p>
          Các điều khoản này được điều chỉnh và diễn giải theo pháp luật hiện
          hành của nơi VNTEZ Cloud đặt trụ sở kinh doanh chính, trừ khi có quy
          định khác bắt buộc theo luật địa phương của người dùng.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Liên hệ" accent={accent}>
        <p>
          Nếu bạn có câu hỏi về Điều khoản sử dụng, vui lòng liên hệ{" "}
          <span className="font-mono text-foreground/90">legal@vntez.com</span>.
        </p>
      </LegalSection>

      <LegalSection title="Lưu ý" accent={accent}>
        <p className="text-sm text-muted-foreground">
          Đây là mẫu điều khoản tham khảo cho sản phẩm công nghệ/SaaS. Trước khi
          vận hành chính thức, bạn nên nhờ luật sư rà soát để phù hợp với mô
          hình kinh doanh, jurisdiction và nghĩa vụ pháp lý thực tế của VNTEZ
          Cloud.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
