export type Orientation = "vertical" | "horizontal";
export type Photo = {
  id: string;
  download_url: string;
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
