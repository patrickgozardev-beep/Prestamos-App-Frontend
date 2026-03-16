// src/services/cloudinaryService.ts

const CLOUD_NAME = "dmt9yobr2";

export const uploadToCloudinary = async (file: File, type: 'dni' | 'pago') => {
  const formData = new FormData();
  formData.append("file", file);
  
  // Seleccionamos el preset que configuraste en Cloudinary
  const preset = type === 'dni' ? 'preset_dni' : 'preset_pagos';
  formData.append("upload_preset", preset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Error al subir a Cloudinary");

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Error:", error);
    throw error;
  }
};