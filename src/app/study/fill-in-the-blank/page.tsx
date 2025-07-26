"use client";
import FillInTheBlankLevel from "@/components/FillInTheBlankLevel";
import { FloatingIcons } from "@/components/FloatingIcons";

export default function SelectFillInTheBlankLevel() {
  return (
    <div>
      <FloatingIcons count={25} />
      <FillInTheBlankLevel />
    </div>
  );
}
