import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { softwareAPI } from '../services/api';

const DashboardPage = () => {
  const [software, setSoftware] = useState([]);
  const [filteredSoftware, setFilteredSoftware] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['All', 'Browser', 'Media', 'Development', 'Utilities', 'Communication', 'Gaming'];

  useEffect(() => {
    loadSoftware();
  }, []);

  useEffect(() => {
    filterSoftware();
  }, [searchTerm, selectedCategory, software]);

  const loadSoftware = async () => {
    try {
      const data = await softwareAPI.getAll();
      setSoftware(data);
      setFilteredSoftware(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load software'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSoftware = () => {
    let filtered = software;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(sw => sw.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(sw =>
        sw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sw.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSoftware(filtered);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDownloadSingle = async (item) => {
    try {
      const result = await softwareAPI.download([item.id]);
      
      await Swal.fire({
        icon: 'success',
        title: 'Download Started!',
        text: `Downloading ${item.name}...`,
        timer: 1500,
        showConfirmButton: false
      });

      window.open(result.download_links[0].download_url, '_blank');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: error.message || 'Something went wrong'
      });
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedItems.length === 0) return;

    try {
      const result = await softwareAPI.download(selectedItems);
      
      await Swal.fire({
        icon: 'success',
        title: 'Downloads Started!',
        text: `Downloading ${selectedItems.length} item(s)...`,
        timer: 1500,
        showConfirmButton: false
      });

      result.download_links.forEach((link, index) => {
        setTimeout(() => window.open(link.download_url, '_blank'), 300 * index);
      });

      setSelectedItems([]);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: error.message || 'Something went wrong'
      });
    }
  };

  const handleVisitSite = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* Modern Navbar */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="flex-1">
          <div className="flex items-center gap-3 ml-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Software Download Manager</h1>
              <p className="text-xs text-base-content/60">Manage your downloads easily</p>
            </div>
          </div>
        </div>
        <div className="flex-none gap-2 mr-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <span className="text-sm">U</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-error btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        {/* Filter Section */}
        <div className="card bg-base-100 shadow-xl rounded-2xl mb-6">
          <div className="card-body p-6">
            {/* Search with Icon */}
            <div className="form-control mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-base-content/40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search software by name or description..."
                  className="input input-bordered w-full pl-10 focus:input-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="tabs tabs-boxed bg-base-200 p-1">
                {categories.map(category => (
                  <a
                    key={category}
                    className={`tab transition-all ${selectedCategory === category ? 'tab-active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </a>
                ))}
              </div>

              {/* Download Selected Button */}
              {selectedItems.length > 0 && (
                <button
                  onClick={handleDownloadSelected}
                  className="btn btn-primary gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download Selected ({selectedItems.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Software Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/60">Loading software...</p>
          </div>
        ) : filteredSoftware.length === 0 ? (
          <div className="card bg-base-100 shadow-xl rounded-2xl">
            <div className="card-body items-center text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-base-content/30 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
              <h3 className="text-xl font-bold text-base-content/70">No software found</h3>
              <p className="text-base-content/50">Try adjusting your search or filter</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredSoftware.map(item => (
              <div 
                key={item.id} 
                className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl border border-base-content/5"
              >
                <div className="card-body p-5">
                  {/* Checkbox & Title */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <label className="label cursor-pointer justify-start gap-2 p-0">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                        <span className="font-bold text-base leading-tight">{item.name}</span>
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-base-content/60 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="badge badge-primary badge-sm">{item.category}</div>
                    <div className="badge badge-ghost badge-sm">{item.size}</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions justify-end gap-2">
                    <button
                      onClick={() => handleVisitSite(item.website_url)}
                      className="btn btn-sm btn-outline"
                    >
                      Visit Site
                    </button>
                    <button
                      onClick={() => handleDownloadSingle(item)}
                      className="btn btn-sm btn-primary gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
