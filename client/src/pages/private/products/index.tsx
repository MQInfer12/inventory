import Page from "@/components/ui/page";
import TableContainer from "@/components/ui/table/tableContainer";

const items = [
  {
    name: "Mauricio Molina",
    age: 20,
    city: "Cochabamba",
  },
  {
    name: "Andres Rocabado",
    age: 20,
    city: "Cochabamba",
  },
  {
    name: "Jose Veizaga",
    age: 20,
    city: "La Paz",
  },
  {
    name: "Veymar Illanez",
    age: 20,
    city: "Santa Cruz",
  },
  {
    name: "Mauricio Molina",
    age: 20,
    city: "Cochabamba",
  },
  {
    name: "Andres Rocabado",
    age: 20,
    city: "Cochabamba",
  },
  {
    name: "Jose Veizaga",
    age: 20,
    city: "La Paz",
  },
  {
    name: "Veymar Illanez",
    age: 20,
    city: "Santa Cruz",
  },
  {
    name: "Mauricio Molina",
    age: 20,
    city: "Cochabamba",
  },
  {
    name: "Andres Rocabado",
    age: 20,
    city: "Cochabamba",
  },
  {
    name: "Jose Veizaga",
    age: 20,
    city: "La Paz",
  },
  {
    name: "Veymar Illanez",
    age: 20,
    city: "Santa Cruz",
  },
  {
    name: "Mauricio Molina",
    age: 20,
    city: "Cochabamba",
  },
  {
    name: "Andres Rocabado",
    age: 20,
    city: "Cochabamba",
  },
  {
    name: "Jose Veizaga",
    age: 20,
    city: "La Paz",
  },
  {
    name: "Veymar Illanez",
    age: 20,
    city: "Santa Cruz",
  },
  {
    name: "Mauricio Molina",
    age: 20,
    city: "Cochabamba",
  },
  {
    name: "Andres Rocabado",
    age: 20,
    city: "Cochabamba",
  },
  {
    name: "Jose Veizaga",
    age: 20,
    city: "La Paz",
  },
  {
    name: "Veymar Illanez",
    age: 20,
    city: "Santa Cruz",
  },
];

const Products = () => {
  return (
    <Page>
      <TableContainer
        add={() => {}}
        columns={[
          {
            accessorKey: "name",
            header: "Nombre",
          },
          {
            accessorKey: "age",
            header: "Edad",
          },
          {
            accessorKey: "city",
            header: "Ciudad",
          },
        ]}
        data={items}
      />
    </Page>
  );
};

export default Products;
