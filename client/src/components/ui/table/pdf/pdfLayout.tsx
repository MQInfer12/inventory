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
import { formatDate } from "@/utils/formatDate";
import Loader from "../../loader/loader";

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
  loaderText?: string;
}

const PDFLayout = ({ children, title, data, loaderText }: Props) => {
  const { user } = useUserContext();
  const pages = Array.isArray(children) ? children : [children];

  const logoUrl = import.meta.env.BASE_URL + "assets/logo.png";
  return (
    <div className="w-full h-full isolate relative">
      <div className="z-[-1] absolute inset-0 flex items-center justify-center">
        <Loader icon={false} text={loaderText} />
      </div>
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
                    gap: 8,
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
                      source={logoUrl}
                    />
                  </View>
                  <Text
                    style={{
                      fontWeight: 700,
                      fontFamily: "Montserrat",
                      fontSize: 20,
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
                  <PDFData
                    title="Creado el"
                    value={formatDate(getTodayUtc())}
                  />
                </View>
              </View>
              {p}
            </Page>
          ))}
        </Document>
      </PDFViewer>
    </div>
  );
};

export default PDFLayout;
