'use client';

import { useState, useEffect } from 'react';
import JDCard from '@/components/jd/JDCard';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Search, Filter, ChevronLeft, ChevronRight, Trash2, RefreshCw, Edit, Eye } from 'lucide-react';

interface JobDescription {
  id: string;
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  workType?: string;
  experience?: string;
  content: string;
  keywords?: string[];
  techStack?: string[];
  createdAt: string;
}

export default function HistoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [filteredJDs, setFilteredJDs] = useState<JobDescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'remote' | 'hybrid' | 'on-site'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(!!authStatus);

    if (authStatus) {
      // Load job descriptions from localStorage (in real app, this would be from API)
      const savedHistory = localStorage.getItem('jdHistory');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setJobDescriptions(parsed);
        setFilteredJDs(parsed);
      }

      // Add some sample data if empty
      if (!savedHistory || JSON.parse(savedHistory).length === 0) {
        const sampleData: JobDescription[] = [
          {
            id: '1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            location: 'Remote',
            salary: '$100,000 - $140,000',
            workType: 'remote',
            experience: 'Senior Level',
            content: 'We are looking for a Senior Frontend Developer to join our team...',
            keywords: ['React', 'TypeScript', 'Frontend'],
            techStack: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '2',
            title: 'Full Stack Engineer',
            company: 'InnovateLab',
            location: 'San Francisco',
            salary: '$120,000 - $160,000',
            workType: 'hybrid',
            experience: 'Mid Level',
            content: 'Join our engineering team to build cutting-edge solutions...',
            keywords: ['Full Stack', 'Node.js', 'React'],
            techStack: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: '3',
            title: 'DevOps Engineer',
            company: 'CloudTech',
            location: 'New York',
            salary: '$130,000 - $170,000',
            workType: 'on-site',
            experience: 'Senior Level',
            content: 'We need a skilled DevOps Engineer to manage our infrastructure...',
            keywords: ['DevOps', 'Cloud', 'CI/CD'],
            techStack: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
            createdAt: new Date(Date.now() - 259200000).toISOString(),
          },
        ];
        setJobDescriptions(sampleData);
        setFilteredJDs(sampleData);
      }
    }
  }, []);

  useEffect(() => {
    // Filter job descriptions based on search and filter
    let filtered = jobDescriptions;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (jd) =>
          jd.title.toLowerCase().includes(term) ||
          jd.company?.toLowerCase().includes(term) ||
          jd.keywords?.some((k) => k.toLowerCase().includes(term)) ||
          jd.techStack?.some((t) => t.toLowerCase().includes(term))
      );
    }

    if (filterBy !== 'all') {
      filtered = filtered.filter((jd) => jd.workType === filterBy);
    }

    setFilteredJDs(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchTerm, filterBy, jobDescriptions]);

  const handleView = (id: string) => {
    const jd = jobDescriptions.find((j) => j.id === id);
    if (jd) {
      alert(`View JD: ${jd.title}\n\nThis would open a detailed view modal.`);
    }
  };

  const handleEdit = (id: string) => {
    const jd = jobDescriptions.find((j) => j.id === id);
    if (jd) {
      // In a real app, this would navigate to the edit page or open an edit modal
      window.location.href = `/generator?edit=${id}`;
    }
  };

  const handleRegenerate = (id: string) => {
    const jd = jobDescriptions.find((j) => j.id === id);
    if (jd) {
      alert(`Regenerate JD: ${jd.title}\n\nThis would regenerate the JD with AI.`);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job description?')) {
      const updated = jobDescriptions.filter((j) => j.id !== id);
      setJobDescriptions(updated);
      localStorage.setItem('jdHistory', JSON.stringify(updated));
    }
  };

  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to delete all job descriptions?')) {
      setJobDescriptions([]);
      setFilteredJDs([]);
      localStorage.removeItem('jdHistory');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredJDs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJDs = filteredJDs.slice(startIndex, startIndex + itemsPerPage);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to view your job description history</p>
          <Button asChild>
            <a href="/auth/signin">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Job Description History</h1>
            {jobDescriptions.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleDeleteAll} className="text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">
            {filteredJDs.length} job description{filteredJDs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:flex md:gap-4 md:items-center md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-[180px] pl-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Work Types</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Job Description Grid */}
        {paginatedJDs.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No job descriptions found</h3>
            <p className="text-muted-foreground mb-4">
              {jobDescriptions.length === 0
                ? "You haven't created any job descriptions yet"
                : 'Try adjusting your search or filter criteria'}
            </p>
            {jobDescriptions.length === 0 && (
              <Button asChild>
                <a href="/generator">Create Your First JD</a>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedJDs.map((jd) => (
                <JDCard
                  key={jd.id}
                  jobDescription={jd}
                  onView={handleView}
                  onEdit={handleEdit}
                  onRegenerate={handleRegenerate}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'default' : 'outline'}
                          size="icon"
                          className="w-10 h-10"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-muted-foreground">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
