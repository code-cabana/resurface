import { useSwellProduct } from "shared/hooks";
import { website, site, email } from "shared/config";

export default function FAQ() {
  const { product } = useSwellProduct();
  const { name } = product || {};

  return (
    <>
      <h2>FAQ</h2>
      <ul>
        <li>
          <span>Which browsers can I use {name} with?</span>
          <p>
            At the moment only Google Chrome. Firefox and Safari support is
            coming soon!
          </p>
        </li>
        <li>
          <span>What websites can I use {name} on?</span>
          <p>
            {name} can be used on any website that utilizes a CodeMirror editor.
            At the time of writing this includes Squarespace, Shopify, Wix,
            Klaviyo + more.
          </p>
          <p>
            Please <a href={`mailto:${email}`}>shoot us an email</a> if
            you&apos;d like to confirm if a site you&apos;re building on is
            supported
          </p>
        </li>
        <li>
          <span>Can {name} cause me to lose my work?</span>
          <p>
            No, changes made within a {name} editor are instantly synced across
            to the webpage that opened it, meaning that the website builder will
            always be up to date on your progress
          </p>
        </li>
        <li>
          <span>What is your refund policy?</span>
          <p>
            Unfortunately because of the digital nature of {name}, we cannot
            issue refunds. Please try the free version, or{" "}
            <a href={`mailto:${email}`}>email us</a> before buying if you are
            unsure if {name} is right for you
          </p>
        </li>
        <li>
          <span>Wow I love it! What else have you got for me?</span>
          <p>
            Fantastic! :) Our mission is to make your job as a web designer
            easier. See all our offerings at <a href={website}>{site}</a>
          </p>
        </li>
      </ul>
    </>
  );
}
