import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ErrorConsole() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload Error Management Console</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Progress value={67} className="w-full" />
          <div className="space-y-2">
            <h3 className="font-semibold">Error Summary:</h3>
            <div className="text-sm">
              <p>Total Records: 1000</p>
              <p>Successful: 670</p>
              <p>Failed: 330</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-red-600">Validation Errors:</h3>
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-600">
                Row 43: Invalid supplier_item_name format
              </p>
              <p className="text-sm text-red-600">
                Row 122: process_description missing
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">Record Details</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier Item Name:</label>
              <Input />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Process Description:
              </label>
              <Textarea />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quality Check:</label>
              <Input />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Conversion Ratio:</label>
              <Input type="number" />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="success">Apply Fixes</Button>
            <Button variant="destructive">Cancel Upload</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
