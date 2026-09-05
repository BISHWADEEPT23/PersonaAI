import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export async function uploadMediaAsset(
  userId: string,
  file: File | Blob,
  type: "image" | "audio"
): Promise<{ storageUrl: string; downloadUrl: string }> {
  const extension = type === "image" ? "webp" : "webm";
  const timestamp = Date.now();
  const filePath = `users/${userId}/media/${type}_${timestamp}.${extension}`;
  const storageRef = ref(storage, filePath);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: { owner: userId }
  });

  const downloadUrl = await getDownloadURL(snapshot.ref);
  return { storageUrl: filePath, downloadUrl };
}
