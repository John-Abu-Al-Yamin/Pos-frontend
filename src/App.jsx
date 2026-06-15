import { RouterProvider } from "react-router-dom";
import router from "./router";
import TanstackProvider from "./providers/TanstackProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <TanstackProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center"   />
    </TanstackProvider>
  );
}

export default App;
