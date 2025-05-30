export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Testimonials", link: "#testimonials" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: "My tech stack ",
    description: "I constantly try to improve",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "usama.png",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "I prioritize client collaboration, fostering open communication",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "Currently building a Networking app using Lightship ARDK",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "/b1.svg",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "bio-IVI - Interactive XR inspection app",
    des: "A multi player XR app for engineers and product designers to visaualize, inspect and demonstrate their products.",
    img: "/bio-IVI.png",
    stacks: ["Unity", "Meta SDK", "OVR toolkit", "C#", "Firebase","PUN2"],
    link: "https://github.com/usama-469/project-bio-IVI/tree/main",
    videoUrl: "https://www.youtube.com/watch?v=DE7tS33IjnY", // Path to your video in the public folder
    gallery: [
      "/ivi1.png",
      "/ivi2.png",
      "/ivi3.png"
  ],
    categories: ["MR", "Networking"]
  },

  {
    id: 2,
    title: "Food AR Service - Door dash with AR",
    des: "A full stack solution containing 2 mobile apps and one a website for Augmented reality dine in experiences.",
    img: "/foodar.png",
    stacks: ["Unity", "AR Foundation 5.1", "ARKit", "ARCore", "Supabase", "Docker"],
    link: "https://play.google.com/store/apps/details?id=com.BeautifulInteractions.FoodAR&hl=en",
    videoUrl: "https://www.youtube.com/watch?v=vgkYO7d66zI", // Path to your video in the public folder
    gallery: [
      "/foodar1.png",
      "/foodar2.png",
      "/foodar3.png"
  ],
    categories: ["AR", "Collaboration", "Mobile"]
  },
  {
    id: 3,
    title: "ROOM VR - VR interior decoration App",
    des: "Simplify the process of interior designing by inspecting multuiple options of store furniture in VR before purchasing.",
    img: "/VR-room.png",
    stacks: ["Unity", "C#", "OpenXR", "XR interaction Toolkit", "Blender"],
    link: "https://www.behance.net/gallery/199557423/VR-Modern-Room-Walkthrough",
    videoUrl: "https://www.youtube.com/watch?v=lydp8Nj00jk", // Path to your video in the public folder
    gallery: [
      "/furniture1.png",
      "/furniture2.png",
      "/furniture3.png"
  ],
    categories: ["VR"]
  
  },
  {
    id: 4,
    title: "MR - Multi Object detection",
    des: "A cutting edge Mixed reality solution to detect objects at runtime.",
    img: "/sentis2.png",
    stacks: ["Unity", "Sentis", "YOLO", "Meta SDK", "C#"],
    link: "https://www.youtube.com/watch?v=GVWJD-u-LH4",
    videoUrl: "https://www.youtube.com/watch?v=GVWJD-u-LH4", // Path to your video in the public folder
    gallery: [
      "/sentis1.png",
      "/sentis2.png",
      "/sentis3.png"
  ],
    categories: ["MR", "AI"]
  },

  {
    id: 5,
    title: "Crowd Source - VR behavior analytics",
    des: "A VR app that helps to collect and understand user behavior in various road crossing scenarios in virtual reality.",
    img: "/vr-crowd.png",
    stacks: ["Unity", "Playfab","Meta SDK", "OVR toolkit" ,"File Handling"],
    link: "https://github.com/usama-469/-VR-crowd-sourcing-app",
        videoUrl: "https://www.youtube.com/watch?v=F0ZKcuPOwUI", // Path to your video in the public folder
    gallery: [
      "/car1.png",
      "/car2.png",
      "/car3.png"
  ],
    categories: ["VR", "Collaboration"]
  },

  {
    id: 6,
    title: "AR Ship - AR app for ship inspection",
    des: "A highly intuitive AR based app. The app uses plane tracking and complex interactions to place the ship the real world.",
    img: "/shipAR.png",
    stacks: ["Unity", "AR Foundation 5.1", "ARKit", "XCode", "Figma"],
    link: "https://github.com/usama-469/Ship-AR-Museum",
    categories: ["AR", "Mobile"],
  },
    {
    id: 7,
    title: "Zombie Shooter - Multiplayer PC game",
    des: "A multiplayer game where players can shoot zombies and collect coins. The game is designed to be played on PC.",
    img: "/zombie2.png",
    stacks: ["Unity", "PUN2", "Fusion", "AI pathfinding", "C#"],
    link: "https://www.youtube.com/watch?v=beuEXKe___s",
        videoUrl: "https://www.youtube.com/watch?v=beuEXKe___s", // Path to your video in the public folder
    gallery: [
      "/zombie1.png",
      "/zombie2.png",
      "/zombie3.png"
  ],
    categories: ["Game", "Networking"]
  },

    {
    id: 8,
    title: "VR room - VR interior decoration App",
    des: "Simplify the process of interior designing by inspecting multuiple options of store furniture in VR before purchasing.",
    img: "/fcontrol2.png",
    stacks: ["Meta All in one SDK", "Unity", "C#", "OVR toolkit", "Blender"],
    link: "https://github.com",
            videoUrl: "https://www.youtube.com/watch?v=hBVFFQF2XeY", // Path to your video in the public folder
    gallery: [
      "/fcontrol1.png",
      "/fcontrol2.png",
      "/fcontrol3.png"
    ],
    categories: ["VR", "Collaboration"]
  },
    {
    id: 9,
    title: "Spark-AR - AR filters for instagram",
    des: "AR filters for Instagram and Facebook, including face filters, world effects, and more. For marketing and entertainment purposes.",
    img: "/spark-AR-filters.png",
    stacks: ["Meta Spark AR Studio", "JavaScript", "HTML", "Visual programming"],
    link: "https://github.com",
  //       videoUrl: "https://www.youtube.com/watch?v=KLfyXzboDM8", // Path to your video in the public folder
  //   gallery: [
  //     "/bio-IVI.png",
  //     "/VR-room.png",
  //     "/vr-crowd.png"
  // ]
      categories: ["AR", "Web"],
  },
  {
    id: 10,
    title: "VR water safety - VR training app",
    des: "A VR training app for water safety. The app is designed to be used in schools and colleges.",
    img: "/water-vr1.png",
    stacks: ["Unity", "Meta All in one SDK", "Inverse Kinematics", "Shader graphs", "Blender"],
    link: "https://www.youtube.com/watch?v=I3kBoDfGDqs",
                videoUrl: "https://www.youtube.com/watch?v=I3kBoDfGDqs", // Path to your video in the public folder
    gallery: [
      "/water-vr1.png",
      "/water-vr2.png",
      "/water-vr3.png"
    ],
    categories: ["VR", "Collaboration"]
  },
    {
    id: 11,
    title: "PC third person water safety - PC training app",
    des: "A PC training game for water safety. The app is designed to be used in schools and colleges.",
    img: "/water-pc2.png",
    stacks: ["Unity", "Third person controller", "Inverse Kinematics", "Shader graphs", "Blender"],
    link: "https://www.youtube.com/watch?v=awm5C-5FNeA",
                videoUrl: "https://www.youtube.com/watch?v=awm5C-5FNeA", // Path to your video in the public folder
    gallery: [
      "/water-pc1.png",
      "/water-pc2.png",
      "/water-pc3.png"
    ],
    categories: ["Game", "Collaboration"]
  },
  
];

export const testimonials = [
  {
    quote:
      "Working with Usama is a great pleasure. Highly motivated with excellent completion of very detailed and complex work. He is definitely a true professional in his field of expertise",
    name: "Gabriel Lucena",
    title: "Director of Sandbox Synergy",
  },
  {
    quote:
      "We did a tiny PoC. Had been really a pleasure to work with. In time, in quality and in budget. Love what he developed and will start more projects. Thanks a lot. Highly recommended.",
    name: "Jörg Jonas",
    title: "Managing Director of nxtDynamics",
  },
  {
    quote:
      "Great unity developer. Developed an augmented reality app game. Enjoyed working with him and would definitely recommend working with him to others. He is strong in augmented reality, unity, and making augmented reality apps. Good communication skill, understood the requirements and implemented accordingly.",
    name: "Hexagon Technologies",
    title: "Fiverr client",
  },
  {
    quote:
      "travaille avec Usama c'est un grand honneur pour moi, très provisionnel et quelque qui donne a fond dans sont travail et perfectionniste",
    name: "Safia Kaci",
    title: "Fiverr client",
  },
  {
    quote:
      "We had great communication and he delivered ahead of scheduled.",
    name: "Jesus Duarte",
    title: "CEO of Beautiful Interactions",
  },
];

export const companies = [
  {
    id: 1,
    name: "Made IT",
    img: "/made_it_logo.svg",
    nameImg: "/MadeIT-NAME.svg",
  },
  {
    id: 2,
    name: "SandBox Synergy",
    img: "/sandbox-logo.svg",
    nameImg: "/sandbox-name.svg",
  },
  {
    id: 3,
    name: "stream",
    img: "/nxtdynamics_logo.svg",
    nameImg: "/nxtdynamics-name.svg",

  },
  {
    id: 4,
    name: "Hexagon Tech",
    img: "/hexagon-tech-logo.svg",
    nameImg: "/hexagon-tech-name.svg",
  },
  {
    id: 5,
    name: "docker.",
    img: "/keymech_logo.svg",
    nameImg: "/keymech-name.svg",
  },
];

export const workExperience = [
  {
    id: 1,
    title: "3D animator - Keymech designs",
    desc: "Created various 3D models and animations for our clients. Worked on various projects including industrial animations and more.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Freelance AR developer - Fiverr",
    desc: "Lead the design and development of an interactable AR mobile app for iOS using Unity, ARFoundation and ARKit.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Lead AR Developer - Hexagon Tech",
    desc: "Lead the design and development of an interactable AR mobile app for iOS using Unity, ARFoundation and ARKit.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "Lead XR developer - MADE IT",
    desc: "Leading the development of a industry level AR/VR solutions for our international clients.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
 
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    url: "https://github.com/usama-469/", // add profile link
  },
  {
    id: 2,
    img: "/insta.svg",
    url: "https://www.instagram.com/usamastark/", // add profile link
  },
  {
    id: 3,
    img: "/link.svg",
    url: "https://www.linkedin.com/in/muhammad-usama-irfan-2ba81a216/", // add profile link
  }, 
  
];
