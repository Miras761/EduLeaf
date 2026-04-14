import { Plus, PlayCircle, LayoutGrid, Dices, Target } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';

interface HomeProps {
  onNavigate: (screen: 'editor' | 'player', quizId?: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { user } = useAuthState();

  const templates = [
    {
      id: 'quiz',
      title: 'Викторина (Quiz)',
      description: 'Серия вопросов с множественным выбором. Идеально для проверки знаний.',
      icon: <Target className="w-8 h-8 text-emerald-500" />,
      color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      available: true,
    },
    {
      id: 'match',
      title: 'Найди пару (Match up)',
      description: 'Соединяйте понятия и их определения. Отлично для изучения терминов.',
      icon: <LayoutGrid className="w-8 h-8 text-lime-500" />,
      color: 'bg-lime-50 border-lime-200 hover:border-lime-400',
      available: false,
    },
    {
      id: 'spin',
      title: 'Колесо фортуны',
      description: 'Случайный выбор темы или вопроса. Добавляет элемент случайности в урок.',
      icon: <Dices className="w-8 h-8 text-teal-500" />,
      color: 'bg-teal-50 border-teal-200 hover:border-teal-400',
      available: false,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Создавайте интерактивные уроки играючи!
          </h1>
          <p className="text-lg sm:text-xl text-emerald-50 mb-8">
            EduLeaf помогает учителям превращать скучные тесты в увлекательные игры за пару минут.
          </p>
          <button 
            onClick={() => {
              if (user) {
                onNavigate('editor');
              } else {
                alert('Пожалуйста, войдите в систему, чтобы создать игру.');
              }
            }}
            className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-bold text-lg shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Plus className="w-6 h-6" />
            <span>Создать игру</span>
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 opacity-20">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18,97.1,-2.4C97.4,13.2,92,28.9,82.8,42.1C73.6,55.3,60.6,66.1,46.3,73.6C32,81.1,16,85.3,0.3,84.8C-15.4,84.3,-30.8,79.1,-44.6,71.1C-58.4,63.1,-70.6,52.3,-79.1,39.1C-87.6,25.9,-92.4,10.3,-91.7,-5.1C-91,-20.5,-84.8,-35.7,-75.2,-48.1C-65.6,-60.5,-52.6,-70.1,-38.6,-77.4C-24.6,-84.7,-9.6,-89.7,3.1,-94.1C15.8,-98.5,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Шаблоны игр</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`border-2 rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col h-full ${template.color} ${!template.available ? 'opacity-60 grayscale' : 'hover:shadow-xl hover:-translate-y-1'}`}
              onClick={() => {
                if (!template.available) {
                  alert('Этот шаблон находится в разработке!');
                  return;
                }
                if (user) {
                  onNavigate('editor');
                } else {
                  alert('Пожалуйста, войдите в систему, чтобы создать игру.');
                }
              }}
            >
              <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mb-6">
                {template.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{template.title}</h3>
              <p className="text-gray-600 flex-grow mb-6">{template.description}</p>
              
              <div className="mt-auto">
                {template.available ? (
                  <span className="inline-flex items-center text-emerald-600 font-semibold group">
                    Создать <Plus className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                ) : (
                  <span className="inline-flex items-center text-gray-500 font-medium">
                    Скоро...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Demo Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Попробуйте демо</h2>
        <div 
          onClick={() => onNavigate('player', 'demo')}
          className="bg-white border-2 border-emerald-100 rounded-3xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-100 p-3 rounded-2xl">
              <PlayCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Демо-викторина по биологии</h3>
              <p className="text-gray-500">5 вопросов • Создано EduLeaf</p>
            </div>
          </div>
          <button className="hidden sm:block bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
            Играть
          </button>
        </div>
      </div>
    </div>
  );
}
