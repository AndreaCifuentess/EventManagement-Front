// src/Layout.jsx
import { Outlet } from "react-router-dom";
import DiscountBanner from "./DiscountBanner";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children}){
    return(
        <div className="flex flex-col min-h-screen w-full font-poppins">
        <Navbar/>
        <DiscountBanner/>
        <main className="min-h-auto">{children}</main>
          <Outlet />

        <Footer/>
        </div>
    );
}