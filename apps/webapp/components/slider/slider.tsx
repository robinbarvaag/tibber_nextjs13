"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import cn from "classnames";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    prevButtonHandler?: () => void;
    nextButtonHandler?: () => void;
  }
>(({ className, prevButtonHandler, nextButtonHandler, ...props }, ref) => (
  <>
    {prevButtonHandler && (
      <button
        onClick={prevButtonHandler}
        className="flex items-center justify-center px-2 py-2 space-x-2 bg-theme1-primary hover:bg-theme1-primay100 text-white rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 10a1 1 0 0 0 2 0H13a1 1 0 1 0 0-2H7a1 1 0 0 0-2 0H5a1 1 0 1 0 0 2z"
          />
        </svg>
      </button>
    )}
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-gray-700 ">
        <SliderPrimitive.Range className="absolute h-full bg-theme1-secondary " />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-7 w-7 rounded-full border-2 border-primary bg-theme1-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
    {nextButtonHandler && (
      <button
        onClick={nextButtonHandler}
        className="flex items-center justify-center px-2 py-2 space-x-2 bg-theme1-primary hover:bg-theme1-primay100 text-white rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11 9V5a1 1 0 0 0-2 0v4H5a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4z"
          />
        </svg>
      </button>
    )}
  </>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
