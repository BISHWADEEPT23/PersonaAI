import exifr from 'exifr';

export async function resolveLocation(imageFile: File | null = null): Promise<{latitude: number, longitude: number, source: string} | null> {
  // 1. Try extracting GPS from image EXIF if an image is provided
  if (imageFile) {
    try {
      const gps = await exifr.gps(imageFile);
      if (gps && gps.latitude && gps.longitude) {
        return {
          latitude: gps.latitude,
          longitude: gps.longitude,
          source: 'photo_exif'
        };
      }
    } catch (e) {
      console.debug("No EXIF GPS found in image");
    }
  }

  // 2. Fallback: Request browser geolocation with a 4-second timeout
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          source: 'device_gps'
        });
      },
      () => resolve(null), // Graceful fallback if permission is denied
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 300000 }
    );
  });
}
