import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div
      className={
        compact
          ? "relative h-5 w-[210px] shrink-0 min-[360px]:h-[26px] min-[360px]:w-[272px] sm:h-[34px] sm:w-[356px] lg:h-[38px] lg:w-[398px]"
          : "relative h-[32px] w-[335px] shrink-0 sm:h-[36px] sm:w-[377px]"
      }
    >
      <Image
        src="/images/brand/ieee-ras-logo.png"
        alt="IEEE Robotics and Automation Society"
        width={722}
        height={69}
        priority
        className="h-full w-full object-contain object-left"
      />
    </div>
  );
}
