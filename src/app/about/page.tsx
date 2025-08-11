import { Metadata } from "next";
import AboutClientPage from "./AboutClientPage";

export const metadata: Metadata = {
  title: "About Me | Yuma Nur Alfath",
  description:
    "I’m just a curious person who loves learning about how the world works. My background is in chemistry, but my interests often lead me into exploring science, technology, and any new ideas that spark my curiosity. I don’t see myself as an expert — I just enjoy learning, experimenting, and finding connections between different fields.",
};

const AboutPage = () => {
  return <AboutClientPage />;
};

export default AboutPage;

