import { tailwindColors } from "@/utils/tailwindConfig";
import { Text, View } from "@react-pdf/renderer";

interface Props {
  title: string;
  value: string;
  end?: boolean;
}

const PDFData = ({ title, value, end = false }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        justifyContent: end ? "flex-end" : undefined,
      }}
    >
      <Text
        style={{
          fontWeight: 400,
          fontFamily: "Montserrat",
          fontSize: 10,
          color: tailwindColors.gray["400"],
        }}
      >
        {title}:
      </Text>
      <Text
        style={{
          fontWeight: 400,
          fontFamily: "Montserrat",
          fontSize: 10,
          color: tailwindColors.emerald["900"],
        }}
      >
        {value}
      </Text>
    </View>
  );
};

export default PDFData;
