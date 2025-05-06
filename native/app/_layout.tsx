import { Provider } from "react-redux";
import { store } from "../store";
import NavigationWrapper from "@/components/navigation/NavigationWrapper";

export default function RootLayout() {
    return (
        <Provider store={store}>
            <NavigationWrapper />
        </Provider>
    );
}
