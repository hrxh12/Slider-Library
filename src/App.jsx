import Slider from "./components/Slider";
import { slides } from "./data/slides";

function App() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 space-y-16 max-w-6xl mx-auto">
      {/* 1. Multi-Card Carousel */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Multi-Card Carousel
        </h2>
        <Slider
          slides={slides}
          loop={true}
          slidesPerView={{
            mobile: 1,
            tablet: 2,
            desktop: 3
          }}
          gap={16}
          autoplay={true}
          autoplayInterval={3500}
          pauseOnHover={true}
          showArrows={true}
          showDots={true}
          showProgress={true}
          showCounter={true}
        />
      </section>

      {/* 2. Hero Banner Slider */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Hero Banner Slider
        </h2>
        <Slider
          slides={slides}
          loop={true}
          slidesPerView={1}
          autoplay={true}
          autoplayInterval={4000}
          pauseOnHover={true}
          showArrows={true}
          showDots={true}
          showProgress={true}
          showCounter={true}
          renderSlide={(slide) => (
            <div className="relative w-full h-[450px] sm:h-[500px] overflow-hidden rounded-2xl flex items-end">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover brightness-75 scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 p-8 sm:p-12 max-w-2xl text-left text-white">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white mb-3 shadow-lg">
                  {slide.category}
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  {slide.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-gray-200 line-clamp-2">
                  {slide.description}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <button className="px-5 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-bold shadow-lg hover:bg-gray-100 transition">
                    Explore Collection
                  </button>
                  <span className="text-xs text-gray-300">By {slide.author}</span>
                </div>
              </div>
            </div>
          )}
        />
      </section>
    </div>
  );
}

export default App;