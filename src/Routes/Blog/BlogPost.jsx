import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useBlog } from '../../hooks/useBlogs';

export const BlogPost = () => {
  const { id } = useParams();
  const { blog, loading, error } = useBlog(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Story not found</h2>
        <p className="text-lg text-gray-600 mb-8">The story you are looking for does not exist or has been removed.</p>
        <Link to="/" className="px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full transition-colors duration-300">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Hero Section */}
      <main 
        className="relative pt-24 pb-16 flex flex-col justify-end w-full bg-cover bg-center bg-no-repeat shadow-lg"
        style={{ backgroundImage: `url('https://picsum.photos/seed/${blog.name.replace(/\s+/g, '')}/1920/1080')`, minHeight: '60vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/80 to-transparent z-0"></div>
        
        <div className="relative z-10 px-4 md:px-8 w-full max-w-screen-md mx-auto flex flex-col pt-16">
          <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Stories
          </Link>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {blog.entry}
            </span>
            <span className="text-xs font-bold text-white bg-green-600/90 px-3 py-1.5 rounded-full uppercase tracking-wider border border-green-500/30 shadow-sm">
              {blog.recommendation}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            {blog.name} - {blog.entry} Interview Experience
          </h1>
          
          <div className="flex items-center text-blue-100 gap-6 mt-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {blog.ssb}
            </div>
          </div>
        </div>
      </main>

      {/* Blog Content Section */}
      <section className="py-16 px-4 md:px-8 flex-grow">
        <div className="max-w-screen-md mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] -mt-24 relative z-20">
          <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown>{blog.data}</ReactMarkdown>
          </div>
        </div>
      </section>
    </div>
  );
};
