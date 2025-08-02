import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  AlertCircle,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock exam data
const mockExam = {
  id: 1,
  title: 'Data Structures Quiz',
  duration: 3600, // 60 minutes in seconds
  mode: 'normal', // or 'timed'
  questions: [
    {
      id: 1,
      question: 'What is the time complexity of accessing an element in an array by index?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      timeLimit: 30, // seconds for timed mode
    },
    {
      id: 2,
      question: 'Which data structure follows Last In First Out (LIFO) principle?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      timeLimit: 25,
    },
    {
      id: 3,
      question: 'What is the worst-case time complexity of Quick Sort?',
      options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
      timeLimit: 45,
    },
    {
      id: 4,
      question: 'In a binary tree, what is the maximum number of nodes at level k?',
      options: ['2^k', '2^(k-1)', 'k²', '2k'],
      timeLimit: 35,
    },
    {
      id: 5,
      question: 'Which sorting algorithm has the best average-case time complexity?',
      options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'],
      timeLimit: 30,
    },
  ],
};

export default function ExamInterface() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(mockExam.duration);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(mockExam.questions[0].timeLimit);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examMode] = useState<'normal' | 'timed'>('normal'); // Can be changed to 'timed'

  // Anti-cheating measures
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast({
          title: "Warning!",
          description: "Tab switching detected. This action has been logged.",
          variant: "destructive",
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common shortcuts
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        toast({
          title: "Action Blocked",
          description: "Copy/paste and developer tools are disabled during exam.",
          variant: "destructive",
        });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [toast]);

  // Overall timer
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted]);

  // Question timer for timed mode
  useEffect(() => {
    if (examMode === 'timed' && questionTimeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setQuestionTimeLeft(prev => {
          if (prev <= 1) {
            handleNextQuestion();
            return mockExam.questions[Math.min(currentQuestion + 1, mockExam.questions.length - 1)]?.timeLimit || 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examMode, questionTimeLeft, currentQuestion, isSubmitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockExam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      if (examMode === 'timed') {
        setQuestionTimeLeft(mockExam.questions[currentQuestion + 1].timeLimit);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0 && examMode === 'normal') {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    toast({
      title: "Exam Submitted!",
      description: "Your answers have been recorded successfully.",
    });
    
    // Simulate submission delay
    setTimeout(() => {
      navigate('/results');
    }, 2000);
  };

  const currentQ = mockExam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockExam.questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Exam Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Your answers have been recorded successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to results...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{mockExam.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {mockExam.questions.length}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {examMode === 'timed' && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <Timer className="w-4 h-4" />
                    <span className="font-mono">{formatTime(questionTimeLeft)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
                
                <Button 
                  onClick={handleSubmitExam}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Exam
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <Card className="h-fit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  Question {currentQuestion + 1}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFlag(currentQuestion)}
                  className={flaggedQuestions.has(currentQuestion) ? 'bg-yellow-100 border-yellow-300' : ''}
                >
                  <Flag className="w-4 h-4" />
                  {flaggedQuestions.has(currentQuestion) ? 'Flagged' : 'Flag'}
                </Button>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg">{currentQ.question}</p>
                
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                        answers[currentQuestion] === index 
                          ? 'bg-primary/10 border-primary' 
                          : 'border-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={index}
                        checked={answers[currentQuestion] === index}
                        onChange={() => handleAnswerSelect(currentQuestion, index)}
                        className="mr-3"
                      />
                      <span className="flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0 || examMode === 'timed'}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === mockExam.questions.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Navigator */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {mockExam.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => examMode === 'normal' && setCurrentQuestion(index)}
                    disabled={examMode === 'timed'}
                    className={`
                      w-10 h-10 rounded-lg text-sm font-medium transition-colors relative
                      ${currentQuestion === index 
                        ? 'bg-primary text-primary-foreground' 
                        : answers[index] !== undefined
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-muted hover:bg-accent'
                      }
                      ${examMode === 'timed' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    {index + 1}
                    {flaggedQuestions.has(index) && (
                      <Flag className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Progress Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Answered:</span>
                  <Badge variant="default">{answeredQuestions}/{mockExam.questions.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Flagged:</span>
                  <Badge variant="secondary">{flaggedQuestions.size}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Remaining:</span>
                  <Badge variant="outline">{mockExam.questions.length - answeredQuestions}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {examMode === 'timed' && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-orange-700 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold">Timed Mode</span>
                </div>
                <p className="text-sm text-orange-600">
                  Each question has a time limit. You cannot go back to previous questions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}