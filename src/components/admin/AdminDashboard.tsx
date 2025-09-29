import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  MapPin, 
  Download, 
  Filter, 
  Calendar,
  Building2,
  Target,
  DollarSign,
  Clock,
  Award,
  Briefcase,
  Network,
  FileText,
  Settings,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BookOpen,
  LogOut,
  ChevronDown,
  Shield,
  TrendingDown
} from 'lucide-react';

// Component Library Types
interface KPITileProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  tooltip?: string;
  onClick?: () => void;
  breakdown?: string;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

interface DataTableProps {
  columns: TableColumn[];
  data: any[];
  sortable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
}

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  exportable?: boolean;
  fullscreen?: boolean;
  tooltip?: string;
}

// Data Types
interface FilterState {
  dateRange: string;
  region: string[];
  track: 'all' | 'employment' | 'business';
  demographic: {
    gender: string[];
    ageGroup: string[];
    education: string[];
  };
}

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  format?: 'number' | 'percentage' | 'currency' | 'date';
}

interface KPIData {
  employment: {
    placementRate: number;
    avgTimeToPlacement: number;
    retentionRate: number;
    skillsGapClosure: number;
    programCompletion: number;
  };
  business: {
    learningCompletion: number;
    networkingEngagement: number;
    businessesRegistered: number;
    jobsCreated: number;
    fundingAccessed: number;
    programROI: number;
  };
}

// Mock Data
const mockKPIData: KPIData = {
  employment: {
    placementRate: 73.2,
    avgTimeToPlacement: 4.2,
    retentionRate: 85.7,
    skillsGapClosure: 68.9,
    programCompletion: 89.4
  },
  business: {
    learningCompletion: 82.1,
    networkingEngagement: 76.3,
    businessesRegistered: 156,
    jobsCreated: 423,
    fundingAccessed: 2.4,
    programROI: 3.2
  }
};

const mockProgramData = [
  { name: 'Digital Skills Training', track: 'Employment', enrolled: 145, successful: 116, successRate: 80, costPerSuccess: '$2,100' },
  { name: 'Business Plan Development', track: 'Business', enrolled: 98, successful: 78, successRate: 80, costPerSuccess: '$1,800' },
  { name: 'Manufacturing Apprentice', track: 'Employment', enrolled: 89, successful: 67, successRate: 75, costPerSuccess: '$3,200' },
  { name: 'Healthcare Certification', track: 'Employment', enrolled: 234, successful: 171, successRate: 73, costPerSuccess: '$2,800' },
  { name: 'Startup Incubator Program', track: 'Business', enrolled: 156, successful: 109, successRate: 70, costPerSuccess: '$4,200' },
  { name: 'Digital Marketing for Startups', track: 'Business', enrolled: 123, successful: 86, successRate: 70, costPerSuccess: '$1,500' },
  { name: 'Customer Service Training', track: 'Employment', enrolled: 167, successful: 113, successRate: 68, costPerSuccess: '$1,900' },
  { name: 'Financial Management', track: 'Business', enrolled: 89, successful: 58, successRate: 65, costPerSuccess: '$2,100' },
  { name: 'Construction Skills', track: 'Employment', enrolled: 112, successful: 72, successRate: 64, costPerSuccess: '$2,600' }
];

// Component Library Implementation
const KPITile: React.FC<KPITileProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color, 
  tooltip, 
  onClick,
  breakdown 
}) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-4 h-4 text-neuro-success" />;
      case 'decrease': return <TrendingDown className="w-4 h-4 text-neuro-error" />;
      default: return <Minus className="w-4 h-4 neuro-text-muted" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-neuro-success';
      case 'decrease': return 'text-neuro-error';
      default: return 'neuro-text-muted';
    }
  };

  return (
    <div 
      className={`neuro-card cursor-pointer hover:shadow-neuro-hover transition-all duration-300 ${onClick ? 'hover:scale-105' : ''}`}
      onClick={onClick}
      title={tooltip}
      role={onClick ? "button" : "generic"}
      tabIndex={onClick ? 0 : -1}
      aria-label={`${title}: ${value}${change ? `, ${changeType} by ${Math.abs(change)}%` : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-16 h-16 neuro-icon ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            {getChangeIcon()}
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold neuro-text-primary">{value}</p>
        <p className="text-sm font-semibold neuro-text-primary">{title}</p>
        {breakdown && (
          <p className="text-sm neuro-text-secondary">{breakdown}</p>
        )}
      </div>
    </div>
  );
};

const SimpleChart: React.FC<{ title: string; data: any[] }> = ({ title, data }) => {
  return (
    <div className="neuro-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold neuro-text-primary flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          {title}
        </h3>
      </div>
      
      {/* Simple line chart representation */}
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((point, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center space-y-2">
              {/* Job Placements */}
              <div 
                className="w-full bg-gradient-to-t from-neuro-primary to-neuro-primary-light rounded-t-neuro-sm"
                style={{ height: `${(point.jobPlacements / 300) * 200}px` }}
                title={`Job Placements: ${point.jobPlacements}`}
              />
              {/* Business Registrations */}
              <div 
                className="w-full bg-gradient-to-t from-neuro-success to-green-400 rounded-t-neuro-sm"
                style={{ height: `${(point.businessRegistrations / 100) * 80}px` }}
                title={`Business Registrations: ${point.businessRegistrations}`}
              />
            </div>
            <span className="text-xs neuro-text-muted mt-2">{point.month}</span>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-neuro-primary rounded-full mr-2"></div>
          <span className="text-sm neuro-text-secondary">Job Placements</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-neuro-success rounded-full mr-2"></div>
          <span className="text-sm neuro-text-secondary">Business Registrations</span>
        </div>
      </div>
    </div>
  );
};

const ProgramTable: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="neuro-card overflow-hidden">
      <div className="px-6 py-4 border-b border-neuro-bg-dark">
        <h3 className="text-lg font-semibold neuro-text-primary flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Top Performing Programs (Both Tracks)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="neuro-inset">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium neuro-text-muted uppercase tracking-wider">
                Program Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium neuro-text-muted uppercase tracking-wider">
                Track
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium neuro-text-muted uppercase tracking-wider">
                Enrolled
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium neuro-text-muted uppercase tracking-wider">
                Successful
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium neuro-text-muted uppercase tracking-wider">
                Success Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium neuro-text-muted uppercase tracking-wider">
                Cost Per Success
              </th>
            </tr>
          </thead>
          <tbody className="bg-neuro-bg-light divide-y divide-neuro-bg-dark">
            {data.map((program, index) => (
              <tr key={index} className="hover:bg-neuro-bg transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium neuro-text-primary">{program.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-neuro-sm text-xs font-medium neuro-surface ${
                    program.track === 'Employment' 
                      ? 'text-neuro-primary' 
                      : 'text-neuro-success'
                  }`}>
                    {program.track}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm neuro-text-primary">
                  {program.enrolled}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm neuro-text-primary">
                  {program.successful}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm neuro-text-primary mr-2">{program.successRate}%</span>
                    <div className="w-16 neuro-inset rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          program.track === 'Employment' 
                            ? 'bg-gradient-to-r from-neuro-primary to-neuro-primary-light' 
                            : 'bg-gradient-to-r from-neuro-success to-green-400'
                        }`}
                        style={{ width: `${program.successRate}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm neuro-text-primary">
                  {program.costPerSuccess}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'employment' | 'business'>('overview');
  const [dateRange, setDateRange] = useState('Last 12 Months');

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-neuro-bg flex items-center justify-center">
        <div className="text-center neuro-card">
          <div className="w-16 h-16 neuro-icon mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-neuro-error" />
          </div>
          <h1 className="text-2xl font-bold neuro-text-primary mb-2">Access Denied</h1>
          <p className="neuro-text-secondary">You need administrator privileges to access this dashboard.</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { month: 'Jan', jobPlacements: 135, businessRegistrations: 45 },
    { month: 'Feb', jobPlacements: 148, businessRegistrations: 52 },
    { month: 'Mar', jobPlacements: 167, businessRegistrations: 48 },
    { month: 'Apr', jobPlacements: 142, businessRegistrations: 55 },
    { month: 'May', jobPlacements: 189, businessRegistrations: 62 },
    { month: 'Jun', jobPlacements: 203, businessRegistrations: 68 },
    { month: 'Jul', jobPlacements: 225, businessRegistrations: 71 },
    { month: 'Aug', jobPlacements: 218, businessRegistrations: 74 },
    { month: 'Sep', jobPlacements: 245, businessRegistrations: 78 },
    { month: 'Oct', jobPlacements: 267, businessRegistrations: 82 },
    { month: 'Nov', jobPlacements: 251, businessRegistrations: 79 },
    { month: 'Dec', jobPlacements: 289, businessRegistrations: 85 }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Privacy Notice */}
      <div className="neuro-inset p-4 rounded-neuro">
        <div className="flex items-start">
          <Eye className="w-5 h-5 text-neuro-primary mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm neuro-text-primary">
              All data is aggregated to protect individual privacy. Results showing fewer than 10 participants are suppressed. 
              Cross-track comparisons use consistent privacy thresholds.{' '}
              <a href="#" className="text-neuro-primary underline hover:text-neuro-primary-light">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPITile
          title="Total Participants"
          value="3,247"
          change={5}
          changeType="increase"
          icon={Users}
          color="bg-gradient-to-br from-neuro-primary to-neuro-primary-light"
          breakdown="Breakdown: 1856 JS, 1391 ENT"
          tooltip="Combined enrollment across both tracks"
        />
        <KPITile
          title="Overall Success Rate"
          value="69%"
          change={4}
          changeType="increase"
          icon={Target}
          color="bg-gradient-to-br from-neuro-success to-green-400"
          breakdown="By Track: 73% JS, 64% ENT"
          tooltip="Success rate across all programs"
        />
        <KPITile
          title="Total Employment Impact"
          value="1,847"
          change={15}
          changeType="increase"
          icon={TrendingUp}
          color="bg-gradient-to-br from-neuro-secondary to-pink-400"
          breakdown="Breakdown: 1356 placements, 491 created"
          tooltip="Jobs placed plus jobs created by new businesses"
        />
        <KPITile
          title="Combined Program ROI"
          value="164%"
          change={12}
          changeType="increase"
          icon={DollarSign}
          color="bg-gradient-to-br from-neuro-warning to-yellow-400"
          tooltip="Return on investment across both tracks"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regional Performance Chart */}
        <div className="neuro-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold neuro-text-primary flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Regional Performance (Both Tracks)
            </h3>
          </div>
          
          {/* Simple bar chart representation */}
          <div className="space-y-4">
            {[
              { region: 'Western Cape', value: 300, percentage: 100 },
              { region: 'Gauteng', value: 180, percentage: 60 },
              { region: 'KwaZulu-Natal', value: 220, percentage: 73 },
              { region: 'Eastern Cape', value: 160, percentage: 53 }
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm neuro-text-secondary">{item.region}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full neuro-inset rounded-full h-6">
                    <div 
                      className="bg-gradient-to-r from-neuro-primary to-neuro-primary-light h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    >
                      <span className="text-white text-xs font-medium">{item.value}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participant Demographics Chart */}
        <div className="neuro-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold neuro-text-primary flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Participant Demographics (Both Tracks)
            </h3>
          </div>
          
          {/* Simple demographic bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="neuro-text-secondary">Age Distribution</span>
              </div>
              <div className="flex space-x-1 h-8 neuro-inset rounded-neuro-sm p-1">
                <div className="bg-gradient-to-r from-neuro-primary to-blue-400 rounded-neuro-sm" style={{ width: '25%' }} title="18-24: 25%"></div>
                <div className="bg-gradient-to-r from-neuro-success to-green-400 rounded-neuro-sm" style={{ width: '35%' }} title="25-34: 35%"></div>
                <div className="bg-gradient-to-r from-neuro-secondary to-pink-400 rounded-neuro-sm" style={{ width: '25%' }} title="35-44: 25%"></div>
                <div className="bg-gradient-to-r from-neuro-warning to-yellow-400 rounded-neuro-sm" style={{ width: '15%' }} title="45+: 15%"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="neuro-text-secondary">Gender Distribution</span>
              </div>
              <div className="flex space-x-1 h-8 neuro-inset rounded-neuro-sm p-1">
                <div className="bg-gradient-to-r from-neuro-success to-green-400 rounded-neuro-sm" style={{ width: '52%' }} title="Female: 52%"></div>
                <div className="bg-gradient-to-r from-neuro-primary to-blue-400 rounded-neuro-sm" style={{ width: '46%' }} title="Male: 46%"></div>
                <div className="bg-gradient-to-r from-neuro-secondary to-pink-400 rounded-neuro-sm" style={{ width: '2%' }} title="Other: 2%"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="neuro-text-secondary">Education Level</span>
              </div>
              <div className="flex space-x-1 h-8 neuro-inset rounded-neuro-sm p-1">
                <div className="bg-gradient-to-r from-neuro-warning to-yellow-400 rounded-neuro-sm" style={{ width: '30%' }} title="High School: 30%"></div>
                <div className="bg-gradient-to-r from-neuro-primary to-blue-400 rounded-neuro-sm" style={{ width: '40%' }} title="Some College: 40%"></div>
                <div className="bg-gradient-to-r from-neuro-secondary to-pink-400 rounded-neuro-sm" style={{ width: '25%' }} title="Bachelor's: 25%"></div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-neuro-sm" style={{ width: '5%' }} title="Advanced: 5%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <SimpleChart title="Monthly Trends - Cross-Track Outcomes" data={chartData} />

      {/* Program Performance Table */}
      <ProgramTable data={mockProgramData} />
    </div>
  );

  const renderEmploymentTab = () => (
    <div className="space-y-6">
      <div className="neuro-inset p-6 rounded-neuro">
        <h3 className="text-lg font-semibold neuro-text-primary mb-2 flex items-center">
          <Briefcase className="w-5 h-5 mr-2" />
          Employment Track Analytics
        </h3>
        <p className="neuro-text-secondary">Detailed analytics for employment-focused programs and job placement outcomes.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPITile
          title="Job Placement Rate"
          value="73%"
          change={4}
          changeType="increase"
          icon={Target}
          color="bg-gradient-to-br from-neuro-primary to-neuro-primary-light"
          tooltip="Percentage of participants who found employment within 6 months"
        />
        <KPITile
          title="Average Time to Placement"
          value="4.2 months"
          change={-8}
          changeType="decrease"
          icon={Clock}
          color="bg-gradient-to-br from-neuro-success to-green-400"
          tooltip="Average time from program start to job placement"
        />
        <KPITile
          title="6-Month Retention Rate"
          value="86%"
          change={2}
          changeType="increase"
          icon={CheckCircle}
          color="bg-gradient-to-br from-neuro-secondary to-pink-400"
          tooltip="Percentage still employed after 6 months"
        />
        <KPITile
          title="Skills Gap Closure"
          value="69%"
          change={3}
          changeType="increase"
          icon={TrendingUp}
          color="bg-gradient-to-br from-neuro-warning to-yellow-400"
          tooltip="Improvement in skills assessment scores"
        />
        <KPITile
          title="Program Completion"
          value="89%"
          change={2}
          changeType="increase"
          icon={Award}
          color="bg-gradient-to-br from-purple-500 to-purple-400"
          tooltip="Percentage completing all program modules"
        />
        <KPITile
          title="Average Salary Increase"
          value="$8,400"
          change={6}
          changeType="increase"
          icon={DollarSign}
          color="bg-gradient-to-br from-pink-500 to-pink-400"
          tooltip="Average salary improvement post-program"
        />
      </div>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <div className="neuro-inset p-6 rounded-neuro">
        <h3 className="text-lg font-semibold neuro-text-primary mb-2 flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Business Track Analytics
        </h3>
        <p className="neuro-text-secondary">Comprehensive metrics for entrepreneurship programs and business development outcomes.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPITile
          title="Learning Module Completion"
          value="82%"
          change={4}
          changeType="increase"
          icon={BookOpen}
          color="bg-gradient-to-br from-neuro-success to-green-400"
          tooltip="Percentage completing entrepreneurship modules"
        />
        <KPITile
          title="Networking Engagement"
          value="76%"
          change={3}
          changeType="increase"
          icon={Network}
          color="bg-gradient-to-br from-neuro-primary to-neuro-primary-light"
          tooltip="Active participation in networking events"
        />
        <KPITile
          title="Businesses Registered"
          value="156"
          change={12}
          changeType="increase"
          icon={Building2}
          color="bg-gradient-to-br from-neuro-secondary to-pink-400"
          tooltip="New businesses formally registered"
        />
        <KPITile
          title="Jobs Created"
          value="423"
          change={9}
          changeType="increase"
          icon={Users}
          color="bg-gradient-to-br from-neuro-warning to-yellow-400"
          tooltip="Employment opportunities created by new businesses"
        />
        <KPITile
          title="Funding Accessed"
          value="$2.4M"
          change={15}
          changeType="increase"
          icon={DollarSign}
          color="bg-gradient-to-br from-purple-500 to-purple-400"
          tooltip="Total funding secured by program participants"
        />
        <KPITile
          title="Program ROI"
          value="320%"
          change={8}
          changeType="increase"
          icon={TrendingUp}
          color="bg-gradient-to-br from-pink-500 to-pink-400"
          tooltip="Return on investment for entrepreneurship programs"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neuro-bg">
      {/* Header */}
      <header className="neuro-nav sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center mr-8">
                <div className="w-12 h-12 neuro-icon mr-3">
                  <Users className="w-6 h-6 text-neuro-primary" />
                </div>
                <div className="w-12 h-12 neuro-icon mr-4">
                  <Building2 className="w-6 h-6 text-neuro-success" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold neuro-text-primary">Lumina Admin Dashboard</h1>
                <p className="text-sm neuro-text-secondary">Your personal co-pilot analytics and insights</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Date Range Selector */}
              <div className="relative">
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="neuro-select text-sm pr-8"
                >
                  <option>Last 12 Months</option>
                  <option>Year to Date</option>
                  <option>Last Quarter</option>
                  <option>Custom Range</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 neuro-text-muted pointer-events-none" />
              </div>
              
              {/* Export Button */}
              <button className="neuro-button-primary flex items-center px-4 py-2 rounded-neuro">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              
              {/* Sign Out Button */}
              <button
                onClick={logout}
                className="neuro-button flex items-center px-4 py-2 rounded-neuro"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="neuro-nav border-t border-neuro-bg-dark">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" role="tablist">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'employment', label: 'Employment Track', icon: Briefcase },
              { id: 'business', label: 'Business Track', icon: Building2 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-neuro-primary text-neuro-primary'
                      : 'border-transparent neuro-text-secondary hover:neuro-text-primary hover:border-neuro-bg-dark'
                  }`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content */}
        <div role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`}>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'employment' && renderEmploymentTab()}
          {activeTab === 'business' && renderBusinessTab()}
        </div>
      </main>
    </div>
  );
};