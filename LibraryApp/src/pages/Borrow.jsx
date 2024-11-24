import { useState, useEffect } from "react";
import axios from "axios";
import "../style/Borrow.css";

const Borrow = () => {
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerMail, setBorrowerMail] = useState("");
  const [borrowingDate, setBorrowingDate] = useState("");
  const [bookId, setBookId] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [bookStock, setBookStock] = useState("");
  const [borrows, setBorrows] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedBorrowId, setSelectedBorrowId] = useState(null);

  // Ödünç alınan kitapları yüklemek için useEffect
  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const response = await axios.get(
          "https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/borrows"
        );
        console.log(response.data);
        setBorrows(response.data);
      } catch (error) {
        console.error("Ödünç alınan kitaplar getirilemedi:", error);
      }
    };
    fetchBorrows();
  }, []);

  // Kitap ödünç alma veya güncelleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stok kontrolü
    if (parseInt(bookStock) <= 0) {
      setMessage("Bu kitabın stoğu tükenmiştir. Lütfen başka bir kitap seçin.");
      return;
    }

    const borrowData = {
      borrowerName,
      borrowerMail,
      borrowingDate,
      bookForBorrowingRequest: {
        id: bookId,
        name: bookName,
        publicationYear: parseInt(bookYear),
        stock: parseInt(bookStock),
      },
    };

    try {
      if (selectedBorrowId) {
        // Güncelleme işlemi
        const response = await axios.put(
          `hhttps://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/borrows/${selectedBorrowId}`,
          borrowData
        );
        if (response.status === 200) {
          setBorrows((prev) =>
            prev.map((borrow) =>
              borrow.id === selectedBorrowId ? response.data : borrow
            )
          );
          setMessage("Kitap başarıyla güncellendi!");
        } else {
          setMessage("Kitap güncellenemedi!");
        }
      } else {
        // Yeni kayıt işlemi
        const response = await axios.post(
          "https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/borrows",
          borrowData
        );
        if (response.status === 201) {
          setBorrows([...borrows, response.data]);

          // Stok azaltma işlemi
          setBookStock((prevStock) => prevStock - 1);

          setMessage("Kitap başarıyla ödünç alındı!");
        } else {
          setMessage("Kitap ödünç alınamadı!");
        }
      }
      // Formu temizle
      resetForm();
    } catch (error) {
      setMessage("Bir hata oluştu! Lütfen tekrar deneyin.");
      console.error("Kitap işlemi hatası:", error);
    }
  };

  // Formu temizlemek için yardımcı fonksiyon
  const resetForm = () => {
    setBorrowerName("");
    setBorrowerMail("");
    setBorrowingDate("");
    setBookId("");
    setBookName("");
    setBookYear("");
    setBookStock("");
    setSelectedBorrowId(null);
  };

  // Silme işlemi
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://awkward-abby-egitim-2c6ebaa9.koyeb.app/api/v1/borrows/${id}`
      );
      if (response.status === 200) {
        setBorrows((prev) => prev.filter((borrow) => borrow.id !== id));
        setMessage("Kitap başarıyla silindi!");
      } else {
        setMessage("Kitap silinemedi!");
      }
    } catch (error) {
      setMessage("Bir hata oluştu! Lütfen tekrar deneyin.");
      console.error("Kitap silme hatası:", error);
    }
  };

  // Güncelleme için seçilen öğeyi form alanlarına yükleme
  const handleEdit = (borrow) => {
    setBorrowerName(borrow.borrowerName);
    setBorrowerMail(borrow.borrowerMail);
    setBorrowingDate(borrow.borrowingDate);
    setBookId(borrow.book.id);
    setBookName(borrow.book.name);
    setBookYear(borrow.book.publicationYear);
    setBookStock(borrow.book.stock);
    setSelectedBorrowId(borrow.id);
  };

  return (
    <div className="borrow-container">
      <div>
        <h2>📖 Kitap Ödünç Alma</h2>
        <p className="borrow-p">
          Burada istediğiniz kitabı ödünç almak için işlem yapabilirsiniz.
        </p>
        <form onSubmit={handleSubmit} className="borrow-form">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="E-posta"
            value={borrowerMail}
            onChange={(e) => setBorrowerMail(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Tarih"
            value={borrowingDate}
            onChange={(e) => setBorrowingDate(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Kitap ID"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Kitap Adı"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Yayın Yılı"
            value={bookYear}
            onChange={(e) => setBookYear(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Stok"
            value={bookStock}
            onChange={(e) => setBookStock(e.target.value)}
            required
          />
          <button type="submit" className="borrow-button">
            {selectedBorrowId ? "Güncelle" : "Ödünç Al"}
          </button>
        </form>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("başarıyla") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      <div className="borrow-list">
        {borrows.map((borrow) => (
          <div className="borrow-card" key={borrow.id}>
            <h4>{borrow.book.name}</h4>
            <p>
              <strong>Ad:</strong> {borrow.borrowerName}
            </p>
            <p>
              <strong>Mail:</strong> {borrow.borrowerMail}
            </p>
            <p>
              <strong>Tarih:</strong> {borrow.borrowingDate}
            </p>
            <p>
              <strong>Kitap ID:</strong> {borrow.book.id}
            </p>
            <div className="button-container">
              <button
                className="update-button"
                onClick={() => handleEdit(borrow)}
              >
                Güncelle
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(borrow.id)}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Borrow;
