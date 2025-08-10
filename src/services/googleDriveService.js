// Google Drive Service for Video Storage
// This service handles video upload, retrieval, and management using Google Drive API

class GoogleDriveService {
  constructor() {
    // Use Vite's import.meta.env instead of process.env for browser compatibility
    this.apiKey = import.meta.env?.VITE_GOOGLE_DRIVE_API_KEY || '';
    this.clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID || '';
    this.discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
    this.scope = 'https://www.googleapis.com/auth/drive.file';
    this.gapi = null;
    this.isInitialized = false;
    
    // Check if required environment variables are available
    if (!this.apiKey || !this.clientId) {
      console.warn('⚠️ Google Drive API credentials not found. Google Drive features will be disabled.');
    }
  }

  // Initialize Google Drive API
  async initialize() {
    if (this.isInitialized) {
      return true;
    }

    // Check if credentials are available
    if (!this.apiKey || !this.clientId) {
      console.warn('⚠️ Google Drive API credentials not available. Skipping initialization.');
      return false;
    }

    try {
      console.log('🚀 Initializing Google Drive API...');
      
      // Load Google API client
      await this.loadGoogleAPI();
      
      // Initialize the API client
      await this.initClient();
      
      // Check if user is signed in
      const isSignedIn = this.gapi.auth2.getAuthInstance().isSignedIn.get();
      
      if (!isSignedIn) {
        console.log('🔐 User not signed in, requesting authentication...');
        await this.signIn();
      }
      
      this.isInitialized = true;
      console.log('✅ Google Drive API initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive API:', error);
      return false;
    }
  }

  // Load Google API client
  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        this.gapi = window.gapi;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        this.gapi = window.gapi;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Initialize the API client
  async initClient() {
    return new Promise((resolve, reject) => {
      this.gapi.load('client:auth2', async () => {
        try {
          await this.gapi.client.init({
            apiKey: this.apiKey,
            clientId: this.clientId,
            discoveryDocs: this.discoveryDocs,
            scope: this.scope
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Sign in user
  async signIn() {
    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      console.log('✅ User signed in successfully');
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      throw error;
    }
  }

  // Upload video to Google Drive
  async uploadVideo(file, diamondId, options = {}) {
    try {
      console.log('🎥 Uploading video to Google Drive:', file.name);
      
      // Check if service is available
      if (!this.apiKey || !this.clientId) {
        console.warn('⚠️ Google Drive API credentials not available. Upload failed.');
        throw new Error('Google Drive API credentials not available');
      }
      
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          console.warn('⚠️ Failed to initialize Google Drive API. Upload failed.');
          throw new Error('Failed to initialize Google Drive API');
        }
      }

      // Create file metadata
      const metadata = {
        name: `${diamondId}_${file.name}`,
        mimeType: file.type,
        parents: [], // Root folder
        properties: {
          diamondId: diamondId,
          isPrimary: options.isPrimary ? 'true' : 'false',
          showInGallery: options.showInGallery ? 'true' : 'false',
          showOnHomepage: options.showOnHomepage ? 'true' : 'false',
          uploadedAt: new Date().toISOString()
        }
      };

      // Create FormData for file upload
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      // Upload file
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
        },
        body: form
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Video uploaded successfully:', result.id);

      // Make file publicly accessible
      await this.makeFilePublic(result.id);

      return {
        id: result.id,
        name: result.name,
        webViewLink: result.webViewLink,
        webContentLink: `https://drive.google.com/uc?export=view&id=${result.id}`,
        size: file.size,
        mimeType: file.type
      };
    } catch (error) {
      console.error('❌ Video upload failed:', error);
      throw error;
    }
  }

  // Make file publicly accessible
  async makeFilePublic(fileId) {
    try {
      const permission = {
        type: 'anyone',
        role: 'reader'
      };

      await this.gapi.client.drive.permissions.create({
        fileId: fileId,
        resource: permission
      });

      console.log('✅ File made public:', fileId);
    } catch (error) {
      console.error('❌ Failed to make file public:', error);
      // Don't throw error as this is not critical
    }
  }

  // Get a single video by ID
  async getVideo(fileId) {
    try {
      console.log('🎥 Getting video by ID:', fileId);
      
      // Check if service is available
      if (!this.apiKey || !this.clientId) {
        console.warn('⚠️ Google Drive API credentials not available. Returning null.');
        return null;
      }
      
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          console.warn('⚠️ Failed to initialize Google Drive API. Returning null.');
          return null;
        }
      }

      const response = await this.gapi.client.drive.files.get({
        fileId: fileId,
        fields: 'id,name,webViewLink,webContentLink,size,mimeType,properties,createdTime'
      });

      const video = {
        id: response.result.id,
        name: response.result.name,
        webViewLink: response.result.webViewLink,
        webContentLink: `https://drive.google.com/uc?export=view&id=${response.result.id}`,
        size: response.result.size,
        mimeType: response.result.mimeType,
        properties: response.result.properties,
        createdTime: response.result.createdTime
      };

      console.log('✅ Found video:', video.name);
      return video;
    } catch (error) {
      console.error('❌ Failed to get video:', error);
      return null;
    }
  }

  // Get videos for a specific diamond
  async getDiamondVideos(diamondId) {
    try {
      console.log('🎥 Getting videos for diamond:', diamondId);
      
      // Check if service is available
      if (!this.apiKey || !this.clientId) {
        console.warn('⚠️ Google Drive API credentials not available. Returning empty videos array.');
        return [];
      }
      
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          console.warn('⚠️ Failed to initialize Google Drive API. Returning empty videos array.');
          return [];
        }
      }

      const response = await this.gapi.client.drive.files.list({
        q: `properties has { key='diamondId' and value='${diamondId}' }`,
        fields: 'files(id,name,webViewLink,webContentLink,size,mimeType,properties,createdTime)',
        orderBy: 'createdTime desc'
      });

      const videos = response.result.files.map(file => ({
        id: file.id,
        name: file.name,
        webViewLink: file.webViewLink,
        webContentLink: `https://drive.google.com/uc?export=view&id=${file.id}`,
        size: file.size,
        mimeType: file.mimeType,
        properties: file.properties,
        createdTime: file.createdTime
      }));

      console.log('✅ Found videos:', videos.length);
      return videos;
    } catch (error) {
      console.error('❌ Failed to get diamond videos:', error);
      return [];
    }
  }

  // Delete video
  async deleteVideo(fileId) {
    try {
      console.log('🗑️ Deleting video:', fileId);
      
      if (!this.isInitialized) {
        await this.initialize();
      }

      await this.gapi.client.drive.files.delete({
        fileId: fileId
      });

      console.log('✅ Video deleted successfully:', fileId);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete video:', error);
      throw error;
    }
  }

  // Get storage usage
  async getStorageUsage() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const response = await this.gapi.client.drive.about.get({
        fields: 'storageQuota'
      });

      const quota = response.result.storageQuota;
      return {
        used: parseInt(quota.usage),
        total: parseInt(quota.limit),
        percentage: (parseInt(quota.usage) / parseInt(quota.limit)) * 100
      };
    } catch (error) {
      console.error('❌ Failed to get storage usage:', error);
      throw error;
    }
  }

  // Check if user is signed in
  isSignedIn() {
    if (!this.gapi || !this.gapi.auth2) {
      return false;
    }
    return this.gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  // Sign out user
  async signOut() {
    try {
      if (this.gapi && this.gapi.auth2) {
        await this.gapi.auth2.getAuthInstance().signOut();
        console.log('✅ User signed out successfully');
      }
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const googleDriveService = new GoogleDriveService();

export default googleDriveService;

