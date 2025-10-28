import { Product, ProductImage } from "@/app/features/carousel/types";

/** Formats products to a list of product title and image URL pairs (some products have multiple images) */
export const formatProducts = (products: Product[]) => {
  const productImages: ProductImage[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    for (let j = 0; j < product.images.length; j++) {
      productImages.push({
        title: product.title,
        url: product.images[j],
      });
    }
  }

  return productImages;
};
