import Image from "next/image";

const VisaCard = () => {
  return (
    <div className="relative flex-1 min-w-0">
      <Image
        src="/icons/visa-card.svg"
        alt="Visa prepaid card"
        width={260}
        height={130}
        priority
        className="w-full h-auto rounded-2xl"
        style={{ height: "auto" }}
      />
    </div>
  );
};

export default VisaCard;
