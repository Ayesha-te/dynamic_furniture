import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet /> {/* This will render all nested routes */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
