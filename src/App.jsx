import ReactDOM from 'react-dom/client';

/* Incorporar bs5 */
import 'bootstrap/dist/css/bootstrap.min.css';
/* Incorporar los iconos */
import 'bootstrap-icons/font/bootstrap-icons.css';

import ContactList from './components/ContactList';

ReactDOM.createRoot(document.getElementById('root')).render(<ContactList />);
