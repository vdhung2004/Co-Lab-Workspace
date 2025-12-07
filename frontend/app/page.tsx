import HomeClient from "@/components/home/HomeClient";
import { getWorkspace } from "@/services/workspace.service";

export default async function HomePage() {
  const locationData = await fetch(
    "http://localhost:5000/api/workspace/089670f8-96aa-4f82-8fac-88cc6007d261",
    { cache: "force-cache" }
  ).then((res) => res.json());

  const data = await getWorkspace("089670f8-96aa-4f82-8fac-88cc6007d261");
  console.log("Locations data in HomePage:", locationData);

  return <HomeClient locationData={data} />;
}
