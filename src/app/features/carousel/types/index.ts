/** Represents an object received from getProducts api */
export type Product = {
  id: string;
  title: string;
  images: string[];
};

/** Represent an image url and its title */
export type ProductImage = {
  title: string;
  url: string;
};

type Success<T> = {
  success: true;
  data: T;
};

type Error = {
  success: false;
  errorMessage: string;
};

export type FetchResponse<T> = Success<T> | Error;
