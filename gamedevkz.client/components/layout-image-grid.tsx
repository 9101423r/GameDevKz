"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Card = {
  id: number;
  content: React.ReactNode;
  className: string;
  thumbnail: string;
};

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-press-start-2p  font-bold md:text-4xl text-xl text-white">
      Digital Bridge GCA 2025
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      Мы участвовали в орагнизации гейм-дев зоны на крупнейшем центрально-азиатском технологическом событии и привезли несколько Алматинских игровых студий 
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-press-start-2p  font-bold md:text-4xl text-xl text-white">
        AKIRA DEMO DAY
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
       Мы организуем Demo-дни в которых местные студии могут показать демо-версии своих игр на широкую аудиторию геймеров
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <p className="font-press-start-2p  font-bold md:text-4xl text-xl text-white">
        Shashlyki
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      Это - Шелки. Довольный участник одного из наших излюбленных форматов - Майского шашлычника. 
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <p className="font-press-start-2p  font-bold md:text-4xl text-xl text-white">
        Turkic Game Jam 2025
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      АКИРА не только организует и помогает организовывать мероприятия, мы так же ведём репортажи с места событий в мире ГеймДева Центральной Азии. 
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail: "/PageGallery/astana.jpg",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: "/PageGallery/demoday.jpg",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: "/PageGallery/shelki.jpg",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail: "/PageGallery/tgj25.webp",
  },
];

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-8xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "")}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "relative overflow-hidden",
              selected?.id === card.id
                ? "rounded-3xl cursor-pointer absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
                : lastSelected?.id === card.id
                ? "z-40 bg-white rounded-3xl h-full w-full"
                : "bg-white rounded-3xl h-full w-full"
            )}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id && <SelectedCard selected={selected} />}
            <ImageComponent card={card} />
          </motion.div>
        </div>
      ))}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "absolute h-full w-full left-0 top-0  opacity-0 z-10",
          selected?.id ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected?.id ? 0.3 : 0 }}
      />
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail}
      height="500"
      width="500"
      className={cn(
        "object-cover object-top absolute inset-0 h-full w-full transition duration-200"
      )}
      alt="thumbnail"
    />
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-3xl shadow-2xl relative z-[60]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative px-8 pb-4 z-[70]"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};

export function LayoutGridDemo() {
  return (
    <div className="h-screen py-20 w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}
