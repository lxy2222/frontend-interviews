import React, { useState, useRef, useEffect, useCallback } from "react";
import classNames from "classnames";
import { ArrowBack } from "./components/arrowBackIcon";

const images = [
  {
    src: 'https://picsum.photos/id/600/600/400',
    alt: 'Forest',
  },
  {
    src: 'https://picsum.photos/id/100/600/400',
    alt: 'Beach',
  },
  {
    src: 'https://picsum.photos/id/200/600/400',
    alt: 'Yak',
  },
  {
    src: 'https://picsum.photos/id/300/600/400',
    alt: 'Hay',
  },
  {
    src: 'https://picsum.photos/id/400/600/400',
    alt: 'Plants',
  },
  {
    src: 'https://picsum.photos/id/500/600/400',
    alt: 'Building',
  },
];

function ImageCarousel({
  images,
}: Readonly<{
  images: ReadonlyArray<{ src: string; alt: string }>;
}>) {
  const [cur, setCur] = useState(1); // from 1 to n 
  const [containerWidth, setContainerWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);

  // 添加首尾图片
  const carouselImages = [
    images[images.length - 1], // copy of the last image
    ...images,
    images[0], // copy of the first image
  ];

  const handleNext = useCallback(() => {
    setIsAnimating(true);
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCur(prev => prev + 1);
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    setIsAnimating(true);
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCur(prev => prev - 1);
  }, [isTransitioning]);

  // 处理过渡结束
  useEffect(() => {
    const handleTransitionEnd = () => {
      setIsTransitioning(false);
      // if it arrives at the last image, switch to the first image
      if (cur === carouselImages.length - 1) {
        setCur(1);
        setIsAnimating(false);
      }
      // if it arrives at the first image, switch to the last image
      else if (cur === 0) {
        setCur(carouselImages.length - 2);
        setIsAnimating(false);
      }
    };

    const transition = transitionRef.current;
    if (transition) {
      transition.addEventListener("transitionend", handleTransitionEnd);
    }

    return () => {
      if (transition) {
        transition.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
  }, [cur, carouselImages.length]);

  // get the width of the container
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setContainerWidth(width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
    className="flex relative w-[400px] h-[400px] max-w-[600px] overflow-hidden"
    ref={containerRef}
    >
      {/* transition row*/}
      <div 
        ref={transitionRef}
        className={classNames({
          flex: true,
          "transition-transform duration-500 linear": isAnimating,
        })}
        style={{
          transform: `translateX(-${cur * containerWidth}px)`
        }}
      >
        {carouselImages.map((image, index) => (
          <img src={image.src} alt={image.alt} key={index}
            className="object-fit h-[400px] w-[400px] max-w-[600px]"/>
        ))}
      </div>
      {/* prev button */}
      <button className="absolute left-8 top-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-full bg-gray-500 cursor-pointer"
        onClick={handlePrev}
        >
        <ArrowBack />
      </button>
      {/* next button */}
      <button className="absolute right-8 top-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-full bg-gray-500 cursor-pointer"
        onClick={handleNext}
      >
        <ArrowBack style={{ transform: "rotate(180deg)" }}/>
      </button>
      {/* dot */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
      {images.map((_, index) => (
        <button 
          key={`dot-${index}`} className={
            classNames({
              "w-[10px] h-[10px] rounded-full bg-gray-500 cursor-pointer": true,
              "bg-gray-300": cur === index + 1,
            })
          }
          onClick={() => setCur(index + 1)} />
      ))}
      </div>
    </div>
  )
}

export default function CarouselApp() {
  return (
    <div className="flex justify-center items-center h-screen mx-auto my-0">
      <ImageCarousel images={images} />
    </div>
  )
}
