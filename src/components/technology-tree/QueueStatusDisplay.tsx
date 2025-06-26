import React, { useState, useEffect } from "react";
import {
  getQueueStatus,
  getQueueListFormatted,
} from "@/services/enrichmentQueue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QueueStatusDisplayProps {
  onNodeSelect?: (nodeId: string) => void;
}

export const QueueStatusDisplay: React.FC<QueueStatusDisplayProps> = ({
  onNodeSelect,
}) => {
  const [status, setStatus] = useState(getQueueStatus());
  const [isVisible, setIsVisible] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [activeTab, setActiveTab] = useState<"summary" | "queue">("summary");

  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus = getQueueStatus();
      setStatus(newStatus);
      setLastUpdate(Date.now());
    }, 500); // Check more frequently for better debugging

    return () => clearInterval(interval);
  }, []);

  // Only show when there's activity or when explicitly toggled
  const hasActivity =
    status.queueLength > 0 ||
    status.processing.papers > 0 ||
    status.processing.useCases > 0 ||
    !status.apiHealthy;

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Queue Status
        </button>
      </div>
    );
  }

  const queueList = getQueueListFormatted();
  queueList.forEach((item) => console.log(item));

  function QueList() {
    // Separate lists
    const waiting = queueList.filter((item) => item.status === "waiting");
    const inprogress = queueList.filter((item) => item.status === "fetching");
    const done = queueList.filter((item) => item.status === "done");

    // Section generator
    const Section = ({ title, items, renderItem }) =>
      items.length > 0 && (
        <>
          <div className="pt-2 pb-1 font-bold text-[11px] text-gray-500 uppercase">
            {title}
          </div>
          {items.map(renderItem)}
          <div className="h-2" />
        </>
      );

    const renderQueueItem = (item, index, section) => {
      const maxTime = item.type === "論文検索" ? 20 : 180;
      const percent =
        section === "done"
          ? 100
          : Math.min(100, Math.floor((item.elapsedSeconds / maxTime) * 100));

      const handleItemClick = () => {
        if (onNodeSelect && item.nodeId) {
          onNodeSelect(item.nodeId);
        }
      };

      return (
        <div
          key={index}
          className={`border-b pb-2 pt-1 flex items-center justify-between gap-2 rounded-sm px-2 ${
            onNodeSelect && item.nodeId
              ? "cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 active:bg-blue-100"
              : "bg-white"
          }`}
          onClick={handleItemClick}
          title={
            onNodeSelect && item.nodeId
              ? `クリックして「${item.name}」ノードに移動`
              : ""
          }
        >
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-1">
              <span
                className={`text-xs ${
                  item.type === "論文検索" ? "text-blue-600" : "text-green-600"
                }`}
              >
                {item.type}
              </span>
              {onNodeSelect && item.nodeId && (
                <span className="text-blue-500 text-xs" title="クリック可能">
                  ↗
                </span>
              )}
            </div>
            <span className="text-gray-800 font-medium">{item.name}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            {/* WAITING */}
            {section === "waiting" && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-[10px] font-semibold">
                待機中
              </span>
            )}
            {/* IN PROGRESS */}
            {section === "fetching" && (
              <>
                <div className="w-8 h-8 relative">
                  <svg
                    className="absolute top-0 left-0 w-full h-full"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3.8"
                      fill="none"
                      d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      stroke="currentColor"
                      strokeWidth="3.8"
                      strokeDasharray={`${percent}, 100`}
                      fill="none"
                      d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[10px] text-gray-700">
                    {percent}%
                  </div>
                </div>
                <span className="text-gray-400 text-[10px]">
                  {item.elapsedSeconds}s
                </span>
              </>
            )}
            {/* DONE */}
            {section === "done" && (
              <div className="w-8 h-8 relative">
                <svg
                  className="absolute top-0 left-0 w-full h-full"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3.8"
                    fill="none"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    stroke="currentColor"
                    strokeWidth="3.8"
                    strokeDasharray={`100, 100`}
                    fill="none"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[10px] text-blue-600 font-bold">
                  100%
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <CardContent className="max-h-64 overflow-y-auto text-xs space-y-2">
        <Section
          title="検索待ち"
          items={waiting}
          renderItem={(item, idx) => renderQueueItem(item, idx, "waiting")}
        />
        <Section
          title="検索中"
          items={inprogress}
          renderItem={(item, idx) => renderQueueItem(item, idx, "fetching")}
        />
        <Section
          title="検索完了"
          items={done}
          renderItem={(item, idx) => renderQueueItem(item, idx, "done")}
        />
      </CardContent>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-64">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">検索状況</CardTitle>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 text-xs"
            >
              ×
            </button>
          </div>
          <div className="flex gap-1 text-xs">
            <button
              className={`px-2 py-1 rounded ${
                activeTab === "queue" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("queue")}
            >
              各検索
            </button>
            <button
              className={`px-2 py-1 rounded ${
                activeTab === "summary" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              全体
            </button>
          </div>
        </CardHeader>
        {activeTab === "summary" && (
          <CardContent className="text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span>検索中</span>
              <Badge
                variant={
                  status.processing.papers + status.processing.useCases > 0
                    ? "default"
                    : "secondary"
                }
              >
                {status.processing.papers + status.processing.useCases}件
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>論文検索実行中</span>
              <Badge
                variant={status.processing.papers > 0 ? "default" : "secondary"}
              >
                {status.processing.papers}件 / {status.maxConcurrent.papers}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span>事例検索実行中</span>
              <Badge
                variant={
                  status.processing.useCases > 0 ? "default" : "secondary"
                }
              >
                {status.processing.useCases}件 / {status.maxConcurrent.useCases}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>検索待機</span>
              <Badge variant={status.queueLength > 0 ? "default" : "secondary"}>
                {status.queueLength}件
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>API Health:</span>
              <Badge variant={status.apiHealthy ? "default" : "destructive"}>
                {status.apiHealthy ? "Healthy" : "Failed"}
              </Badge>
            </div>

            {(status as any).consecutiveFailures > 0 && (
              <div className="flex items-center justify-between">
                <span>Failures:</span>
                <Badge variant="destructive">
                  {(status as any).consecutiveFailures}
                </Badge>
              </div>
            )}

            {status.lastHealthCheck > 0 && (
              <div className="text-gray-500 text-xs">
                Last check:{" "}
                {new Date(status.lastHealthCheck).toLocaleTimeString()}
              </div>
            )}

            <div className="text-gray-500 text-xs">
              Updated: {new Date(lastUpdate).toLocaleTimeString()}
            </div>
          </CardContent>
        )}
        {activeTab === "queue" && QueList()}
      </Card>
    </div>
  );
};
