"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
  };

  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Urban Galle Villa</h2>
            <p className="text-sm text-muted-foreground">
              Luxury villa rentals for unforgettable vacations and special
              occasions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {["Features", "Gallery", "Testimonials", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Booking Policy",
                "Cancellation Policy",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              Subscribe to our newsletter
            </h3>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                className="w-full"
                required
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Connect With Us</h4>
              <div className="flex space-x-4">
                <Link
                  href="https://facebook.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="https://instagram.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://twitter.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Urban Galle Villa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
