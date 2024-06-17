import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContextProvider } from 'Utilities/contexts/UserContext';
import { NotificationContextProvider } from 'Utilities/contexts/NotificationContext';
import App from 'Components/App';

const queryClient = new QueryClient();

const refresh = () =>
  ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <NotificationContextProvider>
          <Router>
            <App />
          </Router>
        </NotificationContextProvider>
      </UserContextProvider>
    </QueryClientProvider>,
  );

refresh();

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
