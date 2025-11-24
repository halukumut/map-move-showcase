import React, { useEffect, useRef, useState } from "react";
import loadGoogleMaps, { resetGoogleMapsLoader } from "@/lib/loadGoogleMaps";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type LatLng = { lat: number; lng: number };

type Props = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  initial?: LatLng;
  onConfirm: (latlng: LatLng & { address?: string }) => void;
};

const MapPicker: React.FC<Props> = ({ open, onOpenChange, initial, onConfirm }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<any>(null);
  const placeChangedListenerRef = useRef<any>(null);
  const mapClickListenerRef = useRef<any>(null);
  const autoServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const inputDebounceRef = useRef<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selected, setSelected] = useState<LatLng | null>(initial ?? null);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.error("VITE_GOOGLE_MAPS_API_KEY is not set");
      return;
    }

    let mounted = true;

    const init = async () => {
      setLoadError(null);
      try {
        await loadGoogleMaps({ apiKey: key, libraries: ["places"], version: "weekly" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Failed to load Google Maps libraries", err);
        setLoadError(msg);
        return;
      }
      if (!mounted || !mapRef.current) return;

      const g = (window as any).google;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new g.maps.Map(mapRef.current, {
          center: initial ?? { lat: 41.015137, lng: 28.979530 },
          zoom: 12,
        });
      } else {
        try {
          g.maps.event.trigger(mapInstanceRef.current, "resize");
          mapInstanceRef.current.setCenter(initial ?? mapInstanceRef.current.getCenter());
        } catch (e) {
          // ignore
        }
      }

      if (!markerRef.current) {
        markerRef.current = new g.maps.Marker({
          map: mapInstanceRef.current,
          position: initial ?? mapInstanceRef.current.getCenter(),
          draggable: true,
        });
      }

      // remove previous click listener if exists
      if (mapClickListenerRef.current) {
        try {
          mapClickListenerRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapClickListenerRef.current = null;
      }

      mapClickListenerRef.current = mapInstanceRef.current.addListener("click", (e: any) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        markerRef.current.setPosition({ lat, lng });
        setSelected({ lat, lng });
        const geocoder = new g.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === "OK" && results && results[0]) {
            setAddress(results[0].formatted_address || "");
          }
        });
      });

      // marker dragend
      try {
        g.maps.event.clearListeners(markerRef.current, "dragend");
      } catch (e) {}
      markerRef.current.addListener("dragend", () => {
        const pos = markerRef.current.getPosition();
        if (!pos) return;
        const lat = pos.lat();
        const lng = pos.lng();
        setSelected({ lat, lng });
        const geocoder = new g.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === "OK" && results && results[0]) setAddress(results[0].formatted_address || "");
        });
      });

      // Places Autocomplete: prefer PlaceAutocompleteElement when available, otherwise use AutocompleteService + PlacesService
      if (inputRef.current) {
        try {
          // initialize services
          if (!autoServiceRef.current && g.maps.places && g.maps.places.AutocompleteService) {
            autoServiceRef.current = new g.maps.places.AutocompleteService();
          }
          if (!placesServiceRef.current && g.maps.places && g.maps.places.PlacesService) {
            // PlacesService requires a node or map; pass the map container
            placesServiceRef.current = new g.maps.places.PlacesService(mapInstanceRef.current);
          }
        } catch (e) {
          // ignore and fallback to geocode
        }
      }

      // initial coords
      if (initial) {
        const lat = initial.lat;
        const lng = initial.lng;
        mapInstanceRef.current.setCenter({ lat, lng });
        markerRef.current.setPosition({ lat, lng });
        setSelected({ lat, lng });
        const geocoder = new g.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === "OK" && results && results[0]) setAddress(results[0].formatted_address || "");
        });
      }

      // ensure map renders correctly when dialog opens multiple times
      setTimeout(() => {
        try {
          g.maps.event.trigger(mapInstanceRef.current, "resize");
          if (selected && mapInstanceRef.current) mapInstanceRef.current.setCenter({ lat: selected.lat, lng: selected.lng });
        } catch (e) {}
      }, 200);
    };

    init();

    return () => {
      mounted = false;
      try {
        if (mapClickListenerRef.current) mapClickListenerRef.current.remove();
      } catch (e) {}
      try {
        if (placeChangedListenerRef.current) placeChangedListenerRef.current.remove();
      } catch (e) {}
      try {
        if (autocompleteRef.current && (autocompleteRef.current as any).unbindAll) (autocompleteRef.current as any).unbindAll();
      } catch (e) {}
      // Clear map and service refs so the next open creates fresh instances.
      try { if (markerRef.current && (markerRef.current as any).setMap) (markerRef.current as any).setMap(null); } catch(e) {}
      markerRef.current = null;
      try { if (mapInstanceRef.current) { /* optionally perform any map cleanup */ } } catch (e) {}
      mapInstanceRef.current = null;
      autocompleteRef.current = null;
      autoServiceRef.current = null;
      placesServiceRef.current = null;
    };
  }, [open, initial, retryKey]);

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm({ ...selected, address });
    onOpenChange?.(false);
  };

  const runGeocode = (query: string) => {
    if (!query) return;
    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results: any, status: any) => {
      if (status === "OK" && results && results[0] && mapInstanceRef.current) {
        const loc = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        if (!markerRef.current) markerRef.current = new (window as any).google.maps.Marker({ map: mapInstanceRef.current });
        markerRef.current.setPosition(loc);
        mapInstanceRef.current.panTo(loc);
        setSelected(loc);
        setAddress(results[0].formatted_address);
      }
    });
  };

  const handleRetry = () => {
    // reset loader singleton and retry
    try { resetGoogleMapsLoader(); } catch (e) {}
    setRetryKey((k) => k + 1);
  };

  // Fetch place predictions when user types (debounced)
  useEffect(() => {
    if (!open) return;
    if (!searchQuery || searchQuery.trim().length < 2) {
      setPredictions([]);
      return;
    }
    if (!autoServiceRef.current) {
      // no AutocompleteService available; skip
      return;
    }

    if (inputDebounceRef.current) clearTimeout(inputDebounceRef.current);
    inputDebounceRef.current = setTimeout(() => {
      try {
        autoServiceRef.current.getPlacePredictions({ input: searchQuery }, (preds: any[], status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && preds) setPredictions(preds);
          else setPredictions([]);
        });
      } catch (e) {
        setPredictions([]);
      }
    }, 300);

    return () => { if (inputDebounceRef.current) clearTimeout(inputDebounceRef.current); };
  }, [searchQuery, open]);

  const handlePickPrediction = (p: any) => {
    setPredictions([]);
    setSearchQuery(p.description || p.structured_formatting?.main_text || p.terms?.map((t:any)=>t.value).join(' '));
    if (placesServiceRef.current && p.place_id) {
      placesServiceRef.current.getDetails({ placeId: p.place_id, fields: ["geometry", "formatted_address"] }, (place: any, status: any) => {
        const OK = (window as any).google.maps.places.PlacesServiceStatus.OK;
        if (status === OK && place && place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          mapInstanceRef.current.setCenter({ lat, lng });
          if (!markerRef.current) markerRef.current = new (window as any).google.maps.Marker({ map: mapInstanceRef.current });
          markerRef.current.setPosition({ lat, lng });
          setSelected({ lat, lng });
          setAddress(place.formatted_address || p.description || '');
        } else {
          // fallback to geocode
          runGeocode(p.description || p.structured_formatting?.main_text || p.description);
        }
      });
    } else {
      runGeocode(p.description || p.structured_formatting?.main_text || p.description);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-3xl h-[70vh] p-0">
          <div className="h-full grid grid-rows-[1fr_auto]">
              <div className="relative h-full w-full">
              <div ref={mapRef} className="h-full w-full" />
              {loadError && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 p-4">
                  <div className="max-w-lg text-center">
                    <p className="mb-3 font-semibold text-lg">Harita yüklenemedi</p>
                    <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" onClick={handleRetry}>Tekrar Dene</Button>
                      <a className="text-sm underline" href="https://developers.google.com/maps/documentation/javascript/error-messages" target="_blank" rel="noreferrer">Hata mesajları hakkında bilgi</a>
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute left-4 right-4 top-4 z-30">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); runGeocode(searchQuery); } }}
                    className="w-full rounded-md border px-3 py-2 bg-white/90"
                    placeholder="Adres veya semt ara (örn: Kağıthane)"
                  />
                  <Button type="button" onClick={() => runGeocode(searchQuery)}>Ara</Button>
                </div>
                  {predictions.length > 0 && (
                    <div className="mt-2 max-h-56 overflow-auto bg-white/95 rounded-md shadow-md border">
                      {predictions.map((p) => (
                        <button key={p.place_id || p.description} type="button" onClick={() => handlePickPrediction(p)} className="w-full text-left px-3 py-2 hover:bg-slate-50">
                          {p.description}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          <div className="p-4 border-t bg-background">
            <div className="mb-2">
              <DialogTitle>Konum Seç</DialogTitle>
              <DialogDescription>
                Haritada bir nokta seçin veya mevcut markerı taşımak için tıklayın. Seçilen adres:
                <span className="mt-1 font-medium block">{address ?? (selected ? `${selected.lat.toFixed(6)}, ${selected.lng.toFixed(6)}` : 'Henüz seçilmedi')}</span>
              </DialogDescription>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange?.(false)}>İptal</Button>
              <Button disabled={!selected} onClick={handleConfirm}>Seçimi Onayla</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapPicker;
