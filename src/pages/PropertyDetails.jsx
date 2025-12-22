import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyBySlug, getGallery, addEnquiry } from '../db/queries';
import { MapPin, Calendar, Layers, Maximize, Ruler, CheckCircle, ArrowLeft, Download, Phone, Car, Home, Droplets, Zap, Shield, Warehouse, Video, Bath, DoorOpen } from 'lucide-react';
import { getLocalAsset } from '../utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const brochureRef = useRef();

    useEffect(() => {
        const loadProperty = async () => {
            setLoading(true);
            try {
                // Fetch property by slug
                const propData = await getPropertyBySlug(id);
                if (propData) {
                    setProperty(propData);

                    // Fetch associated gallery timeline (filter by propertyId on client)
                    const allGallery = await getGallery();
                    const galData = allGallery.filter(g => g.propertyId === propData.id);
                    setGallery(galData);
                }
            } catch (err) {
                console.error("Error fetching property details:", err);
            } finally {
                setLoading(false);
            }
        };
        window.scrollTo(0, 0);
        loadProperty();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium animate-pulse">Loading Property Details...</p>
            </div>
        </div>
    );

    if (!property) {
        console.warn(`Property not found for slug/id: ${id}`);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ArrowLeft size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
                    <p className="text-gray-500 mb-8">
                        The property you are looking for ({id}) does not exist or has been removed.
                    </p>
                    <Link to="/properties" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-secondary transition-colors">
                        Browse All Properties
                    </Link>
                </div>
            </div>
        );
    }

    // Helper for At A Glance icons
    const getIcon = (key) => {
        switch (key) {
            case 'bedrooms': return <Home size={24} />;
            case 'bathrooms': return <Droplets size={24} />;
            case 'size': return <Ruler size={24} />;
            case 'garage': return <Car size={24} />;
            default: return <CheckCircle size={24} />;
        }
    };

    const handleDownloadBrochure = async (e) => {
        e.preventDefault();
        if (!brochureRef.current) return;

        try {
            const canvas = await html2canvas(brochureRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${property.title}-brochure.pdf`);
        } catch (err) {
            console.error('PDF Generation failed', err);
            alert('Failed to generate PDF');
        }
    };

    return (
        <div className="property-details-page pt-16 pb-24 bg-gray-50">
            {/* Hidden Brochure Template */}
            <div style={{ position: 'absolute', top: -9999, left: -9999, width: '800px' }}>
                <div ref={brochureRef} className="bg-white p-10 font-sans text-gray-800">
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <h1 className="text-3xl font-bold text-[#0D47A1]">{property.title}</h1>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Intech Properties</p>
                            <p className="font-bold text-secondary">www.intechproperties.com</p>
                        </div>
                    </div>
                    <img src={getLocalAsset(property.images?.[0])} className="w-full h-64 object-cover mb-8 rounded" alt="Cover" />
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                            <h2 className="font-bold text-lg mb-2">Location</h2>
                            <p>{property.meta?.map_address || property.location}</p>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg mb-2">Status</h2>
                            <p>{property.status}</p>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h2 className="font-bold text-xl mb-4 border-b">At A Glance</h2>
                        <ul className="grid grid-cols-2 gap-2">
                            {property.meta?.land && <li>Land: {property.meta.land}</li>}
                            {property.meta?.['building-height'] && <li>Height: {property.meta['building-height']}</li>}
                            {/* Add more glance items from new AtGlance object if present */}
                            {property.at_a_glance && Object.entries(property.at_a_glance).map(([k, v]) => (
                                <li key={k} className="capitalize">{k.replace('_', ' ')}: {v}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-8">
                        <h2 className="font-bold text-xl mb-4 border-b">Features</h2>
                        <div className="flex flex-wrap gap-2">
                            {(property.features || ['Lift', 'Security']).map(f => (
                                <span key={f} className="bg-gray-100 px-2 py-1 text-sm">{f}</span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 text-center text-xs text-gray-400">
                        Generated from Intech Properties Website
                    </div>
                </div>
            </div>

            {/* Hero / Header Section */}
            <div className="bg-primary text-white py-16">
                <div className="container mx-auto px-6 md:px-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white font-bold mb-6 transition-colors">
                        <ArrowLeft size={20} /> Back to Projects
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black mb-4">{property.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-white/80 font-medium">
                        <div className="flex items-center gap-2">
                            <MapPin size={20} className="text-secondary" />
                            {property.meta?.map_address || property.location}
                        </div>
                        <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${property.status === 'Completed' ? 'bg-green-500 text-white' :
                            property.status === 'Ongoing' ? 'bg-secondary text-white' : 'bg-blue-500 text-white'
                            }`}>
                            {property.status}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 -mt-10 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {/* Unified At A Glance Section */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12 flex flex-col md:flex-row border border-gray-100">
                            {/* Left: Image (Cover) */}
                            {/* Left: Image Slider */}
                            <div className="md:w-1/2 relative min-h-[400px] h-[500px] bg-gray-100">
                                <Swiper
                                    spaceBetween={0}
                                    centeredSlides={true}
                                    autoplay={{
                                        delay: 3500,
                                        disableOnInteraction: false,
                                    }}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    navigation={true}
                                    modules={[Autoplay, Pagination, Navigation]}
                                    className="w-full h-full"
                                >
                                    {/* Property Images from database */}
                                    {(property.images || []).filter(Boolean).map((img, idx) => (
                                        <SwiperSlide key={idx} className="flex items-center justify-center bg-gray-100">
                                            <img
                                                src={getLocalAsset(img)}
                                                alt={`${property.title} - View ${idx + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            {/* Right: Details Table */}
                            <div className="md:w-1/2 p-8">
                                <h3 className="text-xl font-black text-[#0D47A1] uppercase tracking-widest mb-6 border-b pb-4">At A Glance</h3>

                                <div className="space-y-0 text-sm">
                                    <RowItem label="Property Name" value={property.title} />
                                    <RowItem label="Address" value={
                                        [property.address_house, property.address_road, property.address_area, property.address_city]
                                            .filter(Boolean).join(', ') || property.location
                                    } />
                                    <RowItem label="Land Size" value={property.at_a_glance?.land_size || property.meta?.land} />
                                    <RowItem label="Road Size" value={property.at_a_glance?.road_size} />
                                    <RowItem label="Building Height" value={property.at_a_glance?.building_height || property.meta?.['building-height']} />
                                    <RowItem label="Unit Per Floor" value={property.at_a_glance?.unit_per_floor} />

                                    {/* Merged Features */}
                                    <div className="py-3 grid grid-cols-[140px_1fr] gap-4 border-b border-gray-100 last:border-0">
                                        <span className="font-bold text-[#0D47A1] uppercase text-xs tracking-wider pt-1">Features</span>
                                        <div className="text-gray-600 font-medium leading-relaxed">
                                            {(property.features || []).join(', ')}
                                        </div>
                                    </div>
                                </div>
                                {/* Construction Status Removed */}
                            </div>
                        </div>

                        {/* Integrated Floor Plans & Unite Details */}
                        {property.floorPlans && property.floorPlans.length > 0 && (
                            <section className="mb-12 bg-white p-8 rounded-2xl shadow-sm">
                                <h3 className="text-2xl font-bold text-primary mb-6 border-l-4 border-secondary pl-4">Floor Plans & Configurations</h3>
                                {/* Horizontal Scrollable Tabs */}
                                <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
                                    {property.floorPlans.map((plan, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveTab(i)}
                                            className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${activeTab === i
                                                ? 'bg-primary text-white border-primary shadow-lg transform scale-105'
                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-primary hover:border-primary hover:bg-white'
                                                }`}
                                        >
                                            {plan.fave_plan_title || plan.name || `Plan ${i + 1}`}
                                        </button>
                                    ))}
                                </div>
                                {/* Tab Content */}
                                <div className="space-y-8 animate-fadeIn">
                                    {/* Render Unit Details ONLY if it's NOT a simple plan (Ground/Typical) AND has details */}
                                    {!property.floorPlans[activeTab].is_simple_plan && (property.floorPlans[activeTab].fave_plan_size || property.floorPlans[activeTab].details?.size) && (
                                        <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                                            <h4 className="text-lg font-bold text-[#001253] mb-6 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                                Unit Details
                                            </h4>
                                            {/* Compatible with both old data structure and new Admin structure */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                                                <UnitStat label="Size" icon={<Ruler size={20} />} value={property.floorPlans[activeTab].fave_plan_size || property.floorPlans[activeTab].details?.size} unit="sft" />
                                                <UnitStat label="Bedrooms" icon={<Home size={20} />} value={property.floorPlans[activeTab].fave_plan_rooms || property.floorPlans[activeTab].details?.bed} />
                                                <UnitStat label="Bathrooms" icon={<Bath size={20} />} value={property.floorPlans[activeTab].fave_plan_bathrooms || property.floorPlans[activeTab].details?.bath} />
                                                <UnitStat label="Balconies" icon={<DoorOpen size={20} />} value={property.floorPlans[activeTab].details?.balcony || 'N/A'} />
                                            </div>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-xl overflow-hidden border-2 border-dashed border-gray-200 min-h-[400px] flex flex-col items-center justify-center p-4 relative group">
                                        <img
                                            src={getLocalAsset(property.floorPlans[activeTab].fave_plan_image || property.floorPlans[activeTab].image)}
                                            alt="Floor Plan"
                                            className="max-w-full h-auto max-h-[600px] object-contain transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* NEW: Video Section */}
                        {property.video_url && (
                            <section className="mb-12 bg-white p-8 rounded-2xl shadow-sm">
                                <h3 className="text-2xl font-bold text-primary mb-6 border-l-4 border-secondary pl-4">Property Video</h3>
                                <div className="aspect-w-16 aspect-h-9">
                                    {property.video_url.includes('youtube') || property.video_url.includes('youtu.be') ? (
                                        <iframe
                                            src={property.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                            title="Property Video"
                                            className="w-full h-[400px] rounded-lg"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <a href={property.video_url} target="_blank" rel="noreferrer" className="flex items-center justify-center h-40 bg-gray-100 rounded text-blue-600 underline">
                                            <Video className="mr-2" /> Watch Video
                                        </a>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* NEW: Project Timeline Section */}
                        {gallery.length > 0 && (
                            <section className="mb-12 bg-white p-8 rounded-2xl shadow-sm">
                                <h3 className="text-2xl font-bold text-primary mb-6 border-l-4 border-secondary pl-4">Project Progress Timeline</h3>
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                    {gallery
                                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Newest first
                                        .map((item, idx) => (
                                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                {/* Icon */}
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-secondary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                    <Calendar size={16} />
                                                </div>
                                                {/* Content */}
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded bg-gray-50 border border-slate-200 shadow">
                                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                                        <div className="font-bold text-slate-900">{new Date(item.date).toLocaleDateString()}</div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <img src={getLocalAsset(item.image)} alt={item.caption} className="w-full h-48 object-cover rounded-lg mb-2" />
                                                        <p className="text-slate-500">{item.caption}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </section>
                        )}

                        {/* Overview */}
                        <section className="mb-12 bg-white p-8 rounded-2xl shadow-sm">
                            <h3 className="text-2xl font-bold text-primary mb-6 border-l-4 border-secondary pl-4">Project Overview</h3>
                            <div className="text-gray-600 leading-relaxed space-y-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: property.content }} />
                        </section>

                        {/* Location Map Placeholder */}
                        <section className="mb-12 bg-white p-8 rounded-2xl shadow-sm">
                            <h3 className="text-2xl font-bold text-primary mb-6 border-l-4 border-secondary pl-4">Location</h3>
                            <div className="bg-gray-200 rounded-xl h-[400px] flex items-center justify-center text-gray-400 font-bold text-xl">
                                Google Map Integration via API
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 space-y-8">
                        {/* Inquiry / Download Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-8 border-secondary sticky top-28">
                            <h3 className="text-xl font-bold text-primary mb-2">Detailed Brochure</h3>
                            <p className="text-gray-500 text-sm mb-6">Download the full project specification and plans.</p>

                            <button
                                onClick={handleDownloadBrochure}
                                className="w-full bg-primary text-white font-bold py-4 rounded uppercase tracking-widest hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={18} /> Download Brochure PDF
                            </button>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-4">Direct Contact</h4>
                                <a href="tel:+8801958600068" className="flex items-center gap-3 text-secondary font-bold text-lg hover:underline">
                                    <Phone size={20} /> +880 1958 600068
                                </a>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-4">Enquire Now</h4>
                                <SidebarEnquiryForm propertyTitle={property.title} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

const SidebarEnquiryForm = ({ propertyTitle }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await addEnquiry({
                name: formData.name,
                email: '',
                phone: formData.phone,
                message: formData.message,
                propertyId: propertyTitle
            });
            setStatus('success');
            setFormData({ name: '', phone: '', message: '' });
        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'success' && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">Sent successfully!</div>}
            <input
                required
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 p-3 rounded border focus:border-primary outline-none text-sm"
            />
            <input
                required
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-50 p-3 rounded border focus:border-primary outline-none text-sm"
            />
            <textarea
                placeholder="Message"
                rows="3"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-50 p-3 rounded border focus:border-primary outline-none text-sm"
            ></textarea>
            <button disabled={loading} className="w-full bg-secondary text-white py-3 rounded text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Enquiry'}
            </button>
        </form>
    );
};

const UnitStat = ({ label, icon, value, unit }) => (
    value ? (
        <div className="flex flex-col">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</span>
            <div className="flex items-center gap-2 text-xl md:text-2xl font-black text-gray-800">
                <span className="text-secondary">{icon}</span>
                {value} <span className="text-sm text-gray-500">{unit}</span>
            </div>
        </div>
    ) : null
);

const RowItem = ({ label, value }) => (
    value ? (
        <div className="py-3 grid grid-cols-[140px_1fr] gap-4 border-b border-gray-100 last:border-0 items-center">
            <span className="font-bold text-[#0D47A1] uppercase text-xs tracking-wider">{label}</span>
            <span className="text-gray-600 font-medium text-right md:text-left">{value}</span>
        </div>
    ) : null
);

export default PropertyDetails;
