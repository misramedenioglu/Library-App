import { useEffect, useState } from "react";
import axios from "axios";
import "../style/Publisher.css";

function Publisher() {
  const [publishers, setPublishers] = useState([]);
  const [newPublisher, setNewPublisher] = useState({
    name: "",
    establishmentYear: "",
    address: "",
  });
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [message, setMessage] = useState("");

  // Yayımcıları çekme
  useEffect(() => {
    fetchPublishers();

    // Body'ye sınıf ekleme
    document.body.classList.add("publisher-page");

    // Temizlik: Body'deki sınıfı kaldırma
    return () => {
      document.body.classList.remove("publisher-page");
    };
  }, []);

  const fetchPublishers = () => {
    axios
      .get("https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/publishers")
      .then((response) => setPublishers(response.data))
      .catch((error) => console.error(error));
  };

  // Yayımcı ekleme fonksiyonu
  const addPublisher = (e) => {
    e.preventDefault();
    if (
      !newPublisher.name ||
      !newPublisher.establishmentYear ||
      !newPublisher.address
    ) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    axios
      .post(
        "https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/publishers",
        newPublisher
      )
      .then((response) => {
        if (response.status === 201) {
          setMessage("Yayımcı başarıyla eklendi!");
          fetchPublishers(); // Veriyi yeniden çekiyoruz
          setNewPublisher({ name: "", establishmentYear: "", address: "" });
        } else {
          setMessage("Yayımcı eklenemedi!");
        }
      })
      .catch((error) => console.error(error));
  };

  // Yayımcı güncelleme fonksiyonu
  const updatePublisher = (e) => {
    e.preventDefault();
    if (
      !editingPublisher ||
      !editingPublisher.name ||
      !editingPublisher.establishmentYear ||
      !editingPublisher.address
    ) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    axios
      .put(
        `https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/publishers/${editingPublisher.id}`,
        editingPublisher
      )
      .then((response) => {
        if (response.status === 200) {
          setMessage("Yayımcı başarıyla güncellendi!");
          setPublishers((prev) =>
            prev.map((publisher) =>
              publisher.id === editingPublisher.id
                ? response.data // Backend'den dönen güncellenmiş veriyi ekliyoruz
                : publisher
            )
          );
          setEditingPublisher(null);
        } else {
          setMessage("Yayımcı güncellenemedi!");
        }
      })
      .catch((error) => console.error(error));
  };

  // Yayımcı silme fonksiyonu
  const deletePublisher = (id) => {
    axios
      .delete(
        `https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/publishers/${id}`
      )
      .then((response) => {
        if (response.status === 200) {
          setMessage("Yayımcı başarıyla silindi!");
          setPublishers((prev) =>
            prev.filter((publisher) => publisher.id !== id)
          );
        } else {
          setMessage("Yayımcı silinemedi!");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="publisher-page-container">
      <h2>📚 Yayımcı Sayfası</h2>
      <p>Burada yayımcılar hakkında bilgi edinebilirsiniz.</p>

      {/* Yeni Yayımcı Ekleme Formu */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editingPublisher) {
            updatePublisher(e);
          } else {
            addPublisher(e);
          }
        }}
        className="publisher-form"
      >
        <input
          type="text"
          placeholder="Yayımcı adı"
          value={editingPublisher ? editingPublisher.name : newPublisher.name}
          onChange={(e) =>
            editingPublisher
              ? setEditingPublisher({
                  ...editingPublisher,
                  name: e.target.value,
                })
              : setNewPublisher({ ...newPublisher, name: e.target.value })
          }
          className="publisher-input"
        />
        <input
          type="number"
          placeholder="Kuruluş yılı"
          value={
            editingPublisher
              ? editingPublisher.establishmentYear
              : newPublisher.establishmentYear
          }
          onChange={(e) =>
            editingPublisher
              ? setEditingPublisher({
                  ...editingPublisher,
                  establishmentYear: e.target.value,
                })
              : setNewPublisher({
                  ...newPublisher,
                  establishmentYear: e.target.value,
                })
          }
          className="publisher-input"
        />
        <textarea
          placeholder="Adres"
          rows="3"
          value={
            editingPublisher ? editingPublisher.address : newPublisher.address
          }
          onChange={(e) =>
            editingPublisher
              ? setEditingPublisher({
                  ...editingPublisher,
                  address: e.target.value,
                })
              : setNewPublisher({ ...newPublisher, address: e.target.value })
          }
          className="publisher-textarea"
        ></textarea>
        <button type="submit" className="publisher-button">
          {editingPublisher ? "Güncelle" : "Ekle"}
        </button>
      </form>

      {/* Bildirim Mesajı */}
      {message && <div className="publisher-message">{message}</div>}

      {/* Yayımcılar Listesi */}
      <div className="publisher-list">
        <h3>Yayımcılar Listesi</h3>
        {publishers.length === 0 ? (
          <p>Henüz yayımcı eklenmedi.</p>
        ) : (
          <ul>
            {publishers.map((publisher) => (
              <li key={publisher.id} className="publisher-item">
                <div>
                  <strong>{publisher.name}</strong> -{" "}
                  {publisher.establishmentYear} - {publisher.address}
                </div>
                <div className="publisher-buttons">
                  <button
                    onClick={() => deletePublisher(publisher.id)}
                    className="publisher-delete-btn"
                  >
                    Sil
                  </button>
                  <button
                    onClick={() => setEditingPublisher(publisher)}
                    className="publisher-edit-btn"
                  >
                    Düzenle
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

export default Publisher;
