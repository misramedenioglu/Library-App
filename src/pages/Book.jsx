import { useEffect, useState } from "react";
import axios from "axios";
import "../style/Book.css";

function Book() {
  const [books, setBooks] = useState([]); // Kitaplar listesi
  const [newBook, setNewBook] = useState({
    name: "",
    publicationYear: 0,
    stock: 0,
    author: { name: "", birthDate: "", country: "" },
    publisher: { name: "", establishmentYear: 0, address: "" },
    categories: [{ name: "", description: "" }],
  }); // Yeni kitap bilgisi
  const [editingBook, setEditingBook] = useState(null); // Düzenlenmekte olan kitap
  const [message, setMessage] = useState(""); // Kullanıcı mesajı

  // Kitapları API'den çek
  useEffect(() => {
    axios
      .get("https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Kitapları çekerken hata oluştu: ", error);
        setMessage("Kitaplar yüklenirken bir hata oluştu.");
      });
  }, []);

  // Yeni kitap ekleme
  const addBook = (e) => {
    e.preventDefault();

    // Boş alan kontrolü
    const {
      name,
      publicationYear,
      stock,
      author,
      publisher,
      categories,
    } = newBook;

    if (
      !name ||
      !publicationYear ||
      !stock ||
      !author.name ||
      !publisher.name ||
      !categories[0].name ||
      !categories[0].description
    ) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    axios
      .post("https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/books", newBook)
      .then((response) => {
        if (response.status === 201) {
          setMessage("Kitap başarıyla eklendi!");
          setBooks((prevBooks) => [...prevBooks, response.data]);
          setNewBook({
            name: "",
            publicationYear: 0,
            stock: 0,
            author: { name: "", birthDate: "", country: "" },
            publisher: { name: "", establishmentYear: 0, address: "" },
            categories: [{ name: "", description: "" }],
          });
        } else {
          setMessage("Kitap eklenemedi!");
        }
      })
      .catch((error) => {
        console.error("Kitap eklerken hata oluştu: ", error);
        setMessage("Kitap eklenirken bir hata oluştu.");
      });
  };

  // Kitap güncelleme
  const updateBook = (e) => {
    e.preventDefault();

    // Boş alan kontrolü
    const {
      name,
      publicationYear,
      stock,
      author,
      publisher,
      categories,
    } = editingBook || {};

    if (
      !name ||
      !publicationYear ||
      !stock ||
      !author.name ||
      !publisher.name ||
      !categories[0].name ||
      !categories[0].description
    ) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    axios
      .put(
        `https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/books/${editingBook.id}`,
        editingBook
      )
      .then((response) => {
        if (response.status === 200) {
          setMessage("Kitap başarıyla güncellendi!");
          setBooks((prevBooks) =>
            prevBooks.map((book) =>
              book.id === editingBook.id ? editingBook : book
            )
          );
          setEditingBook(null);
        } else {
          setMessage("Kitap güncellenemedi!");
        }
      })
      .catch((error) => {
        console.error("Kitap güncellenirken hata oluştu: ", error);
        setMessage("Kitap güncellenirken bir hata oluştu.");
      });
  };

  // Kitap silme
  const deleteBook = (id) => {
    axios
      .delete(
        `https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/books/${id}`
      )
      .then((response) => {
        if (response.status === 200) {
          setMessage("Kitap başarıyla silindi!");
          setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
        } else {
          setMessage("Kitap silinemedi!");
        }
      })
      .catch((error) => {
        console.error("Kitap silinirken hata oluştu: ", error);
        setMessage("Kitap silinirken bir hata oluştu.");
      });
  };

  return (
    <div className="page-container">
      <h2>📖 Kitap Sayfası</h2>
      <p>Burada kitaplar hakkında bilgi edinebilirsiniz.</p>

      {/* Kitap Ekleme ve Düzenleme Formu */}
      <form onSubmit={editingBook ? updateBook : addBook} className="form-container">
        <input
          type="text"
          placeholder="Kitap adı"
          value={editingBook ? editingBook.name : newBook.name}
          onChange={(e) =>
            editingBook
              ? setEditingBook({ ...editingBook, name: e.target.value })
              : setNewBook({ ...newBook, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Yayın yılı"
          value={editingBook ? editingBook.publicationYear : newBook.publicationYear}
          onChange={(e) =>
            editingBook
              ? setEditingBook({
                  ...editingBook,
                  publicationYear: Number(e.target.value),
                })
              : setNewBook({
                  ...newBook,
                  publicationYear: Number(e.target.value),
                })
          }
        />
        <input
          type="number"
          placeholder="Stok miktarı"
          value={editingBook ? editingBook.stock : newBook.stock}
          onChange={(e) =>
            editingBook
              ? setEditingBook({
                  ...editingBook,
                  stock: Number(e.target.value),
                })
              : setNewBook({
                  ...newBook,
                  stock: Number(e.target.value),
                })
          }
        />
        <input
          type="text"
          placeholder="Yazar adı"
          value={editingBook ? editingBook.author.name : newBook.author.name}
          onChange={(e) =>
            editingBook
              ? setEditingBook({
                  ...editingBook,
                  author: { ...editingBook.author, name: e.target.value },
                })
              : setNewBook({
                  ...newBook,
                  author: { ...newBook.author, name: e.target.value },
                })
          }
        />
        <input
          type="text"
          placeholder="Kategori adı"
          value={editingBook ? editingBook.categories[0].name : newBook.categories[0].name}
          onChange={(e) =>
            editingBook
              ? setEditingBook({
                  ...editingBook,
                  categories: [
                    { ...editingBook.categories[0], name: e.target.value },
                  ],
                })
              : setNewBook({
                  ...newBook,
                  categories: [
                    { ...newBook.categories[0], name: e.target.value },
                  ],
                })
          }
        />
        <textarea
          placeholder="Kategori açıklaması"
          value={editingBook ? editingBook.categories[0].description : newBook.categories[0].description}
          onChange={(e) =>
            editingBook
              ? setEditingBook({
                  ...editingBook,
                  categories: [
                    { ...editingBook.categories[0], description: e.target.value },
                  ],
                })
              : setNewBook({
                  ...newBook,
                  categories: [
                    { ...newBook.categories[0], description: e.target.value },
                  ],
                })
          }
        />
        <button type="submit">{editingBook ? "Güncelle" : "Ekle"}</button>
      </form>

      {/* Kullanıcı Mesajı */}
      {message && <div className="message">{message}</div>}

      {/* Kitaplar Listesi */}
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-item">
            <h3>{book.name}</h3>
            <button onClick={() => setEditingBook(book)}>Düzenle</button>
            <button onClick={() => deleteBook(book.id)}>Sil</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Book;
