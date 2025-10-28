import { FetchResponse, ProductImage } from "@/app/features/carousel/types";
import { formatProducts } from "@/app/features/carousel/utils";

const URL = "https://dummyjson.com/products?select=images,title";

export const getProducts = async (
  limit: number = 5000,
): Promise<FetchResponse<ProductImage[]>> => {
  try {
    const response = await fetch(`${URL}&limit=${limit}`);

    if (!response.ok) {
      return {
        success: false,
        errorMessage: `Request failed with status code ${response.status}`,
      };
    }

    const products = await response.json();
    return { success: true, data: formatProducts(products.products) };
  } catch (e) {
    const error = e as Error;
    return { success: false, errorMessage: error.message };
  }
};
