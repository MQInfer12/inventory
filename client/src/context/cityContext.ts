import { create } from "zustand";

export type City = "cbba" | "sc";

interface Ctx {
  city: City;
  cityName: string;
  setCity: (city: City) => void;
}

export const useCityContext = create<Ctx>((set) => {
  const initialCity: City = "cbba";
  const cityNames: Record<City, string> = {
    cbba: "Cochabamba",
    sc: "Santa Cruz",
  };

  return {
    city: initialCity,
    cityName: cityNames[initialCity],
    setCity(city) {
      set((prev) => ({ ...prev, city, cityName: cityNames[city] }));
    },
  };
});
