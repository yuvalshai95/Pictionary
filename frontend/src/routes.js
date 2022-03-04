import { HomePage } from './pages/HomePage.jsx';
import { OtherPage } from './pages/OtherPage.jsx';

const routes = [
  {
    path: '/other',
    component: <OtherPage />,
  },
  {
    path: '/',
    component: <HomePage />,
  },
];

export default routes;
