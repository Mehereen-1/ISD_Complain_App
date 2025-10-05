 
import * as ImagePicker from "expo-image-picker";

export const pickAndUploadImage = async (): Promise<string | null> => {
  // Step 1: pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
    base64: true,
  });

  if (result.canceled) return null;

  try {
    // Step 2: prepare formData
    const formData = new FormData();
    formData.append("file", `data:image/jpeg;base64,${result.assets[0].base64}`);
    formData.append("upload_preset", "complaint_app"); // must match Cloudinary preset

    // Step 3: upload
    const res = await fetch("https://api.cloudinary.com/v1_1/dqevzhbey/image/upload", {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
      },
    });

    const json = await res.json();
    console.log("📸 Cloudinary response:", json);

    if (json.secure_url) {
      return json.secure_url;
    } else {
      console.error("❌ Cloudinary upload failed:", json);
      return null;
    }
  } catch (err) {
    console.error("⚠️ Cloudinary upload error:", err);
    return null;
  }
};


