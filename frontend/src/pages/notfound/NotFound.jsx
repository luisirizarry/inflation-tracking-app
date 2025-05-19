import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>
        <p className="notfound-message">
          Sorry, the page you’re looking for doesn’t exist.
        </p>
        <Link to="/" className="notfound-link">
          Go back home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
