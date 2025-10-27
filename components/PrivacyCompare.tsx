'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const sampleUser = {
  name: 'Alice Johnson',
  email: 'alice@example.com',
  age: 28,
  salary: 75000,
  creditScore: 720,
  address: '123 Main St, San Francisco, CA',
  ssn: '123-45-6789',
  medicalHistory: 'Type 2 Diabetes',
};

export function PrivacyCompare() {
  const [activeTab, setActiveTab] = useState('exposed');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          With vs Without Privacy
        </CardTitle>
        <CardDescription>
          See how zero-knowledge proofs minimize data exposure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exposed" className="gap-2">
              <Eye className="h-4 w-4" />
              Without ZK
            </TabsTrigger>
            <TabsTrigger value="private" className="gap-2">
              <EyeOff className="h-4 w-4" />
              With ZK
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exposed" className="space-y-4 pt-4">
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
              <p className="mb-3 text-sm font-semibold text-red-300">
                All data exposed
              </p>
              <div className="grid gap-2 text-sm">
                {Object.entries(sampleUser).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between rounded-lg bg-gray-800/50 p-2"
                  >
                    <span className="font-medium capitalize text-gray-300">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-gray-400">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="private" className="space-y-4 pt-4">
            <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
              <p className="mb-3 text-sm font-semibold text-green-300">
                Minimal disclosure with ZK proofs
              </p>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between rounded-lg bg-gray-800/50 p-2">
                  <span className="font-medium text-gray-300">Age:</span>
                  <Badge variant="success">Over 18 ✓</Badge>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-800/50 p-2">
                  <span className="font-medium text-gray-300">Credit Score:</span>
                  <Badge variant="success">Above 700 ✓</Badge>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-800/50 p-2">
                  <span className="font-medium text-gray-300">Identity:</span>
                  <Badge variant="success">Verified ✓</Badge>
                </div>
                <div className="mt-2 rounded-lg border border-gray-700 bg-gray-800/30 p-3">
                  <p className="text-xs text-gray-400">
                    🔒 All sensitive details (name, SSN, exact age, exact score, medical history)
                    remain hidden while still proving required properties.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

