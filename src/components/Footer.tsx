import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg sm:text-2xl font-bold mb-4">Sancak Nakliyat</h3>
            <p className="text-primary-foreground/80 mb-4 text-xs sm:text-base">
              Güvenilir ve profesyonel ev taşıma hizmetlerinde yanınızdayız.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm sm:text-lg font-semibold mb-4">İletişim</h4>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-primary-foreground/80">0545 389 54 81</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-primary-foreground/80 break-all">info@sancaknakliye.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-primary-foreground/80">Merkez Mah. Havuzlar Cad. İstanbul/Kağıthane</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-sm sm:text-lg font-semibold mb-4">Çalışma Saatleri</h4>
            <div className="space-y-2 text-primary-foreground/80 text-xs sm:text-base">
              <p>Hafta içi: 08:00 - 21:00</p>
              <p>Hafta sonu: 09:00 - 21:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Sancak Nakliyat. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;