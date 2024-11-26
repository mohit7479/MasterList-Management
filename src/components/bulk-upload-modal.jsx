import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useState } from "react";

export function BulkUploadModal({ open, onClose }) {
  const [skipHeader, setSkipHeader] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Data Upload</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-sm text-gray-600">Drag and drop files here</p>
              <p className="text-sm text-gray-500">or</p>
              <Button variant="secondary" className="mt-2">
                Browse Files
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Supported file types: .csv
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="skip-header"
              checked={skipHeader}
              onCheckedChange={setSkipHeader}
            />
            <Label htmlFor="skip-header">Skip header row</Label>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Upload</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
