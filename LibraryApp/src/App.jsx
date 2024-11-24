import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; 
import Author from "./pages/author";
import Book from "./pages/Book";
import Borrow from "./pages/borrow";
import Category from "./pages/category";
import Publisher from "./pages/publisher";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/author" element={<Author />} />
        <Route path="/book" element={<Book />} />
        <Route path="/borrow" element={<Borrow />} />
        <Route path="/category" element={<Category />} />
        <Route path="/publisher" element={<Publisher />} />
      </Routes>
    </Router>
  );
}

export default App;
