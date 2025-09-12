import React, { useState } from 'react';
import { Search, Play, Download, BookOpen, Music, Film, Activity, Palette, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<any>(null);

  const categories = [
    { id: 'all', name: 'All', icon: MoreHorizontal },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'books', name: 'Books', icon: BookOpen },
    { id: 'movies', name: 'Movies', icon: Film },
    { id: 'activities', name: 'Activities', icon: Activity },
    { id: 'hobbies', name: 'Hobbies', icon: Palette },
  ];

  const resources = [
    // Music
    { id: 1, code: 'MUS-101', title: 'Relaxing Ocean Waves', type: 'music', duration: '10:00', author: 'Nature Sounds', category: 'music', description: 'Gentle ocean waves for deep relaxation and sleep', tags: ['relaxation', 'sleep', 'nature'], thumbnail: '🌊' },
    { id: 2, code: 'MUS-102', title: 'Mindful Meditation Music', type: 'music', duration: '15:00', author: 'Zen Masters', category: 'music', description: 'Tibetan singing bowls and soft ambient sounds', tags: ['meditation', 'mindfulness', 'zen'], thumbnail: '🎵' },
    { id: 3, code: 'MUS-103', title: 'Forest Rain Sounds', type: 'music', duration: '20:00', author: 'Natural Harmony', category: 'music', description: 'Peaceful rain falling on leaves in a quiet forest', tags: ['rain', 'forest', 'peace'], thumbnail: '🌧️' },
    
    // Books
    { id: 4, code: 'BK-201', title: 'Mindfulness for Beginners', type: 'book', pages: 180, author: 'Dr. Sarah Chen', category: 'books', description: 'A practical guide to starting your mindfulness journey', tags: ['mindfulness', 'beginners', 'practice'], thumbnail: '📚' },
    { id: 5, code: 'BK-202', title: 'Overcoming Anxiety', type: 'book', pages: 245, author: 'Dr. Michael Roberts', category: 'books', description: 'Evidence-based strategies for managing anxiety', tags: ['anxiety', 'coping', 'self-help'], thumbnail: '📖' },
    { id: 6, code: 'BK-203', title: 'The Science of Happiness', type: 'book', pages: 320, author: 'Prof. Lisa Johnson', category: 'books', description: 'Understanding the psychology behind well-being', tags: ['happiness', 'psychology', 'science'], thumbnail: '📘' },
    
    // Movies
    { id: 7, code: 'MOV-301', title: 'Inside Out', type: 'movie', duration: '95 min', author: 'Pixar Animation', category: 'movies', description: 'A beautiful exploration of emotions and mental health', tags: ['emotions', 'family', 'psychology'], thumbnail: '🎬' },
    { id: 8, code: 'MOV-302', title: 'A Beautiful Mind', type: 'movie', duration: '135 min', author: 'Ron Howard', category: 'movies', description: 'Inspiring story about overcoming mental health challenges', tags: ['inspiration', 'mental health', 'biography'], thumbnail: '🎭' },
    { id: 9, code: 'MOV-303', title: 'Good Will Hunting', type: 'movie', duration: '126 min', author: 'Gus Van Sant', category: 'movies', description: 'A touching story about therapy and self-discovery', tags: ['therapy', 'growth', 'relationships'], thumbnail: '🎪' },
    
    // Activities
    { id: 10, code: 'ACT-401', title: 'Breathing Exercise Guide', type: 'activity', duration: '5 min', author: 'Wellness Team', category: 'activities', description: '4-7-8 breathing technique for instant calm', tags: ['breathing', 'stress relief', 'quick'], thumbnail: '🫁' },
    { id: 11, code: 'ACT-402', title: 'Progressive Muscle Relaxation', type: 'activity', duration: '15 min', author: 'Relaxation Experts', category: 'activities', description: 'Systematic tension and release for deep relaxation', tags: ['relaxation', 'muscle tension', 'guided'], thumbnail: '💆‍♂️' },
    { id: 12, code: 'ACT-403', title: 'Gratitude Journaling', type: 'activity', duration: '10 min', author: 'Positive Psychology Team', category: 'activities', description: 'Daily practice to cultivate appreciation', tags: ['gratitude', 'journaling', 'positive'], thumbnail: '✍️' },
    
    // Hobbies
    { id: 13, code: 'HOB-501', title: 'Watercolor Painting Basics', type: 'hobby', duration: '30 min', author: 'Art Therapy Institute', category: 'hobbies', description: 'Therapeutic painting techniques for beginners', tags: ['art', 'creativity', 'therapy'], thumbnail: '🎨' },
    { id: 14, code: 'HOB-502', title: 'Indoor Gardening Guide', type: 'hobby', duration: '45 min', author: 'Green Therapy', category: 'hobbies', description: 'Growing plants for mental wellness', tags: ['gardening', 'nature', 'care'], thumbnail: '🪴' },
    { id: 15, code: 'HOB-503', title: 'Beginner Knitting', type: 'hobby', duration: '60 min', author: 'Craft Wellness', category: 'hobbies', description: 'Meditative knitting patterns and techniques', tags: ['knitting', 'meditation', 'crafts'], thumbnail: '🧶' },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      resource.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (selectedResource) {
    return (
      <div className="min-h-screen pt-20 pb-8 bg-gradient-calm">
        <div className="container mx-auto px-6 max-w-6xl">
          <button
            onClick={() => setSelectedResource(null)}
            className="flex items-center space-x-2 mb-6 text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft size={20} />
            <span>Back to resources</span>
          </button>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:space-x-8">
                <div className="lg:w-2/3">
                  <div className="flex items-start space-x-6 mb-8">
                    <div className="text-8xl">{selectedResource.thumbnail}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                          {selectedResource.code}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {selectedResource.category}
                        </span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedResource.title}</h1>
                      <p className="text-lg text-gray-600 mb-4">by {selectedResource.author}</p>
                      <p className="text-gray-700 leading-relaxed mb-6">{selectedResource.description}</p>
                      
                      <div className="flex items-center space-x-6 text-gray-600">
                        <div className="flex items-center space-x-2">
                          {selectedResource.type === 'music' || selectedResource.type === 'movie' ? (
                            <>
                              <Play size={16} />
                              <span>{selectedResource.duration}</span>
                            </>
                          ) : selectedResource.type === 'book' ? (
                            <>
                              <BookOpen size={16} />
                              <span>{selectedResource.pages} pages</span>
                            </>
                          ) : (
                            <>
                              <Activity size={16} />
                              <span>{selectedResource.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Media Player */}
                  <div className="bg-gray-900 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Now {selectedResource.type === 'music' ? 'Playing' : selectedResource.type === 'movie' ? 'Watching' : 'Reading'}</h4>
                      <div className="text-sm text-gray-300">
                        {selectedResource.type === 'book' ? 'Page 1' : '0:00'}
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 h-2 rounded-full mb-4">
                      <div className="bg-teal-400 h-2 rounded-full w-0"></div>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-6">
                      <button className="p-3 rounded-full hover:bg-gray-700 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 6h2v12H6zm10 0h2v12h-2z"/>
                        </svg>
                      </button>
                      <button className="p-4 bg-teal-600 rounded-full hover:bg-teal-700 transition-colors">
                        <Play size={20} fill="white" />
                      </button>
                      <button className="p-3 rounded-full hover:bg-gray-700 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/3 mt-8 lg:mt-0">
                  <div className="bg-gray-50/80 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Resource Actions</h3>
                    
                    <div className="space-y-3">
                      <button className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center space-x-2">
                        <Play size={18} />
                        <span>Play / View</span>
                      </button>
                      
                      <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2">
                        <Download size={18} />
                        <span>Download</span>
                      </button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Recommended Duration</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {selectedResource.type === 'music' || selectedResource.type === 'activity' 
                          ? `Listen/practice for ${selectedResource.duration} daily`
                          : selectedResource.type === 'book'
                          ? `Read 10-15 pages per session`
                          : `Watch when you need inspiration`}
                      </p>
                      
                      <h4 className="font-medium text-gray-900 mb-3">Related Resources</h4>
                      <div className="space-y-2">
                        {resources.filter(r => r.category === selectedResource.category && r.id !== selectedResource.id).slice(0, 2).map(resource => (
                          <button
                            key={resource.id}
                            onClick={() => setSelectedResource(resource)}
                            className="w-full text-left p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{resource.thumbnail}</span>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{resource.title}</p>
                                <p className="text-xs text-gray-600">{resource.code}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 bg-gradient-calm">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Mental Wellness Resources</h1>
          
          {/* Search Bar */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/50 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by code (e.g., MUS-101) or title..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-white/70 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setSelectedResource(resource)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{resource.thumbnail}</div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                      {resource.code}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-2">by {resource.author}</p>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{resource.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    {resource.type === 'music' || resource.type === 'movie' ? (
                      <>
                        <Play size={14} />
                        <span className="text-sm">{resource.duration}</span>
                      </>
                    ) : resource.type === 'book' ? (
                      <>
                        <BookOpen size={14} />
                        <span className="text-sm">{resource.pages} pages</span>
                      </>
                    ) : (
                      <>
                        <Activity size={14} />
                        <span className="text-sm">{resource.duration}</span>
                      </>
                    )}
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                    {resource.category}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResource(resource);
                    }}
                    className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <Play size={14} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;