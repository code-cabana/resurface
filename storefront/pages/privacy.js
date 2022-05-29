import { supportEmail } from "shared/config";
import { TextLink } from "../components/link";
import MainLayout from "../layouts/main";
import styles from "../styles/privacy.module.css";

export default function PrivacyPolicy() {
  return (
    <MainLayout
      title="Privacy Policy | Resurface"
      description="Resurface privacy policy and support information"
      className={styles.container}
    >
      <h1>Privacy Policy</h1>
      <p>
        This Privacy Policy applies to all personal information collected by
        Code Cabana via the website located at codecabana.com.au.
      </p>
      <ol>
        <Item heading={`1. What is "personal information"?`}>
          <p>
            (a) The Privacy Act 1988 (Cth) currently defines &quot;personal
            information&quot; as meaning information or an opinion about an
            identified individual or an individual who is reasonably
            identifiable: whether the information or opinion is true or not; and
            (ii) whether the information or opinion is recorded in a material
            form or not.
          </p>
          <p>
            (b) If the information does not disclose your identity or enable
            your identity to be ascertained, it will in most cases not be
            classified as &quot;personal information&quot; and will not be
            subject to this privacy policy.
          </p>
        </Item>

        <Item heading="2. What information do we collect?">
          <p>
            (a) The kind of personal information that we collect from you will
            depend on how you use the website. The personal information which we
            collect and hold about you may include: name, email address, phone
            number, residential address and credit card information.
          </p>
        </Item>

        <Item heading="3. How we collect your personal information">
          <p>
            (a) We may collect personal information from you whenever you input
            such information into the website. (b) We also collect cookies from
            your computer which enable us to tell when you use the website and
            also to help customise your website experience. As a general rule;
            however, it is not possible to identify you personally from our use
            of cookies.
          </p>
        </Item>

        <Item heading="4. Purpose of collection">
          <p>
            (a) The purpose for which we collect personal information is to
            provide you with the best service experience possible on the
            website.
          </p>
          <p>
            (b) We customarily disclose personal information only to our service
            providers who assist us in operating the website. Your personal
            information may also be exposed from time to time to maintenance and
            support personnel acting in the normal course of their duties. (c)
            By using our website, you consent to the receipt of direct marketing
            material. We will only use your personal information for this
            purpose if we have collected such information direct from you, and
            if it is material of a type which you would reasonably expect to
            receive from use. We do not use sensitive personal information in
            direct marketing activity. Our direct marketing material will
            include a simple means by which you can request not to receive
            further communications of this nature.
          </p>
        </Item>

        <Item heading="5. Access and correction">
          <p>
            Australian Privacy Principle 12 permits you to obtain access to the
            personal information we hold about you in certain circumstances, and
            Australian Privacy Principle 13 allows you to correct inaccurate
            personal information subject to certain exceptions. If you would
            like to obtain such access, please contact us as set out below.
          </p>
        </Item>

        <Item heading="6. Complaint procedure">
          <p>
            If you have a complaint concerning the manner in which we maintain
            the privacy of your personal information, please contact us as set
            out below. All complaints will be considered by Code Cabana and we
            may seek further information from you to clarify your concerns. If
            we agree that your complaint is well founded, we will, in
            consultation with you, take appropriate steps to rectify the
            problem. If you remain dissatisfied with the outcome, you may refer
            the matter to the Office of the Australian Information Commissioner.
          </p>
        </Item>

        <Item heading="7. Overseas transfer">
          <p>
            Your personal information may be transferred overseas or stored
            overseas for a variety of reasons. It is not possible to identify
            each and every country to which your personal information may be
            sent. If your personal information is sent to a recipient in a
            country with data protection laws which are at least substantially
            similar to the Australian Privacy Principles, and where there are
            mechanisms available to you to enforce protection of your personal
            information under that overseas law, we will not be liable for a
            breach of the Australian Privacy Principles if your personal
            information is mishandled in that jurisdiction. If your personal
            information is transferred to a jurisdiction which does not have
            data protection laws as comprehensive as Australia&apos;s, we will
            take reasonable steps to secure a contractual commitment from the
            recipient to handle your information in accordance with the
            Australian Privacy Principles.
          </p>
        </Item>

        <Item heading="8. GDPR">
          <p>
            In some circumstances, the European Union General Data Protection
            Regulation (GDPR) provides additional protection to individuals
            located in Europe. The fact that you may be located in Europe does
            not, however, on its own entitle you to protection under the GDPR.
            Our website does not specifically target customers located in the
            European Union and we do not monitor the behaviour of individuals in
            the European Union. and accordingly the GDPR does not apply.
          </p>
        </Item>

        <Item heading="9. How to contact us about privacy">
          <p>
            If you have any queries, or if you seek access to your personal
            information, or if you have a complaint about our privacy practices,
            you can contact us through:{" "}
            <TextLink href={`mailto:${supportEmail}`}>
              support@codecabana.com.au
            </TextLink>
          </p>
        </Item>
      </ol>
    </MainLayout>
  );
}

function Item({ heading, children }) {
  return (
    <li>
      <h2>{heading}</h2>
      {children}
    </li>
  );
}
