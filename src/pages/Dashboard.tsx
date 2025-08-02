import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Users, 
  FileText, 
  BarChart3,
  Calendar,
  Timer,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (user?.role === 'student') {
    return <StudentDashboard user={user} greeting={getGreeting()} />;
  }

  if (user?.role === 'admin') {
    return <AdminDashboard user={user} greeting={getGreeting()} />;
  }

  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard user={user} greeting={getGreeting()} />;
  }

  return null;
}

function StudentDashboard({ user, greeting }: { user: any; greeting: string }) {
  const upcomingExams = [
    { id: 1, title: 'Data Structures Quiz', subject: 'Computer Science', date: '2024-08-05', time: '10:00 AM', duration: '60 mins' },
    { id: 2, title: 'Mathematics Test', subject: 'Mathematics', date: '2024-08-07', time: '2:00 PM', duration: '90 mins' },
  ];

  const recentResults = [
    { id: 1, title: 'Operating Systems', score: 85, maxScore: 100, status: 'passed' },
    { id: 2, title: 'Database Management', score: 92, maxScore: 100, status: 'passed' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{greeting}, {user.name}! 👋</h1>
        <p className="text-muted-foreground">Ready for your next exam?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">2</p>
                <p className="text-sm text-blue-600">Upcoming Exams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">88%</p>
                <p className="text-sm text-green-600">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">5</p>
                <p className="text-sm text-purple-600">Completed Exams</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Exams
            </CardTitle>
            <CardDescription>Your scheduled examinations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                <div className="space-y-1">
                  <h4 className="font-medium">{exam.title}</h4>
                  <p className="text-sm text-muted-foreground">{exam.subject}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exam.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exam.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {exam.duration}
                    </span>
                  </div>
                </div>
                <Button size="sm" asChild>
                  <Link to={`/exam/${exam.id}`}>Start Exam</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Recent Results
            </CardTitle>
            <CardDescription>Your latest exam performances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">{result.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                      {result.score}/{result.maxScore}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {((result.score / result.maxScore) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard({ user, greeting }: { user: any; greeting: string }) {
  const stats = [
    { label: 'Active Exams', value: '12', icon: BookOpen, color: 'blue' },
    { label: 'Total Students', value: '156', icon: Users, color: 'green' },
    { label: 'Questions Bank', value: '450', icon: FileText, color: 'purple' },
    { label: 'Avg Score', value: '78%', icon: BarChart3, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{greeting}, {user.name}! 📚</h1>
        <p className="text-muted-foreground">Manage your exams and monitor student progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border-${stat.color}-200`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-${stat.color}-500 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold text-${stat.color}-700`}>{stat.value}</p>
                  <p className={`text-sm text-${stat.color}-600`}>{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Create New Exam
            </CardTitle>
            <CardDescription>Set up a new examination</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link to="/create-exam">Create Exam</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Upload Questions
            </CardTitle>
            <CardDescription>Import questions via CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/upload-csv">Upload CSV</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              View Results
            </CardTitle>
            <CardDescription>Monitor exam results</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/exam-results">View Results</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SuperAdminDashboard({ user, greeting }: { user: any; greeting: string }) {
  const systemStats = [
    { label: 'Total Users', value: '1,234', icon: Users, trend: '+12%' },
    { label: 'Active Exams', value: '45', icon: BookOpen, trend: '+8%' },
    { label: 'System Health', value: '99.9%', icon: CheckCircle, trend: '+0.1%' },
    { label: 'Avg Performance', value: '82%', icon: BarChart3, trend: '+5%' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{greeting}, {user.name}! ⚡</h1>
        <p className="text-muted-foreground">System overview and administration</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <div className="text-right">
                  <stat.icon className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-green-600">{stat.trend}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage students and teachers</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link to="/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              System Analytics
            </CardTitle>
            <CardDescription>View detailed analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              System Settings
            </CardTitle>
            <CardDescription>Configure system parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/settings">Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}