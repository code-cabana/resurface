import { webstorePage } from "shared/config";
import MainLayout from "../layouts/main";

export default function GetResurface() {
  return (
    <MainLayout
      title="Get Resurface"
      description="Resurface extension download page links for each major browser"
    >
      <h1>Get Resurface</h1>
      <p>Select your browser</p>
      <ul>
        <li>
          <a href={webstorePage}>Chrome extension</a>
        </li>
      </ul>
    </MainLayout>
  );
}
