import { useTheme } from "next-themes";
import DTButton from "./DTButton";

export default function ToggleTheme() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <DTButton
      onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
    >
      B
    </DTButton>
  );
}
