// src/components/common/SectionHeader.jsx
import { Link } from 'react-router-dom';

function SectionHeader({ title, actionLink, actionText }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {actionLink && (
        <Link to={actionLink} className="action-btn">
          {actionText}
        </Link>
      )}
    </div>
  );
}

export default SectionHeader;