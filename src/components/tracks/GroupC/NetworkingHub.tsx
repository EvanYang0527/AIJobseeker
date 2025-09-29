import React, { useState } from 'react';
import { Users, Calendar, MapPin, Clock, Star, MessageCircle, Video, Coffee, Briefcase, Building2, Award, TrendingUp, Filter, Search, Plus, ExternalLink, UserPlus, Heart, Share2, BookOpen, Target, Network, Globe, Phone, Mail, Linkedin as LinkedIn, Twitter, CheckCircle, ArrowRight } from 'lucide-react';

interface NetworkingHubProps {
  onComplete?: () => void;
}

export const NetworkingHub: React.FC<NetworkingHubProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const upcomingEvents = [
    {
      id: 1,
      title: 'Mid-Career Professionals Networking Mixer',
      date: '2024-01-25',
      time: '6:00 PM - 8:00 PM',
      location: 'Downtown Business Center',
      type: 'In-Person',
      attendees: 45,
      industry: 'Technology',
      description: 'Connect with fellow mid-career professionals in tech. Casual networking with light refreshments.',
      organizer: 'Tech Professionals Network',
      price: 'Free',
      status: 'registered'
    },
    {
      id: 2,
      title: 'Career Advancement Workshop',
      date: '2024-01-28',
      time: '2:00 PM - 4:00 PM',
      location: 'Virtual Event',
      type: 'Virtual',
      attendees: 120,
      industry: 'General',
      description: 'Learn strategies for advancing your career in mid-level positions. Interactive workshop format.',
      organizer: 'Career Growth Institute',
      price: '$25',
      status: 'available'
    },
    {
      id: 3,
      title: 'Industry Leaders Panel Discussion',
      date: '2024-02-02',
      time: '7:00 PM - 9:00 PM',
      location: 'Convention Center Hall A',
      type: 'In-Person',
      attendees: 200,
      industry: 'Finance',
      description: 'Hear from senior executives about career paths and industry trends.',
      organizer: 'Finance Professionals Association',
      price: '$40',
      status: 'available'
    }
  ];

  const networkingConnections = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Marketing Manager',
      company: 'TechCorp Inc.',
      location: 'Seattle, WA',
      industry: 'Technology',
      connections: 847,
      mutualConnections: 12,
      profileImage: null,
      status: 'connected',
      lastInteraction: '2 days ago',
      expertise: ['Digital Marketing', 'Brand Strategy', 'Team Leadership']
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Product Development Lead',
      company: 'Innovation Labs',
      location: 'San Francisco, CA',
      industry: 'Technology',
      connections: 1203,
      mutualConnections: 8,
      profileImage: null,
      status: 'pending',
      lastInteraction: null,
      expertise: ['Product Management', 'Agile Development', 'User Experience']
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Operations Director',
      company: 'Global Solutions Ltd.',
      location: 'New York, NY',
      industry: 'Consulting',
      connections: 654,
      mutualConnections: 15,
      profileImage: null,
      status: 'suggested',
      lastInteraction: null,
      expertise: ['Operations Management', 'Process Improvement', 'Strategic Planning']
    }
  ];

  const mentorshipOpportunities = [
    {
      id: 1,
      name: 'David Thompson',
      title: 'VP of Engineering',
      company: 'Enterprise Solutions',
      experience: '15+ years',
      expertise: ['Technical Leadership', 'Career Advancement', 'Team Building'],
      availability: 'Monthly 1-hour sessions',
      rating: 4.9,
      reviews: 23,
      description: 'Helping mid-career professionals transition into senior technical roles.',
      price: 'Free through program'
    },
    {
      id: 2,
      name: 'Lisa Park',
      title: 'Director of Business Development',
      company: 'Growth Partners',
      experience: '12+ years',
      expertise: ['Business Strategy', 'Client Relations', 'Leadership Development'],
      availability: 'Bi-weekly sessions',
      rating: 4.8,
      reviews: 31,
      description: 'Specializing in helping professionals develop business acumen and leadership skills.',
      price: '$75/session'
    }
  ];

  const industryGroups = [
    {
      id: 1,
      name: 'Mid-Career Tech Professionals',
      members: 2847,
      posts: 156,
      category: 'Technology',
      description: 'A community for technology professionals navigating mid-career challenges and opportunities.',
      isJoined: true,
      activity: 'Very Active'
    },
    {
      id: 2,
      name: 'Career Advancement Network',
      members: 5432,
      posts: 289,
      category: 'General',
      description: 'Strategies, tips, and support for professionals looking to advance their careers.',
      isJoined: false,
      activity: 'Active'
    },
    {
      id: 3,
      name: 'Women in Leadership',
      members: 1923,
      posts: 98,
      category: 'Leadership',
      description: 'Supporting women in their journey to leadership positions across all industries.',
      isJoined: true,
      activity: 'Moderate'
    }
  ];

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold neuro-text-primary">Networking Events</h3>
          <p className="neuro-text-secondary">Discover events to expand your professional network</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="neuro-select text-sm"
          >
            <option value="all">All Events</option>
            <option value="virtual">Virtual Only</option>
            <option value="in-person">In-Person Only</option>
            <option value="free">Free Events</option>
          </select>
          <button className="neuro-button-primary flex items-center text-sm px-4 py-2 rounded-neuro">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold neuro-text-primary mb-1">{event.title}</h4>
                    <div className="flex items-center text-sm neuro-text-secondary space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`neuro-surface px-3 py-1 rounded-neuro-sm text-xs font-medium ${
                      event.type === 'Virtual' ? 'text-neuro-success' : 'text-neuro-primary'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-sm font-medium neuro-text-primary">{event.price}</span>
                  </div>
                </div>
                
                <p className="neuro-text-secondary mb-3">{event.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm neuro-text-secondary">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {event.attendees} attending
                    </span>
                    <span className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {event.organizer}
                    </span>
                    <span className="neuro-surface px-2 py-1 rounded-neuro-sm text-xs">
                      {event.industry}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 lg:ml-6">
                {event.status === 'registered' ? (
                  <button className="neuro-button bg-gradient-to-br from-neuro-success to-green-400 text-white flex items-center text-sm px-4 py-2 rounded-neuro">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Registered
                  </button>
                ) : (
                  <button className="neuro-button-primary text-sm px-4 py-2 rounded-neuro">
                    Register Now
                  </button>
                )}
                <button className="neuro-button flex items-center text-sm px-4 py-2 rounded-neuro">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConnections = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold neuro-text-primary">Professional Connections</h3>
          <p className="neuro-text-secondary">Build and maintain your professional network</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 neuro-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search connections..."
              className="neuro-input pl-10 text-sm"
            />
          </div>
          <button className="neuro-button-primary flex items-center text-sm px-4 py-2 rounded-neuro">
            <UserPlus className="w-4 h-4 mr-2" />
            Find People
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networkingConnections.map((connection) => (
          <div key={connection.id} className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-primary to-neuro-primary-light text-white font-semibold">
                  {connection.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold neuro-text-primary">{connection.name}</h4>
                  <p className="text-sm neuro-text-secondary">{connection.title}</p>
                </div>
              </div>
              <div className={`neuro-surface px-2 py-1 rounded-neuro-sm text-xs font-medium ${
                connection.status === 'connected' ? 'text-neuro-success' :
                connection.status === 'pending' ? 'text-neuro-warning' :
                'neuro-text-muted'
              }`}>
                {connection.status === 'connected' ? 'Connected' :
                 connection.status === 'pending' ? 'Pending' : 'Suggested'}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm neuro-text-secondary">
                <Building2 className="w-4 h-4 mr-2" />
                {connection.company}
              </div>
              <div className="flex items-center text-sm neuro-text-secondary">
                <MapPin className="w-4 h-4 mr-2" />
                {connection.location}
              </div>
              <div className="flex items-center text-sm neuro-text-secondary">
                <Users className="w-4 h-4 mr-2" />
                {connection.connections} connections • {connection.mutualConnections} mutual
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {connection.expertise.slice(0, 2).map((skill, index) => (
                  <span key={index} className="neuro-surface px-2 py-1 rounded-neuro-sm text-xs text-neuro-primary">
                    {skill}
                  </span>
                ))}
                {connection.expertise.length > 2 && (
                  <span className="neuro-surface px-2 py-1 rounded-neuro-sm text-xs neuro-text-muted">
                    +{connection.expertise.length - 2} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              {connection.status === 'connected' ? (
                <>
                  <button className="flex-1 neuro-button-primary flex items-center justify-center text-sm py-2 rounded-neuro">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </button>
                  <button className="neuro-button p-2 rounded-neuro">
                    <Phone className="w-4 h-4" />
                  </button>
                </>
              ) : connection.status === 'pending' ? (
                <button className="flex-1 neuro-inset text-neuro-text-muted py-2 rounded-neuro cursor-not-allowed text-sm">
                  Request Sent
                </button>
              ) : (
                <button className="flex-1 neuro-button-primary flex items-center justify-center text-sm py-2 rounded-neuro">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMentorship = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold neuro-text-primary">Mentorship Opportunities</h3>
          <p className="neuro-text-secondary">Connect with experienced professionals for guidance</p>
        </div>
        <button className="neuro-button-primary flex items-center text-sm px-4 py-2 rounded-neuro">
          <Target className="w-4 h-4 mr-2" />
          Become a Mentor
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {mentorshipOpportunities.map((mentor) => (
          <div key={mentor.id} className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-16 h-16 neuro-icon bg-gradient-to-br from-neuro-secondary to-pink-400 text-white font-bold text-lg">
                  {mentor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold neuro-text-primary">{mentor.name}</h4>
                  <p className="neuro-text-secondary">{mentor.title}</p>
                  <p className="text-sm neuro-text-muted">{mentor.company}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-1">
                  <Star className="w-4 h-4 text-neuro-warning fill-current" />
                  <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
                  <span className="ml-1 text-sm neuro-text-muted">({mentor.reviews})</span>
                </div>
                <p className="text-sm neuro-text-secondary">{mentor.experience}</p>
              </div>
            </div>
            
            <p className="neuro-text-secondary mb-4">{mentor.description}</p>
            
            <div className="space-y-3 mb-4">
              <div>
                <h5 className="text-sm font-semibold neuro-text-primary mb-2">Expertise Areas</h5>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill, index) => (
                    <span key={index} className="neuro-surface px-3 py-1 rounded-neuro-sm text-sm text-neuro-secondary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center neuro-text-secondary">
                  <Clock className="w-4 h-4 mr-2" />
                  {mentor.availability}
                </div>
                <div className="font-semibold neuro-text-primary">
                  {mentor.price}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 neuro-button-primary text-sm py-2 rounded-neuro">
                Request Mentorship
              </button>
              <button className="neuro-button text-sm px-4 py-2 rounded-neuro">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGroups = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold neuro-text-primary">Industry Groups</h3>
          <p className="neuro-text-secondary">Join communities of like-minded professionals</p>
        </div>
        <button className="neuro-button-primary flex items-center text-sm px-4 py-2 rounded-neuro">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {industryGroups.map((group) => (
          <div key={group.id} className="neuro-card hover:shadow-neuro-hover transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 neuro-icon bg-gradient-to-br from-neuro-success to-green-400">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold neuro-text-primary">{group.name}</h4>
                  <p className="text-sm neuro-text-secondary">{group.category}</p>
                </div>
              </div>
              <div className={`neuro-surface px-2 py-1 rounded-neuro-sm text-xs font-medium ${
                group.activity === 'Very Active' ? 'text-neuro-success' :
                group.activity === 'Active' ? 'text-neuro-primary' :
                'text-neuro-warning'
              }`}>
                {group.activity}
              </div>
            </div>
            
            <p className="neuro-text-secondary mb-4">{group.description}</p>
            
            <div className="flex items-center justify-between mb-4 text-sm neuro-text-secondary">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {group.members.toLocaleString()} members
                </span>
                <span className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {group.posts} posts this month
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {group.isJoined ? (
                <>
                  <button className="flex-1 neuro-button bg-gradient-to-br from-neuro-success to-green-400 text-white flex items-center justify-center text-sm py-2 rounded-neuro">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Joined
                  </button>
                  <button className="neuro-button text-sm px-4 py-2 rounded-neuro">
                    View Posts
                  </button>
                </>
              ) : (
                <>
                  <button className="flex-1 neuro-button-primary flex items-center justify-center text-sm py-2 rounded-neuro">
                    <Plus className="w-4 h-4 mr-2" />
                    Join Group
                  </button>
                  <button className="neuro-button text-sm px-4 py-2 rounded-neuro">
                    Preview
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 neuro-icon mx-auto mb-6">
          <Network className="w-10 h-10 text-neuro-primary" />
        </div>
        <h2 className="text-2xl font-bold neuro-text-primary mb-2">Professional Networking Hub</h2>
        <p className="neuro-text-secondary max-w-2xl mx-auto">
          Expand your professional network, attend industry events, find mentors, and join communities 
          that will accelerate your mid-career growth.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="neuro-inset rounded-neuro">
        <nav className="flex space-x-8 p-4">
          {[
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'connections', label: 'Connections', icon: Users },
            { id: 'mentorship', label: 'Mentorship', icon: Award },
            { id: 'groups', label: 'Groups', icon: Network }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-4 rounded-neuro font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'neuro-button-primary'
                    : 'neuro-text-secondary hover:neuro-text-primary'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'connections' && renderConnections()}
        {activeTab === 'mentorship' && renderMentorship()}
        {activeTab === 'groups' && renderGroups()}
      </div>

      {/* Action Button */}
      {onComplete && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onComplete}
            className="neuro-button-primary flex items-center px-8 py-3 rounded-neuro-lg"
          >
            Continue to Next Step
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};