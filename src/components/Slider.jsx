import { useEffect, useState, useRef, useCallback } from "react";

function Slider({
    slides = [],
    loop = false,
    slidesPerView = 1,
    autoplay = false,
    autoplayInterval = 3000,
    pauseOnHover = true,
    pauseOnInteraction = true,
    showArrows = true,
    showDots = true,
    showCounter = false,
    gap = 16,
    renderSlide = null,
    className = ""
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [currentSlidesPerView, setCurrentSlidesPerView] = useState(1);
    const [touchStart, setTouchStart] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);
    const containerRef = useRef(null);

    const getSlidesPerView = useCallback(() => {
        if (typeof slidesPerView === "number") {
            return slidesPerView;
        }
        if (typeof window === "undefined") {
            return slidesPerView?.desktop || 1;
        }

        const width = window.innerWidth;
        if (width < 640) {
            return slidesPerView?.mobile || 1;
        }
        if (width < 1024) {
            return slidesPerView?.tablet || slidesPerView?.mobile || 1;
        }
        return slidesPerView?.desktop || 1;
    }, [slidesPerView]);

    const maxIndex = Math.max(0, slides.length - currentSlidesPerView);
    const isAtStart = currentIndex === 0;
    const isAtEnd = currentIndex >= maxIndex;

    const goToNextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => {
            const currentMax = Math.max(0, slides.length - currentSlidesPerView);
            const isLast = prevIndex >= currentMax;
            if (isLast) {
                return loop ? 0 : prevIndex;
            }
            return prevIndex + 1;
        });
    }, [currentSlidesPerView, loop, slides.length]);

    const goToPreviousSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => {
            const currentMax = Math.max(0, slides.length - currentSlidesPerView);
            const isFirst = prevIndex === 0;
            if (isFirst) {
                return loop ? currentMax : prevIndex;
            }
            return prevIndex - 1;
        });
    }, [currentSlidesPerView, loop, slides.length]);

    const goToSlide = (index) => {
        const target = Math.min(Math.max(0, index), maxIndex);
        setCurrentIndex(target);
    };

    // Touch Gestures
    const handleTouchStart = (event) => {
        setTouchStart(event.touches[0].clientX);
        setTouchStartY(event.touches[0].clientY);
    };

    const handleTouchEnd = (event) => {
        if (touchStart === null) return;

        const touchEnd = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;

        const distance = touchStart - touchEnd;
        const verticalDistance = touchStartY - touchEndY;

        if (Math.abs(distance) <= Math.abs(verticalDistance)) {
            setTouchStart(null);
            setTouchStartY(null);
            return;
        }

        const minSwipeDistance = 40;

        if (distance > minSwipeDistance) {
            if (pauseOnInteraction) setIsInteracting(true);
            goToNextSlide();
        } else if (distance < -minSwipeDistance) {
            if (pauseOnInteraction) setIsInteracting(true);
            goToPreviousSlide();
        }

        setTouchStart(null);
        setTouchStartY(null);
    };

    // Keyboard Navigation
    const handleKeyDown = (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            if (pauseOnInteraction) setIsInteracting(true);
            goToNextSlide();
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            if (pauseOnInteraction) setIsInteracting(true);
            goToPreviousSlide();
        }
    };

    // Autoplay Timer
    useEffect(() => {
        if (!autoplay || slides.length <= currentSlidesPerView) return;
        if (isHovered && pauseOnHover) return;
        if (isInteracting && pauseOnInteraction) return;

        const timer = setInterval(() => {
            goToNextSlide();
        }, autoplayInterval);

        return () => clearInterval(timer);
    }, [autoplay, autoplayInterval, isHovered, isInteracting, currentSlidesPerView, pauseOnHover, pauseOnInteraction, goToNextSlide, slides.length]);

    // Resume autoplay after user interaction cooldown
    useEffect(() => {
        if (!isInteracting) return;

        const timer = setTimeout(() => {
            setIsInteracting(false);
        }, autoplayInterval * 1.5);

        return () => clearTimeout(timer);
    }, [isInteracting, autoplayInterval]);

    // Handle Responsive Breakpoints
    useEffect(() => {
        const handleResize = () => {
            const spv = getSlidesPerView();
            setCurrentSlidesPerView(spv);
            // Adjust current index if it exceeds new max
            setCurrentIndex((prev) => {
                const newMax = Math.max(0, slides.length - spv);
                return Math.min(prev, newMax);
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [getSlidesPerView, slides.length]);

    // Empty state
    if (!slides || slides.length === 0) {
        return (
            <div className={`w-full max-w-4xl mx-auto p-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 ${className}`}>
                <div className="w-12 h-12 mx-auto mb-3 text-gray-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-gray-500 font-medium">No slides available.</p>
            </div>
        );
    }

    const totalDots = Math.max(1, slides.length - currentSlidesPerView + 1);

    return (
        <div
            ref={containerRef}
            className={`group relative w-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-3xl ${className}`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-roledescription="carousel"
            aria-label="Content Carousel"
        >
            {/* Viewport Container */}
            <div
                className="relative w-full overflow-hidden rounded-2xl shadow-md"
                onMouseEnter={() => {
                    if (pauseOnHover) setIsHovered(true);
                }}
                onMouseLeave={() => {
                    if (pauseOnHover) setIsHovered(false);
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Counter Badge */}
                {showCounter && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/40 text-white/90 border border-white/10 shadow-sm tracking-wider">
                        {String(currentIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                    </div>
                )}

                {/* Slides Track */}
                <div
                    className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / currentSlidesPerView)}%)`
                    }}
                >
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id || index}
                            className="flex-shrink-0 h-full"
                            style={{
                                width: `${100 / currentSlidesPerView}%`,
                                padding: currentSlidesPerView > 1 && gap ? `0 ${gap / 2}px` : "0"
                            }}
                        >
                            {renderSlide ? (
                                renderSlide(slide, index, currentIndex === index)
                            ) : (
                                <div className="group/card relative h-full flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md">
                                    <div className="relative w-full h-80 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        {slide.image ? (
                                            <img
                                                src={slide.image}
                                                alt={slide.title || `Slide ${index + 1}`}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-500">
                                                <svg className="w-12 h-12 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Category / Tag Badge */}
                                        {slide.category && (
                                            <div className="absolute top-3.5 left-3.5">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white shadow-sm border border-white/20">
                                                    {slide.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Card Body */}
                                    <div className="p-6 flex flex-col flex-grow justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
                                                {slide.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                                                {slide.description}
                                            </p>
                                        </div>

                                        {(slide.author || slide.date) && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                                {slide.author && <span>{slide.author}</span>}
                                                {slide.date && <span>{slide.date}</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Left & Right Chevron Arrows (Embedded inside viewport with Glassmorphism) */}
                {showArrows && slides.length > currentSlidesPerView && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous slide"
                            disabled={!loop && isAtStart}
                            onClick={() => {
                                if (pauseOnInteraction) setIsInteracting(true);
                                goToPreviousSlide();
                            }}
                            className={`absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-white/40 dark:border-gray-700/40 text-gray-800 dark:text-white shadow-lg transition-all duration-200 ${
                                !loop && isAtStart
                                    ? "opacity-30 cursor-not-allowed pointer-events-none"
                                    : "hover:bg-white dark:hover:bg-gray-900 hover:scale-105 active:scale-95 opacity-90 group-hover:opacity-100"
                            }`}
                        >
                            <svg className="w-5 h-5 -translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            aria-label="Next slide"
                            disabled={!loop && isAtEnd}
                            onClick={() => {
                                if (pauseOnInteraction) setIsInteracting(true);
                                goToNextSlide();
                            }}
                            className={`absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-white/40 dark:border-gray-700/40 text-gray-800 dark:text-white shadow-lg transition-all duration-200 ${
                                !loop && isAtEnd
                                    ? "opacity-30 cursor-not-allowed pointer-events-none"
                                    : "hover:bg-white dark:hover:bg-gray-900 hover:scale-105 active:scale-95 opacity-90 group-hover:opacity-100"
                            }`}
                        >
                            <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Dots Navigation (Pill Indicators) */}
            {showDots && totalDots > 1 && (
                <div className="flex items-center justify-center gap-2 mt-5" role="tablist" aria-label="Slide dots">
                    {Array.from({ length: totalDots }).map((_, index) => {
                        const isActive = currentIndex === index;
                        return (
                            <button
                                key={index}
                                role="tab"
                                aria-selected={isActive}
                                aria-label={`Go to slide ${index + 1}`}
                                onClick={() => {
                                    if (pauseOnInteraction) setIsInteracting(true);
                                    goToSlide(index);
                                }}
                                className={`relative h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                                    isActive
                                        ? "w-8 bg-indigo-600 dark:bg-indigo-500 shadow-sm"
                                        : "w-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                                }`}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Slider;