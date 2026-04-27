import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function RootLayout() {
  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
}