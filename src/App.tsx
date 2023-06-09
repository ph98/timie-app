import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import duration from 'dayjs/plugin/duration'
import "./App.css";

import EventsPage from "./pages/events/events";
import LoginPage from "./pages/login/login";
import EventPage from "./pages/event/event";
import Layout from "./components/layout";

dayjs.extend(isBetween)
dayjs.extend(duration)


const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
