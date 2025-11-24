import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { MapPin, Home, Briefcase, Truck, Package } from "lucide-react";
import MapPicker from "@/components/MapPicker";

type ServiceType = "ev-tasima" | "profil-tasima" | "arac-kiralama" | "lojistik" | null;

const QuoteForm = () => {
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [isClosing, setIsClosing] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupAddress: "",
    deliveryAddress: "",
    pickupLat: undefined,
    pickupLng: undefined,
    pickupFloor: "",
    deliveryFloor: "",
    pickupElevator: "",
    deliveryElevator: "",
    deliveryLat: undefined,
    deliveryLng: undefined,
    profileType: "",
    profileQuantity: "",
    vehicleType: "",
    rentalDuration: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = {
      service: selectedService,
      ...formData, // tüm formData alanlarını ekler
    };

    // console.log("JSON to send:", JSON.stringify(data));

    try {
      const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
      const sendUrl = API_BASE ? `${API_BASE}/api/sendMail` : "/api/sendMail";

      const res = await fetch(sendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "omit",
      });

      console.log('JSON DATA IS SENT')
      console.log({headers: {
                    "Content-Type": "application/json"
                }})
      console.log({
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

      let result;
      try {
        result = await res.json();
      } catch (err) {
        console.error("JSON parse error:", err);
        result = { success: false };
      }

      if (result.success) alert("Mesajınız gönderildi!");
      else alert("Bir hata oluştu.");
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    }

    setIsSubmitting(false);

    // Form reset
    setFormData({
      name: "",
      email: "",
      phone: "",
      pickupAddress: "",
      deliveryAddress: "",
      pickupLat: undefined,
      pickupLng: undefined,
      pickupFloor: "",
      deliveryFloor: "",
      pickupElevator: "",
      deliveryElevator: "",
      deliveryLat: undefined,
      deliveryLng: undefined,
      profileType: "",
      profileQuantity: "",
      vehicleType: "",
      rentalDuration: "",
      notes: "",
    });
    setSelectedService(null);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Smooth scroll on tab navigation
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      // Only scroll elements that are inputs or textareas inside the form.
      // Ignore submit buttons to avoid interfering with form submission clicks.
      const isInForm = formRef.current?.contains(target);
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      const isButton = target.tagName === 'BUTTON';
      const isSubmitButton = isButton && (target as HTMLButtonElement).getAttribute('type') === 'submit';

      if (isInForm && (isInput || (isButton && !isSubmitButton))) {
        setTimeout(() => {
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }, 100);
      }
    };

    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);

  // Scroll to form when service is selected
  useEffect(() => {
    if (selectedService && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
        });
      }, 100);
    }
  }, [selectedService]);

  const handleServiceChange = (service: ServiceType) => {
    if (selectedService === service) {
      // Closing animation
      setIsClosing(true);
      setTimeout(() => {
        setSelectedService(null);
        setIsClosing(false);
      }, 300);
    } else {
      setIsClosing(false);
      setSelectedService(service);
    }
  };

  // Map picker state — separate pickers for pickup and delivery
  const [pickupMapOpen, setPickupMapOpen] = useState(false);
  const [deliveryMapOpen, setDeliveryMapOpen] = useState(false);
  const [initialPickupPos, setInitialPickupPos] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [initialDeliveryPos, setInitialDeliveryPos] = useState<{ lat: number; lng: number } | undefined>(undefined);

  const handleOpenMap = (which: "pickup" | "delivery") => {
    if (which === "pickup") {
      if (formData.pickupLat && formData.pickupLng) setInitialPickupPos({ lat: formData.pickupLat, lng: formData.pickupLng });
      else setInitialPickupPos(undefined);
      setPickupMapOpen(true);
    } else {
      if (formData.deliveryLat && formData.deliveryLng) setInitialDeliveryPos({ lat: formData.deliveryLat, lng: formData.deliveryLng });
      else setInitialDeliveryPos(undefined);
      setDeliveryMapOpen(true);
    }
  };

  const handleMapConfirmPickup = (payload: { lat: number; lng: number; address?: string }) => {
    setFormData({ ...formData, pickupLat: payload.lat, pickupLng: payload.lng, pickupAddress: payload.address ?? formData.pickupAddress });
    setPickupMapOpen(false);
  };

  const handleMapConfirmDelivery = (payload: { lat: number; lng: number; address?: string }) => {
    setFormData({ ...formData, deliveryLat: payload.lat, deliveryLng: payload.lng, deliveryAddress: payload.address ?? formData.deliveryAddress });
    setDeliveryMapOpen(false);
  };

  const serviceOptions = [
    { value: "ev-tasima", label: "Ev Taşıma", icon: Home, description: "Ev eşyalarınızın güvenli taşınması" },
    { value: "profil-tasima", label: "Demir / Profil Taşıma", icon: Briefcase, description: "Profesyonel ekipman taşımacılığı" },
    { value: "arac-kiralama", label: "Araç Kiralama", icon: Truck, description: "İhtiyacınıza uygun araç kiralama" },
    { value: "diger-tasima", label: "Diğer Taşıma Türleri", icon: Package, description: "Mobilya, beyaz eşya ve özel eşya taşımacılığı" },
  ];

  return (
    <>
    <section id="quote" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">Ücretsiz Teklif Alın</h2>
          <p className="text-sm sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Hizmet türünü seçin ve formu doldurun
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Service Selection */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Hizmet Türünü Seçin</CardTitle>
              <CardDescription className="text-sm sm:text-base">Size en uygun hizmeti belirleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {serviceOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedService === option.value;
                  return (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'border-primary ring-2 ring-primary shadow-lg bg-primary' 
                        : 'bg-background hover:border-primary hover:shadow-soft'
                    }`}
                    onClick={() => handleServiceChange(option.value as ServiceType)}
                  >
                    <CardContent className="p-4 md:p-6 text-center space-y-2 md:space-y-3">
                      <Icon className={`w-8 h-8 md:w-12 md:h-12 mx-auto transition-colors ${isSelected ? 'text-primary-foreground' : 'text-primary/70'}`} />
                      <h3 className={`font-semibold text-sm md:text-lg transition-colors ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>{option.label}</h3>
                      <p className={`text-xs md:text-sm transition-colors ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{option.description}</p>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <div 
            ref={formRef}
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              selectedService && !isClosing ? 'max-h-[5000px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            {selectedService && (
              <Card className="shadow-medium animate-in fade-in-0 zoom-in-95 slide-in-from-top-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-4 duration-700 ring-2 ring-primary/20 shadow-[0_0_40px_rgba(var(--primary),0.15)]">
                <CardHeader>
                  <CardTitle>Teklif Formu - {serviceOptions.find(s => s.value === selectedService)?.label}</CardTitle>
                  <CardDescription>Bilgilerinizi doldurun</CardDescription>
                </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">İletişim Bilgileri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ad Soyad *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Ahmet Yılmaz"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon Numarası *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="0555 123 45 67"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  {/* Service-specific fields */}
                  {selectedService === "ev-tasima" && (
                    <>
                      {/* Pickup Location */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          Mevcut Adres
                        </h3>
                        <div className="space-y-2">
                          <Label htmlFor="pickupAddress">Taşınacak Adres *</Label>
                          <div className="flex gap-2">
                            <Input
                              id="pickupAddress"
                              name="pickupAddress"
                              value={formData.pickupAddress}
                              onChange={handleInputChange}
                              required
                              placeholder="Örnek Mahallesi, Sokak No:1, İlçe, İl"
                            />
                            <Button type="button" variant="outline" onClick={() => handleOpenMap('pickup')}>Haritada Seç</Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="pickupFloor">Kat Numarası *</Label>
                            <Input
                              id="pickupFloor"
                              name="pickupFloor"
                              value={formData.pickupFloor}
                              onChange={handleInputChange}
                              required
                              placeholder="örn: 3. kat"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pickupElevator">Asansör Var mı? *</Label>
                            <Select
                              value={formData.pickupElevator}
                              onValueChange={(value) => setFormData({ ...formData, pickupElevator: value })}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Var</SelectItem>
                                <SelectItem value="no">Yok</SelectItem>
                                <SelectItem value="not-applicable">Müstakil/Zemin Kat</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Location */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-accent" />
                          Varış Adresi
                        </h3>
                        <div className="space-y-2">
                          <Label htmlFor="deliveryAddress">Taşınacak Adres *</Label>
                          <div className="flex gap-2">
                            <Input
                              id="deliveryAddress"
                              name="deliveryAddress"
                              value={formData.deliveryAddress}
                              onChange={handleInputChange}
                              required
                              placeholder="Yeni Mahallesi, Cadde No:10, İlçe, İl"
                            />
                            <Button type="button" variant="outline" onClick={() => handleOpenMap('delivery')}>Haritada Seç</Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="deliveryFloor">Kat Numarası *</Label>
                            <Input
                              id="deliveryFloor"
                              name="deliveryFloor"
                              value={formData.deliveryFloor}
                              onChange={handleInputChange}
                              required
                              placeholder="örn: Zemin kat"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="deliveryElevator">Asansör Var mı? *</Label>
                            <Select
                              value={formData.deliveryElevator}
                              onValueChange={(value) => setFormData({ ...formData, deliveryElevator: value })}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Var</SelectItem>
                                <SelectItem value="no">Yok</SelectItem>
                                <SelectItem value="not-applicable">Müstakil/Zemin Kat</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedService === "profil-tasima" && (
                    <>
                      {/* Addresses */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          Adres Bilgileri
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="pickupAddress">Başlangıç Adresi *</Label>
                            <div className="flex gap-2">
                              <Input
                                id="pickupAddress"
                                name="pickupAddress"
                                value={formData.pickupAddress}
                                onChange={handleInputChange}
                                required
                                placeholder="Örnek Mahallesi, Sokak No:1, İlçe, İl"
                              />
                              <Button type="button" variant="outline" onClick={() => handleOpenMap('pickup')}>Haritada Seç</Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="deliveryAddress">Hedef Adres *</Label>
                            <div className="flex gap-2">
                              <Input
                                id="deliveryAddress"
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleInputChange}
                                required
                                placeholder="Yeni Mahallesi, Cadde No:10, İlçe, İl"
                              />
                              <Button type="button" variant="outline" onClick={() => handleOpenMap('delivery')}>Haritada Seç</Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Profile Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Profil Detayları</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="profileType">Profil Türü *</Label>
                            <Input
                              id="profileType"
                              name="profileType"
                              value={formData.profileType}
                              onChange={handleInputChange}
                              required
                              placeholder="örn: Alüminyum, Cam Balkon"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profileQuantity">Adet *</Label>
                            <Input
                              id="profileQuantity"
                              name="profileQuantity"
                              type="number"
                              value={formData.profileQuantity}
                              onChange={handleInputChange}
                              required
                              placeholder="örn: 50"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedService === "arac-kiralama" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Araç Kiralama Detayları</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vehicleType">Araç Türü *</Label>
                          <Select
                            value={formData.vehicleType}
                            onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="panelvan">Panelvan</SelectItem>
                              <SelectItem value="kamyonet">Kamyonet</SelectItem>
                              <SelectItem value="kamyon">Kamyon</SelectItem>
                              <SelectItem value="tir">Tır</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rentalDuration">Kiralama Süresi *</Label>
                          <Input
                            id="rentalDuration"
                            name="rentalDuration"
                            value={formData.rentalDuration}
                            onChange={handleInputChange}
                            required
                            placeholder="örn: 1 gün, 3 saat"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedService === "lojistik" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Adres Bilgileri
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="pickupAddress">Başlangıç Adresi *</Label>
                          <Input
                            id="pickupAddress"
                            name="pickupAddress"
                            value={formData.pickupAddress}
                            onChange={handleInputChange}
                            required
                            placeholder="Örnek Mahallesi, Sokak No:1, İlçe, İl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deliveryAddress">Hedef Adres *</Label>
                          <Input
                            id="deliveryAddress"
                            name="deliveryAddress"
                            value={formData.deliveryAddress}
                            onChange={handleInputChange}
                            required
                            placeholder="Yeni Mahallesi, Cadde No:10, İlçe, İl"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Ek Notlar</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Özel istekleriniz, kırılabilir eşyalar veya ek bilgiler..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-accent-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        Gönderiliyor...
                      </>
                    ) : (
                      'Teklif Talebini Gönder'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </div>
    </section>
    <>
      <MapPicker
        open={pickupMapOpen}
        onOpenChange={(open) => setPickupMapOpen(open)}
        initial={initialPickupPos}
        onConfirm={handleMapConfirmPickup}
      />
      <MapPicker
        open={deliveryMapOpen}
        onOpenChange={(open) => setDeliveryMapOpen(open)}
        initial={initialDeliveryPos}
        onConfirm={handleMapConfirmDelivery}
      />
    </>
    </>
  );
};

export default QuoteForm;