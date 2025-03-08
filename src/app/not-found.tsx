import Image from "next/image";
import { CSSProperties } from "react";

interface ExtendedCSSProperties extends CSSProperties {
  ":hover"?: CSSProperties;
}

export default function NotFound() {
  return (
    <div style={styles.container}>
      <Image
        src={"/mythikore-anime-girl.gif"}
        alt="https://tenor.com/search/anime-404-gifs"
        width={200}
        height={200}
        style={{ borderRadius: "50%" }}
      />
      <h1 style={styles.heading}>404</h1>
      <p style={styles.message}>
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <a href="/" style={styles.link}>
        Go Back Home
      </a>
    </div>
  );
}

const styles: { [key: string]: ExtendedCSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f4f8",
    textAlign: "center",
    padding: "20px",
  },
  heading: {
    fontSize: "6rem",
    fontWeight: "bold",
    margin: "0",
    color: "#333",
  },
  message: {
    fontSize: "1.5rem",
    margin: "20px 0",
    color: "#555",
  },
  link: {
    fontSize: "1.2rem",
    textDecoration: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
};

styles.link[":hover"] = { backgroundColor: "#005bb5" };
