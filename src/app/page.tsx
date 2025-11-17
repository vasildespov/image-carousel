import { Demo } from "@/components/demo";
import { getPhotos } from "@/services/getPhotos";

export default async function Home() {
  const data = await getPhotos();

  return (
    <div className="p-25">
      <Demo data={data} />
    </div>
  );
}
