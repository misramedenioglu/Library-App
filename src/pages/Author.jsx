import { useEffect, useState } from "react";
import axios from "axios";
import "../style/Author.css";

function Author() {
  const [authors, setAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState({ name: "", country: "", birthDate: "" });
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [message, setMessage] = useState("");

  // Yazarları çekme
  useEffect(() => {
    axios
      .get("https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/authors")
      .then((response) => setAuthors(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Yazar ekleme
  const addAuthor = () => {
    if (!newAuthor.name || !newAuthor.country || !newAuthor.birthDate) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    axios
      .post("https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/authors", newAuthor)
      .then((response) => {
        if (response.status === 201) {
          setMessage("Yazar başarıyla eklendi!");
          setAuthors((prev) => [...prev, response.data]);
          setNewAuthor({ name: "", country: "", birthDate: "" });
        } else {
          setMessage("Yazar eklenemedi!");
        }
      })
      .catch((error) => console.error(error));
  };

  // Yazar güncelleme
  const updateAuthor = () => {
    if (!editingAuthor || !editingAuthor.name || !editingAuthor.country || !editingAuthor.birthDate) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    axios
      .put(
        `https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/authors/${editingAuthor.id}`,
        editingAuthor
      )
      .then((response) => {
        if (response.status === 200) {
          setMessage("Yazar başarıyla güncellendi!");
          setAuthors((prev) =>
            prev.map((author) =>
              author.id === editingAuthor.id ? response.data : author
            )
          );
          setEditingAuthor(null);
        } else {
          setMessage("Yazar güncellenemedi!");
        }
      })
      .catch((error) => console.error(error));
  };

  // Yazar silme
  const deleteAuthor = (id) => {
    axios
      .delete(`https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/authors/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setMessage("Yazar başarıyla silindi!");
          setAuthors(authors.filter((author) => author.id !== id));
        } else {
          setMessage("Yazar silinemedi!");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="author-page-container">
      <h2>✍️ Yazar Sayfası</h2>
      <p>Burada yazarlar hakkında bilgi edinebilirsiniz.</p>

      {/* Yazar Ekleme veya Güncelleme Formu */}
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Sayfa yenilenmesini engelle
          if (editingAuthor) {
            updateAuthor(); // Yazar güncelleme
          } else {
            addAuthor(); // Yeni yazar ekleme
          }
        }}
        className="author-form"
      >
        <input
          type="text"
          placeholder="Yazar adı"
          value={editingAuthor ? editingAuthor.name : newAuthor.name}
          onChange={(e) =>
            editingAuthor
              ? setEditingAuthor({ ...editingAuthor, name: e.target.value })
              : setNewAuthor({ ...newAuthor, name: e.target.value })
          }
          className="author-input"
        />
        <input
          type="date"
          placeholder="Doğum tarihi"
          value={editingAuthor ? editingAuthor.birthDate : newAuthor.birthDate}
          onChange={(e) =>
            editingAuthor
              ? setEditingAuthor({ ...editingAuthor, birthDate: e.target.value })
              : setNewAuthor({ ...newAuthor, birthDate: e.target.value })
          }
          className="author-input"
        />
        <input
          placeholder="Doğum yeri"
          value={editingAuthor ? editingAuthor.country : newAuthor.country}
          onChange={(e) =>
            editingAuthor
              ? setEditingAuthor({ ...editingAuthor, country: e.target.value })
              : setNewAuthor({ ...newAuthor, country: e.target.value })
          }
          className="author-input"
        />
        <button type="submit" className="author-button">
          {editingAuthor ? "Güncelle" : "Ekle"}
        </button>
      </form>

      {/* Bildirim Mesajı */}
      {message && <div className="author-message">{message}</div>}

      {/* Yazarlar Listesi */}
      <div className="author-list-container">
        <h3>Yazarlar Listesi</h3>
        {authors.length === 0 ? (
          <p>Henüz yazar eklenmedi.</p>
        ) : (
          <ul className="author-list">
            {authors.map((author) => (
              <li key={author.id} className="author-item">
                <div>
                  <strong>{author.name}</strong> - {author.country} - {author.birthDate}
                </div>
                <div className="author-buttons">
                  <button
                    onClick={() => deleteAuthor(author.id)}
                    className="author-delete-btn"
                  >
                    Sil
                  </button>
                  <button
                    onClick={() => setEditingAuthor(author)}
                    className="author-edit-btn"
                  >
                    Güncelle
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Author;
