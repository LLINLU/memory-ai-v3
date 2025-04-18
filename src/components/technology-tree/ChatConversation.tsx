
interface ChatConversationProps {
  chatMessages: any[];
}

export const ChatConversation = ({ chatMessages }: ChatConversationProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {chatMessages.map((message, index) => (
        <div 
          key={index} 
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
          <div 
            className={`inline-block max-w-[85%] p-4 rounded-2xl ${
              message.isUser 
                ? 'bg-blue-100 text-blue-900' 
                : 'bg-white text-gray-800'
            }`}
          >
            <p className="text-base leading-relaxed whitespace-pre-line">
              {message.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
