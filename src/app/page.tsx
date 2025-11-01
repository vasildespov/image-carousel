import { ImageCarousel } from "@/components/image-carousel/image-carousel";
import { VirtualisedList } from "@/components/virtualised-list";
import { getPhotos } from "@/services/getPhotos";

export default async function Home() {
  const photos = await getPhotos();

  return (
    <div className="flex gap-25 flex-col h-fit p-25">
      <div>
        <h1 className="mb-5 text-3xl">Image carousel</h1>
        {photos.success && <ImageCarousel itemSize={200} data={photos.data} />}
      </div>

      <div>
        <h1 className="mb-5 text-3xl">Image carousel with loop</h1>
        {photos.success && (
          <ImageCarousel gap={10} loop itemSize={200} data={photos.data} />
        )}
      </div>

      <div>
        <h1 className="mb-5 text-3xl">Vertical Image carousel</h1>
        {photos.success && (
          <ImageCarousel
            className="max-h-100"
            orientation="vertical"
            itemSize={300}
            data={photos.data}
          />
        )}
      </div>

      <div>
        <h1 className="mb-5 text-3xl">Custom virtualized list</h1>
        <VirtualisedList />
      </div>
    </div>
  );
}
