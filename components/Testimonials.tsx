import { testimonials } from "@/constants/Testimonials";
import { Star } from "lucide-react";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Testimonials = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };
  return (
    <section className="py-13 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Guest Experiences</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our guests
            have to say.
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
              breakpoints: {
                640: {
                  slides: "1",
                },
                768: {
                  slides: "2",
                },
                1024: {
                  slides: "3",
                },
              },
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="border-gray-100 h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage
                            src={testimonial.avatar}
                            alt={testimonial.name}
                          />
                          <AvatarFallback>
                            {testimonial.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="text-gray-700">{testimonial.testimonial}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
