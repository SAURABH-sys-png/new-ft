import { useParams, Link } from 'react-router-dom';
import { useQBlog } from '../../hooks/useQBlogs';
import ReactMarkdown from 'react-markdown';

export const QBlogPost = () => {
  const { id } = useParams();
  const { qblog, loading, error } = useQBlog(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !qblog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Article not found</h2>
        <p className="text-lg text-gray-600 mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link to="/" className="px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full transition-colors duration-300">
          Back to Home
        </Link>
      </div>
    );
  }

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'paragraph':
        return <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg">{block.text}</p>;
      case 'heading':
        return <h2 key={index} className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 tracking-tight">{block.text}</h2>;
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-blue-600 bg-gradient-to-r from-blue-50/80 to-transparent p-6 my-10 rounded-r-2xl text-xl italic text-gray-800 font-medium">
            "{block.text}"
          </blockquote>
        );
      case 'image':
        return (
          <figure key={index} className="my-12">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img src={block.src} alt={block.alt || 'Blog illustration'} className="w-full h-auto object-cover max-h-[500px]" />
            </div>
            {block.caption && (
              <figcaption className="text-center text-sm font-medium text-gray-500 mt-4 px-4">{block.caption}</figcaption>
            )}
          </figure>
        );
      case 'list':
        return (
          <ul key={index} className="list-none space-y-4 my-8">
            {block.content.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="flex-shrink-0 h-2 w-2 mt-2.5 rounded-full bg-blue-500 mr-4"></span>
                <span className="text-gray-700 text-lg leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Hero Section */}
      <main 
        className="relative pt-24 pb-20 flex flex-col justify-end w-full bg-cover bg-center bg-no-repeat shadow-lg"
        style={{ backgroundImage: `url('${qblog.coverImage || 'https://picsum.photos/seed/qblog/1920/1080'}')`, minHeight: '65vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-0"></div>
        
        <div className="relative z-10 px-4 md:px-8 w-full max-w-screen-md mx-auto flex flex-col pt-16">
          <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {qblog.category || 'General'}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
            {qblog.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-gray-300 gap-x-6 gap-y-3 mt-4 text-sm font-medium">
            {qblog.author && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-white border border-gray-600">
                  {qblog.author.charAt(0)}
                </div>
                {qblog.author}
              </div>
            )}
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(qblog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            {qblog.readTime && (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {qblog.readTime}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Article Content Section */}
      <section className="py-16 px-4 md:px-8 flex-grow">
        <div className="max-w-screen-md mx-auto bg-white p-8 md:p-14 rounded-[2rem] shadow-[0_-15px_40px_rgba(0,0,0,0.05)] -mt-24 relative z-20">
          
          {/* Main Content Area */}
          <div className="max-w-none text-gray-800">
            {qblog.content && qblog.content.length > 0 ? (
              qblog.content.map((block, index) => renderContentBlock(block, index))
            ) : (
              /* Fallback to markdown rendering if content array is missing */
              <div className="prose prose-lg prose-blue max-w-none">
                <ReactMarkdown>{qblog.data}</ReactMarkdown>
              </div>
            )}
          </div>
          
        </div>
      </section>
    </div>
  );
};
