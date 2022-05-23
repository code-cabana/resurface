import { useSwellProduct } from "shared/hooks";
import { ButtonLink } from "../link";
import { getResurfaceLink } from "shared/config";
import { cssJoin } from "shared/util";
import styles from "./styles.module.css";

export default function Hero() {
  const { loading, product } = useSwellProduct();
  const { name, description } = product || {};

  return (
    <>
      <h1>{name}</h1>
      <p className={cssJoin(styles.description, loading && styles.loading)}>
        {description}
      </p>

      <p>Frustrated with a crummy code editing experience on the web?</p>
      <p>Replace it with {name}!</p>
      <ButtonLink href={getResurfaceLink}>Install now for free</ButtonLink>
    </>
  );
}
