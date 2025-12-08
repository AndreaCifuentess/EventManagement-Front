import { Routes, Route } from 'react-router-dom';
import Categories from './pages/Categories';
import Contact from './pages/Contact';

import Layout from './components/Layout';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import EventDetails from './pages/EventDetails';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Cart from './pages/Cart';

import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/Layout';
import AdminDashboard from './pages/admin/dashboard';
import EventsList from './pages/admin/events/index';
import CreateEvent from './pages/admin/events/create';
import EditEvent from './pages/admin/events/edit';

import CreateEstablishment from './pages/admin/establishments/create';
import EstablishmentsList from './pages/admin/establishments/index';
import EditEstablishment from './pages/admin/establishments/edit';

import CreateEntertainment from './pages/admin/entertainment/create';
import EntertainmentsList from './pages/admin/entertainment/index';
import EditEntertainment from './pages/admin/entertainment/edit';


import CreateCatering from './pages/admin/catering/create';
import CateringsList from './pages/admin/catering/index';
import EditCatering from './pages/admin/catering/edit';

import AdditionalList from './pages/admin/additional/index';
import CreateAdditional from './pages/admin/additional/create';
import EditAdditional from './pages/admin/additional/edit';

import DecorationList from './pages/admin/decoration/index';
import CreateDecoration from './pages/admin/decoration/create';
import EditDecoration from './pages/admin/decoration/edit';

import ClientList from './pages/admin/client/clientelist';

import Services from "./pages/Services";
import CategoryServices from "./pages/CategoriesServices";

import ReservationForm from './pages/ReservationForm';


import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />

        <Route path="/services" element={<Services />} />
        <Route path="/services/:categoryId" element={<CategoryServices />} />
        
        <Route path="/contact" element={<Contact />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/reserve/:serviceId?" element={<ReservationForm />} />

        {/* Rutas admin*/}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
        
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          
           {/* Rutas para Eventos */}
          <Route path="events" element={<EventsList />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/edit/:id" element={<EditEvent />} />

          {/* Rutas para Establecimientos */}
          <Route path="establishments" element={<EstablishmentsList />} />
          <Route path="establishments/create" element={<CreateEstablishment />} />
          <Route path="establishments/edit/:id" element={<EditEstablishment />} />

           {/* Rutas para Entretenimiento */}
          <Route path="entertainment" element={<EntertainmentsList />} />
          <Route path="entertainment/create" element={<CreateEntertainment />} />
          <Route path="entertainment/edit/:id" element={<EditEntertainment />} />

           {/* Rutas para Catering */}
          <Route path="catering" element={<CateringsList />} />
          <Route path="catering/create" element={<CreateCatering />} />
          <Route path="catering/edit/:id" element={<EditCatering />} />

          {/* Rutas para Adicionales */}
          <Route path="/admin/additionals" element={<AdditionalList />} />          
          <Route path="/admin/additionals/create" element={<CreateAdditional />} />  
          <Route path="/admin/additionals/edit/:id" element={<EditAdditional />} />   


          {/* Rutas para decoración */}
          <Route path="/admin/decoration" element={<DecorationList />} />
          <Route path="/admin/decoration/create" element={<CreateDecoration />} />
          <Route path="/admin/decoration/edit/:id" element={<EditDecoration />} />
                  
          {/* Rutas para obtener clientes */}  
          <Route path="/admin/clients" element={<ClientList />} />        
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;