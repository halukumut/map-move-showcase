import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Briefcase, Truck, Package } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Ev Taşıma",
    description: "Ev eşyalarınızın güvenli ve profesyonel bir şekilde taşınması.",
  },
  {
    icon: Briefcase,
    title: "Demir / Profil Taşıma",
    description: "Cam balkon, PVC kapı-pencere gibi profillerin özenli taşınması.",
  },
  {
    icon: Truck,
    title: "Araç Kiralama",
    description: "İhtiyacınıza uygun kamyonet ve kamyon kiralama hizmetleri.",
  },
  {
    icon: Package,
    title: "Diğer Taşıma Türleri",
    description: "Mobilya, beyaz eşya ve özel eşya taşımacılığı hizmetleri.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">Hizmetlerimiz</h2>
          <p className="text-sm sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Taşınma sürecinizin her aşamasında yanınızdayız
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="p-4 md:p-6">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                    <Icon className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-sm md:text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                  <CardDescription className="text-xs md:text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
