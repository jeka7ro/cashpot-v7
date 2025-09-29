import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Paperclip, X, FileText, Download } from 'lucide-react';

export default function AttachmentUpload({ 
  attachments = [], 
  onAdd, 
  onRemove, 
  onDownload,
  maxFiles = 10,
  maxSizeMB = 10,
  acceptedTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
}) {
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (attachments.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > maxSizeMB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed ${maxSizeMB}MB limit`);
      return;
    }
    
    const newAttachments = await Promise.all(files.map(async (file) => {
      // Convert file to base64 for storage
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: base64, // Store as url for consistency
        data: base64 // Keep data for backward compatibility
      };
    }));
    
    onAdd(newAttachments);
    
    // Reset input
    e.target.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm">Attachments</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-3">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          accept={acceptedTypes}
        />
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors"
        >
          <Paperclip className="w-5 h-5 text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">
            Upload files ({acceptedTypes})
          </span>
        </label>
      </div>
      
      {attachments.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Files ({attachments.length})</div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-2 bg-muted rounded text-xs"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{attachment.name}</div>
                    <div className="text-muted-foreground">
                      {formatFileSize(attachment.size)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {onDownload && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Create download from base64 data or url
                        const link = document.createElement('a');
                        link.href = attachment.url || attachment.data;
                        link.download = attachment.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                      title="Download"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(attachment.id)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
