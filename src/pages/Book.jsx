import { useEffect, useState } from "react";
import axios from "axios";
import "../style/Book.css";

function Book() {
  const [books, setBooks] = useState([]); // Kitaplar listesi
  const [newBook, setNewBook] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    authorId: "",
    publisherId: "",
    categoryIds: [],
  }); // Yeni kitap bilgisi
  const [editingBook, setEditingBook] = useState(null); // Düzenlenmekte olan kitap
  const [message, setMessage] = useState(""); // Kullanıcı mesajı

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);

  // Kitapları API'den çek
  useEffect(() => {
    axios
      .get("https://payable-kissee-elif-ce7b7688.koyeb.app/api/v1/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Kitapları çekerken hata oluştu: ", error);
        setMessage("Kitaplar yüklenirken bir hata oluştu.");
      });

    axios
      .get("https://payable-kissee-elif-ce7b7688.koyeb.app/api/v1/authors")
      .then((response) => {
        setAuthors(response.data);
      })
      .catch((error) => {
        console.error("yazarları çekerken hata oluştu: ", error);
        setMessage("yazarlar yüklenirken bir hata oluştu.");
      });

    axios
      .get("https://payable-kissee-elif-ce7b7688.koyeb.app/api/v1/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("yazarları çekerken hata oluştu: ", error);
        setMessage("yazarlar yüklenirken bir hata oluştu.");
      });

    axios
      .get("https://payable-kissee-elif-ce7b7688.koyeb.app/api/v1/publishers")
      .then((response) => {
        setPublishers(response.data);
      })
      .catch((error) => {
        console.error("yazarları çekerken hata oluştu: ", error);
        setMessage("yazarlar yüklenirken bir hata oluştu.");
      });
  }, []);

  // Yeni kitap ekleme
  const addBook = (e) => {
    e.preventDefault();

    // Boş alan kontrolü
    if (
      !newBook.name ||
      !newBook.publicationYear ||
      !newBook.stock ||
      !newBook.authorId ||
      !newBook.publisherId ||
      !newBook.categoryIds.length
    ) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    const bookData = {
      ...newBook,
      author: { id: newBook.authorId }, // Add the author ID to the book data
      publisher: { id: newBook.publisherId }, // Add the publisher ID to the book data
      categories: newBook.categoryIds.map((id) => ({ id })), // Mapping categories
    };

    axios
      .post(
        "https://payable-kissee-elif-ce7b7688.koyeb.app/api/v1/books",
        bookData
      )
      .then((response) => {
        if (response.status === 201) {
          setMessage("Kitap başarıyla eklendi!");

          axios
            .get("https://payable-kissee-elif-ce7b7688.koyeb.app/api/v1/books")
            .then((response) => {
              setBooks(response.data);
            })
            .catch((error) => {
              console.error("Kitapları çekerken hata oluştu: ", error);
              setMessage("Kitaplar yüklenirken bir hata oluştu.");
            });

          setNewBook({
            name: "",
            publicationYear: "",
            stock: "",
            authorId: "",
            publisherId: "",
            categoryIds: [],
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

  const handleEdit = (book) => {
    setEditingBook(book); // Set the book to be edited
    setNewBook({
      name: book.name,
      publicationYear: book.publicationYear,
      stock: book.stock,
      authorId: book.author.id,
      publisherId: book.publisher.id,
      categoryIds: book.categories.map((category) => category.id),
    }); // Pre-fill the form with the book data
  };

  // Kitap güncelleme
  const updateBook = (e) => {
    e.preventDefault();

    if (
      // Check if all necessary fields are filled
      !newBook.name ||
      !newBook.publicationYear ||
      !newBook.stock ||
      !newBook.authorId ||
      !newBook.publisherId ||
      !newBook.categoryIds.length
    ) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    const updatedBookData = {
      ...editingBook, // Retain the existing book data
      name: newBook.name,
      publicationYear: newBook.publicationYear,
      stock: newBook.stock,
      author: { id: newBook.authorId }, // Update the author ID
      publisher: { id: newBook.publisherId }, // Update the publisher ID
      categories: newBook.categoryIds.map((id) => ({ id })), // Update the categories
    };

    axios
      .put(
        `https://payable-kissee-elif-ce7b7688.koyeb.app/api/v1/books/${editingBook.id}`,
        updatedBookData
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setMessage("Kitap başarıyla güncellendi!");
          setBooks(
            books.map((book) =>
              book.id === response.data.id ? response.data : book
            )
          );
          setEditingBook(null);
          setNewBook({
            name: "",
            publicationYear: "",
            stock: "",
            authorId: "",
            publisherId: "",
            categoryIds: [],
          });
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
        `https://payable-kissee-elif-ce7b7688.koyeb.app/api/v1/books/${id}`
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
      <form
        onSubmit={editingBook ? updateBook : addBook}
        className="form-container"
      >
        <input
          type="text"
          placeholder="Kitap adı"
          value={newBook.name}
          onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Yayın yılı"
          value={newBook.publicationYear}
          onChange={(e) =>
            setNewBook({ ...newBook, publicationYear: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Stok miktarı"
          value={newBook.stock}
          onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
        />
        <div>
          <label>Author:</label>
          <select
            value={newBook.authorId}
            onChange={(e) =>
              setNewBook({ ...newBook, authorId: e.target.value })
            }
            required
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Categories:</label>
          <select
            multiple
            value={newBook.categoryIds}
            onChange={(e) =>
              setNewBook({
                ...newBook,
                categoryIds: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              })
            }
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Publisher:</label>
          <select
            value={newBook.publisherId}
            onChange={(e) =>
              setNewBook({ ...newBook, publisherId: e.target.value })
            }
            required
          >
            <option value="">Select Publisher</option>
            {publishers.map((publisher) => (
              <option key={publisher.id} value={publisher.id}>
                {publisher.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">{editingBook ? "Güncelle" : "Ekle"}</button>
      </form>

      {/* Bildirim Mesajı (Form ve Kitap Listesi Arasında) */}
      {message && (
        <div
          className={`message ${
            message.includes("başarıyla") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Kitap Listesi */}
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <h3>{book.name}</h3>
            <p>Yazar: {book.author?.name}</p>
            <p>Yayıncı: {book.publisher?.name}</p>
            <p>Yayın Yılı: {book.publicationYear}</p>
            <p>Stok: {book.stock}</p>
            <strong>Categories:</strong>{" "}
            {book.categories?.map((category) => category.name).join(", ")}
            <button onClick={() => handleEdit(book)}>Düzenle</button>
            <button onClick={() => deleteBook(book.id)}>Sil</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Book;
