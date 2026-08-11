import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Ornament } from "@/components/Ornament";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <main id="content"><section className="contact-hero textured-section"><div className="contact-portrait ornamental-frame"><Image src="/art/profile-rowan.png" alt="Artist working at a desk beside an antique telescope" fill priority sizes="(max-width: 760px) 82vw, 36vw" /></div><div className="contact-copy"><p className="kicker">Let&apos;s work together</p><h1>Contact</h1><p className="lead">For project inquiries, collaborations, or a simple hello, send a note with a little context and your ideal timeline.</p><div className="contact-meta"><div><span>Email</span><a href="mailto:hello@lumenandthorn.studio">hello@lumenandthorn.studio</a></div><div><span>Based in</span><p>Remote · available worldwide</p></div><div><span>Response time</span><p>Usually 2–3 business days</p></div></div><Ornament compact /></div></section><section className="contact-form-section textured-section"><div><p className="kicker">Start a conversation</p><h2>Tell me about your idea.</h2><p>The form is ready for your future email or form-service integration. In this demo it validates locally and stores nothing.</p></div><ContactForm /></section><Footer /></main>;
}
