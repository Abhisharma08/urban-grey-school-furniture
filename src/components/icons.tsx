import Image from "next/image";

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="https://res.cloudinary.com/ddqqlfsjp/image/upload/v1752739362/logourban_kfqdid.webp"
      alt="Urbangrey Logo"
      width={100}
      height={100}
      className={props.className}
      priority
    />
  );
}
