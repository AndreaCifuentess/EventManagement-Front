import Slider from "../components/Slider";
import Categories from "./Categories";
import Establishments from "./Establishments";
import Services from "./Services";
import Contact from "./Contact";


export default function Home() {
    return(
       <>
        <div className="mb-8"><Slider/></div>
        <Categories />
        
        {/* <div className="flex  flex-col items-center justify-center text-center px-4 py-8 w-full bg-[url(https://img.freepik.com/premium-vector/set-mandalas-pastel-colors-every-element-are-isolated-vector-illustration_642878-1073.jpg)] rounded-lg shadow-lg w-full">
            <h1 className="text-4xl m-4 p-4 bg-gray-200 text-gray-800 rounded-lg font-poppins font-bold">We are always ready to give you a wonderful service</h1>
            {/* <h2 className="text-xl bg-black rounded-lg text-white font-script">We provide the best event management services just for you</h2> */}
            {/* <button className="bg-black m-4 p-4 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-900">Get Started</button> *
        </div> */}
        <Establishments />
        <Services />
        <Contact />
       </> 
    );
}