export interface JobEntry {
  company: string;
  jobTitle: string;
  locationType: 'Remote' | 'In-Person' | 'Hybrid';
  employmentType: 'Full-time' | 'Contract' | 'Part-time';
  // Additional "Must-Haves" for Job Boards:
  salaryRange?: string;
  category: string; // e.g., Engineering, Design, Marketing
  description: string;
  applyUrl: string;
  postedAt: string; // ISO String for sorting
}