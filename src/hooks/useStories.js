import { useState, useEffect } from 'react';

export const useStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllStories = async () => {
      setLoading(true);
      const fetched = [];

      for (let j = 1; j <= 30; j++) {
        try {
          const response = await fetch(`/blogs/story_${j}.json`);
          if (response.ok) {
            const data = await response.json();
            fetched.push({ id: `story_${j}`, ...data });
          }
        } catch (err) {
          console.error(`Error fetching story_${j}.json`, err);
        }
      }

      // Sort by date descending
      fetched.sort((a, b) => new Date(b.date) - new Date(a.date));

      setStories(fetched);
      setLoading(false);
    };

    fetchAllStories();
  }, []);

  return { stories, loading, error };
};

export const useStory = (id) => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/blogs/${id}.json`);
        if (!response.ok) {
          throw new Error('Story not found');
        }
        const data = await response.json();
        setStory({ id, ...data });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id]);

  return { story, loading, error };
};
