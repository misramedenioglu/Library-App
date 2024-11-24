import { Link } from 'react-router-dom';
import "../style/Home.css";

function Home() {
  return (
    <div className="home-page">
      <h1>
  Hoşgeldiniz! Kütüphane Web Sitemize <span>📚</span>
</h1>

      <p>Bu sitede kitaplar, kategoriler, yayımcılar ve daha fazlası hakkında bilgi edinebilirsiniz. 📖 İlgilendiğiniz sayfalara göz atmak için aşağıdaki butonlara tıklayın:</p>
      
      <div className='home-container'>
        <Link to="/book">
          <button>📚 Kitap Sayfası</button>
        </Link>
        <Link to="/publisher">
          <button>📖 Yayımcı Sayfası</button>
        </Link>
        <Link to="/category">
          <button>🏷️ Kategori Sayfası</button> 
        </Link>
        <Link to="/author">
          <button>✍️ Yazar Sayfası</button>
        </Link>
        <Link to="/borrow">
          <button>📥 Kitap Alma Sayfası</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
