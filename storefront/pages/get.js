import { webstorePage } from "shared/config";
import MainLayout from "../layouts/main";

export default function Home() {
  return (
    <MainLayout>
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
