import Image from "next/image";

export default function VisaCard() {
  return (
    <Image
      src="/icons/visa-card.svg"
      alt="Visa prepaid card"
      width={279}
      height={120}
      className="shrink-0"
      priority
    />
  );
}
