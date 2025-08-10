import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Mail, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getContactMessagesRealtime, updateMessageStatus, deleteContactMessage, searchContactMessages } from '@/lib/firebase-services';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  createdAt: any;
  readAt?: any;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'New' | 'Read' | 'Replied'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load messages from Firebase
  useEffect(() => {
    try {
      const unsubscribe = getContactMessagesRealtime((messages) => {
        if (Array.isArray(messages)) {
          setMessages(messages);
        } else {
          console.warn('⚠️ getContactMessagesRealtime returned non-array:', messages);
          setMessages([]);
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading messages:', error);
      setHasError(true);
      setErrorMessage('Failed to load messages. Please try again.');
      setIsLoading(false);
    }
  }, []);

  // Filter messages based on search and status
  useEffect(() => {
    try {
      let filtered = messages;

      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(msg => msg.status === statusFilter);
      }

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(msg => 
          (msg.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (msg.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (msg.message || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredMessages(filtered);
    } catch (error) {
      console.error('Error filtering messages:', error);
      setFilteredMessages([]);
    }
  }, [messages, searchTerm, statusFilter]);

  const handleStatusUpdate = async (messageId: string, newStatus: 'Read' | 'Replied') => {
    try {
      const result = await updateMessageStatus(messageId, newStatus);
      if (result.success) {
        toast({
          title: 'Status Updated',
          description: `Message marked as ${newStatus.toLowerCase()}.`,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update message status.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const result = await deleteContactMessage(messageId);
      if (result.success) {
        toast({
          title: 'Message Deleted',
          description: 'Message has been permanently deleted.',
        });
        setSelectedMessage(null);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete message.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Read':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'Replied':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Read':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Replied':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 pt-20 md:pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="btn-outline mb-6 md:mb-8 text-gray-100 hover:text-white hover:bg-gray-800 rounded-lg interactive-hover"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portfolio
        </Button>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-gray-50 mb-4 md:mb-6">
              Contact Messages
            </h1>
            <p className="text-base md:text-lg text-gray-100 font-montserrat max-w-2xl mx-auto leading-relaxed">
              Manage and respond to customer inquiries from your contact form.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-playfair text-gray-50">{messages.length}</div>
              <div className="text-sm text-gray-400 font-montserrat">Total Messages</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-800 to-yellow-700 rounded-lg p-4 border border-yellow-700">
              <div className="text-2xl font-playfair text-gray-50">
                {messages.filter(m => m.status === 'New').length}
              </div>
              <div className="text-sm text-gray-400 font-montserrat">New Messages</div>
            </div>
            <div className="bg-gradient-to-br from-blue-800 to-blue-700 rounded-lg p-4 border border-blue-700">
              <div className="text-2xl font-playfair text-gray-50">
                {messages.filter(m => m.status === 'Read').length}
              </div>
              <div className="text-sm text-gray-400 font-montserrat">Read Messages</div>
            </div>
            <div className="bg-gradient-to-br from-green-800 to-green-700 rounded-lg p-4 border border-green-700">
              <div className="text-2xl font-playfair text-gray-50">
                {messages.filter(m => m.status === 'Replied').length}
              </div>
              <div className="text-sm text-gray-400 font-montserrat">Replied Messages</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className="text-sm interactive-click"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'New' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('New')}
                className="text-sm interactive-click"
              >
                New
              </Button>
              <Button
                variant={statusFilter === 'Read' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('Read')}
                className="text-sm interactive-click"
              >
                Read
              </Button>
              <Button
                variant={statusFilter === 'Replied' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('Replied')}
                className="text-sm interactive-click"
              >
                Replied
              </Button>
            </div>
          </div>

          {/* Messages List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-playfair text-gray-50">Messages ({filteredMessages.length})</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-400">Loading messages...</div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">No messages found</div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`p-4 border-b border-gray-700 cursor-pointer table-row-hover interactive-hover ${
                          selectedMessage?.id === message.id
                            ? 'bg-gray-600'
                            : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-playfair text-gray-50 truncate">{message.name}</h4>
                            <p className="text-sm text-gray-400 truncate">{message.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(message.status)}
                            <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(message.status)}`}>
                              {message.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">{message.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatDate(message.createdAt)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Message Details */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-playfair text-gray-50 mb-2">{selectedMessage.name}</h3>
                      <p className="text-gray-400 font-montserrat">{selectedMessage.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedMessage.status)}
                      <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(selectedMessage.status)}`}>
                        {selectedMessage.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Message</h4>
                      <div className="bg-gray-700 rounded-lg p-4 text-gray-200 font-montserrat leading-relaxed">
                        {selectedMessage.message}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Received:</span>
                        <p className="text-gray-200">{formatDate(selectedMessage.createdAt)}</p>
                      </div>
                      {selectedMessage.readAt && (
                        <div>
                          <span className="text-gray-400">Read:</span>
                          <p className="text-gray-200">{formatDate(selectedMessage.readAt)}</p>
                        </div>
                      )}
                      {selectedMessage.source && (
                        <div>
                          <span className="text-gray-400">Source:</span>
                          <p className="text-gray-200">{selectedMessage.source}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-700">
                      {selectedMessage.status === 'New' && (
                        <Button
                          onClick={() => handleStatusUpdate(selectedMessage.id, 'Read')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mark as Read
                        </Button>
                      )}
                      {selectedMessage.status !== 'Replied' && (
                        <Button
                          onClick={() => handleStatusUpdate(selectedMessage.id, 'Replied')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark as Replied
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg border border-gray-700 p-6 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a message to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 