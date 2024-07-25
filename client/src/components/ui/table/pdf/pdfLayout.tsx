import {
  Document,
  Font,
  Image,
  PDFViewer,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import Montserrat400 from "@assets/fonts/Montserrat-Regular.ttf";
import Montserrat600 from "@assets/fonts/Montserrat-SemiBold.ttf";
import Montserrat700 from "@assets/fonts/Montserrat-Bold.ttf";
import PDFData from "./pdfData";
import { getTodayUtc } from "@/utils/getTodayUtc";
import { tailwindColors } from "@/utils/tailwindConfig";
import { useUserContext } from "@/context/userContext";
import Logo from "@/assets/logo.png";
import { formatDate } from "@/utils/formatDate";

Font.register({
  family: "Montserrat",
  src: Montserrat400,
  fontWeight: 400,
});
Font.register({
  family: "Montserrat",
  src: Montserrat600,
  fontWeight: 600,
});
Font.register({
  family: "Montserrat",
  src: Montserrat700,
  fontWeight: 700,
});

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  data?: {
    title: string;
    value: string;
  }[];
}

const PDFLayout = ({ children, title, data }: Props) => {
  const { user } = useUserContext();
  const pages = Array.isArray(children) ? children : [children];

  return (
    <PDFViewer height="100%" width="100%">
      <Document>
        {pages.map((p, i) => (
          <Page
            key={i}
            size="A4"
            style={{
              padding: 18,
            }}
          >
            <View
              style={{
                paddingHorizontal: 8,
                borderBottom: 1,
                borderBottomColor: tailwindColors.gray["300"],
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 48,
                    borderRadius: 8,
                    marginVertical: 5,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={Logo}
                  />
                </View>
                <Text
                  style={{
                    fontWeight: 700,
                    fontFamily: "Montserrat",
                    fontSize: 24,
                    color: tailwindColors.emerald["900"],
                  }}
                >
                  Multiestilos Hogar
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: 600,
                  fontFamily: "Montserrat",
                  fontSize: 20,
                  color: tailwindColors.emerald["900"],
                }}
              >
                {title}
              </Text>
            </View>
            <View
              style={{
                padding: 8,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  gap: 4,
                }}
              >
                {data?.map((v, i) => (
                  <PDFData key={i} {...v} />
                ))}
              </View>
              <View
                style={{
                  gap: 4,
                }}
              >
                <PDFData
                  end
                  title="Creado por"
                  value={user ? user.usuario : "Anónimo"}
                />
                <PDFData title="Creado el" value={formatDate(getTodayUtc())} />
              </View>
            </View>
            {p}
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
};

export default PDFLayout;
