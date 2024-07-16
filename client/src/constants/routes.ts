export enum ROUTES {
  INDEX = "/",
  HOME = "/home",
  PRODUCTS = ROUTES.HOME + "/products",
  USERS = ROUTES.HOME + "/users",
  CATEGORIES = ROUTES.HOME + "/categories",
  SHOPS = ROUTES.HOME + "/shops",
  REPORTS = ROUTES.HOME + "/reports",
}

export const ROUTENAMES: Record<ROUTES, string> = {
  [ROUTES.INDEX]: "Inicio",
  [ROUTES.HOME]: "Home",
  [ROUTES.PRODUCTS]: "Productos",
  [ROUTES.USERS]: "Usuarios",
  [ROUTES.CATEGORIES]: "Categorías",
  [ROUTES.SHOPS]: "Tiendas",
  [ROUTES.REPORTS]: "Reportes",
} as const;
