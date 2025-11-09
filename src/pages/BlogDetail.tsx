import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import apiFetch, { BACKEND_URL } from "@/lib/api";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  interface BlogPost {
    id: number;
    title: string;
    slug: string;
    blog_type: 'manual' | 'pdf';
    excerpt: string;
    content: string;
    featured_image: string;
    is_published: boolean;
    created_at: string;
    images: Array<{ id: number; image: string; alt_text: string }>;
  }

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => apiFetch(`/blogs/?slug=${slug}`).then((data) => {
      const blogs = Array.isArray(data) ? data : [data];
      return blogs.length > 0 ? blogs[0] : null;
    }),
    enabled: !!slug,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading blog...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Blog post not found.</p>
          <Button onClick={() => navigate("/blog")} variant="outline" className="gap-2">
            <ArrowLeft size={18} />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  if (blog.blog_type === 'pdf') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">This is a PDF blog. Please download it from the blog list.</p>
          <Button onClick={() => navigate("/blog")} variant="outline" className="gap-2">
            <ArrowLeft size={18} />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          onClick={() => navigate("/blog")}
          variant="ghost"
          className="gap-2 mb-8"
        >
          <ArrowLeft size={18} />
          Back to Blog
        </Button>

        <article className="animate-fade-in">
          {/* Featured Image */}
          <div className="relative h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={
                blog.featured_image
                  ? getImageUrl(blog.featured_image)
                  : "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200"
              }
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title and Metadata */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatDate(blog.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Admin</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
            <div
              className="text-base leading-relaxed whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Gallery Images */}
          {blog.images && blog.images.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Gallery</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blog.images.map((img) => (
                  <Card key={img.id} className="overflow-hidden">
                    <img
                      src={getImageUrl(img.image)}
                      alt={img.alt_text || "Gallery image"}
                      className="w-full h-64 object-cover"
                    />
                    {img.alt_text && (
                      <p className="p-3 text-sm text-muted-foreground">
                        {img.alt_text}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/blog")}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft size={18} />
              Back to Blog
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
