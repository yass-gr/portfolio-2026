"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";

const iconSlugs: Record<string, string> = {
  React: "react",
  Express: "express",
  "React Router": "reactrouter",
  SQLite: "sqlite",
  "Tailwind CSS": "tailwindcss",
  "Passport.js": "passport",
  i18next: "i18next",
  Vite: "vite",
  PHP: "php",
  MySQL: "mysql",
  jQuery: "jquery",
  GSAP: "greensock",
  "TypeScript": "typescript",
  ffmpeg: "ffmpeg",
  Python: "python",
  TensorFlow: "tensorflow",
  "Next.js": "nextdotjs",
  Stripe: "stripe",
  PostgreSQL: "postgresql",
  GraphQL: "graphql",
  Redis: "redis",
  Docker: "docker",
  "Vue.js": "vuedotjs",
  AWS: "amazonwebservices",
  Tailwind: "tailwindcss",
  Svelte: "svelte",
  MongoDB: "mongodb",
  "D3.js": "d3dotjs",
  Go: "go",
  WebRTC: "webrtc",
  gRPC: "grpc",
  Flutter: "flutter",
  Firebase: "firebase",
  "Socket.io": "socketdotio",
};

interface ProjectCardProps {
  title: string;
  slug: string;
  tags: string[];
  description?: string;
  githubUrl?: string;
  previewUrl?: string;
}

export default function ProjectCard({
  title,
  slug,
  tags,
  description,
  githubUrl = "#",
  previewUrl,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    const media = mediaRef.current;
    const overlay = overlayRef.current;
    const video = videoRef.current;
    const videoWrap = videoWrapRef.current;
    if (!card || !media || !overlay) return;
    if (window.innerWidth < 1024) return;

    gsap.set(overlay, { y: 200 });

    const tl = gsap.timeline({ paused: true });

    tl.to(
      overlay,
      {
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      },
      0,
    );

    tl.to(
      media,
      {
        scale: 1.7,
        duration: 0.9,
        ease: "power2.inOut",
      },
      0,
    );

    if (videoWrap) {
      tl.fromTo(
        videoWrap,
        { opacity: 0, scale: 0.85, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        0.15,
      );
    }

    const handleEnter = () => {
      overlay.style.backdropFilter = "blur(60px)";
      overlay.style.webkitBackdropFilter = "blur(60px)";
      if (video && !video.src) {
        video.src = `/projects/${slug}/showcase.webm`;
        video.load();
        video.addEventListener("canplay", () => video.play().catch(() => {}), { once: true });
      } else {
        video?.play().catch(() => {});
      }
      tl.play();
    };

    const handleLeave = () => {
      overlay.style.backdropFilter = "blur(0px)";
      overlay.style.webkitBackdropFilter = "blur(0px)";
      video?.pause();
      tl.reverse();
    };

    card.addEventListener("mouseenter", handleEnter);
    card.addEventListener("mouseleave", handleLeave);

    return () => {
      card.removeEventListener("mouseenter", handleEnter);
      card.removeEventListener("mouseleave", handleLeave);
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative rounded-[60px] [clip-path:inset(0_round_60px)] cursor-pointer max-sm:rounded-[60px] max-sm:[clip-path:inset(0_round_60px)] max-lg:rounded-[60px] max-lg:[clip-path:inset(0_round_60px)]"
    >
      <div ref={mediaRef} className="w-full aspect-square overflow-hidden">
        <img
          src={`/projects/${slug}/image.png`}
          alt={title}
          className="w-full aspect-square object-cover"
          loading="lazy"
        />
      </div>
      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col justify-end p-6 pb-8 bg-gradient-to-t from-black/60 to-transparent max-sm:px-5 max-sm:py-4 max-sm:pb-4 max-lg:p-8 max-lg:pb-8"
        style={{
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
          transition: "backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease",
          opacity: 1,
        }}
      >
        <h3 className="font-panchang-bold text-4xl text-white max-sm:text-lg max-lg:text-3xl">{title}</h3>
        {description && (
          <p className="font-clash-grotesk-regular text-sm text-white/80 mt-2 max-sm:text-[10px] max-lg:text-base">{description}</p>
        )}
        <div className="flex items-end justify-between mt-4 max-sm:mt-2 max-lg:mt-5">
          <div className="flex gap-3 max-sm:gap-1.5 max-sm:flex-wrap max-lg:gap-3 max-lg:flex-wrap">
            {tags.map((tag) => {
              const iconSlug = iconSlugs[tag];
              const color = "white";
              return (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/15 max-sm:px-1.5 max-sm:py-0.5 max-lg:px-4 max-lg:py-2"
                  >
                    {iconSlug && (
                      <img
                        src={`https://cdn.simpleicons.org/${iconSlug}/${color}`}
                        alt={tag}
                        title={tag}
                        loading="lazy"
                        className="w-4 h-4 max-sm:w-2.5 max-sm:h-2.5 max-lg:w-6 max-lg:h-6"
                      />
                    )}
                    <span className="text-xs font-clash-grotesk-regular text-white/70 max-sm:text-[8px] max-lg:text-base">{tag}</span>
                  </span>
              );
            })}
          </div>
          <div className="flex items-center gap-3 max-sm:gap-3 max-lg:gap-3">
            <a href={githubUrl} className="text-white/60 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 max-sm:w-5 max-sm:h-5 max-lg:w-8 max-lg:h-8">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            {previewUrl && previewUrl !== "#" && (
              <a href={previewUrl} className="text-white/60 hover:text-white transition-colors">
                <ArrowUpRight className="w-5 h-5 max-sm:w-5 max-sm:h-5 max-lg:w-8 max-lg:h-8" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[92%] aspect-video pointer-events-none">
        <div ref={videoWrapRef} className="w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </div>
  );
}
