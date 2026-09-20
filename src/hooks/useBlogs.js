import { useState, useEffect } from 'react';

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      setLoading(true);
      const fetchedBlogs = [];
      let i = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          const response = await fetch(`/blogs/story_${i}.json`);
          const contentType = response.headers.get('content-type') || '';
          if (!response.ok || !contentType.includes('application/json')) {
            hasMore = false;
            break;
          }
          const data = await response.json();
          fetchedBlogs.push({ id: `story_${i}`, ...data });
          i++;
        } catch (err) {
          hasMore = false;
          break;
        }
      }

      // Sort by date descending
      fetchedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));

      setBlogs(fetchedBlogs);
      setLoading(false);
    };

    fetchAllBlogs();
  }, []);

  return { blogs, loading, error };
};

export const useBlog = (id) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/blogs/${id}.json`);
        if (!response.ok) {
          throw new Error('Blog not found');
        }
        const data = await response.json();
        setBlog({ id, ...data });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  return { blog, loading, error };
};
