import{useState} from "react";

function Slider({slides}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => {
            const isLastSlide = prevIndex === slides.length - 1;
            if(isLastSlide){
                return prevIndex;
            }
            return prevIndex + 1;
        });
    };
    const goToPreviousSlide=()=>{
        setCurrentIndex((prevIndex)=>{
            const isFirstSlide =prevIndex === 0;
            if(isFirstSlide){
                return prevIndex;
            }
            return prevIndex - 1;
        });
    };
    return(
        <div className="slider"> 
        <div className="w-full overflow-hidden">
            <div 
                className="flex transition-transform duration-300"
                style={{
                    transform:`translateX(-${currentIndex *100}%)`
                }}
            >
                {slides.map((slide, index)=>(
                    <div 
                        key={slide.id}
                        className="min-w-full"
                    >
                        <h2>{slide.title}</h2>
                        <p>{slide.description}</p>
                    </div>
                ))}
            </div>
        </div>
            <button onClick={goToPreviousSlide}>Previous</button>
            <button onClick={goToNextSlide}>Next</button>
        </div>
    );
}
export default Slider;