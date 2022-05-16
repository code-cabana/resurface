import { useSwellProduct } from "shared/hooks";
import { Button } from "shared/ui";

export default function Hero() {
  const { product } = useSwellProduct();
  const { name, description } = product || {};

  return (
    <>
      <h1>{name}</h1>
      <p>{description}</p>
      <p>
        Ever had a frustrating experience while editing code on Squarespace?
      </p>
      <p>
        Ever received &quot;0 results&quot; when searching for some code that
        you know is just off-screen?
      </p>
      <p>
        Wouldn&apos;t it be great to get auto-complete suggestions while writing
        code similar to searching something via Google?
      </p>
      <p>
        {name} is here to provide you with a slick code editing experience
        powered by the same engine inside Microsoft&apos;s{" "}
        <a href="https://code.visualstudio.com/">Visual Studio Code</a>, the
        most popular code editor trusted by developers everywhere
      </p>
      <Button>Install free version now</Button>
    </>
  );
}
