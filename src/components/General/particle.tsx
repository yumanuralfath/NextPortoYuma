// "use client";

// import { useEffect, useState } from "react";
// import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { loadSlim } from "@tsparticles/slim";
// import { usePathname } from "next/navigation";

// const Particle = () => {
//   const [init, setInit] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     initParticlesEngine(async (engine) => {
//       await loadSlim(engine);
//     }).then(() => {
//       setInit(true);
//     });
//   }, []);

//   if (pathname !== "/") {
//     return null;
//   }

//   return (
//     <>
//       {init && (
//         <Particles
//           id="tsparticles"
//           options={{
//             fpsLimit: 120,
//             interactivity: {
//               events: {
//                 onClick: {
//                   enable: true,
//                   mode: "push",
//                 },
//                 onHover: {
//                   enable: true,
//                   mode: "repulse",
//                 },
//                 resize: true,
//               },
//               modes: {
//                 push: {
//                   quantity: 4,
//                 },
//                 repulse: {
//                   distance: 100,
//                   duration: 0.4,
//                 },
//               },
//             },
//             particles: {
//               color: {
//                 value: "#000000", // Black particles
//               },
//               links: {
//                 enable: false, // Disable links between particles
//               },
//               move: {
//                 direction: "none",
//                 enable: true,
//                 outModes: {
//                   default: "bounce",
//                 },
//                 random: true, // Random movement for a more dynamic effect
//                 speed: 2, // Moderate speed for a smooth effect
//                 straight: false,
//               },
//               number: {
//                 density: {
//                   enable: true,
//                   area: 800,
//                 },
//                 value: 100, // Number of particles
//               },
//               opacity: {
//                 value: 0.7, // Slightly transparent for a softer look
//               },
//               shape: {
//                 type: ["circle", "triangle"], // Use circle and triangle shapes for variety
//               },
//               size: {
//                 value: { min: 1, max: 5 }, // Size range for particles
//               },
//             },
//             detectRetina: true,
//             background: {
//               color: "#ffffff", // White background
//             },
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default Particle;
