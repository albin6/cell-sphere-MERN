import { Phone, ShieldCheck, Truck } from "lucide-react";

export default function Component() {
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About TechMobile</h1>
          <p className="text-xl">
            Your trusted source for cutting-edge smartphones
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <p className="text-muted-foreground mb-4">
                Founded in 2010, TechMobile has been at the forefront of mobile
                technology, offering a curated selection of the latest and
                greatest smartphones to tech enthusiasts and casual users alike.
              </p>
              <p className="text-muted-foreground">
                Our mission is to provide top-quality devices, exceptional
                customer service, and expert advice to help you find the perfect
                smartphone for your needs.
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2024-05/BeFunky-collage%20%2864%29_0.jpg"
                alt="TechMobile Store"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-3xl font-semibold mb-6">
            Why Choose TechMobile?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Phone className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Latest Models</h3>
              <p className="text-muted-foreground">
                We stock the newest smartphone models from all major brands,
                ensuring you have access to cutting-edge technology.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground">
                All our products come with a full warranty and our satisfaction
                guarantee for your peace of mind.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Truck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Enjoy free, fast shipping on all orders over $500. Your new
                smartphone will be in your hands in no time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
