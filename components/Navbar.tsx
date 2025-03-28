"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { NavItems } from "@/constants/NavItems";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [currentPath, setCurrentPath] = useState("");
  const pathName = usePathname();

  useEffect(() => {
    setCurrentPath(pathName); // Ensures this runs only on the client
  }, [pathName]);

  return (
    <nav className="flex justify-between items-center md:px-15 px-3 py-1 shadow-md">
      {/* Logo */}
      <div>
        <Link href={"/"}>
          <Image
            src={"/Logo-line.png"}
            width={100}
            height={40}
            alt="Urban Villa Logo"
          />
        </Link>
      </div>

      {/* Navbar Items */}
      <div className="hidden md:flex items-center gap-5">
        {NavItems.map((item, index) => {
          const isActive = currentPath === item.endPoint;
          return (
            <Link
              key={index}
              href={item.endPoint}
              className="font-medium relative px-1 py-2 text-primary"
            >
              <motion.span
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-block"
              >
                {item.label}
              </motion.span>
              <motion.span
                className="absolute left-0 bottom-0 h-[2px] bg-primary"
                initial={{ scaleX: isActive ? 1 : 0 }}
                animate={{ scaleX: isActive ? 1 : 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ width: "100%", transformOrigin: "left" }}
              />
            </Link>
          );
        })}
      </div>

      {/* Book Now button */}
      <div className="flex gap-2 items-center">
        <Link
          href={"https://www.booking.com/hotel/lk/tranquil-galle.en-gb.html"}
        >
          <Button className="font-bold">Book Now</Button>
        </Link>

        {/* Sheet for mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <motion.button
              className="md:hidden p-2 rounded-md"
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={28} />
            </motion.button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px]">
            {/* Close Button at the top */}
            <div className="flex justify-between items-center">
              <Image
                src={"/Logo-line.png"}
                width={100}
                height={40}
                alt="Urban Villa Logo"
                className="mx-3 pt-1"
              />
              <SheetTrigger asChild>
                <motion.button whileTap={{ scale: 0.9 }}></motion.button>
              </SheetTrigger>
            </div>

            <SheetTitle className="sr-only"></SheetTitle>
            {/* Navigation Items */}
            <div className="flex flex-col gap-4 mt-4">
              {NavItems.map((item, index) => {
                const isActive = currentPath === item.endPoint;
                return (
                  <SheetTrigger asChild key={index}>
                    <Link
                      href={item.endPoint}
                      className={`font-medium px-3 py-2 text-lg rounded-md ${
                        isActive ? "bg-primary text-white" : "text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </SheetTrigger>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
