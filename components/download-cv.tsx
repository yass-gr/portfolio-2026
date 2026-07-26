"use client";

import { Download } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tooltip";

export default function DownloadCvButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="overflow-hidden">
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={999}
            backgroundOpacity={0}
            saturation={1.8}
            className="px-3 py-2 max-sm:px-1.5 max-sm:py-1 max-lg:px-4 max-lg:py-2.5 cursor-pointer"
          >
            <a
              href="/cv.pdf"
              download
              className="flex items-center justify-center p-1.5 rounded-lg aspect-square text-neutral-700 dark:text-neutral-300"
            >
              <Download size={24} />
            </a>
          </GlassSurface>
        </div>
      </TooltipTrigger>
      <TooltipContent>Download CV</TooltipContent>
    </Tooltip>
  );
}