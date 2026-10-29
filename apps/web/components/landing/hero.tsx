import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import { buttonVariants } from "@workspace/ui/components/button"

export function Hero() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 pt-24 pb-14 text-center">
      {/* Main Headline (Strictly 2 lines) */}
      <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-5xl mx-auto">
        <span className="block sm:whitespace-nowrap">Những gì doanh nghiệp bạn</span>
        <span className="block text-[#fb291a]">thực sự cần.</span>
      </h1>

      {/* Action Buttons using Scaled-up Shadcn Button Variants */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/products"
          className={buttonVariants({
            variant: "default",
            size: "xl",
            className: "rounded-full shadow-md hover:shadow-lg gap-2 text-sm sm:text-base font-bold",
          })}
        >
          <span>Khám phá sản phẩm</span>
          <IconArrowRight className="size-4.5" />
        </Link>

        <Link
          href="/#philosophy"
          className={buttonVariants({
            variant: "outline",
            size: "xl",
            className: "rounded-full text-sm sm:text-base font-semibold",
          })}
        >
          Triết lý vận hành
        </Link>
      </div>
    </section>
  )
}
