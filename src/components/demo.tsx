import { ImageCarousel } from "@/components/image-carousel/image-carousel";
import { VirtualisedList } from "@/components/virtualised-list";
import { FetchResponse, Photo } from "@/types";

export const Demo = ({ data }: { data: FetchResponse<Photo[]> }) => {
  return data.success ? (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col">
        <h1 className="mb-5 text-3xl">Image carousel</h1>
        <ImageCarousel itemSize={200} data={data.data} />
      </div>

      <div className="flex flex-col">
        <h1 className="mb-5 text-3xl">Image carousel with loop</h1>
        <ImageCarousel gap={10} loop itemSize={200} data={data.data} />
      </div>

      <div className="flex flex-col">
        <h1 className="mb-5 text-3xl">Vertical Image carousel</h1>
        <ImageCarousel
          className="max-h-100"
          orientation="vertical"
          itemSize={300}
          data={data.data}
        />
      </div>

      <div className="flex flex-col">
        <h1 className="mb-5 text-3xl">Custom virtualized list</h1>
        <VirtualisedList />
      </div>
    </div>
  ) : (
    <div
      role="alert"
      className="rounded-md border border-red-300 bg-red-50 p-3 w-fit flex flex-col gap-1 text-sm text-red-800"
    >
      <h2 className="font-semibold">Failed to load images</h2>
      <p>{data.errorMessage}</p>
    </div>
  );
};
