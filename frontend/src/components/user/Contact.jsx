import { MapPin, Phone, Mail } from "lucide-react";

export default function Component() {
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">
            We're here to help with all your smartphone needs
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-input rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-input rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </section>
          <section>
            <h2 className="text-3xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-primary mr-2" />
                <p>123 Tech Street, Gadget City, TC 12345</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-primary mr-2" />
                <p>(123) 456-7890</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-primary mr-2" />
                <p>support@techmobile.com</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://www.convergentinfoware.com/public/assets/images/ecommerce-development-banner.webp"
                alt="Map"
                width={400}
                height={300}
                className="w-full"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
