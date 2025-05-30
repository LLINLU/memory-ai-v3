import { useMemo } from 'react';

export const useMessageGrouping = (messages: any[], isNodeCreation: boolean) => {
  // Group consecutive system messages from the same user
  const groupedMessages = useMemo(() => {
    return messages.reduce((acc: any[], message: any, index: number) => {
      // If it's the first message or user changes, create a new group
      if (index === 0 || messages[index - 1].isUser !== message.isUser) {
        acc.push({...message, isGroup: true});
      } else {
        // Otherwise add to the content of the last message
        const lastMessage = acc[acc.length - 1];
        lastMessage.content = Array.isArray(lastMessage.content) 
          ? [...lastMessage.content, message.content]
          : [lastMessage.content, message.content];
      }
      return acc;
    }, []);
  }, [messages]);

  // Filter out node suggestion messages if not in node creation mode
  const filteredMessages = useMemo(() => {
    return isNodeCreation 
      ? groupedMessages 
      : groupedMessages.filter(message => 
          !(message.content?.includes('了解しました — あなたの考えに合ったノードを一緒に作成しましょう') 
            || message.suggestion)
        );
  }, [groupedMessages, isNodeCreation]);

  // Check if there are any substantive messages (excluding welcome messages)
  // Also check for node creation messages that start with "👋 新しいノードを作成しましょう"
  const hasSubstantiveMessages = useMemo(() => {
    return messages.some(m => {
      if (!m.content) return false;
      
      // Check for node creation messages with new format
      const hasNodeCreationMessage = typeof m.content === 'string' && 
        m.content.includes('👋 新しいノードを作成しましょう');
      
      // Check for other substantive messages (excluding generic welcome)
      const hasOtherMessage = !m.content.includes('何かお手伝いできることはありますか');
      
      return hasNodeCreationMessage || hasOtherMessage;
    });
  }, [messages]);

  return { filteredMessages, hasSubstantiveMessages };
};
