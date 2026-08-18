import{useEffect, useState} from "react";

function Slider({slides, loop = false, slidesPerView=1, autoplay = false, autoplayInterval = 3000, pauseOnHover=true, pauseOnInteraction=true}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Is the mouse currently over the slider?
    const [isHovered, setIsHovered] = useState(false);
    // Did the user recently interact with the slider?
    const [isInteracting, setIsInteracting] = useState(false);

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = Math.max(0, slides.length - slidesPerView );
            const isLastSlide = prevIndex >= maxIndex;
            if(isLastSlide){
                if(loop){
                    return 0;
                }
                return prevIndex;
            }
            return prevIndex + 1;
        });
    };
    const goToPreviousSlide=()=>{
        setCurrentIndex((prevIndex)=>{
            const maxIndex=Math.max(0,slides.length-slidesPerView);
            const isFirstSlide =prevIndex === 0;
            if(isFirstSlide){
                if(loop){
                    return maxIndex;
                }
                return prevIndex;
            }
            return prevIndex - 1;
        });
    };

    // for Dots Navigation
    const goToSlide=(index)=>{
        setCurrentIndex(index);
    };
    useEffect(()=>{
        if(!autoplay){
            return;
        }

        //isPaused
        if(isHovered){
            return;
        }

        //isInteracting
        if(isInteracting){
            return;
        }

        //create a timer.
        const timer=setInterval(()=>{
            goToNextSlide();
        },autoplayInterval);

        return ()=>{
            clearInterval(timer);
        };
    },[autoplay,autoplayInterval,isHovered,isInteracting]);


    useEffect(() => {
        if (!isInteracting) return;

        const timer = setTimeout(() => {
            setIsInteracting(false);
        }, autoplayInterval);

        return () => {
            clearTimeout(timer);
        };
    }, [isInteracting, autoplayInterval]);
    

    useEffect(()=>{
        const handleKeyDown=(event)=>{
            //Right
            if(event.key==="ArrowRight"){
                goToNextSlide();
            }

            //left
            if(event.key==="ArrowLeft"){
                goToPreviousSlide();
            }
        };

        window.addEventListener("keydown",handleKeyDown);

        return()=>{
            window.removeEventListener("keydown",handleKeyDown);
        };
    },[]);
    //empty slides

    if(!slides||slides.length===0){
        return(
            <div className="w-full max-w-4xl mx-auto px-4">
                <p>No slides available.</p>
            </div>
        );
    }

    return(
        <div className="w-full max-w-4xl mx-auto px-4"> 
        <div 
        className="w-full overflow-hidden rounded-2xl shadow-lg"
        // {/*Mouse Enters */}
        onMouseEnter={()=>{
            if(pauseOnHover){
                setIsHovered(true);
            }
        }}
        // {/* Mouse Leave */}
        onMouseLeave={()=>{
        if(pauseOnHover){
                setIsHovered(false);
            }
        }}        
        >


            <div 
                className="flex transition-transform duration-300"
                style={{
                    transform:`translateX(-${currentIndex *(100/slidesPerView)}%)`
                }}
            >
                {slides.map((slide, index)=>(
                    <div 
                        key={slide.id}
                            style={{
                                minWidth: `${100 / slidesPerView}%`
                            }}
                    >
                        <img src={slide.image} alt={slide.title} className="w-full h-96 object-cover" />
                        <div className="bg-white p-6">
                            <h2 className="text-2xl font-bold">
                                {slide.title}
                            </h2>
                            <p className="mt-2 text-gray-600">
                                {slide.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
            <button
            onClick={()=>{
                if(pauseOnInteraction){
                    setIsInteracting(true);
                }
                goToPreviousSlide()}}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 shadow flex items-center justify-center text-white">← </button>
            <button 
            onClick={()=>{
                if(pauseOnInteraction){
                    setIsInteracting(true);
                }
                goToNextSlide()}}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 shadow flex items-center justify-center text-white">→</button>
            
            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4">

                {slides.map((slide,index)=>(
                    <button
                    key={slide.id}
                    onClick={()=>{
                        if(pauseOnInteraction){
                            setIsInteracting(true);
                        }
                        goToSlide(index)}}
                    className={
                        currentIndex===index ? "text-black":"text-gray-400"
                    }
                    >
                        ●
                    </button>
                ))}
            </div>

        </div>
    );
}
export default Slider;