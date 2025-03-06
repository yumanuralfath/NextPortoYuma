"use client";

import { useState } from "react";
import Image from "next/image";

const UploadWithProgress = () => {
  const [file, setFile] = useState(null); // Menyimpan file yang dipilih
  const [progress, setProgress] = useState(0); // Progres upload
  const [uploadResult, setUploadResult] = useState(null); // Hasil upload

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file terlebih dahulu!");
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64File = reader.result;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/uploadFile", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100
            );
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            setUploadResult(res.data);
            alert("Upload berhasil!");
          } else {
            alert("Upload gagal: " + xhr.statusText);
          }
        };

        xhr.onerror = () => {
          alert("Terjadi kesalahan saat upload.");
        };

        xhr.send(JSON.stringify({ file: base64File }));
      };
    } catch (error) {
      console.error("Error saat upload:", error);
      alert("Upload gagal!");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {progress > 0 && (
        <div>
          <progress value={progress} max="100"></progress>
          <span>{progress}%</span>
        </div>
      )}
      {uploadResult && (
        <div>
          <h4>Hasil Upload:</h4>
          <Image
            width={400}
            height={400}
            src={uploadResult.secure_url}
            alt="Uploaded Image"
          />
        </div>
      )}
    </div>
  );
};

export default UploadWithProgress;
