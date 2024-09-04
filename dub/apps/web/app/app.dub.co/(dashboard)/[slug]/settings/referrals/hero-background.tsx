import { Logo } from "@dub/ui";
import Image from "next/image";

const heroGradient =
  "conic-gradient(from 45deg at 65% 70%, #855AFC 0deg, #3A8BFD 72deg, #00FFF9 144deg, #5CFF80 197.89deg, #EAB308 260.96deg, #FF0000 360deg)";

export function HeroBackground({ slug }: { slug: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(100%_100%_at_top_right,black,transparent)] max-[350px]:opacity-50 sm:[mask-image:linear-gradient(to_right,transparent_50%,black_70%)]">
      <div className="absolute -right-[60px] top-[40px] isolate w-[600px] -translate-y-1/2 overflow-hidden bg-white sm:-right-[60px] sm:top-1/2 sm:w-[1200px] md:right-0">
        <div
          className="absolute -inset-[50%] opacity-15 blur-[100px]"
          style={{
            backgroundImage: heroGradient,
          }}
        />
        <Image
          src="https://assets.dub.co/misc/referrals-hero-background.svg"
          alt="Refer and earn"
          width={1200}
          height={630}
          className="relative"
        />
        <div
          className="absolute -inset-[50%] mix-blend-soft-light blur-[100px]"
          style={{
            backgroundImage: heroGradient,
          }}
        />
        <Logo className="absolute right-[9.9%] top-[49.9%] size-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-white sm:size-20 sm:drop-shadow-lg" />
      </div>
    </div>
  );
}
