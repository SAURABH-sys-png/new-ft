import { useState, useEffect } from 'react';

export const useQBlogs = () => {
  const [qblogs, setQBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllQBlogs = async () => {
      setLoading(true);
      const fetchedBlogs = [];
      let i = 1;
      // As per listing, blg_8 is missing, so we'll check up to 15 just to be safe
      // or we just handle 404s gracefully without stopping entirely if we want, 
      // but sequentially if we stop at blg_8 we miss 9-12.
      // Let's loop up to 20 instead of breaking on first 404.
      
      for (let j = 1; j <= 15; j++) {
        try {
          const response = await fetch(`/qblogs/blg_${j}.json`);
          if (response.ok) {
            const data = await response.json();
            fetchedBlogs.push({ id: `blg_${j}`, ...data });
          }
        } catch (err) {
          console.error(`Error fetching blg_${j}.json`, err);
        }
      }

      // Sort by date descending
      fetchedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));

      setQBlogs(fetchedBlogs);
      setLoading(false);
    };

    fetchAllQBlogs();
  }, []);

  return { qblogs, loading, error };
};

export const useQBlog = (id) => {
  const [qblog, setQblog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/qblogs/${id}.json`);
        if (!response.ok) {
          throw new Error('QBlog not found');
        }
        const data = await response.json();
        setQblog({ id, ...data });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQBlog();
    }
  }, [id]);

  return { qblog, loading, error };
};
