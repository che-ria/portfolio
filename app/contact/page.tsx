import type { Metadata } from "next";
import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { mediaUrl } from "@/data/media";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <main id="content" className="contact-page textured-section">
    <section className="contact-card" aria-label="Contact">
      <div className="contact-portrait">
        <Image src={mediaUrl("/portfolio/profile/contact.jpg")} alt="Daryna Chernysheva" width={1320} height={1850} priority sizes="(max-width: 700px) 68vw, 330px" />
      </div>
      <div className="contact-copy">
        <div className="contact-description">
          <p>Hi! I&apos;m Daryna Chernysheva (feel free to call me Daria) and I am a 2D Artist and Art Lead currently based in Warsaw, Poland.</p>
          <p>I graduated from the Polish-Japanese Academy of Information Technology. Over my 8 years in the gaming industry, I&apos;ve had the opportunity to grow from a UI Designer and 2D Artist into an Art Lead role. This journey has taught me a lot about how different parts of game development come together, and I truly enjoy collaborating with a team to bring ideas to life. I value good communication and always strive to create art that supports the overall vision of the project.</p>
          <p>In my free time, I love stepping out of my comfort zone to experiment with new art styles and techniques. I&apos;m also a huge anime fan, which is both a great way to relax and a constant source of inspiration for my personal work!</p>
          <p className="contact-closing">Let&apos;s create something awesome together!</p>
        </div>
        <div className="contact-actions">
          <a className="cv-button" href={mediaUrl("/portfolio/cv.pdf")} target="_blank" rel="noreferrer">Open CV</a>
          <div className="contact-links">
            <a className="contact-social-link" href="https://www.linkedin.com/in/daryna-chernysheva/" target="_blank" rel="noreferrer" aria-label="Daryna Chernysheva on LinkedIn">
              <span className="contact-social-icon"><FaLinkedinIn aria-hidden="true" /></span>
              <span>Daryna Chernysheva</span>
            </a>
            <a className="contact-social-link" href="mailto:cherdak.art@gmail.com" aria-label="Email Daryna Chernysheva">
              <span className="contact-social-icon"><FiMail aria-hidden="true" /></span>
              <span>cherdak.art@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </main>;
}
