import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UploadCSV() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Upload Successful!",
      description: `${selectedFile.name} uploaded and processed successfully`
    });
    
    setIsUploading(false);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Upload Questions CSV</h1>
        <p className="text-muted-foreground">Import multiple choice questions from a CSV file</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload CSV File
            </CardTitle>
            <CardDescription>Select and upload your questions file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Choose CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>

            {selectedFile && (
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">{selectedFile.name}</p>
                    <p className="text-sm text-green-600">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload Questions'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              CSV Format Guide
            </CardTitle>
            <CardDescription>Required format for your CSV file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Required Columns:</p>
                <ul className="text-sm space-y-1">
                  <li>• <strong>question</strong> - The question text</li>
                  <li>• <strong>option_a</strong> - First option</li>
                  <li>• <strong>option_b</strong> - Second option</li>
                  <li>• <strong>option_c</strong> - Third option</li>
                  <li>• <strong>option_d</strong> - Fourth option</li>
                  <li>• <strong>correct_answer</strong> - (a, b, c, or d)</li>
                  <li>• <strong>time_limit</strong> - (seconds, optional)</li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">Example CSV:</p>
                <pre className="text-xs text-blue-700 overflow-x-auto">
{`question,option_a,option_b,option_c,option_d,correct_answer,time_limit
"What is 2+2?","3","4","5","6","b","30"
"Capital of India?","Delhi","Mumbai","Kolkata","Chennai","a","25"`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}