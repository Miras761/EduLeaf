import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, RefreshCcw } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Quiz } from '../types';

interface PlayerProps {
  quizId: string;
  onNavigate: (screen: 'home') => void;
}

// Demo quiz data
const DEMO_QUIZ: Quiz = {
  title: "Демо-викторина по биологии",
  creatorId: "demo",
  createdAt: new Date(),
  questions: [
    {
      question: "Какая часть клетки является ее 'энергетической станцией'?",
      options: ["Ядро", "Митохондрия", "Рибосома", "Вакуоль"],
      correctOptionIndex: 1
    },
    {
      question: "Как называется процесс образования органических веществ на свету у растений?",
      options: ["Дыхание", "Транспирация", "Фотосинтез", "Пищеварение"],
      correctOptionIndex: 2
    },
    {
      question: "Сколько хромосом в обычной клетке человека?",
      options: ["46", "23", "48", "44"],
      correctOptionIndex: 0
    }
  ]
};

export default function Player({ quizId, onNavigate }: PlayerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (quizId === 'demo') {
        setQuiz(DEMO_QUIZ);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'quizzes', quizId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setQuiz(docSnap.data() as Quiz);
        } else {
          setError('Игра не найдена.');
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError('Ошибка при загрузке игры.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionClick = (index: number) => {
    if (isAnswered || !quiz) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    const isCorrect = index === quiz.questions[currentQuestionIndex].correctOptionIndex;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    // Wait a bit before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <button 
          onClick={() => onNavigate('home')}
          className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center border-2 border-emerald-100">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Игра завершена!</h2>
          <p className="text-xl text-gray-600 mb-8">
            Ваш результат: <span className="font-bold text-emerald-600">{score}</span> из {quiz.questions.length}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={restartGame}
              className="flex items-center justify-center bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Играть снова
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center justify-center bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center text-gray-500 hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Выйти
        </button>
        
        <div className="bg-white px-6 py-2 rounded-xl shadow-sm font-bold text-lg text-emerald-800 border border-emerald-100">
          Очки: <span className="text-emerald-600">{score}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-emerald-50">
        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-2">
          <div 
            className="bg-emerald-500 h-2 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <span className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
              Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-400 hover:shadow-md hover:-translate-y-1";
              
              if (isAnswered) {
                if (index === currentQuestion.correctOptionIndex) {
                  buttonClass = "bg-emerald-500 border-emerald-600 text-white shadow-lg scale-[1.02]";
                } else if (index === selectedOption) {
                  buttonClass = "bg-red-500 border-red-600 text-white shadow-lg scale-[0.98]";
                } else {
                  buttonClass = "bg-gray-100 border-gray-200 text-gray-400 opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={isAnswered}
                  className={`p-6 rounded-2xl text-xl font-bold transition-all duration-300 transform ${buttonClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
