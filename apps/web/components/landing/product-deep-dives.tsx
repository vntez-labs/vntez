"use client"

import React from "react"
import { StorageDeepDive } from "./deep-dives/storage-deep-dive"
import { IdDeepDive } from "./deep-dives/id-deep-dive"
import { PosDeepDive } from "./deep-dives/pos-deep-dive"

export function ProductDeepDives() {
  return (
    <section id="products" className="mx-auto max-w-6xl px-6 py-28 sm:py-36 space-y-36 sm:space-y-48">
      {/* BLOCK 1: VNTEZ STORAGE & EDGE (NVME CLUSTER) */}
      <StorageDeepDive />

      {/* BLOCK 2: OAUTH 2.0, PKCE & SOCIAL LOGIN (ZAG) */}
      <IdDeepDive />

      {/* BLOCK 3: BMAN POS & OFFLINE ENGINE */}
      <PosDeepDive />
    </section>
  )
}
