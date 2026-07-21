"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLocationArrow, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { projects } from "@/data";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import MagicButton from "./ui/MagicButton";

type Project = {
  id: number;
  title: string;
  des: string;
  img: string;
  stacks: string[];
  link: string;
  gallery?: string[]; // array of image URLs
  videoUrl?: string; // YouTube video URL
  categories?: string[]; // <-- Add this field for category filter
};

const PROJECTS_PER_PAGE = 6;

// Handles watch?v=, youtu.be/ short links, and /embed/ URLs, and tolerates
// trailing params (&t=30s, the ?si= the Share button appends). Returns null on
// anything unrecognised so the caller can skip the iframe rather than render a
// broken one.
const getYouTubeId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const v = parsed.searchParams.get("v");
      if (v) return v;

      const embedMatch = parsed.pathname.match(/^\/(?:embed|v|shorts)\/([^/?]+)/);
      if (embedMatch) return embedMatch[1];
    }
    return null;
  } catch {
    return null;
  }
};

const RecentProjects = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const openModal = (project: Project) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
  }, []);

  // Get all unique categories
  const allCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(projects.flatMap((project: any) => project.categories || []))
      ),
    ],
    []
  );

  // Filter projects by category
  const filteredProjects = useMemo(
    () =>
      selectedCategory === "All"
        ? projects
        : projects.filter((project: any) =>
            project.categories?.includes(selectedCategory)
          ),
    [selectedCategory]
  );

  // Paging is bounded by the *filtered* list, not the full one — every category
  // holds fewer than one page, so bounding on projects.length left Next enabled
  // and paged the grid into an empty slice.
  const canPrev = startIndex > 0;
  const canNext = startIndex + PROJECTS_PER_PAGE < filteredProjects.length;

  const handlePrev = useCallback(() => {
    setStartIndex((prev) => Math.max(prev - PROJECTS_PER_PAGE, 0));
  }, []);

  const handleNext = useCallback(() => {
    setStartIndex((prev) => {
      const nextIndex = prev + PROJECTS_PER_PAGE;
      if (nextIndex >= filteredProjects.length) return prev;
      return nextIndex;
    });
  }, [filteredProjects.length]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setStartIndex(0);
  };

  // Arrow keys page the carousel only while it holds focus, so ordinary
  // keyboard scrolling still works everywhere else on the page.
  const handleCarouselKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" && canPrev) {
      e.preventDefault();
      handlePrev();
    }
    if (e.key === "ArrowRight" && canNext) {
      e.preventDefault();
      handleNext();
    }
  };

  const visibleProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  // Lock background scroll while the dialog is open, restoring whatever the
  // previous overflow value was rather than assuming it was "".
  useEffect(() => {
    if (!isModalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isModalOpen]);

  // Move focus into the dialog on open, return it to the opener on close.
  useEffect(() => {
    if (!isModalOpen) {
      lastFocusedRef.current?.focus();
      return;
    }
    dialogRef.current?.focus();
  }, [isModalOpen]);

  // Escape closes; Tab cycles within the dialog instead of escaping to the page.
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeModal]);

  const videoId = selectedProject?.videoUrl
    ? getYouTubeId(selectedProject.videoUrl)
    : null;

  return (
    <div className="py-20">
      <h2 className="heading">
        A small selection of {' '}
        <span className="text-purple">recent projects</span>
      </h2>
      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-3 justify-center mb-10 mt-8">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 rounded-full border font-semibold transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm
              ${selectedCategory === cat
                ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-transparent scale-110 shadow-lg"
                : "bg-white dark:bg-[#18181b] text-neutral-700 dark:text-neutral-200 border-gray-300 hover:bg-purple-100 dark:hover:bg-[#232336] hover:scale-105"}
            `}
            style={{ boxShadow: selectedCategory === cat ? '0 4px 24px 0 rgba(139,92,246,0.15)' : undefined }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div
        role="group"
        aria-label="Project carousel"
        tabIndex={0}
        onKeyDown={handleCarouselKeyDown}
        className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
      <div className="flex justify-between items-center mb-4 px-4">
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg hover:scale-110 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous projects"
        >
          <FaChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg hover:scale-110 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next projects"
        >
          <FaChevronRight size={20} />
        </button>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 items-start justify-center p-4 gap-12 mt-10">
        {visibleProjects.map((project: Project) => (
          <div
            key={project.id}
            className="flex items-stretch justify-center cursor-pointer"
            onClick={() => openModal(project)}
          >
            <CardContainer className="w-full lg:min-h-[24rem] h-auto flex flex-col justify-between">
              <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white">
                  {project.title}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {project.des}
                </CardItem>
                <CardItem translateZ="50" className="w-full mt-4 flex-grow">
                  <div className="relative flex items-center justify-center overflow-hidden h-[20vh] lg:h-[30vh] mb-5"> 
                    <div className="relative w-full h-full overflow-hidden lg:rounded-3xl">
                    </div>
                    <Image
                          src={project.img}
                          height="1000"
                          width="1000"
                          className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                          alt={project.title}
                        />
                  </div>
                </CardItem>
                <CardItem className="flex-grow">
                  <p>Tech Stack:</p>
                  <div className="flex flex-wrap items-center mt-5 gap-2 mb-5">
                    {project.stacks.map((item: string, i: number) => (
                      <span
                        key={i}
                        className="py-2 px-3 text-xs lg:text-base rounded-lg text-center bg-[#10132E] text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </CardItem>
                <CardItem
                  translateZ={20}
                  as={Link}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white mt-4 ml-auto flex justify-end"
                >
                  Try now →
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        ))}
      </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && selectedProject && (
        <>
          {/* z-[6000] clears the floating nav's z-[5000]; the nav is fixed, so a
              body overflow lock alone would not have kept it off the backdrop. */}
          <div
            className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              className="bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative animate-fadeIn focus:outline-none"
              onClick={e => e.stopPropagation()} // Prevent modal content click from closing
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-purple-500 transition-colors"
                aria-label="Close"
              >
                ×
              </button>
              <div className="flex flex-col items-center">
                {/* YouTube Video section if available */}
                {videoId && (
                  <div className="w-full mb-4 aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={selectedProject.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                )}
                {/* Gallery section if available */}
                {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                  <div className="flex gap-2 mb-4 w-full justify-center">
                    {selectedProject.gallery.slice(0, 3).map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        height={120}
                        width={180}
                        className="object-cover rounded-lg border w-36 h-24"
                        alt={selectedProject.title + ' gallery ' + (idx + 1)}
                      />
                    ))}
                  </div>
                )}
                <h3 id="project-modal-title" className="text-2xl font-bold mb-2 text-purple-600 dark:text-purple-400">{selectedProject.title}</h3>
                <p className="text-neutral-700 dark:text-neutral-200 mb-4 text-center">{selectedProject.des}</p>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {selectedProject.stacks.map((item: string, i: number) => (
                    <span
                      key={i}
                      className="py-1 px-3 text-xs rounded-lg bg-[#10132E] text-white"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-lg shadow hover:scale-105 transition-transform"
                >
                  Visit Project
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-center items-center mt-10">
        <a href="https://github.com/usama-469?tab=repositories" rel="noopener noreferrer" target="_blank">
          <MagicButton 
            title="View more projects"
            icon={<FaLocationArrow />} 
            position='right' 
          />
        </a>
      </div>
    </div>
  );
};

export default RecentProjects;