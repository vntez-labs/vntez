import {
  IconHeartHandshake,
  IconLockOpen,
  IconShieldCheck,
  IconEyeCheck,
  IconSparkles,
} from "@tabler/icons-react"

export function PhilosophySection() {
  const values = [
    {
      title: "Zero-Egress: Tự do dữ liệu",
      subtitle: "Data Sovereignty",
      desc: "Lưu trữ chuẩn S3 và tải về với 0 đồng chi phí. Dữ liệu thuộc về bạn, không rào cản, không chi phí ẩn.",
      icon: IconLockOpen,
      accent: "text-[#f77241] border-[#fb291a]/30 bg-[#fb291a]/10",
    },
    {
      title: "Offline-First: Sự an tâm tuyệt đối",
      subtitle: "Unshakable Resilience",
      desc: "Vận hành liên tục ngay cả khi đứt mạng Internet. Dữ liệu lưu cục bộ và tự động đồng bộ khi online.",
      icon: IconShieldCheck,
      accent: "text-cyan-500 border-cyan-500/30 bg-cyan-500/10",
    },
    {
      title: "Chủ động phát hiện sự cố & Thấu hiểu người dùng",
      subtitle: "Continuous Observability",
      desc: "Tự động bắt lỗi runtime và vẽ lại hành trình khách hàng, xử lý sự cố trước khi người dùng phàn nàn.",
      icon: IconEyeCheck,
      accent: "text-purple-500 border-purple-500/30 bg-purple-500/10",
    },
    {
      title: "Give to receive more",
      subtitle: "Cho đi để nhận lại nhiều hơn",
      desc: "Tạo ra công cụ tử tế, minh bạch và giải phóng sức lao động. Giá trị kinh tế và niềm tin sẽ tự khắc nhân lên.",
      icon: IconHeartHandshake,
      accent: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
    },
  ]

  return (
    <section id="philosophy" className="mx-auto max-w-6xl px-6 py-20 border-t border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#fb291a]/30 bg-[#fb291a]/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#fb291a] mb-4">
          <IconSparkles className="size-3.5" />
          <span>TRIẾT LÝ SẢN PHẨM // PRODUCT PHILOSOPHY</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          The things you actually need.
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          Chúng tôi không cố gắng tạo ra thêm những tính năng rườm rà. vntez tập trung vào những điều căn bản nhưng quan trọng nhất: sự an tâm, tính minh bạch và sự tự chủ của bạn.
        </p>
      </div>

      {/* 4 Value Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {values.map((v, i) => {
          const IconComp = v.icon

          return (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e]/75 p-6 hover:shadow-md dark:hover:border-slate-700 transition-all relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex size-10 items-center justify-center rounded-xl border ${v.accent}`}>
                    <IconComp className="size-5" />
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {v.subtitle}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {v.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {v.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
