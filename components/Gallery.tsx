import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { galleryImages } from "@/constants/GalleryImages";

const GallerySection = () => {
  return (
    <section className="py-2 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take a visual tour of our beautiful villa and its surroundings.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
            breakpoints: {
              768: {
                slidesToScroll: 2,
              },
              1024: {
                slidesToScroll: 3,
              },
            },
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {galleryImages.map((image, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="border-none">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-4">
            <CarouselPrevious className="relative" />
            <CarouselNext className="relative" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default GallerySection;
