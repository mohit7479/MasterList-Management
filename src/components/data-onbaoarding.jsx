"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react"; // Assuming you're using lucide-react for icons

export function DataOnboarding() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Data Onboarding</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">BOMs</span>
          <div className="flex items-center space-x-1">
            <span className="font-bold">28</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">35</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Items Master</TabsTrigger>
          <TabsTrigger value="processes">Processes</TabsTrigger>
          <TabsTrigger value="bom">BOM</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardContent className="p-0">
                {/* Loading State */}
                <div className="flex justify-center items-center h-60">
                  <Loader className="animate-spin text-gray-500" />
                  <span className="ml-2">Loading...</span>
                </div>

                {/* Table with Data */}
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-left font-medium">ITEM NAME</th>
                      <th className="p-4 text-left font-medium">TYPE</th>
                      <th className="p-4 text-left font-medium">UOM</th>
                      <th className="p-4 text-left font-medium">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">Steel Pipe Grade A</td>
                      <td className="p-4">Component</td>
                      <td className="p-4">KG</td>
                      <td className="p-4">
                        <Badge variant="warning">Pending</Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Aluminum Plate</td>
                      <td className="p-4">Raw Material</td>
                      <td className="p-4">Sheet</td>
                      <td className="p-4">
                        <Badge variant="success">Completed</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
