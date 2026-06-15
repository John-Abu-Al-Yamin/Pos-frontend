import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function Main() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Change the direction of the document based on current language
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
