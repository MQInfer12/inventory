import { Text } from "@react-pdf/renderer";

interface Props {
  children?: React.ReactNode;
  style?: { [key: string]: any };
}

const FontedText = ({ children, style }: Props) => {
  return (
    <Text
      style={{
        fontFamily: "Montserrat",
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

export default FontedText;
