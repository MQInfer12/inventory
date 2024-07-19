import resolveConfig from "tailwindcss/resolveConfig";
import tailwindCfg from "../../tailwind.config";

const tailwindConfig = resolveConfig(tailwindCfg);
export const tailwindColors = tailwindConfig.theme.colors;
export default tailwindConfig;

