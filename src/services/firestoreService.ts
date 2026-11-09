import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  LeaderProfile, 
  Project, 
  AssemblyActivity, 
  NewsItem, 
  GalleryMedia, 
  CitizenComplaint, 
  ContactMessage, 
  SiteSettings,
  PublicNotice,
  SMSLog,
  AuditLog,
  AdminUser,
  AdminRole
} from '../types';
import { 
  initialProfile, 
  initialProjects, 
  initialAssemblyActivities, 
  initialNews, 
  initialGallery, 
  initialComplaints, 
  initialSettings,
  initialPublicNotices,
  initialSMSLogs,
  initialAuditLogs
} from '../data/initialData';

// Fetch profile
export async function getProfile(): Promise<LeaderProfile> {
  const path = 'profile/main';
  try {
    const docRef = doc(db, 'profile', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as LeaderProfile;
      if (!data.photoUrl || data.photoUrl.includes('portrait_lead')) {
        data.photoUrl = initialProfile.photoUrl;
      }
      return data;
    }
    return initialProfile;
  } catch (error) {
    console.warn('Error fetching profile from Firestore, using initial dataset:', error);
    return initialProfile;
  }
}

export async function updateProfile(profileData: Partial<LeaderProfile>): Promise<void> {
  const path = 'profile/main';
  try {
    const docRef = doc(db, 'profile', 'main');
    await setDoc(docRef, { ...profileData, updatedAt: new Date().toISOString() }, { merge: true });
    await recordAuditLog('PROFILE_UPDATED', 'profile', 'main', 'Leader biography and secretariat information updated.');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Projects
export async function getProjects(): Promise<Project[]> {
  const path = 'projects';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialProjects;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
  } catch (error) {
    console.warn('Error fetching projects from Firestore, fallback to local data:', error);
    return initialProjects;
  }
}

export async function createProject(project: Omit<Project, 'id'>): Promise<string> {
  const path = 'projects';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...project,
      createdAt: new Date().toISOString()
    });
    await recordAuditLog('PROJECT_CREATED', 'projects', docRef.id, `Created development project: ${project.title}`);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  const path = `projects/${id}`;
  try {
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, updates);
    await recordAuditLog('PROJECT_UPDATED', 'projects', id, `Updated project status/details for ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProject(id: string): Promise<void> {
  const path = `projects/${id}`;
  try {
    await deleteDoc(doc(db, 'projects', id));
    await recordAuditLog('PROJECT_DELETED', 'projects', id, `Deleted project ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Assembly Activities
export async function getAssemblyActivities(): Promise<AssemblyActivity[]> {
  const path = 'assembly_activities';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialAssemblyActivities;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AssemblyActivity));
  } catch (error) {
    console.warn('Error fetching assembly activities from Firestore:', error);
    return initialAssemblyActivities;
  }
}

export async function createAssemblyActivity(act: Omit<AssemblyActivity, 'id'>): Promise<string> {
  const path = 'assembly_activities';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...act,
      createdAt: new Date().toISOString()
    });
    await recordAuditLog('ASSEMBLY_ACTIVITY_LOGGED', 'assembly_activities', docRef.id, `Recorded: ${act.title}`);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteAssemblyActivity(id: string): Promise<void> {
  const path = `assembly_activities/${id}`;
  try {
    await deleteDoc(doc(db, 'assembly_activities', id));
    await recordAuditLog('ASSEMBLY_ACTIVITY_DELETED', 'assembly_activities', id, `Removed assembly record ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// News
export async function getNews(): Promise<NewsItem[]> {
  const path = 'news';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialNews;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsItem));
  } catch (error) {
    console.warn('Error fetching news from Firestore:', error);
    return initialNews;
  }
}

export async function createNewsItem(item: Omit<NewsItem, 'id'>): Promise<string> {
  const path = 'news';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...item,
      createdAt: new Date().toISOString()
    });
    await recordAuditLog('NEWS_PUBLISHED', 'news', docRef.id, `Published news article: ${item.title}`);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteNewsItem(id: string): Promise<void> {
  const path = `news/${id}`;
  try {
    await deleteDoc(doc(db, 'news', id));
    await recordAuditLog('NEWS_DELETED', 'news', id, `Removed news release ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Gallery
export async function getGallery(): Promise<GalleryMedia[]> {
  const path = 'gallery';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialGallery;
    }
    return snap.docs.map(d => {
      const item = { id: d.id, ...d.data() } as GalleryMedia;
      if (item.mediaUrl && item.mediaUrl.includes('portrait_lead')) {
        item.mediaUrl = initialProfile.photoUrl;
      }
      return item;
    });
  } catch (error) {
    console.warn('Error fetching gallery from Firestore:', error);
    return initialGallery;
  }
}

export async function createGalleryItem(item: Omit<GalleryMedia, 'id'>): Promise<string> {
  const path = 'gallery';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...item,
      createdAt: new Date().toISOString()
    });
    await recordAuditLog('GALLERY_ITEM_ADDED', 'gallery', docRef.id, `Added media: ${item.title}`);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Public Notices
export async function getPublicNotices(): Promise<PublicNotice[]> {
  const path = 'public_notices';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialPublicNotices;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PublicNotice));
  } catch (error) {
    console.warn('Error fetching notices from Firestore:', error);
    return initialPublicNotices;
  }
}

export async function createPublicNotice(notice: Omit<PublicNotice, 'id'>): Promise<string> {
  const path = 'public_notices';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...notice,
      createdAt: new Date().toISOString()
    });
    await recordAuditLog('NOTICE_PUBLISHED', 'public_notices', docRef.id, `Gazetted notice: ${notice.title}`);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deletePublicNotice(id: string): Promise<void> {
  const path = `public_notices/${id}`;
  try {
    await deleteDoc(doc(db, 'public_notices', id));
    await recordAuditLog('NOTICE_DELETED', 'public_notices', id, `Deleted notice ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Complaints (Citizen Portal)
export async function submitComplaint(complaintData: Omit<CitizenComplaint, 'id' | 'createdAt'>): Promise<{ id: string; trackingId: string }> {
  const path = 'complaints';
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, path), {
      ...complaintData,
      smsNotified: true,
      createdAt: now,
      updatedAt: now
    });

    // Trigger initial automated SMS notification
    await triggerSMSNotification({
      trackingId: complaintData.trackingId,
      recipientPhone: complaintData.phone,
      message: `Your complaint has been received at MPA Chaudhry Asad Hanif Jutt Secretariat. Tracking ID: ${complaintData.trackingId}. Track progress online at our official website.`,
      status: 'Simulated',
      provider: 'Telecom SMS Gateway',
      timestamp: now
    });

    return { id: docRef.id, trackingId: complaintData.trackingId };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function trackComplaintByTrackingId(trackingId: string, phoneInput?: string): Promise<CitizenComplaint | null> {
  const path = 'complaints';
  const cleanId = trackingId.trim().toUpperCase();
  try {
    const q = query(collection(db, path), where('trackingId', '==', cleanId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0].data() as CitizenComplaint;
      // Optional security phone verification if provided
      if (phoneInput && phoneInput.trim().length >= 4) {
        const cleanedPhoneInput = phoneInput.replace(/\D/g, '');
        const storedPhone = docData.phone.replace(/\D/g, '');
        if (!storedPhone.endsWith(cleanedPhoneInput) && !cleanedPhoneInput.endsWith(storedPhone)) {
          // If mismatch, return sanitized version without PII
          return {
            id: snap.docs[0].id,
            trackingId: docData.trackingId,
            citizenName: docData.citizenName.charAt(0) + '***',
            phone: '***' + docData.phone.slice(-4),
            district: docData.district,
            tehsil: docData.tehsil,
            area: docData.area,
            category: docData.category,
            description: docData.description,
            status: docData.status,
            departmentReferred: docData.departmentReferred,
            adminRemarks: docData.adminRemarks,
            createdAt: docData.createdAt,
            updatedAt: docData.updatedAt
          };
        }
      }
      return { ...docData, id: snap.docs[0].id };
    }
    // Check initial fallback data if not yet in database
    const local = initialComplaints.find(c => c.trackingId.toUpperCase() === cleanId);
    return local || null;
  } catch (error) {
    const local = initialComplaints.find(c => c.trackingId.toUpperCase() === cleanId);
    if (local) return local;
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getAllComplaints(): Promise<CitizenComplaint[]> {
  const path = 'complaints';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialComplaints;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as CitizenComplaint));
  } catch (error) {
    console.warn('Admin complaints fetch fallback:', error);
    return initialComplaints;
  }
}

export async function updateComplaintStatus(
  id: string, 
  status: CitizenComplaint['status'], 
  adminRemarks: string, 
  departmentReferred?: string,
  citizenPhone?: string,
  trackingId?: string
): Promise<void> {
  const path = `complaints/${id}`;
  try {
    const now = new Date().toISOString();
    const docRef = doc(db, 'complaints', id);
    await updateDoc(docRef, {
      status,
      adminRemarks,
      departmentReferred: departmentReferred || '',
      updatedAt: now
    });

    // Record administrative action in Audit Logs
    await recordAuditLog(
      'COMPLAINT_STATUS_UPDATED',
      'complaints',
      id,
      `Status changed to: ${status}. Department: ${departmentReferred || 'N/A'}. Tracking ID: ${trackingId || id}`
    );

    // Trigger SMS notification to citizen
    if (citizenPhone && trackingId) {
      let smsText = `Your complaint ${trackingId} status has been updated to ${status}.`;
      if (status === 'Resolved') {
        smsText = `Your complaint ${trackingId} has been marked RESOLVED by MPA Chaudhry Asad Hanif Jutt Secretariat. Remarks: ${adminRemarks || 'Work completed.'}`;
      } else if (status === 'Referred to Department') {
        smsText = `Your complaint ${trackingId} has been REFERRED to ${departmentReferred || 'the relevant department'} for immediate action. Track at chasadhanif.pk`;
      }
      await triggerSMSNotification({
        trackingId,
        recipientPhone: citizenPhone,
        message: smsText,
        status: 'Delivered',
        provider: 'Telecom SMS Gateway',
        timestamp: now
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// SMS Notification Service
export async function triggerSMSNotification(log: Omit<SMSLog, 'id'>): Promise<string> {
  const path = 'sms_logs';
  try {
    const docRef = await addDoc(collection(db, path), log);
    return docRef.id;
  } catch (error) {
    console.warn('SMS log recording warning:', error);
    return 'local-simulated-' + Date.now();
  }
}

export async function getSMSLogs(): Promise<SMSLog[]> {
  const path = 'sms_logs';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialSMSLogs;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as SMSLog));
  } catch (error) {
    console.warn('SMS logs fetch fallback:', error);
    return initialSMSLogs;
  }
}

// Audit Logs
export async function recordAuditLog(action: string, targetCollection?: string, targetId?: string, details: string = ''): Promise<void> {
  const path = 'audit_logs';
  try {
    const adminEmail = auth.currentUser?.email || (localStorage.getItem('demo_admin_active') === 'true' ? 'admin@chasadhanif.pk' : 'system@chasadhanif.pk');
    await addDoc(collection(db, path), {
      action,
      adminEmail,
      targetCollection: targetCollection || '',
      targetId: targetId || '',
      details,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Audit log write error:', error);
  }
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const path = 'audit_logs';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialAuditLogs;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog));
  } catch (error) {
    console.warn('Audit logs fallback:', error);
    return initialAuditLogs;
  }
}

// Contact messages
export async function sendContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const path = 'contact_messages';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...msg,
      status: 'New',
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const path = 'contact_messages';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
  } catch (error) {
    console.warn('Contact messages fetch fallback:', error);
    return [];
  }
}

// Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  const path = 'settings/general';
  try {
    const docRef = doc(db, 'settings', 'general');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...initialSettings, ...snap.data() } as SiteSettings;
    }
    return initialSettings;
  } catch (error) {
    return initialSettings;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const path = 'settings/general';
  try {
    const docRef = doc(db, 'settings', 'general');
    await setDoc(docRef, { ...settings, lastUpdated: new Date().toISOString() }, { merge: true });
    await recordAuditLog('SETTINGS_UPDATED', 'settings', 'general', 'Portal settings, WhatsApp or SMS configuration updated.');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Seed initial database
export async function seedInitialDatabase(): Promise<{ success: boolean; count: number }> {
  try {
    // 1. Profile
    await setDoc(doc(db, 'profile', 'main'), initialProfile, { merge: true });

    // 2. Settings
    await setDoc(doc(db, 'settings', 'general'), initialSettings, { merge: true });

    // 3. Projects
    for (const proj of initialProjects) {
      await setDoc(doc(db, 'projects', proj.id), proj, { merge: true });
    }

    // 4. Assembly
    for (const act of initialAssemblyActivities) {
      await setDoc(doc(db, 'assembly_activities', act.id), act, { merge: true });
    }

    // 5. News
    for (const n of initialNews) {
      await setDoc(doc(db, 'news', n.id), n, { merge: true });
    }

    // 6. Gallery
    for (const g of initialGallery) {
      await setDoc(doc(db, 'gallery', g.id), g, { merge: true });
    }

    // 7. Complaints
    for (const c of initialComplaints) {
      await setDoc(doc(db, 'complaints', c.id), c, { merge: true });
    }

    // 8. Public Notices
    for (const pn of initialPublicNotices) {
      await setDoc(doc(db, 'public_notices', pn.id), pn, { merge: true });
    }

    // 9. SMS Logs
    for (const sl of initialSMSLogs) {
      await setDoc(doc(db, 'sms_logs', sl.id), sl, { merge: true });
    }

    // 10. Audit Logs
    for (const al of initialAuditLogs) {
      await setDoc(doc(db, 'audit_logs', al.id), al, { merge: true });
    }

    return { success: true, count: 35 };
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

// Staff & RBAC Accounts
export async function getAdminUser(uid: string): Promise<AdminUser | null> {
  const path = `admins/${uid}`;
  try {
    const docRef = doc(db, 'admins', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as AdminUser;
    }
    return null;
  } catch (error) {
    console.warn('Error reading admin profile:', error);
    return null;
  }
}

export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const path = 'admins';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminUser));
  } catch (error) {
    console.warn('Error fetching all admins:', error);
    return [];
  }
}

export async function saveAdminUser(adminUser: AdminUser): Promise<void> {
  const path = `admins/${adminUser.uid}`;
  try {
    const docRef = doc(db, 'admins', adminUser.uid);
    await setDoc(docRef, {
      ...adminUser,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    await recordAuditLog(
      'STAFF_ACCOUNT_SAVED',
      'admins',
      adminUser.uid,
      `Staff account saved: ${adminUser.email} with role: ${adminUser.role}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateAdminUserStatus(uid: string, status: 'Active' | 'Suspended'): Promise<void> {
  const path = `admins/${uid}`;
  try {
    const docRef = doc(db, 'admins', uid);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });

    await recordAuditLog(
      'STAFF_STATUS_UPDATED',
      'admins',
      uid,
      `Staff status updated to: ${status}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAdminUser(uid: string, email: string): Promise<void> {
  const path = `admins/${uid}`;
  try {
    await deleteDoc(doc(db, 'admins', uid));
    await recordAuditLog(
      'STAFF_ACCOUNT_DELETED',
      'admins',
      uid,
      `Staff account removed: ${email}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

