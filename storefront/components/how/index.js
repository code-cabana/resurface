import { TextLink } from "../link";
import { useSwellProduct } from "shared/hooks";
import { getResurfaceLink } from "shared/config";

export default function HowDoesItWork() {
  const { product } = useSwellProduct();
  const { name } = product || {};

  return (
    <>
      <h2>How does it work?</h2>
      <ol>
        <li>
          Install the{" "}
          <TextLink
            label={`${name} browser extension`}
            href={getResurfaceLink}
          />
        </li>
        <li>Open any page that contains an editable textbox</li>
        <li>Click the extension icon in your browser&apos;s toolbar</li>
        <li>
          Click the <i>&quot;Open {name} editor&quot;</i> button that appears
          within any editable textboxes on the page
        </li>
        <li>Away you go! 🚀</li>
      </ol>
    </>
  );
}
