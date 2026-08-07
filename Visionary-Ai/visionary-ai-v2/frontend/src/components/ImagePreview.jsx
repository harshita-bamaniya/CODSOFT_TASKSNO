function ImagePreview({ image }) {
  if (!image) return null;

  return (
    <div className="preview-card">
      <img
        src={URL.createObjectURL(image)}
        alt="Preview"
        className="preview-image"
      />

      <p className="image-name">{image.name}</p>
    </div>
  );
}

export default ImagePreview;