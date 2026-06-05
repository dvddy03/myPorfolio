import PropTypes from "prop-types";

function TechBadge({ label }) {
  return <span className="tech-badge">{label}</span>;
}

TechBadge.propTypes = {
  label: PropTypes.string.isRequired,
};

export default TechBadge;
