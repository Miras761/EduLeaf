import { useState } from 'react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Question, Quiz } from '../types';
import { useAuthState } from '../hooks/useAuthState';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface EditorProps {
  onNavigate: (screen: 'home' | 'player', quizId?: string) => void;
}

export default function Editor({ onNavigate }: EditorProps) {
  const { user } = useAuthState();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], correctOptionIndex: 0 }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddQuestion = () => {
    if (questions.length >= 50) {
      alert("Максимум 50 вопросов.");
      return;
    }
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOptionIndex: 0 }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) return;
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionSelect = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOptionIndex = oIndex;
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!user) {
      alert("Необходимо войти в систему.");
      return;
    }
    if (!title.trim()) {
      alert("Пожалуйста, введите название игры.");
      return;
    }
    
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Вопрос ${i + 1} не может быть пустым.`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          alert(`Вариант ответа ${j + 1} в вопросе ${i + 1} не может быть пустым.`);
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      const quizData = {
        title: title.trim(),
        creatorId: user.uid,
        questions: questions,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'quizzes'), quizData);
      onNavigate('player', docRef.id);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Ошибка при сохранении игры.");
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => onNavigate('home')}
        className="flex items-center text-gray-500 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Назад на главную
      </button>

      <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden mb-8">
        <div className="bg-emerald-500 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Создание викторины</h1>
          <p className="text-emerald-100">Заполните вопросы и отметьте правильные ответы.</p>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Название игры
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Биология 5 класс"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-lg"
              maxLength={100}
            />
          </div>

          <div className="space-y-8">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Вопрос {qIndex + 1}</h3>
                  {questions.length > 1 && (
                    <button 
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-red-400 hover:text-red-600 p-2"
                      title="Удалить вопрос"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  placeholder="Введите вопрос..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 outline-none transition-colors mb-6"
                  maxLength={500}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {q.options.map((opt, oIndex) => (
                    <div 
                      key={oIndex} 
                      className={`flex items-center rounded-xl border-2 p-2 transition-colors ${
                        q.correctOptionIndex === oIndex 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 bg-white hover:border-emerald-200'
                      }`}
                    >
                      <button
                        onClick={() => handleCorrectOptionSelect(qIndex, oIndex)}
                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-3 flex items-center justify-center ${
                          q.correctOptionIndex === oIndex 
                            ? 'border-emerald-500 bg-emerald-500' 
                            : 'border-gray-300'
                        }`}
                      >
                        {q.correctOptionIndex === oIndex && <div className="w-2 h-2 bg-white rounded-full" />}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Вариант ${oIndex + 1}`}
                        className="w-full bg-transparent outline-none text-gray-800"
                        maxLength={100}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              onClick={handleAddQuestion}
              className="flex items-center text-emerald-600 font-bold hover:bg-emerald-50 px-4 py-2 rounded-xl transition-colors w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить вопрос
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 w-full sm:w-auto justify-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? 'Сохранение...' : 'Сохранить и играть'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
