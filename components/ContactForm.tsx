"use client";

import { type FormEvent, useState } from "react";
import { FiSend, FiStar } from "react-icons/fi";

type ContactFields = { name: string; email: string; subject: string; message: string };
const initial: ContactFields = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [fields, setFields] = useState(initial);
  const [errors, setErrors] = useState<Partial<ContactFields>>({});
  const [sent, setSent] = useState(false);

  const update = (key: keyof ContactFields, value: string) => { setFields((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Partial<ContactFields> = {};
    if (fields.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) next.email = "Please enter a valid email.";
    if (fields.subject.trim().length < 3) next.subject = "What would you like to talk about?";
    if (fields.message.trim().length < 20) next.message = "Please add a little more detail.";
    setErrors(next);
    if (!Object.keys(next).length) { setSent(true); setFields(initial); }
  };

  if (sent) return <div className="contact-success" role="status"><span><FiStar aria-hidden="true" /></span><h2>Message prepared.</h2><p>This portfolio demo does not send data yet. Connect the form to your preferred email or form service before publishing.</p><button className="ornate-button" onClick={() => setSent(false)}>Write another message</button></div>;

  return <form className="contact-form" onSubmit={submit} noValidate>
    <div className="contact-field-row"><label>Name<input value={fields.name} onChange={(event) => update("name", event.target.value)} aria-invalid={!!errors.name} />{errors.name && <small>{errors.name}</small>}</label><label>Email<input type="email" value={fields.email} onChange={(event) => update("email", event.target.value)} aria-invalid={!!errors.email} />{errors.email && <small>{errors.email}</small>}</label></div>
    <label>Subject<input value={fields.subject} onChange={(event) => update("subject", event.target.value)} aria-invalid={!!errors.subject} />{errors.subject && <small>{errors.subject}</small>}</label>
    <label>Message<textarea rows={8} value={fields.message} onChange={(event) => update("message", event.target.value)} aria-invalid={!!errors.message} />{errors.message && <small>{errors.message}</small>}</label>
    <button className="ornate-button" type="submit">Send a message <FiSend aria-hidden="true" /></button>
  </form>;
}
