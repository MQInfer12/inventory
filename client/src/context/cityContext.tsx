import { createContext, useContext, useState } from "react";

export type City = "cbba" | "sc";

interface Ctx {
  city: City;
  cityName: string;
  setCity: (city: City) => void;
}

const CityContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
}

export const CityContextProvider = ({ children }: Props) => {
  const initialCity: City = "cbba";
  const cityNames: Record<City, string> = {
    cbba: "Cochabamba",
    sc: "Santa Cruz",
  };
  const [city, setCityS] = useState<City>(initialCity);

  const setCity = (city: City) => {
    setCityS(city);
  };

  return (
    <CityContext.Provider value={{ city, setCity, cityName: cityNames[city] }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCityContext = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("this contexts must be used whitin a CityContextProvider");
  }
  return context;
};
