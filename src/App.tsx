import { EditorPage } from "@/pages/Editor";
import { ThemeProvider } from "@/theme/providers/ThemeProvider";
import 'prosemirror-view/style/prosemirror.css';

import "@/i18n";

function App() {
  return (
    <ThemeProvider>
      <EditorPage />
    </ThemeProvider>
  );
}

export default App;
