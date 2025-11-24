import { useState } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const galleryImages = [
  {
    src: gallery1,
    alt: "Organize edilmiş depo alanı",
    title: "Depo Hizmetleri",
  },
  {
    src: gallery2,
    alt: "Mobilya yükleme işlemi",
    title: "Ev Taşıma",
  },
  {
    src: gallery3,
    alt: "Profesyonel paketleme",
    title: "Eşya Paketleme",
  },
  {
    src: gallery4,
    alt: "Ofis taşıma hizmeti",
    title: "Ofis Taşıma",
  },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">Çalışmalarımız</h2>
          <p className="text-sm sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Başarıyla tamamladığımız taşıma işleri ve mutlu müşterilerimiz
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg cursor-pointer shadow-soft hover:shadow-medium transition-all duration-300"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full">
              <button
                className="absolute top-4 right-4 text-foreground hover:text-accent text-4xl font-light"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="w-full h-auto rounded-lg shadow-medium"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;