import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQBlogs } from '../../hooks/useQBlogs';

export const Home = () => {
    const categories = ['All', 'NDA', 'CDS', 'AFCAT', 'INET', 'CAPF', 'SSB'];
    const [activeCategory, setActiveCategory] = useState('All');
    const { qblogs: blogs, loading } = useQBlogs();

    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        {/* Hero Section */}
        <main 
          className="relative pt-24 pb-0 flex flex-col justify-between w-full bg-cover bg-center bg-no-repeat shadow-lg"
          style={{ backgroundImage: "url('/images/Sudan_Block.jpg')", minHeight: '75vh' }}
        >
          {/* Cinematic overlay matching the header's blue theme */}
          <div className="absolute inset-0 bg-blue-900/85 z-0 pointer-events-none"></div>
          
          {/* Content (Centered to match the reference) */}
          <div className="relative z-10 px-4 md:px-8 w-full max-w-screen-xl mx-auto flex flex-col items-center text-center pt-16 md:pt-24 flex-grow">
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
              Welcome to DefenceRoger
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl font-light leading-relaxed">
              Your ultimate platform to prepare, practice, and succeed. Begin your journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-16">
              <button className="font-sans px-8 py-3.5 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-full text-[15px] tracking-wide transition-colors duration-300 shadow-md">
                Start test series
              </button>
              <button className="font-sans px-8 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/40 font-medium rounded-full text-[15px] tracking-wide transition-colors duration-300">
                Check if you are eligible
              </button>
            </div>
          </div>
          
          {/* Bottom Bar for Categories */}
          <div className="relative z-10 w-full bg-white mt-auto rounded-t-xl md:rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="max-w-screen-xl mx-auto px-4">
              <ul className="flex items-center justify-start md:justify-center overflow-x-auto py-5 gap-8 hide-scrollbar text-[15px] font-medium text-gray-500">
                {categories.map((cat) => (
                  <li key={cat} className="flex-shrink-0">
                    <button 
                      onClick={() => setActiveCategory(cat)}
                      className={`hover:text-blue-600 transition-colors pb-1 border-b-2 ${activeCategory === cat ? 'text-blue-600 border-blue-600' : 'border-transparent'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        {/* Blog Posts Section */}
        <section className="py-20 px-4 md:px-8 flex-grow">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-10">Latest Articles & Guides</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                  <Link to={`/qblog/${blog.id}`} key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col">
                    <div className="h-56 bg-gray-200 overflow-hidden relative">
                      <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                      <img 
                        src={blog.coverImage || `https://picsum.photos/seed/${index + 300}/800/600`} 
                        alt="Blog cover" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">{blog.category || 'General'}</span>
                        <span className="text-xs font-medium text-gray-500">
                          {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow">
                        {blog.excerpt || blog.data}
                      </p>
                      <div className="flex items-center text-blue-600 font-bold text-sm mt-auto">
                        Read full article 
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    );
};
