
import { useEffect } from "react";

export const useResearchAreaObserver = (
  conversationHistory: Array<{ type: "system" | "user", content: React.ReactNode | string, questionType?: string }>,
  onResearchAreaVisible?: (isVisible: boolean) => void
) => {
  // Track research area visibility
  useEffect(() => {
    if (!onResearchAreaVisible) return;
    
    // Find all elements that contain the research area section
    setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('.conversation-message'))
        .filter(el => el.textContent?.includes('潜在的な研究分野')) as HTMLDivElement[];
      
      if (elements.length === 0) return;
      
      const observer = new IntersectionObserver((entries) => {
        const isVisible = entries.some(entry => entry.isIntersecting);
        onResearchAreaVisible(isVisible);
      }, { threshold: 0.3 }); // Consider visible when 30% is visible
      
      elements.forEach(element => {
        observer.observe(element);
      });
      
      return () => {
        elements.forEach(element => {
          observer.unobserve(element);
        });
      };
    }, 100);
  }, [conversationHistory, onResearchAreaVisible]);
};
