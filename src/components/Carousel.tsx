import { FC } from "react";
import * as CarouselPrimitive from "@radix-ui/react-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface CarouselProps {
  images: string[];
}

export const Carousel: FC<CarouselProps> = ({ images }) => {
  if (images.length === 0) return null;

  return (
    <CarouselPrimitive.Root className="relative">
      <CarouselPrimitive.Viewport className="w-full overflow-hidden rounded-lg">
        <div className="flex">
          {images.map((image, index) => (
            <CarouselPrimitive.Slide key={index} className="min-w-full">
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-auto object-cover"
              />
            </CarouselPrimitive.Slide>
          ))}
        </div>
      </CarouselPrimitive.Viewport>
      {images.length > 1 && (
        <>
          <CarouselPrimitive.Control asChild direction="prev">
            <button
              className="absolute top-1/2 left-2 -translate-y-1/2 p-1 bg-gray-800 rounded-full"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>
          </CarouselPrimitive.Control>
          <CarouselPrimitive.Control asChild direction="next">
            <button
              className="absolute top-1/2 right-2 -translate-y-1/2 p-1 bg-gray-800 rounded-full"
              aria-label="Next Slide"
            >
              <ChevronRight size={24} />
            </button>
          </CarouselPrimitive.Control>
        </>
      )}
    </CarouselPrimitive.Root>
  );
};
