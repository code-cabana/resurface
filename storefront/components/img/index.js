import Image from "next/image";

export default function Img({ className, ...rest }) {
  return (
    <div className={className}>
      <Image {...rest} quality={100} />
    </div>
  );
}
