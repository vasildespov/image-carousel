import { HTMLAttributes } from "react";

export type Orientation = HTMLAttributes<HTMLElement>["aria-orientation"];
export type Photo = {
  id: string;
  width: number;
  height: number;
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
