import { FetchResponse, Photo } from "@/types";

const URL = "https://picsum.photos/v2/list?limit=100";
const getPhotos = async (): Promise<FetchResponse<Photo[]>> => {
  try {
    const response = await fetch(URL);

    if (!response.ok) {
      return {
        success: false,
        errorMessage: `Request failed with status code ${response.status}`,
      };
    }

    const photos = await response.json();
    return { success: true, data: photos };
  } catch (e) {
    const error = e as Error;
    return { success: false, errorMessage: error.message };
  }
};

export { getPhotos };
