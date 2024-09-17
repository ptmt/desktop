import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./pages/HomePage";
import BaseLayout from "./layouts/BaseLayout";
import { syncThemeWithLocal } from "./components/theme_helpers";

export default function App() {

    useEffect(() => {
        syncThemeWithLocal();
    }, []);

    return (
        <BaseLayout>
            <HomePage />
        </BaseLayout>
    );
}

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
