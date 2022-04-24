import { useSwellProduct } from "shared/hooks";

export default function HowDoesItWork() {
  const { product } = useSwellProduct();
  const { name } = product || {};

  return (
    <>
      <h2>How does it work?</h2>
      <ol>
        <li>Install the {name} extension in your browser</li>
        <li>
          Open any page that contains a CodeMirror editor{" "}
          <i>
            (commonly found on Squarespace, Shopify, Wix, Klaviyo and many other
            website builders)
          </i>
        </li>
        <li>
          Click the "Open {name} editor" button that appears within any
          CodeMirror editor on the page
        </li>
        <li>
          Away you go! Any changes made within a {name} editor are instantly
          synced across to the webpage that opened it
        </li>
      </ol>
    </>
  );
}
