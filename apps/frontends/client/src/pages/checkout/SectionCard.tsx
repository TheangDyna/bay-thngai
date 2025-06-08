// src/components/checkout/SectionCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children
}) => (
  <Card className="shadow-sm rounded-lg h-min">
    <CardHeader className="border-b px-6 py-4">
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="px-6 py-6">{children}</CardContent>
  </Card>
);
