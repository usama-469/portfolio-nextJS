"use client";
import Image from "next/image";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";
import { projects } from "@/data";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import MagicButton from "./ui/MagicButton";

const RecentProjects = () => {
  return (
    <div className="py-20">
      <h1 className="heading">
        A small selection of {' '}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 items-center justify-center p-4 gap-24 mt-10">
        {projects.map(({id, title, des, img, stacks, link}) => (
          <div key={id} className="lg:min-h-[22.5rem] h-auto flex items-center justify-center sm:w-full w-full">
            <CardContainer className="inter-var">
              <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white">
                  {title}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {des}
                </CardItem>
                <CardItem translateZ="50" className="w-full mt-4">
                  <div className="relative flex items-center justify-center sm:w-96 w-full overflow-hidden h-[20vh] lg:h-[30vh] mb-5"> 
                    <div className="relative w-full h-full overflow-hidden lg:rounded-3xl">
                    </div>
                    <Image
                          src={img}
                          height="1000"
                          width="1000"
                          className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                          alt={title}
                        />
                      {/* <img src={img} alt={title} className="z-10 absolute bottom-0" /> */}
                    </div>
                </CardItem>
                <CardItem>
                  <p>Tech Stack:</p>
                  <div className="flex flex-wrap items-center mt-5 mb-2 gap-2">
                    {stacks.map((item, i) => (
                      <span
                        key={i}
                        className="py-2 px-3 text-xs lg:text-base rounded-lg text-center bg-[#10132E] text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </CardItem>
                <CardItem
                  translateZ={20}
                  as={Link}
                  href={link}
                  target="__blank"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white absolute bottom-4 right-4"
                >
                  Try now →
                </CardItem>
              </CardBody>
            </CardContainer>
          </div> 
        ))}
      </div>
      <div className="flex justify-center items-center">
        <a href="https://github.com/usama-469?tab=repositories" rel="noopener noreferrer" target="_blank">
          <MagicButton 
            title="View more projects"
            icon={<FaLocationArrow />} 
            position='right' 
          />
        </a>
      </div>
    </div>
  );
};

export default RecentProjects;
