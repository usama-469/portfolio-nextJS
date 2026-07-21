"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/utils/cn";

export const TextGenerateEffect = ({
  words,
  className,
  as: Component = "div",
}: {
  words: string;
  className?: string;
  as?: React.ElementType;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      // span, not div: a div inside an h1 is invalid HTML, and this now renders
      // inside whatever `as` element the caller asks for.
      <motion.span ref={scope} className="block">
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className={`${idx>1 ? 'text-purple' : 'dark:text-white text-black' } opacity-0`}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.span>
    );
  };

  return (
    <Component className={cn("font-bold", className)}>
      <span className="block my-4">
        <span className="block dark:text-white text-black leading-snug tracking-wide">
          {renderWords()}
        </span>
      </span>
    </Component>
  );
};
