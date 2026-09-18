import blog1 from "./blg_1.json";
import blog2 from "./blg_2.json";
import blog3 from "./blg_3.json";
import blog4 from "./blg_4.json";
import blog5 from "./blg_5.json";
import blog6 from "./blg_6.json";
import blog7 from "./blg_7.json";
import blog8 from "./blg_8.json";
import blog9 from "./blg_9.json";
import blog10 from "./blg_10.json";
import blog11 from "./blg_11.json";
import blog12 from "./blg_12.json";

import { slugify } from "../utils/slugify";
const blogs = [
  { ...blog1, slug: slugify(blog1.title) },
  { ...blog2, slug: slugify(blog2.title) },
  { ...blog3, slug: slugify(blog3.title) },
  { ...blog4, slug: slugify(blog4.title) },
  { ...blog5, slug: slugify(blog5.title) },
  { ...blog6, slug: slugify(blog6.title) },
  { ...blog7, slug: slugify(blog7.title) },
  { ...blog8, slug: slugify(blog8.title) },
  { ...blog9, slug: slugify(blog9.title) },
  { ...blog10, slug: slugify(blog10.title)},
  { ...blog11, slug:slugify(blog11.title)},
  { ...blog12, slug:slugify(blog12.title)}
];

export default blogs;
