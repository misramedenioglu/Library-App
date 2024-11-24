// hata mesaj kısmı
import PropTypes from "prop-types"; 
import "../style/toast.css";

const ToastNotification = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`toast-notification ${type}`}>
      <p>{message}</p>
    </div>
  );
};

// PropTypes kullanarak props'ların doğrulamasını yapıyoruz
ToastNotification.propTypes = {
  message: PropTypes.string.isRequired, // message string olmalı ve zorunlu
  type: PropTypes.oneOf(["success", "error"]).isRequired, // type sadece "success" veya "error" olabilir ve zorunlu
};

export default ToastNotification;
