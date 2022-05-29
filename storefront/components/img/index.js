import Image from "next/image";

export default function Img({ className, ...rest }) {
  return (
    <div className={className}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image {...rest} quality={100} />
    </div>
  );
}
