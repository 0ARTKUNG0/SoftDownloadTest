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

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(sw => sw.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sw =>
        sw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sw.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSoftware(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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

      // Open download URL in new tab
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

      // Open each download URL in new tab
      result.download_links.forEach(link => {
        setTimeout(() => window.open(link.download_url, '_blank'), 300);
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
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <h1 className="text-xl font-bold ml-4">Software Download Manager</h1>
        </div>
        <div className="flex-none">
          <button onClick={handleLogout} className="btn btn-ghost mr-4">
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Filters Area */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-6">
          {/* Search Input */}
          <div className="form-control mb-4">
            <input
              type="text"
              placeholder="Search software..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="tabs tabs-boxed">
            {categories.map(category => (
              <a
                key={category}
                className={`tab ${selectedCategory === category ? 'tab-active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </a>
            ))}
          </div>
        </div>

        {/* Download Selected Button */}
        {selectedItems.length > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleDownloadSelected}
              className="btn btn-primary"
            >
              Download Selected ({selectedItems.length})
            </button>
          </div>
        )}

        {/* Software Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSoftware.map(item => (
              <div key={item.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  {/* Checkbox */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                      <span className="label-text font-bold">{item.name}</span>
                    </label>
                  </div>

                  <p className="text-sm text-base-content/70 mb-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="badge badge-outline">{item.category}</div>
                    <div className="badge badge-ghost">{item.size}</div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => handleVisitSite(item.website_url)}
                      className="btn btn-sm btn-ghost"
                    >
                      Visit Site
                    </button>
                    <button
                      onClick={() => handleDownloadSingle(item)}
                      className="btn btn-sm btn-primary"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredSoftware.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-base-content/70">No software found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
