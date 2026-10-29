import type { Metadata } from "next";
import {
  type LegalAccent,
  LegalChip,
  LegalSection,
  LegalShell,
} from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Chính sách bảo mật dữ liệu cá nhân của người dùng VNTEZ ID và toàn bộ hệ sinh thái VNTEZ.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Chính sách bảo mật | VNTEZ ID",
    description: "Chính sách bảo mật dữ liệu cá nhân của người dùng VNTEZ ID và toàn bộ hệ sinh thái VNTEZ.",
    url: "/privacy",
  },
  twitter: {
    card: "summary",
    title: "Chính sách bảo mật | VNTEZ ID",
    description: "Chính sách bảo mật dữ liệu cá nhân của người dùng VNTEZ ID và toàn bộ hệ sinh thái VNTEZ.",
  },
};

export default function PrivacyPage() {
  const accent: LegalAccent = "info";

  return (
    <LegalShell
      title="Chính Sách Bảo Mật"
      updatedAt="15/10/2026"
      badge="Data Protection"
      accent={accent}
      backHref="/login"
      footerLink={{ href: "/terms", label: "← Điều khoản sử dụng" }}
    >
      <section className="rounded-xl border border-border bg-card/40 p-5 dark:bg-white/[0.025]">
        <h2 className="mb-3 text-base font-semibold text-foreground">
          Tóm tắt nhanh
        </h2>
        <ul className="space-y-1.5 text-sm text-foreground/75">
          <li>
            ✅ Chỉ thu thập dữ liệu cần thiết để vận hành xác thực và đồng bộ.
          </li>
          <li>🔒 Truyền qua HTTPS, xử lý theo nguyên tắc tối thiểu.</li>
          <li>
            🚫 Không bán dữ liệu cá nhân cho bên thứ ba vì mục đích quảng cáo.
          </li>
          <li>🗑️ Bạn có quyền truy cập, chỉnh sửa, xuất hoặc xóa dữ liệu.</li>
        </ul>
      </section>

      <LegalSection n={1} title="Phạm vi áp dụng" accent={accent}>
        <p>
          Chính sách này áp dụng cho các dịch vụ thuộc hệ sinh thái VNTEZ Cloud,
          bao gồm trang xác thực tập trung, Pomoduo, Bonsai Reader, API đồng bộ
          tài khoản và các công cụ liên quan.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Thông tin chúng tôi thu thập" accent={accent}>
        <ul>
          <li>
            <span className="text-foreground/90">Thông tin định danh:</span>{" "}
            email, tên hiển thị, ảnh đại diện nếu đăng nhập bằng OAuth.
          </li>
          <li>
            <span className="text-foreground/90">Thông tin bảo mật:</span> token
            Magic Link đã băm, thời hạn, trạng thái sử dụng, log đăng nhập chống
            lạm dụng.
          </li>
          <li>
            <span className="text-foreground/90">Thông tin kỹ thuật:</span>{" "}
            trình duyệt, hệ điều hành, device info, IP đã xử lý theo chính sách
            lưu trữ, nhật ký server.
          </li>
          <li>
            <span className="text-foreground/90">Nội dung người dùng tạo:</span>{" "}
            ghi chú, phiên làm việc, cài đặt, lịch sử đọc hoặc dữ liệu đồng bộ
            bạn chủ động lưu trên cloud.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={3} title="Mục đích sử dụng dữ liệu" accent={accent}>
        <ul>
          <li>
            Xác thực và bảo mật: gửi Magic Link, xác minh OAuth, phát hiện đăng
            nhập đáng ngờ.
          </li>
          <li>
            Vận hành dịch vụ: đồng bộ giữa các thiết bị, backup, duy trì tính
            sẵn sàng.
          </li>
          <li>
            Hỗ trợ người dùng: trả lời yêu cầu, xử lý sự cố, xác minh danh tính
            khi cần.
          </li>
          <li>
            Cải thiện sản phẩm: phân tích ẩn danh mức độ sử dụng tính năng.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={4} title="Cơ sở pháp lý xử lý dữ liệu" accent={accent}>
        <ul>
          <li>Sự đồng ý của bạn khi đăng ký hoặc sử dụng dịch vụ.</li>
          <li>
            Nhu cầu thực hiện hợp đồng/cam kết dịch vụ giữa bạn và VNTEZ Cloud.
          </li>
          <li>
            Lợi ích hợp pháp trong bảo mật hệ thống, phòng chống gian lận và vận
            hành.
          </li>
          <li>
            Nghĩa vụ pháp lý khi có yêu cầu hợp lệ từ cơ quan có thẩm quyền.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={5} title="Chia sẻ dữ liệu" accent={accent}>
        <p>
          Chúng tôi không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ trong
          các trường hợp hạn chế:
        </p>
        <ul>
          <li>
            Nhà cung cấp hạ tầng lưu trữ, compute, database, CDN theo hợp đồng
            bảo mật.
          </li>
          <li>
            Nhà cung cấp email transactional để gửi Magic Link và thông báo hệ
            thống.
          </li>
          <li>
            Nhà cung cấp OAuth (Google, GitHub, Facebook) khi bạn chủ động sử
            dụng.
          </li>
          <li>
            Cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp bằng văn bản.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={6} title="Lưu trữ và bảo mật" accent={accent}>
        <p>
          Chúng tôi áp dụng mã hóa khi truyền, kiểm soát truy cập, logging bảo
          mật, giới hạn quyền quản trị và sao lưu định kỳ.
        </p>
        <p>
          Magic Token không được lưu nguyên văn trong cơ sở dữ liệu; hệ thống
          lưu dạng hash, thời hạn ngắn, chỉ dùng một lần.
        </p>
        <p>
          Không có hệ thống nào an toàn tuyệt đối. Nếu có sự cố bảo mật ảnh
          hưởng nghiêm trọng, chúng tôi sẽ thông báo theo quy định pháp luật
          hiện hành.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Thời gian lưu trữ" accent={accent}>
        <ul>
          <li>
            Dữ liệu tài khoản lưu trong suốt thời gian bạn sử dụng dịch vụ.
          </li>
          <li>Magic token hết hạn sau 10–15 phút.</li>
          <li>Log bảo mật lưu có thời hạn để điều tra lạm dụng.</li>
          <li>
            Sau khi xóa tài khoản, dữ liệu cá nhân được xóa hoặc ẩn danh hóa
            trong thời hạn hợp lý, trừ khi pháp luật yêu cầu lưu giữ.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={8} title="Quyền của bạn" accent={accent}>
        <p>
          Tùy khu vực pháp lý, bạn có các quyền sau đối với dữ liệu cá nhân của
          mình:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            "Truy cập",
            "Chỉnh sửa",
            "Xóa",
            "Xuất dữ liệu",
            "Hạn chế xử lý",
            "Rút lại đồng ý",
          ].map((r) => (
            <LegalChip key={r} accent={accent}>
              {r}
            </LegalChip>
          ))}
        </div>
        <p className="pt-1">
          Để thực hiện quyền, liên hệ{" "}
          <span className="font-mono text-foreground/90">
            privacy@vntez.com
          </span>
          .
        </p>
      </LegalSection>

      <LegalSection n={9} title="Cookie và công nghệ tương tự" accent={accent}>
        <p>
          Chúng tôi chỉ dùng cookie cần thiết để duy trì phiên đăng nhập, ghi
          nhớ tùy chọn giao diện và bảo mật phiên làm việc.
        </p>
        <p>
          Không dùng cookie quảng cáo hoặc tracking xuyên trang web nếu không có
          sự đồng ý rõ ràng. Bạn có thể quản lý/xóa cookie qua trình duyệt, tuy
          nhiên vô hiệu hóa cookie cần thiết có thể khiến một số chức năng không
          hoạt động.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Dịch vụ của bên thứ ba" accent={accent}>
        <p>
          Dịch vụ có thể chứa liên kết hoặc tích hợp với bên thứ ba. Chính sách
          này không áp dụng cho các bên đó. Chúng tôi khuyến nghị bạn đọc chính
          sách bảo mật của từng dịch vụ bên thứ ba trước khi cung cấp dữ liệu.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Trẻ em" accent={accent}>
        <p>
          Dịch vụ không nhắm đến trẻ em dưới độ tuổi tối thiểu theo pháp luật
          địa phương. Chúng tôi không cố ý thu thập dữ liệu cá nhân của trẻ em
          mà không có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp.
        </p>
      </LegalSection>

      <LegalSection n={12} title="Thay đổi chính sách" accent={accent}>
        <p>
          Chúng tôi có thể cập nhật chính sách này theo thời gian. Ngày hiệu lực
          mới nhất luôn hiển thị ở đầu trang. Với thay đổi đáng kể, chúng tôi sẽ
          thông báo qua email, trong ứng dụng hoặc hình thức phù hợp khác.
        </p>
      </LegalSection>

      <LegalSection n={13} title="Liên hệ" accent={accent}>
        <p>
          Mọi câu hỏi về quyền riêng tư hoặc xử lý dữ liệu, vui lòng liên hệ:
        </p>
        <p className="font-mono text-sm text-foreground/90">
          privacy@vntez.com
          <br />
          security@vntez.com
        </p>
      </LegalSection>

      <LegalSection title="Lưu ý" accent={accent}>
        <p className="text-sm text-muted-foreground">
          Đây là mẫu chính sách bảo mật tham khảo. Trước khi triển khai chính
          thức, bạn nên rà soát với cố vấn pháp lý để đảm bảo tuân thủ GDPR,
          CCPA, Luật Bảo vệ dữ liệu cá nhân và các quy định địa phương liên
          quan.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
