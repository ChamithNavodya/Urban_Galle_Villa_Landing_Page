import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative w-full" style={{ height: "75vh" }}>
      <Image
        src={"/herophoto.jpg"}
        layout="fill"
        objectFit="cover"
        alt="Villa House"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            <span className="block">Escape to Luxury</span>
            <span className="block mt-2">Where Memories Last Forever</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Experience unparalleled comfort and elegance in our exclusive villa
            retreat
          </p>
          <div className="pt-4">
            <Link href={"https://www.booking.com/hotel/lk/tranquil-galle.en-gb.html"} target="_blank">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 text-2xl px-8 py-6"
              >
                Book Now
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="flex flex-col items-center text-white">
              <span className="text-3xl font-semibold">5★</span>
              <span className="text-sm uppercase tracking-wider mt-1">
                Rating
              </span>
            </div>
            <div className="h-12 w-px bg-white/30"></div>
            <div className="flex flex-col items-center text-white">
              <span className="text-3xl font-semibold">100%</span>
              <span className="text-sm uppercase tracking-wider mt-1">
                Satisfaction
              </span>
            </div>
            <div className="h-12 w-px bg-white/30 hidden md:block"></div>
            <div className="flex flex-col items-center text-white md:flex">
              <span className="text-3xl font-semibold">24/7</span>
              <span className="text-sm uppercase tracking-wider mt-1">
                Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
