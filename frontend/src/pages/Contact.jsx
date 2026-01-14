/**
 * Contact Page
 */
import { useState } from 'react';
import { IndexRailHero } from '../components/sections/IndexRailHero';
import { Navigation } from '../components/base/Navigation';
import { Footer } from '../components/base/Footer';
import { Button } from '../components/base/Button';
import { Input } from '../components/base/Input';
import { TabLabel } from '../components/base/TabLabel';

export function Contact() {
  const [formState, setFormState] = useState({
    email: '',
    name: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ email: '', name: '', company: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navigation />

      {/* ──── HERO ──── */}
      <IndexRailHero
        index="05"
        headline="Get in Touch"
        subheadline="Questions? We'd love to hear from you. Average response time: 2 hours."
      />

      {/* ──── CONTACT LAYOUT ──── */}
      <section className="bg-[var(--bg-0)] border-b border-[var(--border)] py-space-9 px-space-6">
        <div className="max-w-editorial mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-8">
            {/* Left: Info */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <h2 className="font-display text-3xl font-700 text-[var(--fg-0)] mb-space-8">
                Let's Talk
              </h2>

              <div className="space-y-space-8">
                {/* Contact methods */}
                {[
                  {
                    label: 'Email',
                    value: 'hello@opengateway.io',
                    href: 'mailto:hello@opengateway.io',
                  },
                  {
                    label: 'Phone',
                    value: '+1 (555) 123-4567',
                    href: 'tel:+15551234567',
                  },
                  {
                    label: 'Office',
                    value: 'San Francisco, CA',
                  },
                ].map((contact, i) => (
                  <div key={i} className="pb-space-6 border-b border-[var(--border)] border-opacity-30 last:border-b-0">
                    <p className="text-mono text-[var(--fg-1)] text-xs mb-space-2">
                      [{String(i + 1).padStart(2, '0')}]
                    </p>
                    <p className="text-small text-[var(--fg-1)] mb-space-2">{contact.label}</p>
                    {contact.href ? (
                      <a href={contact.href} className="text-[var(--fg-0)] font-600 hover:text-[var(--accent)] transition-colors duration-140">
                        {contact.value}
                      </a>
                    ) : (
                      <p className="text-[var(--fg-0)] font-600">{contact.value}</p>
                    )}
                  </div>
                ))}

                {/* Social */}
                <div className="pt-space-6 border-t border-[var(--border)]">
                  <p className="text-mono text-[var(--fg-1)] text-xs mb-space-4">FOLLOW US</p>
                  <div className="flex gap-space-5">
                    {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="text-[var(--fg-0)] hover:text-[var(--accent)] transition-colors duration-140 text-small font-600"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <TabLabel index="01" label="FORM" />
              <form
                onSubmit={handleSubmit}
                className="relative rounded-xs border border-[var(--border)] bg-[var(--bg-1)] p-space-6 pt-space-8 space-y-space-6"
              >
                {submitted ? (
                  <div className="py-space-8 text-center">
                    <p className="text-[var(--accent)] font-600 mb-space-2">✓ Message sent!</p>
                    <p className="text-small text-[var(--fg-1)]">
                      We'll get back to you within 2 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <Input
                      label="Full Name"
                      name="name"
                      type="text"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      placeholder="Alex Chen"
                    />

                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      placeholder="you@company.io"
                    />

                    <Input
                      label="Company"
                      name="company"
                      type="text"
                      value={formState.company}
                      onChange={handleChange}
                      placeholder="Acme Corp"
                    />

                    <div>
                      <label className="block text-small font-600 mb-space-3 text-[var(--fg-0)]">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Tell us about your security needs..."
                        rows="6"
                        required
                        className="
                          w-full px-space-4 py-space-3 rounded-xs
                          bg-[var(--bg-0)] border border-[var(--border)]
                          text-[var(--fg-0)] placeholder-[var(--fg-1)] placeholder-opacity-60
                          transition-all duration-140 ease-out
                          focus:outline-none focus:border-[var(--accent2)] focus:shadow-focus
                          resize-none
                        "
                      />
                    </div>

                    <Button variant="primary" type="submit" className="w-full">
                      Send Message
                    </Button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
