import { Hero } from "@/components/landing/hero"
import { DuckDbGrid } from "@/components/landing/duckdb-grid"
import { ArchitectureFlow } from "@/components/landing/architecture-flow"
import { ProductDeepDives } from "@/components/landing/product-deep-dives"
import { DeveloperExperience } from "@/components/landing/developer-experience"
import { ComparisonTable } from "@/components/landing/comparison-table"
import { DataSovereignty } from "@/components/landing/data-sovereignty"
import { PreFooterCta } from "@/components/landing/pre-footer-cta"

export default function Page() {
  return (
    <main>
      {/* HERO SECTION */}
      <Hero />

      {/* 6-CARD GRID (OVERVIEW) */}
      <DuckDbGrid />

      {/* 1. KIẾN TRÚC LIÊN THÔNG (THE UNIFIED ENGINE) */}
      <ArchitectureFlow />

      {/* 2. TRÌNH DIỄN SÂU SẢN PHẨM CHỦ LỰC (PRODUCT DEEP DIVES - ZIG-ZAG) */}
      <ProductDeepDives />

      {/* 3. TRẢI NGHIỆM LẬP TRÌNH VIÊN & SDK (DEVELOPER EXPERIENCE) */}
      <DeveloperExperience />

      {/* 4. BẢNG ĐỐI CHIẾU NĂNG LỰC CẠNH TRANH (COMPARISON TABLE) */}
      <ComparisonTable />

      {/* 5. TRIẾT LÝ VẬN HÀNH & CHỦ QUYỀN DỮ LIỆU (DATA SOVEREIGNTY) */}
      <DataSovereignty />

      {/* 6. KHỐI KÊU GỌI HÀNH ĐỘNG CUỐI TRANG (PRE-FOOTER CTA) */}
      <PreFooterCta />
    </main>
  )
}
