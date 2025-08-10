// Firebase Services for Diamond Portfolio Management
// Handles all Firebase operations for diamonds, leads, and contact messages

import { 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';

// ===== DIAMOND SERVICES =====

// Get all diamonds with real-time updates
export const getDiamondsRealtime = (callback: (diamonds: any[]) => void) => {
  const q = query(collection(db, 'diamonds'), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const diamonds = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(diamonds);
  });
};

// Add new diamond
export const addDiamond = async (diamondData: any, imageFile?: File) => {
  try {
    let imageUrl = '';
    
    // Upload image if provided
    if (imageFile) {
      const imageRef = ref(storage, `diamonds/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
    
    // Add diamond to Firestore
    const docRef = await addDoc(collection(db, 'diamonds'), {
      ...diamondData,
      image: imageUrl,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding diamond:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Update diamond
export const updateDiamond = async (diamondId: string, updateData: any) => {
  try {
    const docRef = doc(db, 'diamonds', diamondId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating diamond:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Delete diamond
export const deleteDiamond = async (diamondId: string, imageUrl?: string) => {
  try {
    // Delete image from storage if exists
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }
    
    // Delete document from Firestore
    await deleteDoc(doc(db, 'diamonds', diamondId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting diamond:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Get diamonds by category
export const getDiamondsByCategory = (category: string, callback: (diamonds: any[]) => void) => {
  const q = query(
    collection(db, 'diamonds'), 
    where('category', '==', category),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const diamonds = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(diamonds);
  });
};

// Get bestseller diamonds
export const getBestsellerDiamonds = (callback: (diamonds: any[]) => void) => {
  const q = query(
    collection(db, 'diamonds'), 
    where('bestseller', '==', true),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const diamonds = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(diamonds);
  });
};

// ===== LEADS SERVICES =====

// Get all leads with real-time updates
export const getLeadsRealtime = (callback: (leads: any[]) => void) => {
  const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(leads);
  });
};

// Add new lead
export const addLead = async (leadData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      createdAt: serverTimestamp(),
      status: 'New'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding lead:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Update lead status
export const updateLeadStatus = async (leadId: string, status: string) => {
  try {
    const docRef = doc(db, 'leads', leadId);
    await updateDoc(docRef, { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating lead:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Delete lead
export const deleteLead = async (leadId: string) => {
  try {
    await deleteDoc(doc(db, 'leads', leadId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting lead:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Search leads
export const searchLeads = (searchTerm: string, callback: (leads: any[]) => void) => {
  // Note: Firestore doesn't support full-text search
  // This is a simple client-side filter
  getLeadsRealtime((leads) => {
    const filtered = leads.filter(lead => 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm)
    );
    callback(filtered);
  });
};

// ===== CONTACT MESSAGES SERVICES =====

// Get all contact messages with real-time updates
export const getContactMessagesRealtime = (callback: (messages: any[]) => void) => {
  const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

// Add new contact message
export const addContactMessage = async (messageData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'contact_messages'), {
      ...messageData,
      createdAt: serverTimestamp(),
      status: 'New', // New, Read, Replied
      readAt: null
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding contact message:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Update message status
export const updateMessageStatus = async (messageId: string, status: string) => {
  try {
    const docRef = doc(db, 'contact_messages', messageId);
    const updateData: any = { status };
    
    // If marking as read, add read timestamp
    if (status === 'Read' || status === 'Replied') {
      updateData.readAt = serverTimestamp();
    }
    
    await updateDoc(docRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating message status:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Delete contact message
export const deleteContactMessage = async (messageId: string) => {
  try {
    await deleteDoc(doc(db, 'contact_messages', messageId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Search contact messages
export const searchContactMessages = (searchTerm: string, callback: (messages: any[]) => void) => {
  getContactMessagesRealtime((messages) => {
    const filtered = messages.filter(message => 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    callback(filtered);
  });
};

// Get contact messages statistics
export const getContactMessagesStats = (callback: (stats: any) => void) => {
  getContactMessagesRealtime((messages) => {
    const stats = {
      totalMessages: messages.length,
      newMessages: messages.filter((m: any) => m.status === 'New').length,
      readMessages: messages.filter((m: any) => m.status === 'Read').length,
      repliedMessages: messages.filter((m: any) => m.status === 'Replied').length,
      recentMessages: messages.slice(0, 5) // Last 5 messages
    };
    callback(stats);
  });
};

// ===== STATISTICS SERVICES =====

// Get portfolio statistics
export const getPortfolioStats = (callback: (stats: any) => void) => {
  getDiamondsRealtime((diamonds) => {
    const stats = {
      totalDiamonds: diamonds.length,
      totalValue: diamonds.reduce((sum: number, diamond: any) => {
        const price = parseFloat(diamond.price?.replace(/[$,]/g, '') || '0');
        return sum + price;
      }, 0),
      bestsellerCount: diamonds.filter((d: any) => d.bestseller).length,
      categories: diamonds.reduce((acc: any, diamond: any) => {
        acc[diamond.category] = (acc[diamond.category] || 0) + 1;
        return acc;
      }, {})
    };
    callback(stats);
  });
};

// Get leads statistics
export const getLeadsStats = (callback: (stats: any) => void) => {
  getLeadsRealtime((leads) => {
    const stats = {
      totalLeads: leads.length,
      newLeads: leads.filter((l: any) => l.status === 'New').length,
      contactedLeads: leads.filter((l: any) => l.status === 'Contacted').length,
      convertedLeads: leads.filter((l: any) => l.status === 'Converted').length,
      recentLeads: leads.slice(0, 5) // Last 5 leads
    };
    callback(stats);
  });
}; 