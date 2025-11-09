import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import apiFetch, { BACKEND_URL } from "@/lib/api";

const Blog = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  interface BlogPost {
    id: number;
    title: string;
    slug: string;
    blog_type: 'manual' | 'pdf';
    excerpt: string;
    content: string;
    featured_image: string;
    pdf_file: string;
    pdf_thumbnail: string;
    is_published: boolean;
    created_at: string;
    images: Array<{ id: number; image: string; alt_text: string }>;
  }

  const { data: allBlogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => apiFetch("/blogs/"),
    staleTime: 1000 * 60 * 5,
  });

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    
    const base = BACKEND_URL.replace(/\/$/, "");
    
    if (imagePath.startsWith("/")) {
      return `${base}${imagePath}`;
    }
    
    if (imagePath.startsWith("media/")) {
      return `${base}/${imagePath}`;
    }
    
    return `${base}/media/${imagePath}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const blogPosts = allBlogs.map((blog: BlogPost) => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    blog_type: blog.blog_type,
    excerpt: blog.excerpt,
    date: formatDate(blog.created_at),
    author: "Admin",
    image: blog.blog_type === 'manual' 
      ? (blog.featured_image ? getImageUrl(blog.featured_image) : "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800")
      : (blog.pdf_thumbnail ? getImageUrl(blog.pdf_thumbnail) : "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800"),
    pdf_file: blog.pdf_file,
  }));

  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const displayedPosts = blogPosts.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading blogs...</p>
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No blogs available yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and insights about office
            furniture and workspace design
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts.length > 0 && (
          <Card className="overflow-hidden mb-12 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded text-sm font-semibold">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
                <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{blogPosts[0].date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{blogPosts[0].author}</span>
                  </div>
                </div>
                {blogPosts[0].blog_type === 'pdf' ? (
                  <Button 
                    onClick={() => window.open(blogPosts[0].pdf_file, '_blank')}
                    className="w-fit gap-2"
                  >
                    Download PDF
                    <ArrowRight size={18} />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate(`/blog/${blogPosts[0].slug}`)}
                    className="w-fit gap-2"
                  >
                    Read More
                    <ArrowRight size={18} />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.slice(1).map((post, index) => (
            <Card
              key={post.id}
              className="overflow-hidden hover-lift group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold my-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                </div>
                {post.blog_type === 'pdf' ? (
                  <Button 
                    onClick={() => window.open(post.pdf_file, '_blank')}
                    variant="ghost" 
                    className="p-0 h-auto gap-2 text-primary"
                  >
                    Download PDF
                    <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    variant="ghost" 
                    className="p-0 h-auto gap-2 text-primary"
                  >
                    Read More
                    <ArrowRight size={16} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
