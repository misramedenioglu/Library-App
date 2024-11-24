import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Author from "./pages/Author";
import Book from "./pages/Book";
import Borrow from "./pages/Borrow";
import Category from "./pages/Category";
import Publisher from "./pages/Publisher";

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
