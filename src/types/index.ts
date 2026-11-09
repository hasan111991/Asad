export type Language = 'en' | 'ur';

export interface LeaderProfile {
  id?: string;
  fullName: string;
  fullNameUrdu: string;
  title: string;
  titleUrdu: string;
  party: string;
  partyUrdu: string;
  constituency: string;
  constituencyUrdu: string;
  district: string;
  districtUrdu: string;
  bio: string;
  bioUrdu: string;
  politicalJourney: string;
  politicalJourneyUrdu: string;
  education: string;
  educationUrdu: string;
  assemblyTenure: string;
  assemblyTenureUrdu: string;
  officeAddress: string;
  officeAddressUrdu: string;
  officeHours: string;
  officeHoursUrdu: string;
  officialEmail: string;
  officialPhone: string;
  verifiedNotice: string;
  verifiedNoticeUrdu: string;
  photoUrl: string;
}

export type ProjectCategory = 
  | 'Roads and Infrastructure'
  | 'Education'
  | 'Healthcare'
  | 'Clean Drinking Water'
  | 'Electricity'
  | 'Sanitation'
  | 'Public Facilities';

export type ProjectStatus = 'Proposed' | 'Approved' | 'In Progress' | 'Completed';

export type FundingType = 'Government-Funded' | 'Department-Led' | 'MPA Initiative';

export interface Project {
  id: string;
  title: string;
  titleUrdu: string;
  category: ProjectCategory;
  categoryUrdu: string;
  location: string;
  locationUrdu: string;
  description: string;
  descriptionUrdu: string;
  status: ProjectStatus;
  statusUrdu: string;
  department: string;
  departmentUrdu: string;
  budget: string;
  startDate: string;
  completionDate: string;
  imageUrl: string;
  fundingType: FundingType;
  fundingTypeUrdu: string;
  progressPercent: number;
  latitude?: number;
  longitude?: number;
}

export type AssemblyActivityType = 
  | 'Question Raised'
  | 'Bill & Resolution'
  | 'Committee Participation'
  | 'Parliamentary Activity'
  | 'Official Announcement';

export interface AssemblyActivity {
  id: string;
  title: string;
  titleUrdu: string;
  type: AssemblyActivityType;
  typeUrdu: string;
  session: string;
  sessionUrdu: string;
  date: string;
  summary: string;
  summaryUrdu: string;
  status: string;
  statusUrdu: string;
  officialRecordRef?: string;
}

export type NewsCategory = 
  | 'Latest Updates'
  | 'Press Releases'
  | 'Official Statements'
  | 'Assembly News'
  | 'Constituency Visits'
  | 'Public Meetings';

export interface NewsItem {
  id: string;
  title: string;
  titleUrdu: string;
  category: NewsCategory;
  categoryUrdu: string;
  date: string;
  summary: string;
  summaryUrdu: string;
  content: string;
  contentUrdu: string;
  imageUrl: string;
  isFeatured?: boolean;
}

export interface GalleryMedia {
  id: string;
  title: string;
  titleUrdu: string;
  category: string;
  categoryUrdu: string;
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  date: string;
  caption: string;
  captionUrdu: string;
}

export type ComplaintCategory = 
  | 'Roads & Infrastructure'
  | 'Water Supply'
  | 'Electricity'
  | 'Education Concerns'
  | 'Healthcare Facilities'
  | 'Sanitation & Sewerage'
  | 'Other Public Service';

export type ComplaintStatus = 
  | 'Received'
  | 'Under Review'
  | 'Referred to Department'
  | 'Resolved'
  | 'Closed';

export interface CitizenComplaint {
  id: string;
  trackingId: string;
  citizenName: string;
  phone: string;
  district: string;
  tehsil: string;
  area: string;
  category: ComplaintCategory;
  categoryUrdu?: string;
  description: string;
  status: ComplaintStatus;
  statusUrdu?: string;
  departmentReferred?: string;
  adminRemarks?: string;
  smsNotified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied' | 'Archived';
  createdAt: string;
}

export type NoticeCategory = 
  | 'Public Announcements'
  | 'Development Updates'
  | 'Office Notifications'
  | 'Public Meetings'
  | 'Important Documents';

export interface PublicNotice {
  id: string;
  title: string;
  titleUrdu: string;
  category: NoticeCategory;
  categoryUrdu: string;
  publishDate: string;
  description: string;
  descriptionUrdu: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  isPublished: boolean;
  officialRef?: string;
  createdAt?: string;
}

export type SMSStatus = 'Delivered' | 'Sent' | 'Failed' | 'Simulated';

export interface SMSLog {
  id: string;
  trackingId: string;
  recipientPhone: string;
  message: string;
  status: SMSStatus;
  provider: string;
  error?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  adminEmail: string;
  targetCollection?: string;
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface SiteSettings {
  announcement: string;
  announcementUrdu: string;
  announcementActive: boolean;
  helplinePhone: string;
  officeLocation: string;
  officeLocationUrdu: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  lastUpdated: string;

  // 1. WhatsApp Configuration
  whatsappNumber: string;
  whatsappEnabled: boolean;
  whatsappDefaultMessage: string;
  whatsappComplaintTemplate: string;
  whatsappAppointmentTemplate: string;

  // 2. SMS Gateway Configuration
  smsEnabled: boolean;
  smsProvider: 'custom_http' | 'twilio' | 'zong_portal' | 'jazz_business' | 'simulated';
  smsSenderId: string;
  smsApiKey?: string;
  smsApiSecret?: string;
  smsTemplateReceived: string;
  smsTemplateResolved: string;
  smsTemplateReferred: string;

  // 3. Google Analytics 4
  gaMeasurementId: string;
  gaEnabled: boolean;
}

export interface MonthlyReportData {
  month: string;
  year: number;
  totalComplaints: number;
  complaintsReceived: number;
  complaintsUnderReview: number;
  complaintsReferred: number;
  complaintsResolved: number;
  resolutionRate: number;
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  proposedProjects: number;
  totalBudgetAllocated: string;
  publicMeetingsHeld: number;
  noticesPublished: number;
  estimatedBeneficiaries: number;
  topGrievanceSector: string;
  generatedAt: string;
}

export type AdminRole = 
  | 'Super Admin'
  | 'Office Manager'
  | 'Project Manager'
  | 'Media Manager'
  | 'Data Entry Operator';

export interface AdminUser {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  status: 'Active' | 'Suspended';
  createdAt: string;
  createdBy: string;
  lastLogin?: string;
}

