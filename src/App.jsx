import Slider from "./components/Slider";
import {slides} from "./data/slides";

function App() {
  return (
    <div className="App">
      <h1>Slider Library</h1>
      <Slider slides={slides} loop={true} slidesPerView={1} autoplay={true} autoplayInterval={3000} />
    </div>
  );
}

export default App;