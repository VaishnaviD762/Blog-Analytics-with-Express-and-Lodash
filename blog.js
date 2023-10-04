//Blog Analytics with Express and Lodash

const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const app = express();
const port = 3000;

// Middleware to fetch blog data
app.get('/api/blog-stats', async (req, res) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });

    const blogs = response.data;

    // Calculate statistics
    const totalBlogs = blogs.length;
    const longestBlog = _.maxBy(blogs, 'title.length');
    const blogsWithPrivacy = _.filter(blogs, (blog) => blog.title.toLowerCase().includes('privacy'));
    const uniqueTitles = _.uniqBy(blogs, 'title');

    res.json({
      totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueTitles: uniqueTitles.map((blog) => blog.title),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching and analyzing blog data' });
  }
});

// Search endpoint
app.get('/api/blog-search', async (req, res) => {
  try {
    const query = req.query.query.toLowerCase();
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });

    const blogs = response.data;

    // Filter blogs based on query
    const filteredBlogs = _.filter(blogs, (blog) => blog.title.toLowerCase().includes(query));

    res.json(filteredBlogs);
  } catch (error) {
    res.status(500).json({ error: 'Error searching for blogs' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
