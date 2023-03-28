// pages/_app.js
import { ChakraProvider, useColorMode, extendTheme } from "@chakra-ui/react";
import { useEffect } from "react";
import { Global, css } from "@emotion/react";

import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/open-sans/800.css";

function ForceLightMode({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "light") return;
    toggleColorMode();
  }, [colorMode]);

  return children;
}

const GlobalStyle = ({ children }) => {
  let { colorMode } = useColorMode();
  return (
    <>
      <Global
        styles={css`
          html {
            min-width: 356px;
            scroll-behavior: smooth;
          }
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background: #f2e9e4;
          }
        `}
      />
      {children}
    </>
  );
};

const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ForceLightMode>
        <GlobalStyle>
          <Component {...pageProps} />
        </GlobalStyle>
      </ForceLightMode>
    </ChakraProvider>
  );
}

export default MyApp;
