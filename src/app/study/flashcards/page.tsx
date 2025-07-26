"use client";
import FlashcardsLevel from "@/components/FlashcardsLevel";
import { FloatingIcons } from "@/components/FloatingIcons";

export default function SelectFlashcardsLevel() {
  return (
    <div>
      <FloatingIcons count={15} />
      <FlashcardsLevel />
    </div>
  );
}
