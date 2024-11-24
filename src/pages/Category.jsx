import { useEffect, useState } from "react";
import axios from "axios";
import "../style/Category.css";


function Category() {
  // Kategoriler listesi
  const [categories, setCategories] = useState([]);

  // Yeni kategori verisi
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  // Düzenlenmekte olan kategori
  const [editingCategory, setEditingCategory] = useState(null);

  // Kullanıcı mesajı
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Body'ye özel sınıf ekleme
    document.body.classList.add("category-body");

    // Bileşen temizlenirken sınıfı kaldırma
    return () => {
      document.body.classList.remove("category-body");
    };
  }, []);

  // Kategorileri çekme
  useEffect(() => {
    axios
      .get("https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Kategori ekleme fonksiyonu
  const addCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.description) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    axios
      .post("https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/categories", newCategory)
      .then((response) => {
        if (response.status === 201) {
          setMessage("Kategori başarıyla eklendi!");
          setCategories((prev) => [...prev, response.data]); // Sunucudan dönen veriyi ekler
          setNewCategory({ name: "", description: "" });
        } else {
          setMessage("Kategori eklenemedi!");
        }
      })
      .catch((error) => console.error(error));
  };

  // Kategori güncelleme fonksiyonu
  const updateCategory = (e) => {
    e.preventDefault();

    if (
      !editingCategory ||
      !editingCategory.name ||
      !editingCategory.description
    ) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    axios
      .put(
        `https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/categories/${editingCategory.id}`,
        editingCategory
      )
      .then((response) => {
        if (response.status === 200) {
          setMessage("Kategori başarıyla güncellendi!");
          setCategories((prev) =>
            prev.map((category) =>
              category.id === editingCategory.id ? editingCategory : category
            )
          );
          setEditingCategory(null);
        } else {
          setMessage("Kategori güncellenemedi!");
        }
      })
      .catch((error) => console.error(error));
  };

  // Kategori silme fonksiyonu
  const deleteCategory = (id) => {
    axios
      .delete(`https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/categories/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setMessage("Kategori başarıyla silindi!");
          setCategories(categories.filter((category) => category.id !== id));
        } else {
          setMessage("Kategori silinemedi!");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="category-page">
      <h2 className="category-page__title">📂 Kategori Sayfası</h2>
      <p className="category-page__description">
        Burada kategoriler hakkında bilgi edinebilirsiniz.📂
      </p>

      {/* Yeni Kategori Ekleme Formu */}
      <form
        className="category-page__form"
        onSubmit={editingCategory ? updateCategory : addCategory}
      >
        <input
          className="category-page__input"
          type="text"
          placeholder="Kategori adı"
          value={editingCategory ? editingCategory.name : newCategory.name}
          onChange={(e) =>
            editingCategory
              ? setEditingCategory({ ...editingCategory, name: e.target.value })
              : setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
        <textarea
          className="category-page__textarea"
          placeholder="Kategori açıklaması"
          value={
            editingCategory
              ? editingCategory.description
              : newCategory.description
          }
          onChange={(e) =>
            editingCategory
              ? setEditingCategory({
                  ...editingCategory,
                  description: e.target.value,
                })
              : setNewCategory({ ...newCategory, description: e.target.value })
          }
        ></textarea>
        <button className="category-page__button" type="submit">
          {editingCategory ? "Güncelle" : "Ekle"}
        </button>
      </form>

      {/* Bildirim Mesajı */}
      {message && <div className="category-page__message">{message}</div>}

      {/* Kategoriler Listesi */}
      <div>
        <h3 className="category-page__list-title">Kategoriler Listesi</h3>
        {categories.length === 0 ? (
          <p className="category-page__empty">Henüz kategori eklenmedi.</p>
        ) : (
          <ul className="category-page__list">
            {categories.map((category) => (
              <li className="category-page__list-item" key={category.id}>
                <strong className="category-page__list-item-name">
                  {category.name}
                </strong>{" "}
                - {category.description}
                <div className="category-page__list-item-buttons">
                  <button
                    className="category-page__button-delete"
                    onClick={() => deleteCategory(category.id)}
                  >
                    Sil
                  </button>
                  <button
                    className="category-page__button-edit"
                    onClick={() => setEditingCategory(category)}
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

export default Category;
