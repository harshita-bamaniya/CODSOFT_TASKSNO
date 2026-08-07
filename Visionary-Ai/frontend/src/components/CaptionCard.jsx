import { FaRegCopy } from "react-icons/fa";
import { toast } from "react-toastify";

function CaptionCard({ title, text }) {

  const copyText = async () => {

    await navigator.clipboard.writeText(text);

    toast.success(`${title} copied!`);
  };

  return (
    <div className="caption-card">

      <div className="card-header">

        <h3>{title}</h3>

        <button
          className="copy-btn"
          onClick={copyText}
        >
          <FaRegCopy />
        </button>

      </div>

      <p>{text}</p>

    </div>
  );
}

export default CaptionCard;