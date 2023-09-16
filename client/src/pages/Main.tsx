import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const Main: React.FC = () => {
  return (
    <div className="h-screen flex flex-col justify-between">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
};

export default Main;
