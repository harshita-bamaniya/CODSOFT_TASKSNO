function ActionButtons({ captions, onReset }) {

  const downloadCaptions = () => {
    const content = `
Professional:
${captions.professional}

Creative:
${captions.creative}

Detailed:
${captions.detailed}

Social:
${captions.social}
`;

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "captions.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="action-buttons">

      <button onClick={downloadCaptions}>
        💾 Download Captions
      </button>

      <button onClick={onReset}>
        🔄 Generate Another
      </button>

    </div>
  );
}

export default ActionButtons;