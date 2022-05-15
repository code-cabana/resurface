import { useSwellProduct } from "shared/hooks";

export default function Features() {
  const { product } = useSwellProduct();
  const { name } = product || {};

  return (
    <>
      <h2>Features</h2>
      <p>
        If you&apos;re familiar with{" "}
        <a href="https://code.visualstudio.com/">Visual Studio Code</a>,
        you&apos;ll feel right at home with {name}
      </p>
      <ul>
        <li>Search and replace</li>
        <li>Code completion (auto-complete)</li>
        <li>Multiple selections (edit in multiple places at once)</li>
        <li>
          Syntax highlighting (pretty colours that make code easier to read)
        </li>
        <li>
          Error highlighting (pinpoint exactly where you&apos;re missing that
          curly bracket)
        </li>
      </ul>
    </>
  );
}
