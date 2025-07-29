"use client";
import FlashcardsLevel from "@/components/FlashcardsLevel";
import { FloatingIcons } from "@/components/FloatingIcons";

export default function SelectFlashcardsLevel() {
  return (
    <div>
      <FloatingIcons count={10} />
      <FlashcardsLevel />
    </div>
  );
}
