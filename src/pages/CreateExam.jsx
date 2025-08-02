import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Textarea, Badge } from '@/components/ui/core-components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/form-components';
import { Plus, Trash2, Clock, Settings, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CreateExam() {
  const { toast } = useToast();
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [examMode, setExamMode] = useState('normal');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    timeLimit: 30
  });

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion.options.some(opt => !opt.trim())) {
      toast({
        title: "Error", 
        description: "Please fill all options",
        variant: "destructive"
      });
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now().toString(),
    };

    setQuestions(prev => [...prev, newQuestion]);
    setCurrentQuestion({
      id: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      timeLimit: 30
    });

    toast({
      title: "Question Added",
      description: `Question ${questions.length + 1} added successfully`
    });
  };

  const removeQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Question Removed",
      description: "Question removed successfully"
    });
  };

  const updateOption = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const createExam = () => {
    if (!examTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter exam title",
        variant: "destructive"
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to backend
    toast({
      title: "Exam Created!",
      description: `"${examTitle}" has been created with ${questions.length} questions`
    });

    // Reset form
    setExamTitle('');
    setExamDescription('');
    setQuestions([]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create New Exam</h1>
        <p className="text-muted-foreground">Set up a new examination with custom questions</p>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Exam Details
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Add Questions
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Preview & Create
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Configuration</CardTitle>
              <CardDescription>Basic information about the examination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="e.g., Data Structures Quiz"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min="1"
                    max="180"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={examDescription}
                  onChange={(e) => setExamDescription(e.target.value)}
                  placeholder="Brief description about the exam"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base">Exam Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    {examMode === 'normal' 
                      ? 'Students can navigate between questions freely' 
                      : 'Each question has individual time limits'}
                  </p>
                </div>
                <Select value={examMode} onValueChange={(value) => setExamMode(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="timed">Timed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Question Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
                <CardDescription>Create a multiple choice question</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter your question here..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Options</Label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct-answer"
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                        />
                        <span className="text-sm font-medium">Option {index + 1}</span>
                      </div>
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">
                    Select the radio button for the correct answer
                  </p>
                </div>

                {examMode === 'timed' && (
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={currentQuestion.timeLimit}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                      min="10"
                      max="300"
                    />
                  </div>
                )}

                <Button onClick={addQuestion} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>

            {/* Questions List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Added Questions
                  <Badge variant="secondary">{questions.length}</Badge>
                </CardTitle>
                <CardDescription>Review and manage your questions</CardDescription>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No questions added yet</p>
                    <p className="text-sm">Start by adding your first question</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {questions.map((q, index) => (
                      <div key={q.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">Question {index + 1}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{q.question}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(q.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-1">
                          {q.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2 text-sm">
                              <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center ${
                                q.correctAnswer === optIndex 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>

                        {examMode === 'timed' && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{q.timeLimit}s time limit</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Preview</CardTitle>
              <CardDescription>Review your exam before creating</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-lg font-semibold">{examTitle || 'Untitled Exam'}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-lg">{duration} minutes</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Questions</Label>
                  <p className="text-lg">{questions.length}</p>
                </div>
              </div>

              {examDescription && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-muted-foreground">{examDescription}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Mode</Label>
                <Badge variant={examMode === 'timed' ? 'destructive' : 'default'}>
                  {examMode === 'timed' ? 'Timed Questions' : 'Normal Navigation'}
                </Badge>
              </div>

              <div className="pt-6 border-t">
                <Button 
                  onClick={createExam} 
                  size="lg" 
                  className="w-full md:w-auto"
                  disabled={!examTitle.trim() || questions.length === 0}
                >
                  Create Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}