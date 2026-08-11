import Image from "next/image";

export function PageBanner({ title, eyebrow, image, position = "center" }: { title: string; eyebrow: string; image: string; position?: string }) {
  return <section className="page-banner"><Image src={image} alt="" fill priority sizes="100vw" style={{ objectPosition: position }} /><div className="banner-shade" /><div className="banner-copy"><p>{eyebrow}</p><h1>{title}</h1></div></section>;
}
