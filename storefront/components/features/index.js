import { useSwellProduct } from "shared/hooks";

export default function Features() {
  const { product } = useSwellProduct();
  const { name } = product || {};

  return (
    <>
      <h2>Features</h2>
      <p>
        If you&apos;re familiar with Microsoft&apos;s <i>Visual Studio Code</i>,
        you&apos;ll feel right at home when using {name}
      </p>
      <ul>
        <li>Search and replace</li>
        <li>Code completion</li>
        <li>Multi selections (edit in multiple places at once)</li>
        <li>Syntax highlighting (colours that make code easier to read)</li>
        <li>
          Error highlighting (pinpoint exactly where you&apos;re missing that
          curly bracket)
        </li>
      </ul>
    </>
  );
}
