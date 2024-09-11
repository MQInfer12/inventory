import { SheetData } from "@/components/ui/table/tableContainer";
import { ShowType } from "..";
import { Movimiento } from "../types/api";
import { City } from "@/context/cityContext";
import { formatDate } from "@/utils/formatDate";

export const getSheetData = (show: ShowType, city: City, cityName: string) => {
  const sheetData: SheetData<Movimiento>[] = [];
  if (show === "Movimientos") {
    sheetData.push(
      {
        title: "Descripción",
        value: (row) => row.producto?.descripcion || "-",
        style: {
          fontWeight: 700,
        },
      },
      {
        title: "Categorías",
        value: (row) =>
          row.producto?.categorias.map((cat) => cat.descripcion).join(", ") ||
          "",
      },
      {
        title: "Cantidad inicial",
        value: (row) =>
          city === "cbba"
            ? String(row.actual_cbba - row.cantidad_cbba)
            : String(row.actual_sc - row.cantidad_sc),
      },
      {
        title: "Código",
        value: (row) => row.producto?.codigo || "-",
        style: {
          color: "red",
        },
      },
      {
        title: "%",
        value: (row) =>
          row.producto?.porcentaje ? String(row.producto.porcentaje) : "",
      },
      {
        title: "Tienda",
        value: (row) => row.producto?.tienda?.nombre || "",
      },
      {
        title: "Ciudad",
        value: () => cityName,
      },
      {
        title: "Precio",
        value: (row) =>
          row.producto
            ? city === "cbba"
              ? String(row.producto.precio_cbba || "")
              : String(row.producto.precio_sc || "")
            : "",
      },
      {
        title: "Precio oferta",
        value: (row) =>
          row.producto
            ? city === "cbba"
              ? String(row.producto.precio_oferta_cbba || "")
              : String(row.producto.precio_oferta_sc || "")
            : "",
      },
      {
        title: "Usuario",
        value: (row) => row.usuario?.usuario || "-",
      },
      {
        title: "Fecha",
        value: (row) => formatDate(row.fecha.split(" ")[0]),
      },
      {
        title: "Hora",
        value: (row) => row.fecha.split(" ")[1],
      },
      {
        title: "Entrada",
        value: (row) =>
          city === "cbba"
            ? row.cantidad_cbba > 0
              ? String(row.cantidad_cbba)
              : "0"
            : row.cantidad_sc > 0
            ? String(row.cantidad_sc)
            : "0",
      },
      {
        title: "Salida",
        value: (row) =>
          city === "cbba"
            ? row.cantidad_cbba < 0
              ? String(row.cantidad_cbba)
              : "0"
            : row.cantidad_sc < 0
            ? String(row.cantidad_sc)
            : "0",
      },
      {
        title: "Saldo",
        value: (row) =>
          city === "cbba" ? String(row.actual_cbba) : String(row.actual_sc),
      },
      {
        title: "",
        value: (row) =>
          city === "cbba"
            ? row.actual_cbba === 0
              ? "Agotado"
              : ""
            : row.actual_sc === 0
            ? "Agotado"
            : "",
        style: {
          color: "red",
        },
      }
    );
  }

  if (show === "Ventas") {
    sheetData.push(
      {
        title: "Descripción",
        value: (row) => row.producto?.descripcion || "-",
        style: {
          fontWeight: 700,
        },
      },
      {
        title: "Categorías",
        value: (row) =>
          row.producto?.categorias.map((cat) => cat.descripcion).join(", ") ||
          "",
      },
      {
        title: "Código",
        value: (row) => row.producto?.codigo || "-",
        style: {
          color: "red",
        },
      },
      {
        title: "Ciudad",
        value: () => cityName,
      },
      {
        title: "Cantidad",
        value: (row) =>
          city === "cbba"
            ? String(row.cantidad_cbba * -1)
            : String(row.cantidad_sc * -1),
      },
      {
        title: "Precio unitario",
        value: (row) =>
          city === "cbba"
            ? String(row.precio_venta_cbba)
            : String(row.precio_venta_sc),
      },
      {
        title: "Total",
        value: (row) =>
          city === "cbba"
            ? String(row.cantidad_cbba * row.precio_venta_cbba * -1)
            : String(row.cantidad_sc * row.precio_venta_sc * -1),
      }
    );
  }

  return sheetData;
};
