// pages/_app.js
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";

function ForceDarkMode({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "dark") return;
    toggleColorMode();
  }, [colorMode]);

  return children;
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ForceDarkMode>
        <Component {...pageProps} />
      </ForceDarkMode>
    </ChakraProvider>
  );
}

export default MyApp;
