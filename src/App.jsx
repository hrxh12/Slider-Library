import Slider from "./components/Slider";
import {slides} from "./data/slides";

function App() {
  return (
    <div className="App">
      <h1>Slider Library</h1>
      <Slider slides={slides}/>
    </div>
  );
}

export default App;