import { Carousel } from "@/components/carousel/carousel";
import { getPhotos } from "@/services/getPhotos";

export default async function Home() {
  const photos = await getPhotos();

  return (
    <div className="flex min-h-screen w-full items-center">
      {photos.success && <Carousel data={photos.data} />}
    </div>
  );
}
