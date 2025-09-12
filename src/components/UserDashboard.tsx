import React, { useState } from 'react';
import { Edit, TrendingUp, CheckCircle2, Play, Calendar, MessageCircle, BookOpen, Users, Award, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  onTabChange?: (tab: string) => void;
}

const UserDashboard: React.FC<DashboardProps> = ({ onTabChange = () => {} }) => {
  const { t } = useTranslation();
  const [mood, setMood] = useState('');
  const [activities, setActivities] = useState([
    { id: 1, name: 'Meditation', duration: '10m', completed: false, icon: '🧘‍♂️' },
    { id: 2, name: 'Journaling', duration: '5m', completed: false, icon: '📝' },
    { id: 3, name: 'Walk', duration: '20m', completed: false, icon: '🚶‍♂️' },
  ]);

  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState('');

  const completeActivity = (id: number) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, completed: true } : activity
      )
    );
    
    const activity = activities.find(a => a.id === id);
    if (activity) {
      setEarnedBadge(`${activity.name} Completed! 🎖`);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setEarnedBadge('');
      }, 3000);
    }
  };

  const kpis = [
    { label: 'Stress', score: 38, trend: 'down', color: 'green' },
    { label: 'Anxiety', score: 45, trend: 'down', color: 'blue' },
    { label: 'Sleep Quality', score: 72, trend: 'up', color: 'purple' },
  ];

  const games = [
    { id: 1, title: 'Mindful Breathing', duration: '5 min', image: '🫁' },
    { id: 2, title: 'Color Therapy', duration: '10 min', image: '🎨' },
    { id: 3, title: 'Nature Sounds', duration: '15 min', image: '🌿' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 lg:pb-6">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg animate-bounce">
            <div className="text-center">
              <Award className="w-12 h-12 text-orange-400 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">{earnedBadge}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative mb-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/50">
          <div className="absolute top-4 right-4 opacity-20">
            <div className="text-4xl">🌊</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.greeting', { name: 'Aniket' })}</h1>
          <p className="text-gray-600 mb-4">{t('dashboard.howFeeling')}</p>
          
          <div className="flex space-x-3">
            {['🙂', '😐', '😔'].map((emoji, index) => (
              <button
                key={index}
                onClick={() => setMood(emoji)}
                className={`w-12 h-12 rounded-full text-2xl transition-all duration-200 ${
                  mood === emoji 
                    ? 'bg-teal-100 border-2 border-teal-300 scale-110' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Strip */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 mb-6 shadow-lg border border-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Aniket Sharma</h3>
              <p className="text-gray-600 text-sm">Delhi University</p>
              <p className="text-gray-500 text-sm">Delhi, India</p>
            </div>
          </div>
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <Edit size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Assessment Snapshot */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{t('dashboard.assessment')}</h2>
            <button 
              onClick={() => onTabChange('manasai')}
              className="text-teal-600 text-sm font-medium hover:underline"
            >
              {t('dashboard.viewReport')}
            </button>
          </div>
          
          <div className="space-y-4">
            {kpis.map((kpi, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    kpi.color === 'green' ? 'bg-green-400' : 
                    kpi.color === 'blue' ? 'bg-blue-400' : 'bg-purple-400'
                  }`}></div>
                  <span className="font-medium text-gray-900">{kpi.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">{kpi.score}</span>
                  <TrendingUp size={16} className={`${
                    kpi.trend === 'up' ? 'text-green-500' : 'text-red-500 transform rotate-180'
                  }`} />
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-600 mt-3">{t('dashboard.lastAssessed', { date: 'Sep 10, 2025' })}</p>
        </div>

        {/* Daily Activities */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
          <h2 className="font-semibold text-gray-900 mb-4">{t('dashboard.todayActivities')}</h2>
          
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{activity.icon}</span>
                  <div>
                    <span className="font-medium text-gray-900">{activity.name}</span>
                    <p className="text-sm text-gray-600">{activity.duration}</p>
                  </div>
                </div>
                <button
                  onClick={() => !activity.completed && completeActivity(activity.id)}
                  className={`transition-all duration-200 ${
                    activity.completed 
                      ? 'text-green-500' 
                      : 'text-gray-400 hover:text-teal-600 hover:scale-110'
                  }`}
                >
                  <CheckCircle2 size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Games Carousel */}
      <div className="mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">{t('dashboard.games')}</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {games.map((game) => (
            <div key={game.id} className="flex-shrink-0 bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/50 w-48">
              <div className="text-3xl mb-2">{game.image}</div>
              <h3 className="font-medium text-gray-900 mb-1">{game.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{game.duration}</p>
              <button className="w-full bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
                <Play size={16} />
                <span>{t('dashboard.play')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => onTabChange('booking')}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/50 hover:scale-105 transition-transform"
          >
            <Calendar className="w-8 h-8 text-teal-600 mb-2" />
            <p className="font-medium text-gray-900 text-sm">{t('dashboard.bookConsultant')}</p>
          </button>
          <button 
            onClick={() => onTabChange('manasai')}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/50 hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-8 h-8 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900 text-sm">{t('dashboard.chatWithAI')}</p>
          </button>
          <button 
            onClick={() => onTabChange('resources')}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/50 hover:scale-105 transition-transform"
          >
            <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900 text-sm">{t('dashboard.resources')}</p>
          </button>
          <button 
            onClick={() => onTabChange('peer')}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/50 hover:scale-105 transition-transform"
          >
            <Users className="w-8 h-8 text-orange-600 mb-2" />
            <p className="font-medium text-gray-900 text-sm">{t('dashboard.peerChat')}</p>
          </button>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
        <h2 className="font-semibold text-gray-900 mb-4">{t('dashboard.upcoming')}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Dr. Sarah Wilson - Consultation</p>
                <p className="text-sm text-gray-600">Tomorrow at 2:00 PM</p>
              </div>
            </div>
            <Zap size={18} className="text-teal-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Art Therapy Group Session</p>
                <p className="text-sm text-gray-600">Friday at 6:00 PM</p>
              </div>
            </div>
            <Users size={18} className="text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
