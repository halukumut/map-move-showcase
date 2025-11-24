import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Reviews = () => {
  const [placeId, setPlaceId] = useState("");
  const [showWidget, setShowWidget] = useState(false);

  const handleShowReviews = () => {
    if (placeId.trim()) {
      setShowWidget(true);
    }
  };

  return (
    <section id="reviews" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 sm:w-8 sm:h-8 text-accent fill-accent" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">Müşteri Yorumları</h2>
            <Star className="w-5 h-5 sm:w-8 sm:h-8 text-accent fill-accent" />
          </div>
          <p className="text-sm sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Google'daki müşteri yorumlarımız
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-medium mb-8">
            <CardHeader>
              <CardTitle>Google İşletme Profili Yorumları</CardTitle>
              <CardDescription>
                Google Place ID'nizi girerek yorumlarınızı gösterin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="placeId">Google Place ID</Label>
                  <Input
                    id="placeId"
                    value={placeId}
                    onChange={(e) => setPlaceId(e.target.value)}
                    placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                  />
                  <p className="text-xs text-muted-foreground">
                    Place ID'nizi{" "}
                    <a
                      href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      buradan
                    </a>{" "}
                    bulabilirsiniz
                  </p>
                </div>
                <Button onClick={handleShowReviews} variant="accent">
                  Yorumları Göster
                </Button>
              </div>
            </CardContent>
          </Card>

          {showWidget && placeId && (
            <div className="space-y-4">
              {/* Google Maps Embed with Reviews */}
              <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-medium border border-border">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=place_id:${placeId}&zoom=15`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Reviews"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Not: Yorumları görmek için Google Maps API anahtarı gereklidir.{" "}
                <a
                  href="https://console.cloud.google.com/google/maps-apis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  API anahtarı alın
                </a>
              </p>
            </div>
          )}

          {/* Alternative: Manual Reviews Display */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
              Müşterilerimizden Gelen Yorumlar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Ahmet Y.",
                  rating: 5,
                  comment: "Çok profesyonel bir ekip, eşyalarımı özenle taşıdılar. Kesinlikle tavsiye ederim!",
                  date: "2 hafta önce",
                },
                {
                  name: "Zeynep K.",
                  rating: 5,
                  comment: "Hızlı ve güvenilir hizmet. Fiyatları da çok makul. Teşekkürler!",
                  date: "1 ay önce",
                },
                {
                  name: "Mehmet D.",
                  rating: 5,
                  comment: "Ofis taşımamızı sorunsuz bir şekilde gerçekleştirdiler. Mükemmel organizasyon!",
                  date: "3 hafta önce",
                },
              ].map((review, index) => (
                <Card key={index} className="border-border hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <div className="flex gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                        ))}
                      </div>
                    </div>
                    <CardDescription className="text-xs">{review.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
