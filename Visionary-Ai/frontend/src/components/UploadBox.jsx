function UploadBox({ onImageSelect }) {
  return (
    <label className="upload-box">
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onImageSelect(e.target.files[0])}
      />

      <h2>📤 Upload Image</h2>
      <p>Click here to browse an image</p>
    </label>
  );
}

export default UploadBox;