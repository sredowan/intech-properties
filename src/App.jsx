import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Landowners from './pages/Landowners';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PropertiesManager from './pages/admin/PropertiesManager';
import BlogManager from './pages/admin/BlogManager';
import { GalleryManager, TestimonialsManager } from './pages/admin/GalleryAndTestimonials';
import EnquiriesManager from './pages/admin/EnquiriesManager';
import Settings from './pages/admin/Settings';
import DataMigration from './pages/admin/DataMigration';
import HeroManager from './pages/admin/HeroManager';

// Components
import Header from './components/Header';
import { Footer } from './components/Footer';

// Public Layout Wrapper
const PublicLayout = () => (
  <div className="font-sans text-gray-800">
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes (No Header/Footer) */}
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<PropertiesManager />} />
          <Route path="blogs" element={<BlogManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="enquiries" element={<EnquiriesManager />} />
          <Route path="settings" element={<Settings />} />
          <Route path="migration" element={<DataMigration />} />
          <Route path="hero-slider" element={<HeroManager />} />
        </Route>

        {/* Public Routes (With Header/Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:status" element={<Properties />} />
          <Route path="/projects/:id" element={<PropertyDetails />} />
          <Route path="/landowners" element={<Landowners />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
