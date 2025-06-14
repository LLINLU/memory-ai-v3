import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Calendar, Users, BookOpen } from "lucide-react";
import { useEnrichedData } from "@/hooks/useEnrichedData";

interface EnrichedDataDisplayProps {
  nodeId: string | null;
}

export const EnrichedDataDisplay: React.FC<EnrichedDataDisplayProps> = ({
  nodeId,
}) => {
  const { papers, useCases, loading, error } = useEnrichedData(nodeId);

  if (!nodeId) {
    return (
      <div className="p-4 text-center text-gray-500">
        ノードを選択してください
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">エラー: {error}</div>;
  }

  if (papers.length === 0 && useCases.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        このノードには追加データがありません
      </div>
    );
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="papers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="papers" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            論文 ({papers.length})
          </TabsTrigger>
          <TabsTrigger value="usecases" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            事例 ({useCases.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="papers" className="space-y-4">
          {papers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              論文データはありません
            </div>
          ) : (
            papers.map((paper) => (
              <Card
                key={paper.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-medium leading-5">
                      {paper.title}
                    </CardTitle>
                    <Badge
                      variant={
                        paper.region === "international"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {paper.region === "international" ? "国際" : "国内"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {paper.authors} • {paper.journal}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-gray-700 line-clamp-3">
                    {paper.abstract}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {paper.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {paper.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{paper.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {paper.date}
                    </div>
                    <div>被引用数: {paper.citations}</div>
                  </div>

                  {(paper.url || paper.doi) && (
                    <div className="flex gap-2">
                      {paper.url && (
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3" />
                          論文を見る
                        </a>
                      )}
                      {paper.doi && (
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          DOI: {paper.doi}
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="usecases" className="space-y-4">
          {useCases.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              事例データはありません
            </div>
          ) : (
            useCases.map((useCase) => (
              <Card
                key={useCase.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-medium leading-5">
                      {useCase.title}
                    </CardTitle>
                    <Badge variant="outline">{useCase.releases}件</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-gray-700">{useCase.description}</p>

                  {useCase.pressReleases.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600">
                        関連プレスリリース:
                      </div>
                      {useCase.pressReleases
                        .slice(0, 3)
                        .map((release, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-2 rounded text-xs"
                          >
                            <a
                              href={release.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {release.title}
                            </a>
                            {release.date && (
                              <div className="text-gray-500 mt-1">
                                {release.date}
                              </div>
                            )}
                          </div>
                        ))}
                      {useCase.pressReleases.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{useCase.pressReleases.length - 3}件の追加リリース
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
